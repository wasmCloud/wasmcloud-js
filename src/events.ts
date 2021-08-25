import { uuidv4 } from './util';

export enum EventType {
  HeartBeat = 'com.wasmcloud.lattice.host_heartbeat',
  ActorStarted = 'com.wasmcloud.lattice.actor_started',
  ActorStopped = 'com.wasmcloud.lattice.actor_stopped',
  HealthCheckPass = 'com.wasmcloud.lattice.health_check_passed'
}

export type EventData = {
  datacontenttype: string;
  id: string;
  source: string;
  specversion: string;
  time: string;
  type: EventType;
  data: any;
};

export function createEventMessage(hostKey: string, eventType: EventType, data: any): EventData {
  return {
    data: data,
    datacontenttype: 'application/json',
    id: uuidv4(),
    source: hostKey,
    specversion: '1.0',
    time: new Date().toISOString(),
    type: eventType
  };
}
