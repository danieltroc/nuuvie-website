# 004 — Load the blog hover-preview images before they are needed

- **Status**: DONE
- **Commit**: none (the project is not a git repository; written 2026-11-11)
- **Severity**: MEDIUM
- **Category**: Missed seam (jarring state change)
- **Estimated scope**: 1 file, about 12 added lines

## Problem

On desktop, hovering a blog row shows a floating image that follows the pointer. Those six
images are `loading="lazy"` inside a container that starts at `opacity: 0`, so the browser
may not have fetched them when the first hover happens. The result is an empty rounded box
that later pops to an image. Also, no image is active until a row is entered, so moving the
pointer into the gap between rows shows an empty box.

```astro
<!-- src/components/home/Blog.astro — current -->
  <div class="blog__preview" data-blog-preview aria-hidden="true">
    {t.blog.posts.map((p) => <img src={p.img} alt="" loading="lazy" />)}
  </div>
```

```ts
/* src/scripts/motion.ts — current, inside initPointer() */
  // Blog: image preview follows the pointer
  const list = $('[data-blog-list]');
  const preview = $('[data-blog-preview]');
  if (list && preview) {
    const imgs = $$('img', preview);
    const x = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3.out' });
    gsap.set(preview, { scale: 0.9 });
```

## Target

Keep `loading="lazy"` in the markup (phones never show the preview, so they should not be
forced to fetch it). On devices with a mouse, fetch and decode all six images shortly before
the blog list scrolls into view, and make the first image active by default.

```ts
/* src/scripts/motion.ts — target, inside initPointer() */
  // Blog: image preview follows the pointer
  const list = $('[data-blog-list]');
  const preview = $('[data-blog-preview]');
  if (list && preview) {
    const imgs = $$<HTMLImageElement>('img', preview);
    imgs[0]?.classList.add('is-active');
    // Fetch + decode before the first hover so the preview never shows an empty box
    ScrollTrigger.create({
      trigger: list,
      start: 'top 150%',
      once: true,
      onEnter: () => imgs.forEach((img) => {
        img.loading = 'eager';
        img.decode().catch(() => {});
      }),
    });
    const x = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3.out' });
    gsap.set(preview, { scale: 0.9 });
```

## Repo conventions to follow

- `initPointer()` in `src/scripts/motion.ts` already returns early unless the device has a
  fine pointer, so anything placed inside it is desktop-only. That is why the warm-up goes here.
- `$$` is the file's typed `querySelectorAll` helper: `$$<HTMLImageElement>('img', preview)`.
- Scroll-position hooks use `ScrollTrigger.create({ … once: true })`; see `initMarquee` in
  the same file for an example of `ScrollTrigger.create`.
- The visible image is chosen with the `is-active` class (see `.blog__preview img.is-active`
  in `src/styles/global.css`).

## Steps

1. In `src/scripts/motion.ts`, inside `initPointer()`, in the block that starts with the
   comment `// Blog: image preview follows the pointer`, change
   `const imgs = $$('img', preview);` to `const imgs = $$<HTMLImageElement>('img', preview);`.
2. Directly below that line, insert the `imgs[0]?.classList.add('is-active');` line and the
   `ScrollTrigger.create({ … })` block exactly as shown in the target.
3. Leave the rest of the block (the `quickTo` lines and the event listeners) unchanged.

## Boundaries

- Do NOT change `src/components/home/Blog.astro`; the `loading="lazy"` attribute stays.
- Do NOT touch the cursor or magnetic-button code in the same function.
- Do NOT add new dependencies.
- If a step doesn't match the code you find, STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` completes with no errors.
- **Feel check** (`npm run dev`, desktop width, DevTools → Network with "Disable cache" on
  and throttling set to "Fast 4G"):
  - Reload and scroll down. The six `/img/blog/*.jpg` requests start while the blog list is
    still below the viewport, not on first hover.
  - Move the pointer onto the first row straight away: the preview shows its image at once,
    with no empty box.
  - Move the pointer into the thin gap between two rows: an image is still shown.
  - At 375px wide (phone emulation, reload): the Network panel shows the blog images loading
    only for the small thumbnails as they scroll into view.
- **Done when**: the first hover never shows an empty preview on a throttled connection.
