# Browser Drawing Studio

A production-grade web drawing studio designed strictly according to the Apple Human Interface Guidelines (HIG). Features multi-layer composition, custom brush smoothing, geometric shapes, typography, undo/redo history, and high-resolution export.

## Features

- **Apple HIG Design System** — Cupertino-style toolbars, San Francisco typography, light/dark mode support
- **Drawing Tools** — Dynamic brush with hardness/smoothing, eraser, geometric shapes (rectangle, circle, line), and text
- **Multi-Layer Engine** — Create, reorder, adjust opacity, and toggle layer visibility
- **Full History** — Multi-level undo/redo timeline with hotkey navigation
- **Color Control** — Apple system colors with native dynamic color picking
- **Responsive** — Smooth touch and mouse input with hardware-accelerated rendering
- **Accessibility** — Keyboard shortcuts, high-contrast focus rings, touch targets ≥ 44pt, reduced-motion compliance

## Quick Start

```bash
# Serve static files locally
python3 -m http.server 8080 -d src
```

Then open http://localhost:8080

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `B` | Brush tool |
| `E` | Eraser tool |
| `R` | Rectangle tool |
| `C` | Circle tool |
| `L` | Line tool |
| `T` | Text tool |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| `Ctrl+N` / `Cmd+N` | New canvas |
| `Ctrl+S` / `Cmd+S` | Export PNG |

## Design System

Engineered strictly following the [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/):
- **Typography:** San Francisco (`-apple-system`, `BlinkMacSystemFont`, `SF Pro Text`, `SF Pro Display`)
- **System Colors:** Apple dynamic system colors (`UIColor.systemBackground`, `UIColor.label`, `UIColor.systemBlue` `#007AFF`, `UIColor.systemGreen` `#34C759`, `UIColor.systemRed` `#FF3B30`)
- **Light/Dark Mode:** Full native support via `color-scheme: light dark` and `@media (prefers-color-scheme: dark)`
- **8pt Grid:** Consistent spacing increments (8, 16, 24, 32, 48px)
- **Corner Radii:** 8pt, 12pt, 16pt, and pill buttons
- **Elevation:** Apple 5-tier shadow elevation system (`.shadow-1` through `.shadow-5`)
- **Motion:** Spring timing functions (`cubic-bezier(0.4, 0, 0.2, 1)`) with `prefers-reduced-motion` compliance

## License

MIT © 2026 spdedsec
