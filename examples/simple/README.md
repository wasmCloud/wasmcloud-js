# Simple HTML/JS example

This directory contains examples of using the `wasmcloud-js` library with an `esbuild` configuration.

## Prerequisities

- NATS with WebSockets enabled

  - There is sample infra via docker in the `test/infra` directory of this repo, `cd test/infra && docker-compose up`

- wasmCloud lattice (OTP Version)

- (OPTIONAL) Docker Registry with CORS configured

  - If launching actors from remote registries in the browser host, CORS must be configured on the registry server

- NodeJS, NPM, npx

## Build

```sh
npm install # this will run and build the rust deps
npm install esbuild copy-webpack-plugin fs
node esbuild.js # this produces the esbuild version
```

## Usage

1. Build the code with esbuild

2. Start a web server inside this directory (e.g `python3 -m http.server` or `npx serve`)

3. Navigate to a browser `localhost:<PORT>`

4. Launch a host using the button on the page, feel free to add a lattice prefix or just use `default`

5. Start an actor with `host.launchActor('registry:5000/image', (data) => console.log(data))`. Echo actor is recommended (the 2nd parameter here is an invocation callback to handle the data from an invocation)

6. Link the actor with a provider running in Wasmcloud (eg `httpserver`)

7. Run a `curl localhost:port/echo` to see the response in the console (based off the invocation callback).
