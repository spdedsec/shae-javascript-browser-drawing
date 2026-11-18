# DESIGN.md — shae-javascript-browser-drawing

This document records how the SHAE field manual design system is applied to
`shae-javascript-browser-drawing`, a browser-based drawing application.

## Core principles

### Precise over decorative

The interface shows only what is needed: a toolbar (color, brush size,
clear, save) and a canvas. No ornamental noise, no decorative accents, no
gratuitous decoration. The drawing itself is the content.

### Flat and physical

- `0px radius` everywhere — buttons, toolbar, and canvas card are
  square-cornered.
- `1px borders` define every card and control; nothing is conveyed by shadow
  or elevation.
- Border-defined cards: the toolbar and canvas card are distinguished by a
  single 1px ink border on warm paper.
- No gradients, glows, pills, glass cards, or shadows.

### Type does the work

- **Display:** `shae drawing` heading set in Archivo at large size.
- **Body:** labels and hints in Instrument Sans.
- **Labels / code:** control labels (`color`, `brush`) in JetBrains Mono,
  uppercase, short — matching the design system's short-label rule.

### Confident restraint

Palette: warm paper `#F2EEE5`, ink `#191712`, oxide signal `#B3341B`.

- Background: warm paper (`#F2EEE5`).
- Strokes: ink (`#191712`) by default, selectable via the color picker.
- Primary action: the **save png** button is the single oxide signal
  (`#B3341B`) per view.
- No gradients, glows, pills, glass cards, or shadows.

### Motion

State changes (button hover/active, focus) use transform/opacity only,
140–240 ms, with reduced-motion fallback:

```css
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}
```

No animation libraries. Content is complete without JavaScript-assisted
motion.

### Accessibility

- WCAG AA contrast: ink on warm paper exceeds AA; oxide-on-paper for the
  primary button is checked against AA.
- 44px touch targets: every button and the color/brush inputs are at least
  44px × 44px (48px on narrow viewports).
- Complete keyboard path: all controls are focusable natively (buttons,
  range, color input) with visible oxide focus rings (`outline: 2px solid
  #B3341B`).
- No horizontal overflow: the layout is contained within the 1280px max
  container and stacks on narrow screens.
- Touch: `touchstart`/`touchmove` use `preventDefault` (non-passive) so
  drawing does not scroll the page.

## Color palette

| Role      | Hex     | Use                                       |
|-----------|---------|-------------------------------------------|
| Warm paper| #F2EEE5 | page background, canvas background, cards |
| Ink       | #191712 | default stroke, text, borders             |
| Oxide     | #B3341B | primary action button, focus rings        |

## Component notes

- **Toolbar:** border-defined card, 1px ink border on paper, 0 radius.
- **Color / brush inputs:** 44px touch targets, ink border, oxide focus
  ring on focus-visible.
- **Buttons:** 1px ink border, 0 radius, paper/ink default; hover tightens
  to oxide border; active inverts to oxide/paper; the save button is the
  oxide signal.
- **Canvas:** square-cornered card with a paper background and crosshair
  cursor; strokes are round-capped ink.

## Files

- `src/index.html` — markup
- `src/styles.css` — design-system styles
- `src/app.js` — drawing logic
- `DESIGN.md` — this document
