import { WapcHost } from '@wapc/host';

import { HostCall, Writer } from './types';

export async function instantiate(source: Uint8Array, hostCall?: HostCall, writer?: Writer): Promise<Wasmbus> {
  const host = new Wasmbus(hostCall, writer);
  return host.instantiate(source);
}

export class Wasmbus extends WapcHost {
  constructor(hostCall?: HostCall, writer?: Writer) {
    super(hostCall, writer);
  }

  async instantiate(source: Uint8Array): Promise<Wasmbus> {
    const imports = super.getImports();
    const result = await WebAssembly.instantiate(source, {
      wasmbus: imports.wapc,
      wasi: imports.wasi,
      wasi_unstable: imports.wasi_unstable
    }).catch(e => {
      throw new Error(`Invalid wasm binary: ${e.message}`)
    });
    super.initialize(result.instance);

    return this;
  }
}
