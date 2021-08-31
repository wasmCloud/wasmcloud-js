export type HeartbeatMessage = {
  actors: Array<{
    actor: string;
    instances: number;
  }>;
  providers: [];
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
    tags: Array<any>;
    caps: Array<string>;
    ver: string;
    prov: boolean;
  };
};

export type ActorClaimsMessage = {
  call_alias: string;
  caps: any;
  iss: string;
  name: string;
  rev: string;
  sub: string;
  tags: string;
  version: string;
};

export type LaunchActorMessage = {
  actor_ref: string;
  host_id: string;
};

export type ActorStartedMessage = {
  api_version: number;
  instance_id: string;
  public_key: string;
};

export type ActorHealthCheckPassMessage = {
  instance_id: string;
  public_key: string;
};

export type StopActorMessage = {
  host_id: string;
  actor_ref: string;
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
