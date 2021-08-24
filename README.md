# wasmCloud Host in JavaScript/Browser

This is the JavaScript implementation of the wasmCloud host for the browser (NodeJS support in progress). The library runs a host inside a web browser/application that connects to a remote lattice via NATS and can run wasmCloud actors in the browser. The host will automatically listen for actor start/stop from NATS and will initialize the actor using `wapcJS`. Any invocations will be handled by the browser actor and returned to the requesting host via NATS. Users can pass callbacks to handle invocation and event data.

## Demonstration Video

In this demonstration video we will demonstration the following:

* Load an HTTP Server capability into a wasmCloud Host running on a machine
* Load an the wasmcloud-js host into a web browser
* Load an 'echo' actor into the web browser
* **seemlessly** bind the actor to the capability provider through Lattice
* Access the webserver, which in turn delivers the request to the actor, processes it, and returns it to the requestion client via the capability
* Unload the actor

https://user-images.githubusercontent.com/1530656/130013412-b9a9daa6-fc71-424b-814c-2ca400926794.mp4




## Prerequisities

* NATS with WebSockets enabled

* wasmCloud lattice (OTP Version)

* (OPTIONAL) Docker Registry with CORS configured

    * If launching actors from remote registries in the browser host, CORS must be configured on the registry server

## Development Prerequisities

* NodeJS, npm 

* rust, cargo, wasm-pack 

    * Used to port the rust versions of wascap, nkeys to JS


## Installation

```sh
$ npm install @wasmcloud/wasmcloud-js
```

## Usage

**Browser**

```html
<script src="dist/wasmcloud.js"></script>
<script>
  (async () => {
    // start the host passing the name, registry tls enabled, a list of nats ws/wss hosts or the natsConnection object, a map of invocation callbacks, and a host heartbeat interval (default is 30 seconds)
    const host = await wasmcloudjs.startHost("default", false, ["ws://localhost:4222"], {}, 30000);
    // the host will automatically listen for actors start & stop messages, to manually listen for these messages
    // actor invocations are automatically returned to the host. if a user wants to handle the data, they can pass a map of callbacks using the actor ref/wasm file name as the key with a callback(data, result) function. The data contains the invocation data and the result contains the invocation result
    (async() => {
        await host.listenLaunchActor(
            {
                "localhost:5000/echo:0.2.2": (data, result) => console.log(data.operation, result);
            }
        );
        await host.listenStopActor();
    })();
    // to launch an actor manually from the library from a registry
    await host.launchActor("registry.com/actor:0.1.1")
    // to launch an actrom manually from local disk (note the .wasm is required)
    await host.launchActor("./actor.wasm");
    // to listen for events, you can call the subscribeToEvents and pass an optional callback to handle the event data
    await host.subscribeToEvents((eventData) => console.log(eventData, eventData.source));
    // to unsubscribe, call the unsubscribeEvents
    await host.unsubscribeEvents();
    // to start & stop the heartbeat events
    await host.startHeartbeat();
    await host.stopHeartbeat();
    // the host will automatically connect to nats on start. to connect/reconnect to nats
    await host.connectNATS();
    // to close/drain all connections from nats, call the disconnectNATS() method
    await host.disconnectNATS();
    // stop the host
    await host.stopHost();
    // restart the host (this only needs to be called if the host is stopped, it is automatically called on the constructor)
    await host.startHost();
  })();
</script>
```

**With a bundler**

There are some caveats to using with a bundler: 

* The module contains `.wasm` files that need to be present alongside the final build output. Using `webpack-copy-plugin` can solve this issue.

* Using the es6 imports is currently broken due to `webpack` bundling and the `.wasm` file -- this is being tracked/fixed.

```javascript
import { wasmcloudjs } from '@wasmcloud/wasmcloud-js/dist/cjs/wasmcloud'

(async() => {
    const host = await wasmcloudjs.startHost('default', false, ['ws://localhost:4222'])
    console.log(host);
})()

```

```javascript
// webpack config, add this to the plugin section
plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: 'node_modules/@wasmcloud/wasmcloud-js/dist/cjs/*.wasm',
					to: '[name].wasm'
				}
			]
		}),
	]
```

**Node** 

*IN PROGRESS* - NodeJS does not support WebSockets natively (required by nats.ws)

## Contributing

### Running tests

```sh
$ npm run test
```

### Building

```sh
$ npm run build
```
