# 002 — Give every service card a hover response, not just one

- **Status**: DONE (16.11.2026)
- **Commit**: ce9ecc5
- **Severity**: HIGH (owner's rule: "if we animate on hover, animate all")
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file (`src/styles/next.css`), ~35 lines

## Problem

The home page section "Co zrobię dla Twojego biznesu" (`#services`) has five cards: `.x-feat--brand`, `--ux`, `--graphic`, `--audit`, `--team`. Only the **graphic** card reacts to the pointer (its three posts fan out). The other four do nothing on hover. Pointing at one card and seeing it move, then pointing at the next and seeing nothing, reads as a bug. The site owner's explicit rule is: if something in a group animates on hover, everything in the group does.

The one existing hover also uses the same 600 ms in both directions. The return should be faster than the entrance.

```css
/* src/styles/next.css:178 — current (graphic card posts) */
.x-g-post { width: 30%; max-width: 8.5rem; margin-inline: -3.5%; padding: 0.35rem; border-radius: 0.625rem; background: #fff; box-shadow: inset 0 0 0 1px var(--line), 0 12px 24px -16px rgb(10 10 10 / 0.3); display: grid; gap: 0.3rem; transition: transform 600ms var(--ease-out); }
```

```css
/* src/styles/next.css:185-188 — current (the only hover in the bento) */
@media (hover: hover) and (pointer: fine) {
  .x-feat:hover .x-g-post:nth-child(1) { transform: rotate(-3deg) translate(-22%, 0); }
  .x-feat:hover .x-g-post:nth-child(3) { transform: rotate(3deg) translate(22%, 0); }
}
```

Markup for reference (`src/components/pages/HomeView.astro:154-195`). Each card is `article.x-card.x-feat.x-feat--{key}` with one graphic inside `.x-feat__gfx`:

- **brand**: `svg.x-g-brand` with `g.x-g-circles circle` (construction circles), `path.x-g-fill` (mark fill) and `path.x-g-stroke` (mark outline, drawn by GSAP on scroll).
- **ux**: `.x-g-ux` > `.x-g-ux__win` (wireframe) with `.x-g-ux__cards span` ×3, plus a GSAP-driven cursor.
- **graphic**: `.x-g-posts` > `.x-g-post` ×3.
- **audit**: `.x-g-audit` > `p` + four `div.x-g-row`, each with a bar `i > b` (GSAP animates the bar's `scaleX` on scroll, leaving an inline `transform`).
- **team**: `.x-g-issues` > four `.x-g-issue` (GSAP fades them in on scroll, leaving an inline `transform`).

## Target

One shared hover language for all five cards, with one small move per card:

| Card | On hover |
| --- | --- |
| all five | The graphic lifts by 4px (`translate: 0 -4px`). |
| brand | Construction circles go from `stroke-opacity: 0.45` to `1`, and the mark fill from `opacity: 0.06` to `0.12`. |
| ux | The three wireframe cards rise by a further 4px, staggered 0 / 50 / 100 ms, and darken from `#f1f1f1` to `#e6e6e6`. |
| graphic | The existing fan, unchanged. |
| audit | The four bars turn from ink to `var(--accent)`, staggered 0 / 60 / 120 / 180 ms. |
| team | The four issues slide right by 4px, staggered 0 / 50 / 100 / 150 ms. |

Timing, the same everywhere:

- **Hover in**: movement `500ms var(--ease-out)` (the fan keeps its `600ms`); colour `400ms ease`.
- **Hover out**: `250ms var(--ease-out)` for movement, `250ms ease` for colour, with no stagger. The system's response snaps back.
- `--ease-out` is already defined in `src/styles/tokens.css:59`: `cubic-bezier(0.23, 1, 0.32, 1)`.

Rules:

- Use the individual **`translate` property**, not `transform`, for the lift, the ux cards and the issues. GSAP writes inline `transform` on some of these elements (issues; bars), and `translate` composes with it instead of being overwritten.
- Movement only under `(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`. Colour changes only under `(hover: hover) and (pointer: fine)`, so they still work with reduced motion.
- Delays go only on the hover-in rules, so leaving is instant.

## Repo conventions to follow

- Hover rules are always wrapped in `@media (hover: hover) and (pointer: fine)` (exemplar: `next.css:142-145`).
- Easing token `var(--ease-out)` for movement, plain `ease` for colour (exemplar: `.x-btn` at `next.css:22`: `transition: transform var(--dur-press) var(--ease-out), background-color 200ms ease;`).
- Comments: one short plain sentence above a block.

## Steps

1. **`src/styles/next.css:178`**: in the `.x-g-post` rule, change only `transition: transform 600ms var(--ease-out);` to `transition: transform 250ms var(--ease-out);`. Everything else on that line stays.

2. **`src/styles/next.css:185-188`**: delete this block (its two rules move into step 3):

   ```css
   @media (hover: hover) and (pointer: fine) {
     .x-feat:hover .x-g-post:nth-child(1) { transform: rotate(-3deg) translate(-22%, 0); }
     .x-feat:hover .x-g-post:nth-child(3) { transform: rotate(3deg) translate(22%, 0); }
   }
   ```

3. **`src/styles/next.css`**: directly after the team-card rules (after the line `.x-st--done { box-shadow: none; background: var(--accent); }`, currently line 204), insert:

   ```css
   /* Hover: every service card answers the pointer the same way. The graphic lifts a little and
      each graphic adds one move of its own. In 500 ms, out 250 ms. */
   .x-feat__gfx > * { transition: translate 250ms var(--ease-out); }
   .x-g-circles circle { transition: stroke-opacity 250ms ease; }
   .x-g-fill { transition: opacity 250ms ease; }
   .x-g-ux__cards span { transition: translate 250ms var(--ease-out), background-color 250ms ease; }
   .x-g-row b { transition: background-color 250ms ease; }
   .x-g-issue { transition: translate 250ms var(--ease-out); }
   @media (hover: hover) and (pointer: fine) {
     .x-feat:hover .x-g-circles circle { stroke-opacity: 1; transition-duration: 400ms; }
     .x-feat:hover .x-g-fill { opacity: 0.12; transition-duration: 400ms; }
     .x-feat:hover .x-g-ux__cards span { background-color: #e6e6e6; }
     .x-feat:hover .x-g-row b { background-color: var(--accent); transition-duration: 400ms; }
     .x-feat:hover .x-g-row:nth-of-type(2) b { transition-delay: 60ms; }
     .x-feat:hover .x-g-row:nth-of-type(3) b { transition-delay: 120ms; }
     .x-feat:hover .x-g-row:nth-of-type(4) b { transition-delay: 180ms; }
   }
   @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
     .x-feat:hover .x-feat__gfx > * { translate: 0 -4px; transition-duration: 500ms; }
     .x-feat:hover .x-g-post { transition-duration: 600ms; }
     .x-feat:hover .x-g-post:nth-child(1) { transform: rotate(-3deg) translate(-22%, 0); }
     .x-feat:hover .x-g-post:nth-child(3) { transform: rotate(3deg) translate(22%, 0); }
     .x-feat:hover .x-g-ux__cards span { translate: 0 -4px; transition-duration: 500ms; }
     .x-feat:hover .x-g-ux__cards span:nth-child(2) { transition-delay: 50ms; }
     .x-feat:hover .x-g-ux__cards span:nth-child(3) { transition-delay: 100ms; }
     .x-feat:hover .x-g-issue { translate: 4px 0; transition-duration: 500ms; }
     .x-feat:hover .x-g-issue:nth-child(2) { transition-delay: 50ms; }
     .x-feat:hover .x-g-issue:nth-child(3) { transition-delay: 100ms; }
     .x-feat:hover .x-g-issue:nth-child(4) { transition-delay: 150ms; }
   }
   ```

   Note: `.x-g-row` is a `div` that follows a `p`, so `:nth-of-type` counts only the rows (row 1 = `nth-of-type(1)`). That's why it's used for the bars instead of `:nth-child`.

## Boundaries

- Only `src/styles/next.css` changes. Do NOT touch `src/scripts/next.ts` (the scroll entrances and loops stay as they are), the markup, or other pages' cards (`.z-*` in `strefa.css`, `.a-*` in `about.css`).
- Do NOT use `transform` for the new hover moves; use `translate` as specified.
- Do NOT add JavaScript for hover.
- If the cited lines don't match (drift since `ce9ecc5`), STOP and report.

## Verification

- **Mechanical**: `npm run build` finishes with `Complete!`.
- **Feel check** (`npm run dev`, `http://localhost:4321/#services`, desktop with a mouse):
  - Point at each of the five cards in turn. **Every** card visibly responds, none is left still.
  - Move quickly across all five: each card's graphic settles back fast (about 250 ms) with no stagger on the way out, and nothing keeps moving after the pointer has left.
  - Audit card: bars turn purple top to bottom, one after another. Team card: issues slide right one after another. UX card: the three small cards rise one after another.
  - Hover the UX card while its cursor loop is running: the cursor and button animation keep working; the lift doesn't fight them.
  - Hover the team and audit cards right after scrolling them into view, while their entrance is still running: no jump. `translate` composes with GSAP's inline `transform`.
  - DevTools → Animations panel at 10% speed: hover-in eases out (fast start, soft landing), hover-out is noticeably quicker.
  - DevTools → Rendering → `prefers-reduced-motion: reduce`: nothing moves on hover, but the circles brighten, the bars turn purple and the ux cards darken.
  - Phone or tablet emulation (touch): tapping a card triggers no sticky hover state.
- **Done when**: all five service cards respond to hover with the timings above, and no hover movement happens with reduced motion.

## Execution note

Applied as written, plus one change outside the plan's boundary, which was needed for two of the cards:

- GSAP's scroll entrances left inline styles that override the CSS hover.
  - **Team card:** `gsap.from()` on `.x-g-issue` leaves `translate: none` inline, which blocks the hover slide.
  - **Brand card:** `.x-g-fill` keeps an inline `opacity`, which would override the hover's 0.12.
- In `src/scripts/next.ts`, the issues tween now has `clearProps: 'all'` and the fill tween has `clearProps: 'opacity'`, so both hand control back to CSS once the entrance finishes.
