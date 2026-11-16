# 003 — Respect "reduce motion" in hover effects and the blog preview

- **Status**: DONE (16.11.2026)
- **Commit**: ce9ecc5
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 2 files (`src/styles/global.css`, `src/scripts/motion.ts`), ~12 lines

## Problem

The JavaScript respects `prefers-reduced-motion`: Lenis smooth scroll, the reveals and the hero scenes all check it. The CSS doesn't. No stylesheet has a `prefers-reduced-motion` rule, so hover effects keep **moving** things. The blog preview, a floating image that follows the pointer, is also set up regardless of the setting.

Moving hover effects on the home page:

```css
/* src/styles/next.css:340 — current (work cards: image zooms) */
@media (hover: hover) and (pointer: fine) { .x-col:hover img { transform: scale(1.03); } }
```

```css
/* src/styles/global.css:89-93 — current (blog rows: title slides right) */
@media (hover: hover) and (pointer: fine) and (min-width: 900px) {
  .blog__list:hover .post a { opacity: 0.35; }
  .blog__list .post a:hover { opacity: 1; }
  .post a:hover h3 { transform: translateX(0.75rem); }
  .post a:hover .post__arrow { background: var(--ink); color: var(--paper); }
```

The same image zoom on other pages, same pattern and fixed in the same rule:

```css
/* src/styles/next.css:142-145 — .x-project:hover img { transform: scale(1.03); } */
/* src/styles/blog.css:17-20   — .b-card:hover img { transform: scale(1.03); } */
/* src/styles/work.css:47      — .w-next:hover img { transform: scale(1.03); } */
```

The pointer-following preview:

```ts
/* src/scripts/motion.ts:58-61 — current */
function initBlogPreview() {
  if (!finePointer) return;
  const list = $('[data-blog-list]');
  const preview = $('[data-blog-preview]');
```

## Target

With `prefers-reduced-motion: reduce`:

- **Movement goes**: no image zoom, no title slide, no pointer-following preview.
- **Feedback stays**: the dimming of other blog rows (opacity), the arrow filling (colour) and link colour changes still happen. Reduced motion means fewer and gentler animations, not none.
- Button press feedback (`.x-btn:active { transform: scale(0.97) }`) stays. It is a 160 ms confirmation of a press, not decorative movement.

## Repo conventions to follow

- `motion.ts` already reads the setting once: `const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;` (`motion.ts:19`). Reuse that constant.
- The pattern to imitate is how `initScroll()` exits early: `if (reduced) return;` (`motion.ts:25`).
- Stylesheet load order between `global.css` and the page styles isn't guaranteed, so this override uses `!important`. That's the accepted pattern for user-preference overrides.

## Steps

1. **`src/styles/global.css`**: append at the very end of the file (after the block added by plan 001, if it is already there):

   ```css
   /* Reduced motion: hover feedback stays (colour, opacity), movement goes */
   @media (prefers-reduced-motion: reduce) {
     .x-col:hover img,
     .x-project:hover img,
     .b-card:hover img,
     .w-next:hover img,
     .post a:hover h3 { transform: none !important; }
   }
   ```

2. **`src/scripts/motion.ts:59`**: change

   ```ts
     if (!finePointer) return;
   ```

   to

   ```ts
     if (!finePointer || reduced) return;
   ```

   With the early return, the preview element keeps its CSS `opacity: 0` (`global.css:97`) and never shows.

## Boundaries

- Do NOT touch `src/styles/next.css` lines 178-188 (the service-card hover). Plan 002 handles reduced motion there.
- Do NOT remove `.x-btn:active` press feedback or any colour or opacity transition.
- Do NOT change hover behaviour when motion is allowed.
- If the cited code doesn't match (drift since `ce9ecc5`), STOP and report.

## Verification

- **Mechanical**: `npm run build` finishes with `Complete!`.
- **Feel check**: in DevTools → Rendering, set "Emulate CSS prefers-reduced-motion: reduce" and reload `http://localhost:4321/`.
  - Hover a work card in "Wybrane projekty": the image doesn't zoom; the "Zobacz projekt →" link still darkens.
  - Hover the blog rows in "Piszę o designie": the other rows still dim and the arrow still fills, but the title doesn't slide and no floating image follows the pointer.
  - Press a button: the small press scale is still there.
  - Switch the emulation off and reload: zoom, slide and preview all work as before.
  - Optional: check `/blog` (cards) and a case study's "next project" card the same way.
- **Done when**: with reduced motion emulated, no hover on the home page moves or scales anything, and all colour and opacity feedback remains.
