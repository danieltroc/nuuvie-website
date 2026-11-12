# 001 — Shorten the intro and skip the curtain on repeat visits and deep links

- **Status**: DONE
- **Commit**: none (the project is not a git repository; written 2026-11-11)
- **Severity**: HIGH
- **Category**: Purpose & frequency
- **Estimated scope**: 3 files, about 40 changed lines

## Problem

The preloader curtain and hero intro hold the page too long, and they run on every load.

- First visit: the curtain is gone about 2.3s after the script starts, and the hero button
  finishes fading in at about 4s. Scrolling is locked until the whole timeline completes.
- Repeat visits in the same session still show the curtain (about 2.8s until the button is in).
- `window.scrollTo(0, 0)` runs on every load, so a link such as `/#contact` lands at the top,
  and a reload loses the scroll position.
- The counter is not tied to real loading; it is decoration, so it should be brief.

```ts
/* src/scripts/motion.ts:98-106 — current (inside heroIntro) */
  tl.from(wordmark.chars, { yPercent: 118, duration: 1.4, stagger: 0.045 }, 0)
    .from('.nav__bar', { yPercent: -180, duration: 1.1 }, 0.35)
    .from('[data-hero-meta]', { opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.4)
    .from('[data-hero-rule]', { scaleX: 0, duration: 1.3, stagger: 0.08, ease: IN_OUT }, 0.3)
    .from('[data-hero-svc]', { y: 14, opacity: 0, duration: 0.9, stagger: 0.035 }, 0.75)
    .from('[data-hero-portrait]', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: IN_OUT }, 0.45)
    .from('[data-hero-portrait] img', { scale: 1.3, duration: 1.9 }, 0.45)
    .call(() => { titleReady = true; titleTween?.play(); }, [], 0.85)
    .from('[data-hero-fade]', { y: 22, opacity: 0, duration: 1, stagger: 0.08 }, 1.25);
```

```ts
/* src/scripts/motion.ts:117-152 — current */
function runPreloader(onDone: () => void) {
  const pre = $('[data-preloader]');
  const count = $('[data-preloader-count]');
  if (!pre) return onDone();

  let first = true;
  try {
    first = !sessionStorage.getItem('nuuvie:seen');
    sessionStorage.setItem('nuuvie:seen', '1');
  } catch { /* private mode — just play the full intro */ }

  if (reduced) {
    gsap.to(pre, { opacity: 0, duration: 0.3, ease: 'power1.out', onComplete: () => { pre.remove(); onDone(); } });
    return;
  }

  lenis?.stop();
  window.scrollTo(0, 0);
  const state = { v: 0 };
  const tl = gsap.timeline({ onComplete: () => { pre.remove(); lenis?.start(); onDone(); } });

  if (first && count) {
    tl.from('[data-preloader-mark]', { scale: 0.9, opacity: 0, duration: 0.6, ease: OUT })
      .to(state, {
        v: 100, duration: 1.15, ease: 'power2.inOut',
        onUpdate: () => { count.textContent = String(Math.round(state.v)); },
      }, 0.1);
  } else if (count) {
    count.textContent = '';
  }

  tl.to(pre, { yPercent: -100, duration: 0.95, ease: IN_OUT }, first ? '+=0.1' : 0.15)
    .to('[data-preloader-mark], [data-preloader-count]', { yPercent: 60, duration: 0.95, ease: IN_OUT }, '<')
    .add(heroIntro(), '<0.42');
}
```

```html
<!-- src/layouts/Base.astro — current, last line inside <head> -->
    <script is:inline>document.documentElement.classList.replace('no-js', 'js');</script>
```

```css
/* src/styles/global.css — current, end of the "Preloader" block */
.no-js .preloader { display: none; }
```

## Target

- The curtain plays only on the first visit of a session, and only when the page opens at the
  top with no `#hash` in the URL. In every other case the preloader is never painted.
- First visit: mark in 0.4s, counter 0.7s, curtain lift 0.8s. Scrolling unlocks the moment the
  curtain starts to lift. Curtain fully gone about 1.6s after the script starts.
- Hero headline starts at 0.45s into the hero timeline (was 0.85s); sub-copy and button start
  at 0.75s with a 0.8s duration (were 1.25s and 1s).
- The page never force-scrolls to the top.

```html
<!-- src/layouts/Base.astro — target, replaces the single inline script line -->
    <script is:inline>
      (function () {
        var root = document.documentElement;
        root.classList.replace('no-js', 'js');
        try {
          if (sessionStorage.getItem('nuuvie:seen') || location.hash) root.classList.add('is-seen');
        } catch (e) {}
      })();
    </script>
```

