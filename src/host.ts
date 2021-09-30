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
  StopActorMessage,
  HostCall,
  Writer
} from './types';
import { jsonDecode, jsonEncode, uuidv4 } from './util';

const HOST_HEARTBEAT_INTERVAL: number = 30000;

/**
 * Host holds the js/browser host
 */
export class Host {
  name: string;
  key: string;
  seed: string;
  heartbeatInterval: number;
  heartbeatIntervalId: any;
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
  invocationCallbacks?: InvocationCallbacks;
  hostCalls?: {
    [key: string]: HostCall
  };
  writers?: {
    [key: string]: Writer
  };

  constructor(
    name: string = 'default',
    withRegistryTLS: boolean,
    heartbeatInterval: number,
    natsConnOpts: Array<string> | ConnectionOptions,
    wasm: any
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
    this.invocationCallbacks = {};
    this.hostCalls = {};
    this.writers = {};
  }

  /**
   * connectNATS connects to nats using either the array of servers or the connection options object
   */
  async connectNATS() {
    const opts: ConnectionOptions = Array.isArray(this.natsConnOpts)
      ? {
        servers: this.natsConnOpts
      }
      : this.natsConnOpts;
    this.natsConn = await connect(opts);
  }

  /**
   * disconnectNATS disconnects from nats
   */
  async disconnectNATS() {
    this.natsConn.close();
  }

  /**
   * startHeartbeat starts a heartbeat publish message every X seconds based on the interval
   */
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

  /**
   * stopHeartbeat clears the heartbeat interval
   */
  async stopHeartbeat() {
    clearInterval(this.heartbeatIntervalId);
    this.heartbeatIntervalId = null;
  }

  /**
   * subscribeToEvents subscribes to the events on the host
   *
   * @param eventCallback - an optional callback(data) to handle the event message
   */
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

  /**
   * unsubscribeEvents unsubscribes and removes the events subscription
   */
  async unsubscribeEvents() {
    this.eventsSubscription?.unsubscribe();
    this.eventsSubscription = null;
  }

  /**
   * launchActor launches an actor via the launch actor message
   *
   * @param actorRef - the actor to start
   * @param invocationCallback - an optional callback(data) to handle the invocation
   * @param hostCall - the hostCallback
   * @param writer - writer for the hostCallback, can be undefined
   */
  async launchActor(actorRef: string, invocationCallback?: Function, hostCall?: HostCall, writer?: Writer) {
    const actor: LaunchActorMessage = {
      actor_ref: actorRef,
      host_id: this.key
    };
    this.natsConn.publish(`wasmbus.ctl.${this.name}.cmd.${this.key}.la`, jsonEncode(actor));
    if (invocationCallback) {
      this.invocationCallbacks![actorRef] = invocationCallback;
    }
    if (hostCall) {
      this.hostCalls![actorRef] = hostCall
    }
    if (writer) {
      this.writers![actorRef] = writer
    }
  }

  /**
   * stopActor stops an actor by publishing the sa message
   *
   * @param {string} actorRef - the actor to stop
   */
  async stopActor(actorRef: string) {
    const actorToStop: StopActorMessage = {
      host_id: this.key,
      actor_ref: actorRef
    };
    this.natsConn.publish(`wasmbus.ctl.${this.name}.cmd.${this.key}.sa`, jsonEncode(actorToStop));
  }

  /**
   * listenLaunchActor listens for start actor message and will fetch the actor (either from disk or registry) and initialize the actor
   */
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
          url = `${this.withRegistryTLS ? 'https://' : 'http://'}${actorDigest.registry}/v2/${actorDigest.name}/blobs/${actorDigest.digest
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
          this.invocationCallbacks?.[actorRef],
          this.hostCalls?.[actorRef],
          this.writers?.[actorRef]
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

  /**
   * listenStopActor listens for the actor stopped message and will tear down the actor on message receive
   */
  async listenStopActor() {
    // listen for stop actor message, decode the data
    // publish actor_stopped to the lattice
    // delete the actor from the host and remove the invocation callback
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
      delete this.invocationCallbacks![(actorData as StopActorMessage).actor_ref];
    }
    throw new Error('sa.subscription was closed');
  }

  /**
   * createLinkDefinition creates a link definition between an actor and a provider (unused)
   *
   * @param {string} actorKey - the actor key
   * @param {string} providerKey - the provider public key
   * @param {string} linkName - the name of the link
   * @param {string} contractId - the contract id of the linkdef
   * @param {any} values - list of key/value pairs to pass for the linkdef
   */
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

  /**
   * startHost connects to nats, starts the heartbeat, listens for actors start/stop
   */
  async startHost() {
    await this.connectNATS();
    Promise.all([this.startHeartbeat(), this.listenLaunchActor(), this.listenStopActor()]).catch((err: Error) => {
      throw err;
    });
  }

  /**
   * stopHost stops the heartbeat, stops all actors, drains the nats connections and disconnects from nats
   */
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

/**
 * startHost is the main function to start the js/browser host
 *
 * @param {string} name - the name of the host (defaults to 'default')
 * @param {boolean} withRegistryTLS - whether or not remote registries use tls
 * @param {Array<string>|ConnectionOptions} natsConnection - an array of nats websocket servers OR a full nats connection object
 * @param {number} heartbeatInterval - used to determine the heartbeat to the lattice (defaults to 30000 or 30 seconds)
 * @returns {Host}
 */
export async function startHost(
  name: string,
  withRegistryTLS: boolean = true,
  natsConnection: Array<string> | ConnectionOptions,
  heartbeatInterval?: number
) {
  const wasmModule: any = await import('../wasmcloud-rs-js/pkg/');
  const wasm: any = await wasmModule.default;
  const host: Host = new Host(
    name,
    withRegistryTLS,
    heartbeatInterval ? heartbeatInterval : HOST_HEARTBEAT_INTERVAL,
    natsConnection,
    wasm
  );
  await host.startHost();
  return host;
}
