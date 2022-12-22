export type HeartbeatMessage = {
  actors: Array<{
    actor: string;
    instances: number;
  }>;
  providers: [];
  labels: object;
};

export type HostStartedMessage = {
  labels: object;
  friendly_name: string;
};

export type CreateLinkDefMessage = {
  actor_id: string;
  provider_id: string;
  link_name: string;
  contract_id: string;
  values: any;
};

export type ActorClaims = {
  jti: string;
  iat: number;
  iss: string;
  sub: string;
  wascap: {
    name: string;
    hash: string;
    tags: Array<string>;
    caps: Array<string>;
    ver: string;
    call_alias: string | null;
    prov: boolean;
  };
};

export type ActorClaimsMessage = {
  call_alias: string;
  caps: Array<string>;
  iss: string;
  name: string;
  rev: string;
  sub: string;
  tags: Array<string>;
  version: string;
};

export type LaunchActorMessage = {
  actor_ref: string;
  host_id: string;
};

export type ActorStartedClaims = {
  call_alias: string;
  caps: string[];
  issuer: string;
  tags: Array<string>;
  name: string;
  revision: string;
  version: string;
  not_before_human: number | null;
  expires_human: number | null;
};

export type ActorStartedMessage = {
  api_version: number;
  instance_id: string;
  annotations: object;
  public_key: string;
  claims: ActorStartedClaims;
};

export type ActorHealthCheckPassMessage = {
  instance_id: string;
  public_key: string;
};

export type StopActorMessage = {
  host_id: string;
  actor_ref: string;
  count: number;
};

export type ActorStoppedMessage = {
  public_key: string;
  instance_id: string;
};

export type InvocationMessage = {
  encoded_claims: string;
  host_id: string;
  id: string;
  msg: Uint8Array;
  operation: string;
  origin: {
    public_key: string;
    link_name: string;
    contract_id: string;
  };
  target: {
    public_key: string;
    link_name: string;
    contract_id: string;
  };
};

export type InvocationCallbacks = {
  [key: string]: Function;
};

/* eslint-disable no-unused-vars */
export type HostCall = (binding: string, namespace: string, operation: string, payload: Uint8Array) => Uint8Array;
/* eslint-disable no-unused-vars */
export type Writer = (message: string) => void;
