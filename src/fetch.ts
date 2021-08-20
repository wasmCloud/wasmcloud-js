import axios, { AxiosResponse } from 'axios';

export type ImageDigest = {
  name: string;
  digest: string;
  registry: string;
}

type FetchActorDigestResponse = {
  schemaVersion: number;
  mediaType: any;
  config: {
    annotations: any;
    digest: string;
    mediaType: string;
    size: 2;
    urls: any;
  };
  layers: Array<{
    annotations: {
      ['org.opencontainers.image.title']: string;
    }
    digest: string;
    mediaType: string;
    size: number;
    urls: any;
  }>;
  annotations: any;
};

export async function fetchActorDigest(actorRef: string, withTLS?: boolean): Promise<ImageDigest> {
  const image: Array<string> = actorRef.split('/');
  const registry: string = image[0];
  const [name, version] = image[1].split(':');

  const response: AxiosResponse = await axios.get(
    `${withTLS ? 'https://' : 'http://'}${registry}/v2/${name}/manifests/${version}`,
    {
      headers: {
        'Accept': 'application/vnd.oci.image.manifest.v1+json'
      }
    }).catch((err) => { throw err });
  const layers: FetchActorDigestResponse = response.data;

  if (layers.layers.length === 0) {
    throw new Error('no layers');
  }

  return {
    name,
    digest: layers.layers[0].digest,
    registry
  }
}

export async function fetchActor(url: string): Promise<Uint8Array> {
  const response: AxiosResponse = await axios.get(
    url,
    {
      responseType: 'arraybuffer'
    }
  ).catch((err) => { throw err });

  return new Uint8Array(response.data);
}

