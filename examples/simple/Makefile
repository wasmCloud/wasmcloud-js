help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_\-.*]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

install:
	npm install

infra: ## Launch required infrastructure using Docker
	cd ../../test/infra && docker compose up

build: install ## Install NPM dependencies and compile the JS library and wasmcloud.wasm file
	node esbuild.js

run: build ## Build and run wasmCloud with esbuild, then run python3's httpserver
	python3 -m http.server
