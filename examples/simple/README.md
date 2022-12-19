# wasmcloud-js Examples

This directory contains examples of using the `wasmcloud-js` library with sample `webpack` and `esbuild` configurations.

## Prerequisities

* NATS with WebSockets enabled

    * There is sample infra via docker in the `test/infra` directory of this repo, `cd test/infra && docker-compose up`

* wasmCloud lattice (OTP Version)

* (OPTIONAL) Docker Registry with CORS configured

    * If launching actors from remote registries in the browser host, CORS must be configured on the registry server

* NodeJS, NPM, npx

## Build

```sh
$ npm install # this will run and build the rust deps
$ npm install webpack esbuild copy-webpack-plugin fs
$ #### if you want to use esbuild, follow these next 2 steps ####
$ node esbuild.js # this produces the esbuild version
$ mv out-esbuild.js out.js # rename the esbuild version
$ #### if you want to use webpack, follow the steps below ####
$ npx webpack --config=example-webpack.config.js # this produces the webpack output
$ mv out-webpack.js out.js #rename the webpack version to out.js
```

## Usage

1. Build the code with esbuild or webpack

2. Rename the output file to `out.js`

3. Start a web server inside this directory (e.g `python3 -m http.server` or `npx serve`)

3. Navigate to a browser `localhost:<PORT>`

4. Open the developer console to view the host output

5. In the dev tools run `host` and you will get the full host object and methods

6. Start an actor with `host.launchActor('registry:5000/image', (data) => console.log(data))`. Echo actor is recommended (the 2nd parameter here is an invocation callback to handle the data from an invocation)

7. Link the actor with a provider running in Wasmcloud (eg `httpserver`)

8. Run a `curl localhost:port/echo` to see the response in the console (based off the invocation callback).