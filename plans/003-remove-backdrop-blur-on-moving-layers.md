# 003 — Remove backdrop blur from elements that sit on moving layers

- **Status**: DONE
- **Commit**: none (the project is not a git repository; written 2026-11-11)
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file, 2 changed declarations

## Problem

`backdrop-filter` forces the browser to re-blur whatever is behind an element every time
that background changes. Two places put it on top of content that is transformed on every
scroll frame:

- The tag pills on the work cards (ten pills). Each card is scaled by a scroll-driven
  animation and its image moves with parallax, so every pill is re-blurred each frame.
- The name caption on the hero portrait, which sits over an image that moves with parallax.

This is most likely to drop frames in Safari and on phones, exactly where the sticky
card stack is the main event.

```css
/* src/styles/global.css — current, "Hero" block */
.hero__portrait figcaption {
  position: absolute; left: 0.75rem; bottom: 0.75rem;
  padding: 0.4rem 0.7rem; border-radius: 999px;
  background: rgb(245 243 238 / 0.8); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
}
```

```css
/* src/styles/global.css — current, "Work" block */
.tags li { padding: 0.45rem 0.7rem; border-radius: 999px; box-shadow: inset 0 0 0 1px rgb(245 243 238 / 0.3); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
```

## Target

Solid translucent fills, no blur. The look stays close because both sit on low-detail areas.

```css
/* target */
.hero__portrait figcaption {
  position: absolute; left: 0.75rem; bottom: 0.75rem;
  padding: 0.4rem 0.7rem; border-radius: 999px;
  background: rgb(245 243 238 / 0.92);
}
```

```css
/* target */
.tags li { padding: 0.45rem 0.7rem; border-radius: 999px; background: rgb(12 12 13 / 0.35); box-shadow: inset 0 0 0 1px rgb(245 243 238 / 0.3); }
```

## Repo conventions to follow

- Colours are written as `rgb(R G B / alpha)` using the paper value `245 243 238` and the
  ink value `12 12 13` (see `--paper` and `--ink` in `src/styles/tokens.css`).
- The floating nav bar (`.nav__bar`) keeps its `backdrop-filter`. It is a single element and
  the blur is part of its design. Leave it.

## Steps

1. In `src/styles/global.css`, rule `.hero__portrait figcaption`: change the background
   alpha from `0.8` to `0.92` and delete both `-webkit-backdrop-filter` and `backdrop-filter`.
2. Rule `.tags li`: delete both `-webkit-backdrop-filter` and `backdrop-filter`, and add
   `background: rgb(12 12 13 / 0.35);` before `box-shadow`.

## Boundaries

- Do NOT touch `.nav__bar`.
- Do NOT change markup or `src/scripts/motion.ts`.
- Do NOT add new dependencies.
- If a step doesn't match the code you find, STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` completes with no errors. Searching
  `src/styles/global.css` for `backdrop-filter` returns matches only inside `.nav__bar`.
- **Feel check** (`npm run dev`):
  - Scroll slowly through the three work cards: tag pills stay legible on all three covers
    (dark Tedee, dark Old Craft, blue Netwise).
  - The "Daniel Troć" caption on the portrait is still readable.
  - DevTools → Performance, record a scroll through the work section with 4× CPU throttling:
    no long purple "Paint" bars repeating every frame.
  - If possible, repeat the scroll in Safari or on a phone and confirm it is smooth.
- **Done when**: the mechanical search passes and the pills and caption remain readable.
