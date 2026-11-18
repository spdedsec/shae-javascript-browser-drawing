#!/usr/bin/env bash
# scripts/install.sh — shae-javascript-browser-drawing
#
# Opens the drawing app in the default browser. No build step is required
# (plain HTML/CSS/JS); this launches the file directly.
#
# Usage:
#   ./scripts/install.sh
set -euo pipefail

FILE="src/index.html"

echo "==> shae-javascript-browser-drawing"
echo
if [ ! -f "$FILE" ]; then
  echo "error: $FILE not found. Run this from the project root."
  exit 1
fi

echo "ok: $FILE present"
echo "==> Opening $FILE in the default browser"

if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$FILE" >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then
  open "$FILE" >/dev/null 2>&1 &
elif command -v wslview >/dev/null 2>&1; then
  wslview "$FILE" >/dev/null 2>&1 &
else
  echo "warning: no desktop opener found (xdg-open / open / wslview)"
  echo "         open $FILE manually in your browser"
fi

echo "ok: done. Tip: for live reload, run 'make dev' and visit http://localhost:8080/src/index.html"
