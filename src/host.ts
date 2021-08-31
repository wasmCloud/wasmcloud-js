import { encode } from '@msgpack/msgpack';
import { connect, ConnectionOptions, NatsConnection, Subscription } from 'nats.ws';

import { Actor, startActor } from './actor';
import { createEventMessage, EventType } from './events';
import { fetchActor, fetchActorDigest, ImageDigest } from './fetch';
import {
  ActorStoppedMessage,
  CreateLinkDefMessage,
  HeartbeatMessage,
  InvocationCallbacks,
  LaunchActorMessage,
  StopActorMessage
} from './types';
import { jsonDecode, jsonEncode, uuidv4 } from './util';

const HOST_HEARTBEAT_INTERVAL: number = 30000;

export class Host {
  name: string;
  key: string;
  seed: string;
  heartbeatInterval: number;
  heartbeatIntervalId: any;
  invocationCallbacks?: InvocationCallbacks;
  withRegistryTLS: boolean;
  actors: {
    [key: string]: {
      actor: Actor;
      count: number;
    };
  };
  natsConnOpts: Array<string> | ConnectionOptions;
  natsConn!: NatsConnection;
  eventsSubscription!: Subscription | null;
  wasm: any;

  constructor(
    name: string = 'default',
    withRegistryTLS: boolean,
    heartbeatInterval: number,
    natsConnOpts: Array<string> | ConnectionOptions,
    wasm: any,
    invocationCallbacks: InvocationCallbacks
  ) {
    const hostKey = new wasm.HostKey();
    this.name = name;
    this.key = hostKey.pk;
    this.seed = hostKey.seed;
    this.withRegistryTLS = withRegistryTLS;
    this.actors = {};
    this.wasm = wasm;
    this.heartbeatInterval = heartbeatInterval;
    this.natsConnOpts = natsConnOpts;
    this.invocationCallbacks = invocationCallbacks;
  }

  async connectNATS() {
    const opts: ConnectionOptions = Array.isArray(this.natsConnOpts)
      ? {
          servers: this.natsConnOpts
        }
      : this.natsConnOpts;
    this.natsConn = await connect(opts);
  }

  async disconnectNATS() {
    this.natsConn.close();
  }

  async startHeartbeat() {
    this.heartbeatIntervalId;
    const heartbeat: HeartbeatMessage = {
      actors: [],
      providers: []
    };
    for (const actor in this.actors) {
      heartbeat.actors.push({
        actor: actor,
        instances: 1
      });
    }
    this.heartbeatIntervalId = await setInterval(() => {
      this.natsConn.publish(
        `wasmbus.evt.${this.name}`,
        jsonEncode(createEventMessage(this.key, EventType.HeartBeat, heartbeat))
      );
    }, this.heartbeatInterval);
  }

  async stopHeartbeat() {
    clearInterval(this.heartbeatIntervalId);
    this.heartbeatIntervalId = null;
  }

  async subscribeToEvents(eventCallback?: Function) {
    this.eventsSubscription = this.natsConn.subscribe(`wasmbus.evt.${this.name}`);
    for await (const event of this.eventsSubscription) {
      const eventData = jsonDecode(event.data);
      if (eventCallback) {
        eventCallback(eventData);
      }
    }
    throw new Error('evt subscription was closed');
  }

  async unsubscribeEvents() {
    this.eventsSubscription?.unsubscribe();
    this.eventsSubscription = null;
  }

  async launchActor(actorRef: string, invocationCallback?: Function) {
    const actor: LaunchActorMessage = {
      actor_ref: actorRef,
      host_id: this.key
    };
    this.natsConn.publish(`wasmbus.ctl.${this.name}.cmd.${this.key}.la`, jsonEncode(actor));
    if (invocationCallback) {
      this.invocationCallbacks![actorRef] = invocationCallback;
    }
  }

  async stopActor(actorRef: string) {
    const actorToStop: StopActorMessage = {
      host_id: this.key,
      actor_ref: actorRef
    };
    this.natsConn.publish(`wasmbus.ctl.${this.name}.cmd.${this.key}.sa`, jsonEncode(actorToStop));
    delete this.invocationCallbacks![actorRef];
  }

