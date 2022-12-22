# wasmCloud Host in JavaScript/Browser

This is the JavaScript implementation of the wasmCloud host for the browser (NodeJS support in progress). The library runs a host inside a web browser/application that connects to a remote [lattice](https://wasmcloud.com/docs/reference/lattice/) via NATS and can run [wasmCloud actors](https://wasmcloud.com/docs/app-dev/create-actor/) in the browser. The host will automatically listen for actor start/stop from NATS and will initialize the actor using `wapcJS`. Any invocations will be handled by the browser actor and returned to the requesting host via NATS. Users can pass callbacks to handle invocation and event data.

## Running the JavaScript host

This repository contains two examples:

1. [console](./examples/console) which includes examples for how to utilize the wasmCloud host as a library or through a bundler like webpack or esbuild. All interaction with this host occurs through the browser console
1. [simple](./examples/simple/) which includes a very simple web UI, error handling, and scripts for starting the host through the web browser. **It's recommended to use this example to get started**

## Demonstration Video

In this demonstration video we will demonstration the following:

- Load an HTTP Server capability into a wasmCloud Host running on a machine
- Load an the wasmcloud-js host into a web browser
- Load an 'echo' actor into the web browser
- **seamlessly** bind the actor to the capability provider through Lattice
- Access the webserver, which in turn delivers the request to the actor, processes it, and returns it to the requestion client via the capability
- Unload the actor

https://user-images.githubusercontent.com/1530656/130013412-b9a9daa6-fc71-424b-814c-2ca400926794.mp4

## Prerequisities

- NATS with WebSockets enabled

- wasmCloud lattice (OTP Version)

- (OPTIONAL) Docker Registry with CORS configured

  - If launching actors from remote registries in the browser host, CORS must be configured on the registry server

## Development Prerequisities

- NodeJS, npm

- rust, cargo, wasm-pack

  - Used to port the rust versions of wascap, nkeys to JS

## Installation

```sh
$ npm install @wasmcloud/wasmcloud-js
```

## Usage

More examples can be found in the [examples](examples/) directory, including sample `webpack` and `esbuild` configurations

**Browser**

````html
<script src="https://unpkg.com/@wasmcloud/wasmcloud-js@<VERSION>/dist/wasmcloud.js"></script>
<script>
  (async () => {
    // Start the host passing the name, registry tls enabled, a list of nats ws/wss hosts or the natsConnection object, and an optional host heartbeat interval (default is 30 seconds)
    const host = await wasmcloudjs.startHost('default', false, ['ws://localhost:4222'], 30000);
    // The host will automatically listen for actors start & stop messages, to manually listen for these messages the following methods are exposed
    // only call these methods if your host is not listening for actor start/stop
    // actor invocations are automatically returned to the host. if a user wants to handle the data, they can pass a map of callbacks using the actor ref/wasm file name as the key with a callback(data, result) function. The data contains the invocation data and the result contains the invocation result
    // (async() => {
    //     await host.listenLaunchActor(
    //         {
    //             "localhost:5000/echo:0.2.2": (data, result) => console.log(data.operation, result);
    //         }
    //     );
    //     await host.listenStopActor();
    // })();
    // To launch an actor manually from the library from a registry, optionally a callback can be passed to handle the invocation results. In addition, a hostCall callback and writer can be passed.
    // The hostCallback format is as follows:
    // ```
    // (binding, namespace, operation, payload) => {
    //    return Uint8Array(payload);
    // })
    // ```
    await host.launchActor('registry.com/actor:0.1.1', data => {
      /* handle data */
    });
    // Launch an actor with the hostCallback
    await host.launchActor(
      'registry.com/actor:0.1.1',
      data => {
        /* handle data */
      },
      (binding, namespace, operation, payload) => {
        // decode payload via messagepack
        // const decoded = decode(payload);
        return new Uint8Array(payload);
      }
    );
    // To launch an actrom manually from local disk (note the .wasm is required)
    await host.launchActor('./actor.wasm');
    // To listen for events, you can call the subscribeToEvents and pass an optional callback to handle the event data
    await host.subscribeToEvents(eventData => console.log(eventData, eventData.source));
    // To unsubscribe, call the unsubscribeEvents
    await host.unsubscribeEvents();
    // To start & stop the heartbeat events
    await host.startHeartbeat();
    await host.stopHeartbeat();
    // The host will automatically connect to nats on start. to connect/reconnect to nats
    await host.connectNATS();
    // To close/drain all connections from nats, call the disconnectNATS() method
    await host.disconnectNATS();
    // Stop the host
    await host.stopHost();
    // Restart the host (this only needs to be called if the host is stopped, it is automatically called on the constructor)
    await host.startHost();
  })();
</script>
````

**With a bundler**

There are some caveats to using with a bundler:

- The module contains `.wasm` files that need to be present alongside the final build output. Using `webpack-copy-plugin` (or `fs.copyFile` with other bundlers) can solve this issue.

- If using with `create-react-app`, the webpack config will need to be ejected via `npm run eject` OR an npm library like `react-app-rewired` can handle the config injection.

```javascript
// as esm -- this will grant you access to the types/params
import { startHost } from '@wasmcloud/wasmcloud-js';
// as cjs
// const wasmcloudjs = require('@wasmcloud/wasmcloud-js);

async function cjsHost() {
  const host = await wasmcloudjs.startHost('default', false, ['ws://localhost:4222']);
  console.log(host);
}

async function esmHost() {
  const host = await startHost('default', false, ['ws://localhost:4222']);
  console.log(host);
}

cjsHost();
esmHost();
```

```javascript
// webpack config, add this to the plugin section
plugins: [
  new CopyPlugin({
    patterns: [
      {
        from: 'node_modules/@wasmcloud/wasmcloud-js/dist/wasmcloud-rs-js/pkg/*.wasm',
        to: '[name].wasm'
      }
    ]
  })
];
```

**Node**

_IN PROGRESS_ - NodeJS does not support WebSockets natively (required by nats.ws)

## Contributing

### Running tests

```sh
$ npm run test
```

### Building

```sh
$ npm run build
```