```css
/* src/styles/global.css — target */
.no-js .preloader,
.is-seen .preloader { display: none; }
```

```ts
/* src/scripts/motion.ts — target, the last two chained calls of the heroIntro timeline */
    .call(() => { titleReady = true; titleTween?.play(); }, [], 0.45)
    .from('[data-hero-fade]', { y: 22, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.75);
```

```ts
/* src/scripts/motion.ts — target, the whole runPreloader function */
function runPreloader(onDone: () => void) {
  const pre = $('[data-preloader]');
  const count = $('[data-preloader-count]');

  let first = true;
  try {
    first = !sessionStorage.getItem('nuuvie:seen');
    sessionStorage.setItem('nuuvie:seen', '1');
  } catch { /* private mode — just play the full intro */ }

  if (reduced) {
    if (!pre) return onDone();
    gsap.to(pre, { opacity: 0, duration: 0.3, ease: 'power1.out', onComplete: () => { pre.remove(); onDone(); } });
    return;
  }

  // The curtain is a first-visit, top-of-page moment only.
  const skipCurtain = !first || !!window.location.hash || window.scrollY > 4;
  if (!pre || skipCurtain) {
    pre?.remove();
    heroIntro().eventCallback('onComplete', onDone);
    return;
  }

  lenis?.stop();
  const state = { v: 0 };
  const tl = gsap.timeline({ onComplete: () => { pre.remove(); onDone(); } });

  tl.from('[data-preloader-mark]', { scale: 0.9, opacity: 0, duration: 0.4, ease: OUT })
    .to(state, {
      v: 100, duration: 0.7, ease: 'power2.inOut',
      onUpdate: () => { if (count) count.textContent = String(Math.round(state.v)); },
    }, 0.05)
    .call(() => lenis?.start())
    .to(pre, { yPercent: -100, duration: 0.8, ease: IN_OUT })
    .to('[data-preloader-mark], [data-preloader-count]', { yPercent: 60, duration: 0.8, ease: IN_OUT }, '<')
    .add(heroIntro(), '<0.3');
}
```

## Repo conventions to follow

- All scripted motion lives in `src/scripts/motion.ts`. Use the existing constants
  `OUT` (`'expo.out'`) and `IN_OUT` (`'expo.inOut'`) declared near the top of that file;
  do not type new ease strings.
- The `$` helper in that file is `document.querySelector`; `lenis` is a module-level
  variable that may be `null`, so always call it as `lenis?.stop()` / `lenis?.start()`.
- Class flags on `<html>` are how CSS reacts to state here: see `.no-js .preloader` and
  `.menu-open .menu` in `src/styles/global.css`.

## Steps

1. `src/layouts/Base.astro`: replace the single inline `<script is:inline>` line in `<head>`
   with the target block above.
2. `src/styles/global.css`: replace `.no-js .preloader { display: none; }` with the target rule.
3. `src/scripts/motion.ts`, function `heroIntro`: change only the last two chained calls of
   the `tl` chain to the target values (`0.85` becomes `0.45`; `duration: 1` becomes
   `duration: 0.8` and position `1.25` becomes `0.75`). Leave every other line of the chain as is.
4. `src/scripts/motion.ts`: replace the whole `runPreloader` function with the target function.

## Boundaries

- Do NOT touch `initReveals`, `initMarquee`, `initWork`, `initFooter`, `initPointer` or `boot`.
- Do NOT change `src/components/Preloader.astro` or any other markup.
- Do NOT add new dependencies.
- If a step doesn't match the code you find, STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` completes with "2 page(s) built" and no errors.
- **Feel check** (run `npm run dev`, open `http://localhost:4321/`):
  - In a new tab (fresh session): the counter runs once, the curtain lifts, and you can
    scroll as soon as the curtain starts moving.
  - Reload the same tab: no dark curtain flashes at all; the hero letters rise immediately.
  - Open `http://localhost:4321/#contact` in a new tab: the page opens at the contact
    section with no curtain and stays there.
  - Scroll halfway down, reload: the page stays where it was.
  - DevTools → Animations panel at 25%: the headline lines begin rising before the
    wordmark letters have fully settled, and the button arrives last.
  - DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, new tab: the curtain
    fades out in place, nothing slides.
- **Done when**: all six checks pass and the browser console shows no errors.