  async listenLaunchActor() {
    // subscribe to the .la topic `wasmbus.ctl.${this.name}.cmd.${this.key}.la`
    // decode the data
    // fetch the actor from registry  or local
    // start the actor class
    // listen for invocation events
    const actorsTopic: Subscription = this.natsConn.subscribe(`wasmbus.ctl.${this.name}.cmd.${this.key}.la`);
    for await (const actorMessage of actorsTopic) {
      const actorData = jsonDecode(actorMessage.data);
      const actorRef: string = (actorData as LaunchActorMessage).actor_ref;
      const usingRegistry: boolean = !actorRef.endsWith('.wasm');
      try {
        let url: string;
        if (usingRegistry) {
          const actorDigest: ImageDigest = await fetchActorDigest(actorRef);
          url = `${this.withRegistryTLS ? 'https://' : 'http://'}${actorDigest.registry}/v2/${actorDigest.name}/blobs/${
            actorDigest.digest
          }`;
        } else {
          url = actorRef;
        }
        const actorModule: Uint8Array = await fetchActor(url);
        const actor: Actor = await startActor(
          this.name,
          this.key,
          actorModule,
          this.natsConn,
          this.wasm,
          this.invocationCallbacks?.[actorRef]
        );

        if (this.actors[actorRef]) {
          this.actors[actorRef].count++;
        } else {
          this.actors[actorRef] = {
            count: 1,
            actor: actor
          };
        }
      } catch (err) {
        // TODO: error handling
        console.log('error', err);
      }
    }
    throw new Error('la.subscription was closed');
  }

  async listenStopActor() {
    // listen for stop actor message, decode the data
    // publish actor_stopped to the lattice
    // delete the actor from the host
    const actorsTopic: Subscription = this.natsConn.subscribe(`wasmbus.ctl.${this.name}.cmd.${this.key}.sa`);
    for await (const actorMessage of actorsTopic) {
      const actorData = jsonDecode(actorMessage.data);
      const actorStop: ActorStoppedMessage = {
        instance_id: uuidv4(),
        public_key: this.actors[(actorData as StopActorMessage).actor_ref].actor.key
      };
      this.natsConn.publish(
        `wasmbus.evt.${this.name}`,
        jsonEncode(createEventMessage(this.key, EventType.ActorStopped, actorStop))
      );
      delete this.actors[(actorData as StopActorMessage).actor_ref];
    }
    throw new Error('sa.subscription was closed');
  }

  async createLinkDefinition(actorKey: string, providerKey: string, linkName: string, contractId: string, values: any) {
    const linkDefinition: CreateLinkDefMessage = {
      actor_id: actorKey,
      provider_id: providerKey,
      link_name: linkName,
      contract_id: contractId,
      values: values
    };
    this.natsConn.publish(`wasmbus.rpc.${this.name}.${providerKey}.${linkName}.linkdefs.put`, encode(linkDefinition));
  }

  async startHost() {
    await this.connectNATS();
    Promise.all([this.startHeartbeat(), this.listenLaunchActor(), this.listenStopActor()]).catch((err: Error) => {
      throw err;
    });
  }

  async stopHost() {
    // stop the heartbeat
    await this.stopHeartbeat();
    // stop all actors
    for (const actor in this.actors) {
      await this.stopActor(actor);
    }
    // TODO: we need to wait to drain and disconnect to wait for the stop_actors to process
    // drain all subscriptions
    await this.natsConn.drain();
    // disconnect nats
    await this.disconnectNATS();
    // return or throw?
  }
}

export async function startHost(
  name: string,
  withRegistryTLS: boolean = true,
  natsConnection: Array<string> | ConnectionOptions,
  invocationCallbacks?: InvocationCallbacks,
  heartbeatInterval?: number
) {
  const wasmModule: any = await import('../wasmcloud-rs-js/pkg/');
  const wasm: any = await wasmModule.default;
  const host: Host = new Host(
    name,
    withRegistryTLS,
    heartbeatInterval ? heartbeatInterval : HOST_HEARTBEAT_INTERVAL,
    natsConnection,
    wasm,
    invocationCallbacks || {}
  );
  await host.startHost();
  return host;
}
