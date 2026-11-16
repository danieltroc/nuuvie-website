# 001 — Stop the hero and fade-ins from flashing before they animate

- **Status**: DONE (16.11.2026)
- **Commit**: ce9ecc5
- **Severity**: HIGH
- **Category**: Purpose & frequency (first impression) / Interruptibility of the load sequence
- **Estimated scope**: 4 files (`src/styles/global.css`, `src/layouts/Base.astro`, `src/scripts/motion.ts`, `src/scripts/next.ts`), ~40 lines

## Problem

Elements that animate in are hidden **only by JavaScript**, and the scripts start late, so on first load the content paints fully, then disappears, then animates in. On the home page this hits the hero heading, paragraph, buttons and the big UI window: exactly what the visitor looks at first.

Why it happens:

1. Nothing in CSS hides `[data-x-in]`, `[data-x-stage]` or `[data-fade]` before the scripts run. Module scripts run after the HTML is parsed, and the browser may already have painted.
2. The hero intro waits for `document.fonts.ready` **with no timeout**. The font is a 289 KB TTF (`public/fonts/BDOGrotesk-VF.ttf`), so on a slow connection the hero stays fully visible, then snaps to `opacity: 0` and rises in.

```ts
/* src/scripts/next.ts:22-32 — current */
function initHero() {
  const win = $('[data-x-win]');
  const stage = $('[data-x-stage]');
  if (reduced || !win || !stage) return;
  gsap.from('[data-x-in]', { opacity: 0, y: 16, duration: 0.9, ease: OUT, stagger: 0.08, delay: 0.05 });
  gsap.from(stage, { opacity: 0, y: 48, duration: 1.2, ease: OUT, delay: 0.3 });
  gsap.fromTo(win, { rotateX: 16, scale: 0.95 }, {
    rotateX: 0, scale: 1, ease: 'none',
    scrollTrigger: { trigger: stage, start: 'top 90%', end: 'top 22%', scrub: 0.4 },
  });
}
```

```ts
/* src/scripts/next.ts:142-148 — current */
initCopy();
document.fonts.ready.then(() => {
  initHero();
  initCanvas();
  initGraphics();
  ScrollTrigger.refresh();
});
```

```ts
/* src/scripts/motion.ts:32-56 — current (reveals) */
function initReveals() {
  // Headlines: lines rise out of a mask
  $$('[data-split="lines"]').forEach((el) => {
    SplitText.create(el, { /* … */ });
  });

  // Everything else: soft rise + fade, batched so neighbours stagger
  gsap.set('[data-fade]', { opacity: 0, y: 24 });
  ScrollTrigger.batch('[data-fade]', {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: OUT, stagger: 0.07, overwrite: true }),
  });
}
```

```ts
/* src/scripts/motion.ts:86-98 — current (boot) */
async function boot() {
  initScroll();
  // Line splitting needs final font metrics
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
  if (!reduced) initReveals();
  initBlogPreview();
  ScrollTrigger.refresh();
}

boot().catch((err) => {
  console.error('[motion]', err);
  gsap.set('[data-fade]', { clearProps: 'all' });
});
```

```html
<!-- src/layouts/Base.astro:52 — current -->
<script is:inline>document.documentElement.classList.replace('no-js', 'js');</script>
```

## Target

- With JS on and motion allowed, `[data-fade]`, `[data-x-in]` and `[data-x-stage]` start at `opacity: 0` **from the first paint**, via CSS.
- The hero intro starts as soon as `next.ts` runs. It doesn't wait for the font, because fading and rising don't depend on font metrics. Only things that measure text or layout (SplitText line splitting, the canvas selection box, the service graphics) still wait for the font, with a 1500 ms cap.
- Plain fade-ins (`[data-fade]`) are set up immediately too. Only `[data-split="lines"]` waits for fonts.
- Because CSS now provides the hidden state, the hero tweens must be `fromTo` with explicit end values. A `gsap.from()` would animate from 0 to the CSS-computed 0 and stay invisible.
- Failsafe: if the motion script hasn't started within 3000 ms, or it throws, everything becomes visible.
- With `prefers-reduced-motion: reduce` nothing is pre-hidden, because the scripts don't animate in that case.

Animation values stay exactly as they are today:
- hero items: `y 16 → 0`, `0.9s`, `expo.out`, stagger `0.08`, delay `0.05`;
- stage: `y 48 → 0`, `1.2s`, `expo.out`, delay `0.3`;
- fades: `y 24 → 0`, `1s`, `expo.out`, stagger `0.07`.

## Repo conventions to follow

- GSAP ease constant `OUT = 'expo.out'` is defined at the top of both `motion.ts` and `next.ts`. Reuse it; don't add new easings.
- Reduced motion is read once per file: `const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;`.
- The html element gets class `js` from the inline script in `Base.astro:52`. The new class names follow the same plain style: `motion-ready`, `motion-off`.
- CSS comments in this repo are short, plain sentences above the rule (see `global.css:63`, the `.sl-mask` comment).

