# 004 — Reveal the home hero title line by line, like every other heading

- **Status**: DONE (16.11.2026)
- **Commit**: ce9ecc5
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens
- **Estimated scope**: 3 files (`src/components/pages/HomeView.astro`, `src/scripts/next.ts`, `src/styles/global.css`), ~25 lines

## Problem

Every section heading on the home page ("Wybrane projekty", "Co zrobię dla Twojego biznesu", "Piszę o designie"…) rises line by line out of a mask, through `[data-split="lines"]` in `motion.ts`. The hero title is the first and most important line of text on the site, yet it only fades and rises 16px as one block, together with the paragraph and buttons. The strongest moment of the page has a weaker entrance than headings further down.

```astro
<!-- src/components/pages/HomeView.astro:62 — current -->
<h1 data-x-in>{c.hero.title}</h1>
```

The section headings' reveal, which is the look to match:

```ts
/* src/scripts/motion.ts — current, inside the [data-split="lines"] loop */
SplitText.create(el, {
  type: 'lines',
  mask: 'lines',
  linesClass: 'sl',
  autoSplit: true,
  onSplit: (self) =>
    gsap.from(self.lines, {
      yPercent: 115, duration: 1.15, stagger: 0.085, ease: OUT,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    }),
});
```

After plan 001, the hero intro in `src/scripts/next.ts` looks like this:

```ts
/* src/scripts/next.ts — initHero() after plan 001 */
function initHero() {
  if (reduced) return;
  const items = $$('[data-x-in]');
  if (items.length) {
    gsap.fromTo(items, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: OUT, stagger: 0.08, delay: 0.05 });
  }
  const win = $('[data-x-win]');
  const stage = $('[data-x-stage]');
  if (!win || !stage) return;
  gsap.fromTo(stage, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 1.2, ease: OUT, delay: 0.3 });
  /* … scroll-scrubbed window tilt, unchanged … */
}
```

## Target

On load (no scroll trigger), as one sequence:

1. **Title**: lines rise from `yPercent: 115` to `0` out of a mask, `1.15s`, `expo.out`, stagger `0.085`, delay `0.05`. These are the same values as the section headings.
2. **Paragraph and buttons** (`[data-x-in]`): `opacity 0 → 1`, `y 16 → 0`, `0.9s`, `expo.out`, stagger `0.08`, delay **`0.35`** (was `0.05`). They start while the title's last line is still rising, so the sequence reads as one motion rather than two.
3. **Window stage**: `opacity 0 → 1`, `y 48 → 0`, `1.2s`, `expo.out`, delay **`0.55`** (was `0.3`).

Further requirements:

- The title is hidden by CSS from the first paint, like the other hero items in plan 001, and becomes visible at the moment its lines are split and placed below their masks. That way there is no flash and no empty gap.
- `autoSplit: true`: if the web font finishes loading after the split, SplitText re-splits and keeps the animation in sync. So the title does **not** wait for `document.fonts.ready`.
- Reduced motion: no split, and the title is visible right away (`initHero` already returns early, and the CSS pre-hide only applies under `prefers-reduced-motion: no-preference`).
- Polish diacritics (ę, ą, ż, Ś) must not be clipped by the mask. `.sl-mask` in `global.css:64` already adds the needed room.

## Repo conventions to follow

- SplitText options exactly as `motion.ts` uses them: `type: 'lines'`, `mask: 'lines'`, `linesClass: 'sl'`, `autoSplit: true`.
- Ease constant `OUT = 'expo.out'` is already defined in `next.ts:14`.
- Hook elements with `data-x-*` attributes (`data-x-in`, `data-x-stage`, `data-x-win`); the new hook is `data-x-title`.

## Steps

1. **`src/components/pages/HomeView.astro:62`**: change

   ```astro
   <h1 data-x-in>{c.hero.title}</h1>
   ```

   to

   ```astro
   <h1 data-x-title>{c.hero.title}</h1>
   ```

