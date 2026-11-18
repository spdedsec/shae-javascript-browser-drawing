# Makefile — shae-javascript-browser-drawing
#
# Targets:
#   make dev     — serve the app with python3 -m http.server on :8080
#   make test    — sanity-check that source files exist
#   make release — reminder that releases are cut via GitHub Actions
#   make clean   — no build artifacts to clean
#
# Plain HTML/CSS/JS: nothing to compile.

SHELL := /usr/bin/env bash
PORT ?= 8080
HOST := http://localhost:$(PORT)

.PHONY: dev test release clean

dev:
	@echo "==> Serving shae-javascript-browser-drawing"
	@echo "==> $(HOST)/src/index.html"
	@echo "==> Press Ctrl-C to stop"
	python3 -m http.server $(PORT) -b 127.0.0.1

test:
	@echo "==> Checking source files"
	@for f in src/index.html src/styles.css src/app.js; do \
		if [ -f "$$f" ]; then echo "ok: $$f"; else echo "missing: $$f"; exit 1; fi; \
	done
	@echo "ok: all source files present"

release: test
	@echo "==> Release"
	@echo "Create the GitHub release v0.1.0 via .github/workflows/release.yml."

clean:
	@echo "ok: no build artifacts to clean"
