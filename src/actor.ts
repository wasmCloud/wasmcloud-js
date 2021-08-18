import { encode, decode } from '@msgpack/msgpack';
import { instantiate, WapcHost } from '@wapc/host';
import { NatsConnection, Subscription } from 'nats.ws';

import { extract_jwt, validate_jwt } from '../wasmcloud-rs-js/pkg/wasmcloud_rs_js';

import { createEventMessage, EventType } from './events';
import {
  ActorClaims, ActorClaimsMessage, ActorStartedMessage, ActorHealthCheckPassMessage,
  InvocationMessage,
  StopActorMessage
} from './types';
import { jsonEncode, parseJwt, uuidv4 } from './util';

export class Actor {
  claims: ActorClaims;
  key: string;
  module!: WapcHost;
  hostKey: string;
  hostName: string;

  constructor(hostName: string = 'default', hostKey: string) {
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
  }

  async initActor(actorBuffer: Uint8Array) {
    const token: string = await extract_jwt(actorBuffer);
    const valid: boolean = await validate_jwt(token);
    if (!valid) {
      throw new Error('invalid token');
    }
    this.claims = parseJwt(token);
    this.key = this.claims.sub;
    this.module = await instantiate(actorBuffer);
  }

  async stopActor(natsConn: NatsConnection) {
    const actorToStop: StopActorMessage = {
      host_id: this.hostKey,
      actor_ref: this.key
    }
    natsConn.publish(`wasmbus.ctl.${this.hostName}.cmd.${this.hostKey}.sa`, jsonEncode(actorToStop))
  }

  async publishActorStarted(natsConn: NatsConnection) {
    // publish claims,
    const claims: ActorClaimsMessage = {
      call_alias: '',
      caps: this.claims.wascap.caps[0],
      iss: this.claims.iss,
      name: this.claims.wascap.name,
      rev: '1',
      sub: this.claims.sub,
      tags: '',
      version: this.claims.wascap.ver
    }
    natsConn.publish(`lc.${this.hostName}.claims.${this.key}`, jsonEncode(claims))

    // publish actor_started
    const actorStarted: ActorStartedMessage = {
      api_version: 0,
      instance_id: uuidv4(),
      public_key: this.key
    }
    natsConn.publish(`wasmbus.evt.${this.hostName}`, jsonEncode(createEventMessage(this.hostKey, EventType.ActorStarted, actorStarted)));

    // publish actor health_check
    const actorHealthCheck: ActorHealthCheckPassMessage = {
      instance_id: uuidv4(),
      public_key: this.key
    }
    natsConn.publish(`wasmbus.evt.${this.hostName}`, jsonEncode(createEventMessage(this.hostKey, EventType.HealthCheckPass, actorHealthCheck)));

  }

  async subscribeInvocations(natsConn: NatsConnection, invocationCallback?: Function) {
    // subscribe to topic, wait for invokes, invoke the host, if callback set, send message
    const invocationsTopic: Subscription = natsConn.subscribe(`wasmbus.rpc.${this.hostName}.${this.key}`);
    for await (const invocationMessage of invocationsTopic) {
      const invocationData = decode(invocationMessage.data);
      const invocation: InvocationMessage = (invocationData as InvocationMessage)
      const invocationResult: Uint8Array = await this.module.invoke(invocation.operation, invocation.msg);
      invocationMessage.respond(encode({
        invocation_id: (invocationData as any).id,
        instance_id: uuidv4(),
        msg: invocationResult
      }));
      if (invocationCallback) {
        invocationCallback(invocationResult);
      }
    }
  }
}

export async function newActor(hostName: string, hostKey: string,
  actorModule: Uint8Array,
  natsConn: NatsConnection,
  invocationCallback?: Function
): Promise<Actor> {
  const actor: Actor = new Actor(hostName, hostKey);
  await actor.initActor(actorModule);
  await actor.publishActorStarted(natsConn);
  (async () => {
    await actor.subscribeInvocations(natsConn, invocationCallback);
  })();
  return actor;
}