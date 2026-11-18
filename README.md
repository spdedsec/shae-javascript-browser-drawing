# shae-javascript-browser-drawing

A browser-based drawing application built with HTML5 Canvas, vanilla
JavaScript, and CSS. Supports mouse and touch drawing, a color picker,
adjustable brush size, clear canvas, and save-as-PNG. Styled to the SHAE
field manual: warm paper background, ink strokes, oxide accent UI, 0px
radius, 1px borders, 44px touch targets. Part of the SHAE Tier 3 series.

## Features

- HTML5 canvas drawing with mouse and touch
- Color picker (oxide accent)
- Adjustable brush size
- Clear canvas
- Save drawing as PNG
- Apple-like design: paper background, ink strokes, oxide accent UI
- 0px radius, 1px borders, 44px touch targets, oxide focus rings
- No dependencies (vanilla HTML/CSS/JS)

## Requirements

- A modern browser. No build step or server required.
- For local development, Python 3 (for `make dev`).

## Install

```bash
./scripts/install.sh
```

This opens `src/index.html` in your default browser.

## Usage

### Direct (no server)

Open `src/index.html` in a browser.

### Local development server

```bash
make dev
# then visit http://localhost:8080/src/index.html
```

Draw by dragging on the canvas with your mouse or finger. Use the toolbar to
pick a color, change the brush size, clear the canvas, or save the drawing
as a PNG.

## Project structure

```
src/index.html   # markup
src/styles.css   # design-system styles
src/app.js       # drawing logic (vanilla JS)
scripts/install.sh   # open in browser
Makefile         # dev / test / release targets
DESIGN.md        # design system applied
README.md        # this file
.github/workflows/release.yml
LICENSE          # MIT
docs/DE.md       # German
docs/ES.md       # Spanish
```

## Design

See `DESIGN.md` for how the SHAE field manual design system is applied.

## License

MIT. See `LICENSE`.
