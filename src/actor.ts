import { encode, decode } from '@msgpack/msgpack';
import { NatsConnection, Subscription } from 'nats.ws';

import { instantiate, Wasmbus } from './wasmbus';
import { createEventMessage, EventType } from './events';
import {
  ActorClaims,
  ActorClaimsMessage,
  ActorStartedMessage,
  ActorHealthCheckPassMessage,
  InvocationMessage,
  StopActorMessage,
  HostCall,
  Writer
} from './types';
import { jsonEncode, parseJwt, uuidv4 } from './util';

/**
 * Actor holds the actor wasm module
 */
export class Actor {
  claims: ActorClaims;
  key: string;
  module!: Wasmbus;
  hostKey: string;
  hostName: string;
  wasm: any;
  invocationCallback?: Function;
  hostCall?: HostCall;
  writer?: Writer;

  constructor(
    hostName: string = 'default',
    hostKey: string,
    wasm: any,
    invocationCallback?: Function,
    hostCall?: HostCall,
    writer?: Writer
  ) {
    this.key = '';
    this.hostName = hostName;
    this.hostKey = hostKey;
    this.claims = {
      jti: '',
      iat: 0,
      iss: '',
      sub: '',
      wascap: {
        name: '',
        hash: '',
        tags: [],
        caps: [],
        ver: '',
        prov: false
      }
    };
    this.wasm = wasm;
    this.invocationCallback = invocationCallback;
    this.hostCall = hostCall;
    this.writer = writer;
  }

  /**
   * startActor takes an actor wasm uint8array, extracts the jwt, validates the jwt, and uses wapcJS to instantiate the module
   *
   * @param {Uint8Array} actorBuffer - the wasm actor module as uint8array
   */
  async startActor(actorBuffer: Uint8Array) {
    const token: string = await this.wasm.extract_jwt(actorBuffer);
    const valid: boolean = await this.wasm.validate_jwt(token);
    if (!valid) {
      throw new Error('invalid token');
    }
    this.claims = parseJwt(token);
    this.key = this.claims.sub;
    this.module = await instantiate(actorBuffer, this.hostCall, this.writer);
  }

  /**
   * stopActor publishes the stop_actor message
   *
   * @param {NatsConnection} natsConn - the nats connection object
   */
  async stopActor(natsConn: NatsConnection) {
    const actorToStop: StopActorMessage = {
      host_id: this.hostKey,
      actor_ref: this.key
    };
    natsConn.publish(`wasmbus.ctl.${this.hostName}.cmd.${this.hostKey}.sa`, jsonEncode(actorToStop));
  }

  /**
   * publishActorStarted publishes the claims, the actor_started, and health_check_pass messages
   *
   * @param {NatsConnection} natsConn - the natsConnection object
   */
  async publishActorStarted(natsConn: NatsConnection) {
    // publish claims
    const claims: ActorClaimsMessage = {
      call_alias: '',
      caps: this.claims.wascap.caps[0],
      iss: this.claims.iss,
      name: this.claims.wascap.name,
      rev: '1',
      sub: this.claims.sub,
      tags: '',
      version: this.claims.wascap.ver
    };
    natsConn.publish(`lc.${this.hostName}.claims.${this.key}`, jsonEncode(claims));

    // publish actor_started
    const actorStarted: ActorStartedMessage = {
      api_version: 0,
      instance_id: uuidv4(),
      public_key: this.key
    };
    natsConn.publish(
      `wasmbus.evt.${this.hostName}`,
      jsonEncode(createEventMessage(this.hostKey, EventType.ActorStarted, actorStarted))
    );

    // publish actor health_check
    const actorHealthCheck: ActorHealthCheckPassMessage = {
      instance_id: uuidv4(),
      public_key: this.key
    };
    natsConn.publish(
      `wasmbus.evt.${this.hostName}`,
      jsonEncode(createEventMessage(this.hostKey, EventType.HealthCheckPass, actorHealthCheck))
    );
  }

  /**
   *  subscribeInvocations does a subscribe on nats for invocations
   *
   * @param {NatsConnection} natsConn the nats connection object
   */
  async subscribeInvocations(natsConn: NatsConnection) {
    // subscribe to topic, wait for invokes, invoke the host, if callback set, send message
    const invocationsTopic: Subscription = natsConn.subscribe(`wasmbus.rpc.${this.hostName}.${this.key}`);
    for await (const invocationMessage of invocationsTopic) {
      const invocationData = decode(invocationMessage.data);
      const invocation: InvocationMessage = invocationData as InvocationMessage;
      const invocationResult: Uint8Array = await this.module.invoke(invocation.operation, invocation.msg);
      invocationMessage.respond(
        encode({
          invocation_id: (invocationData as any).id,
          instance_id: uuidv4(),
          msg: invocationResult
        })
      );
      if (this.invocationCallback) {
        this.invocationCallback(invocationResult);
      }
    }
    throw new Error('actor.inovcation subscription closed');
  }
}
/**
 * startActor initializes an actor and listens for invocation messages
 *
 * @param {string} hostName - the name of the host
 * @param {string} hostKey - the publickey of the host
 * @param {Uint8Array} actorModule - the wasm module of the actor
 * @param {NatsConnection} natsConn - the nats connection object
 * @param {any} wasm - the rust wasm module
 * @param {Function} invocationCallback - an optional function to call when the invocation is successful
 * @param {HostCall} hostCall - the hostCallback
 * @param {Writer} writer - the hostCallback writer
 * @returns {Actor}
 */
export async function startActor(
  hostName: string,
  hostKey: string,
  actorModule: Uint8Array,
  natsConn: NatsConnection,
  wasm: any,
  invocationCallback?: Function,
  hostCall?: HostCall,
  writer?: Writer
): Promise<Actor> {
  const actor: Actor = new Actor(hostName, hostKey, wasm, invocationCallback, hostCall, writer);
  await actor.startActor(actorModule);
  await actor.publishActorStarted(natsConn);
  Promise.all([actor.subscribeInvocations(natsConn)]).catch(err => {
    throw err;
  });
  return actor;
}
