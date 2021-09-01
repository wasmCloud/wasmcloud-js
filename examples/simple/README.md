# wasmcloud-js Examples

This directory contains examples of using the `wasmcloud-js` library with sample `webpack` and `esbuild` configurations.

## Prerequisities

* NATS with WebSockets enabled

* wasmCloud lattice (OTP Version)

* (OPTIONAL) Docker Registry with CORS configured

    * If launching actors from remote registries in the browser host, CORS must be configured on the registry server

* NodeJS, NPM, npx

## Build

```sh
$ npm install webpack esbuild copy-webpack-plugin fs
$ node esbuild.js # this produces the esbuild version
$ npx webpack --config=example-webpack.config.js # this produces the webpack output
```

## Usage

1. Build the code

2. Start a web server inside this directory (e.g `python3 -m http.server`)

3. Navigate to a browser `localhost:<PORT>`

4. Open the developer console to view the host output