## Steps

1. **`src/styles/global.css`**: append at the very end of the file:

   ```css
   /* ───── Motion: start hidden so nothing flashes before the scripts run ─────
      motion.ts and next.ts reveal these. Only with JS on and motion allowed; if the scripts never
      start, Base.astro adds .motion-off after 3 s and everything shows. */
   @media (prefers-reduced-motion: no-preference) {
     html.js:not(.motion-off) :is([data-fade], [data-x-in], [data-x-stage]) { opacity: 0; }
   }
   ```

2. **`src/layouts/Base.astro:52`**: replace the one-line inline script with:

   ```html
   <script is:inline>
     document.documentElement.classList.replace('no-js', 'js');
     // Failsafe: if motion.ts has not started within 3 s (blocked or failed), show all content
     setTimeout(() => {
       if (!document.documentElement.classList.contains('motion-ready')) document.documentElement.classList.add('motion-off');
     }, 3000);
   </script>
   ```

3. **`src/scripts/motion.ts`**: split `initReveals()` into two functions. Keep the bodies byte-for-byte except for the split:

   ```ts
   /* ───── Reveals ───── */
   // Soft rise + fade, batched so neighbours stagger. Needs no font metrics, so it starts at once.
   function initFades() {
     gsap.set('[data-fade]', { opacity: 0, y: 24 });
     ScrollTrigger.batch('[data-fade]', {
       start: 'top 92%',
       once: true,
       onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: OUT, stagger: 0.07, overwrite: true }),
     });
   }

   // Headlines: lines rise out of a mask (line breaks need the final font)
   function initSplits() {
     $$('[data-split="lines"]').forEach((el) => {
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
     });
   }
   ```

4. **`src/scripts/motion.ts`**: replace `boot()` and its `.catch` with:

   ```ts
   /* ───── Boot ───── */
   async function boot() {
     document.documentElement.classList.add('motion-ready');
     initScroll();
     if (!reduced) initFades();
     // Line splitting needs final font metrics
     await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
     if (!reduced) initSplits();
     initBlogPreview();
     ScrollTrigger.refresh();
   }

   boot().catch((err) => {
     console.error('[motion]', err);
     document.documentElement.classList.add('motion-off');
     gsap.set('[data-fade]', { clearProps: 'all' });
   });
   ```

5. **`src/scripts/next.ts:22-32`**: replace `initHero()` with this version. The hero items reveal even on a page without the window, and every tween states its end values:

   ```ts
   /* ───── Hero: text in, window rises and un-tilts as you scroll ───── */
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
     gsap.fromTo(win, { rotateX: 16, scale: 0.95 }, {
       rotateX: 0, scale: 1, ease: 'none',
       scrollTrigger: { trigger: stage, start: 'top 90%', end: 'top 22%', scrub: 0.4 },
     });
   }
   ```

6. **`src/scripts/next.ts:142-148`**: replace the boot block with:

   ```ts
   initCopy();
   // The hero only fades and rises, so it starts at once; a failure must never leave it hidden
   try {
     initHero();
   } catch (err) {
     console.error('[next]', err);
     document.documentElement.classList.add('motion-off');
   }
   // These measure text and layout, so they wait for the font (at most 1.5 s)
   Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(() => {
     initCanvas();
     initGraphics();
     ScrollTrigger.refresh();
   });
   ```

   Leave the separate "Statement figures" block at `next.ts:150-161` unchanged.

## Boundaries

- Do NOT change any animation values (durations, eases, distances, staggers, delays). This plan only changes *when* things start and *what hides them*.
- Do NOT touch `src/scripts/strefa.ts`, `src/scripts/fonty.ts` or any `.astro` page other than `Base.astro`.
- Do NOT add `[data-split]` to the CSS pre-hide; headings below the fold are hidden by SplitText itself. (Plan 004 adds the hero title.)
- Do NOT add dependencies.
- If the code at the cited lines doesn't match the "current" excerpts (drift since `ce9ecc5`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` finishes with `Complete!` and no errors.
- **Feel check** (dev server `npm run dev`, open `http://localhost:4321/`):
  - DevTools → Network: throttling "Slow 4G", "Disable cache" on, reload. The first frames show **no** hero text and no window. Then the heading, paragraph and buttons rise in, followed by the window. The text must never appear, disappear and reappear.
  - Same on `/strefa-designera` and `/fonty`, which also use `[data-x-in]` and `[data-x-stage]`.
  - DevTools → Network → block request URL pattern `*next.ts*`, reload: the hero appears after about 3 s (failsafe). Unblock afterwards.
  - DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce", reload: all content is visible immediately and nothing animates.
  - Disable JavaScript, reload: all content is visible (html keeps class `no-js`).
  - Scroll the whole home page: every `[data-fade]` block still fades in once, and section headings still rise line by line.
- **Done when**: on a throttled, uncached reload, the hero is never visible before its entrance animation starts, and content shows in all three fallback cases (reduced motion, no JS, blocked script).
