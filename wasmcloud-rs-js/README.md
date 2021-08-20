# wasmCloud Rust in JavaScript

This contains a set of wasmCloud Rust related functionailty (`wascap`, `nkeys`) ported to JavaScript/wasm via `wasm-bindgen` and `wasm-pack`. The code is compiled to a library that is then imported in the JavaScript library.

## Prerequisities

* rust

* cargo

* wasm-pack

## Build

```sh
$ wasm-pack build
```

## Usage

**JavaScript**

```html
<script>
    async function main() {
        const wasmModule = await import('./pkg/');
        const wasm = await wasmModule.default;

        const hostKey = new wasm.HostKey();
        console.log(hostKey.pk, hostKey.seed);

        const wasmFile = await fetch('./some-wasm.wasm');
        const wasmBuffer = await wasmFile.arrayBuffer();
        const token = wasm.extract_jwt(new Uint8Array(wasmBuffer));
        const valid = wasm.validate_jwt(token);

        console.log(token, valid);
    }
</script>
```

## Contributing