# Animation plans

Plans produced by the animation audit of the home page on 2026-11-11. Each plan is
self-contained and can be executed by any agent without other context.

| # | Plan | Severity | Status |
| --- | --- | --- | --- |
| 001 | [Shorten the intro and skip the curtain on repeat visits and deep links](001-shorten-intro-and-skip-curtain.md) | HIGH | DONE |
| 002 | [Make the mobile menu open faster and close faster still](002-faster-asymmetric-mobile-menu.md) | MEDIUM | DONE |
| 003 | [Remove backdrop blur from elements that sit on moving layers](003-remove-backdrop-blur-on-moving-layers.md) | MEDIUM | DONE |
| 004 | [Load the blog hover-preview images before they are needed](004-warm-up-blog-preview-images.md) | MEDIUM | DONE |

## Recommended order

001, 003, 002, 004. Plan 001 changes what every visitor sees first; 003 is a two-line
change that protects the sticky work stack; 002 and 004 are contained polish.

## Dependencies

- None of the plans depend on each other.
- 001 and 004 both edit `src/scripts/motion.ts` but in different functions
  (`heroIntro` / `runPreloader` versus `initPointer`). Run them one after the other, not
  in parallel.
- 002 and 003 both edit `src/styles/global.css` in different rules. Same advice.

## Audit findings not yet planned

Nav hides while keyboard focus is inside it; reduced-motion mode removes all fades while the
accordion still moves; cursor label and blog preview go stale when the page scrolls under a
still pointer; accordion duration over budget; no press feedback on rows and cards; easing
tokens differ between CSS and GSAP; marquee allocates a tween per scroll frame.