2. **`src/styles/global.css`**: in the block added by plan 001, add `[data-x-title]` to the selector list:

   ```css
   html.js:not(.motion-off) :is([data-fade], [data-x-in], [data-x-stage], [data-x-title]) { opacity: 0; }
   ```

3. **`src/scripts/next.ts:6-9`**: register SplitText. Change

   ```ts
   import gsap from 'gsap';
   import { ScrollTrigger } from 'gsap/ScrollTrigger';

   gsap.registerPlugin(ScrollTrigger);
   ```

   to

   ```ts
   import gsap from 'gsap';
   import { ScrollTrigger } from 'gsap/ScrollTrigger';
   import { SplitText } from 'gsap/SplitText';

   gsap.registerPlugin(ScrollTrigger, SplitText);
   ```

4. **`src/scripts/next.ts`**: replace `initHero()` (the plan-001 version quoted above) with:

   ```ts
   /* ───── Hero: title lines rise, then text, then the window; the window un-tilts as you scroll ───── */
   function initHero() {
     if (reduced) return;
     const title = $('[data-x-title]');
     if (title) {
       SplitText.create(title, {
         type: 'lines',
         mask: 'lines',
         linesClass: 'sl',
         autoSplit: true,
         onSplit: (self) => {
           gsap.set(title, { opacity: 1 });
           return gsap.fromTo(self.lines, { yPercent: 115 }, { yPercent: 0, duration: 1.15, stagger: 0.085, ease: OUT, delay: 0.05 });
         },
       });
     }
     const items = $$('[data-x-in]');
     if (items.length) {
       gsap.fromTo(items, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: OUT, stagger: 0.08, delay: title ? 0.35 : 0.05 });
     }
     const win = $('[data-x-win]');
     const stage = $('[data-x-stage]');
     if (!win || !stage) return;
     gsap.fromTo(stage, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 1.2, ease: OUT, delay: title ? 0.55 : 0.3 });
     gsap.fromTo(win, { rotateX: 16, scale: 0.95 }, {
       rotateX: 0, scale: 1, ease: 'none',
       scrollTrigger: { trigger: stage, start: 'top 90%', end: 'top 22%', scrub: 0.4 },
     });
   }
   ```

   The `title ? … : …` delays keep `/strefa-designera` and `/fonty`, which still use `data-x-in` on their h1, on their current timing.

## Boundaries

- Only the **home page** h1 changes. Do NOT change `DesignerZoneView.astro` or `fonty.astro`.
- Do NOT touch `motion.ts`.
- Do NOT change the title's font size, wrapping or any non-motion style.
- Plan 001 must be applied first. If `initHero()` doesn't look like the plan-001 version quoted above, STOP and report.

## Verification

- **Mechanical**: `npm run build` finishes with `Complete!`. `grep -n "data-x-title" src/components/pages/HomeView.astro` shows the h1.
- **Feel check** (`npm run dev`, `http://localhost:4321/` and `http://localhost:4321/en`):
  - Reload: the title's lines rise one after another out of an invisible mask. The paragraph and buttons follow while the last line is still landing, then the window rises. It should read as one sequence, not three separate events.
  - DevTools → Animations panel at 10% speed: the tops of "ę" in "Projektuję" and other diacritics are never cut by the mask, and the title is never visible as a whole block before the lines start.
  - DevTools → Network "Slow 4G" + "Disable cache": no flash of the title before its animation, and no jump when the font arrives (`autoSplit` re-split).
  - Resize the window from desktop to mobile width after load: the title re-wraps correctly and stays visible.
  - `prefers-reduced-motion: reduce` (Rendering panel): the title is visible immediately and not split into animated lines.
  - `/strefa-designera` and `/fonty`: the hero entrance is unchanged.
  - Screen reader or accessibility tree: the h1 still reads as one heading. SplitText adds an `aria-label` by default.
- **Done when**: the home hero title enters line by line with the same motion as the section headings, with no flash, in both PL and EN.
