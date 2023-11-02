# Simple HTML/JS example

This directory contains examples of using the `wasmcloud-js` library with an `esbuild` configuration.

## Prerequisities

- `make`
- `npm`
- `cargo` and a Rust `wasm32-unknown-unknown` toolchain installed
- `python3` or an equivalent way to serve static assets from local files
- `nats-server` with JetStream and WebSockets enabled

## Build and Run

This example is bundled with `esbuild` and runs locally with use of the `python3` http server. As mentioned above you will need a NATS server running with JetStream and WebSockets. You can either launch a NATS server yourself with `nats-server -js -c ../../test/infra/nats.conf`, or use the included Docker compose file with `make infra`

```sh
make run
```

In another terminal you'll need to run a NATS server with websockets enabled, which you can do with:

```
cd ../../test/infra && docker compose up
```

## Starting Actors

For this section you should install [`wash`, the wasmCloud shell](https://wasmcloud.com/docs/installation).
You can start actors on this host by dragging the `.wasm` file into the browser window after you launch the host. To run the `echo` example, in your terminal, download the sample actor with `wash`:

```
wash reg pull wasmcloud.azurecr.io/echo:0.3.4
```

Then, drag that `echo.wasm` file into the browser. You should see a single `Echo` actor running. You can directly call this actor's HTTP handler using `wash`:

```
wash call MBCFOPM6JW2APJLXJD3Z5O4CN7CPYJ2B4FTKLJUR5YR5MITIU7HD3WD5 HttpServer.HandleRequest '{"method": "GET", "path": "/echo", "body": "", "queryString":"","header":{}}'
```

And you'll get back a raw response like: `Call response (raw): ��statusCode�Ȧheader��body�;{"body":[],"method":"GET","path":"/echo","query_string":""}`
