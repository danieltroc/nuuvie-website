# 002 — Make the mobile menu open faster and close faster still

- **Status**: DONE
- **Commit**: none (the project is not a git repository; written 2026-11-11)
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 file, 4 changed declarations

## Problem

The full-screen mobile menu opens and closes with the same 700ms wipe, and its links wait
250ms and then take 900ms to rise, so the menu is only readable about a second after the tap.
An overlay like this has a 200–500ms budget, and the exit should be quicker than the entrance:
when someone closes a menu, the system is responding, not presenting.

```css
/* src/styles/global.css — current, in the "Nav" block */
.menu {
  position: fixed; inset: 0; z-index: 40;
  background: var(--ink); color: var(--on-ink);
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 7rem var(--gutter) calc(var(--gutter) * 1.5);
  clip-path: inset(0 0 100% 0);
  visibility: hidden;
  transition: clip-path 700ms var(--ease-in-out), visibility 0s 700ms;
}
.menu-open .menu { clip-path: inset(0 0 0 0); visibility: visible; transition: clip-path 700ms var(--ease-in-out), visibility 0s; }
```

```css
/* src/styles/global.css — current, a few lines below */
.menu__links a {
  display: block; font-size: clamp(2.75rem, 13vw, 5rem); line-height: 1.05; letter-spacing: var(--tracking-tight); font-weight: 500;
  transform: translateY(110%);
  transition: transform 500ms var(--ease-out);
}
.menu-open .menu__links a { transform: translateY(0); transition: transform 900ms var(--ease-out) calc(250ms + var(--i) * 60ms); }
```

## Target

- Open: 500ms on the drawer curve. Close: 300ms on the strong ease-out.
- Links: start 120ms after the tap, 40ms apart, 600ms rise. On close they drop in 200ms.

```css
/* target */
.menu {
  /* …all other declarations unchanged… */
  transition: clip-path 300ms var(--ease-out), visibility 0s 300ms;
}
.menu-open .menu { clip-path: inset(0 0 0 0); visibility: visible; transition: clip-path 500ms var(--ease-drawer), visibility 0s; }

.menu__links a {
  /* …all other declarations unchanged… */
  transition: transform 200ms var(--ease-out);
}
.menu-open .menu__links a { transform: translateY(0); transition: transform 600ms var(--ease-out) calc(120ms + var(--i) * 40ms); }
```

## Repo conventions to follow

- Curves are tokens in `src/styles/tokens.css`. The three used here already exist:
  `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`,
  `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`. Do not add or hand-type curves.
- The closed-state rule carries the exit timing and the `.menu-open` rule carries the
  entrance timing. Keep that split.
- The `visibility` delay on the closed state must always equal the closed-state `clip-path`
  duration (both 300ms), otherwise the menu vanishes before the wipe ends.

## Steps

1. In `src/styles/global.css`, rule `.menu`: change the `transition` declaration to
   `transition: clip-path 300ms var(--ease-out), visibility 0s 300ms;`.
2. Rule `.menu-open .menu`: change its `transition` to
   `transition: clip-path 500ms var(--ease-drawer), visibility 0s;`.
3. Rule `.menu__links a`: change `transition: transform 500ms var(--ease-out);` to
   `transition: transform 200ms var(--ease-out);`.
4. Rule `.menu-open .menu__links a`: change its `transition` to
   `transition: transform 600ms var(--ease-out) calc(120ms + var(--i) * 40ms);`.

## Boundaries

- Do NOT touch `src/components/Nav.astro` or `src/scripts/motion.ts`.
- Do NOT change the `@media (prefers-reduced-motion: reduce)` block at the end of the file.
- Do NOT add new dependencies.
- If a step doesn't match the code you find, STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` completes with no errors.
- **Feel check** (`npm run dev`, browser at 375px wide):
  - Tap the round menu button: the dark panel wipes down and all five links are readable
    in well under a second.
  - Tap it again: the panel is gone noticeably faster than it arrived.
  - Tap open and close rapidly several times: the wipe always continues from where it is,
    it never jumps or restarts.
  - Animations panel at 10%: on close, the links have dropped out of view before the panel
    edge passes them.
  - With `prefers-reduced-motion: reduce` emulated: the menu appears and disappears with no wipe.
- **Done when**: the four declarations match the target exactly and the checks pass.
