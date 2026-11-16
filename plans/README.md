# Animation plans

Plans from the home page motion audit, 16.11.2026 (commit `ce9ecc5`). Each plan is self-contained and can be executed by any agent.

| # | Plan | Severity | Status |
| --- | --- | --- | --- |
| 001 | [Stop the hero and fade-ins from flashing before they animate](001-no-flash-before-reveal.md) | HIGH | DONE |
| 002 | [Give every service card a hover response, not just one](002-hover-on-every-service-card.md) | HIGH | DONE |
| 003 | [Respect "reduce motion" in hover effects and the blog preview](003-reduced-motion-in-css.md) | MEDIUM | DONE |
| 004 | [Reveal the home hero title line by line](004-hero-title-line-reveal.md) | MEDIUM | DONE |

## Order and dependencies

1. **001**: first. It rewrites `initHero()` and adds the CSS pre-hide block.
2. **004**: right after 001. It extends that block (`[data-x-title]`) and that version of `initHero()`.
3. **002** and **003**: independent of the others and of each other. They can run in parallel with 001/004.
   - 002 changes only `src/styles/next.css`.
   - 003 appends to the end of `src/styles/global.css` (after 001's block, if present) and changes one line in `src/scripts/motion.ts` (`initBlogPreview`, which 001 doesn't touch).
   - 003 must not touch the service-card hover; 002 owns that.

## Not planned (from the same audit)

- **LOW**: the hero canvas selection box animates `width`/`height` (`src/scripts/next.ts:57`). It's small and runs only while visible.
- **LOW**: the blog preview crossfade double-exposes for 320 ms (`src/styles/global.css:100`). Fix with 200 ms plus `filter: blur(2px)` during the swap.
- **Missed opportunities**:
  - The email copy button swaps its label with no transition, and the pill's width jumps.
  - Work cards and blog rows use different hover affordances for their "→".
