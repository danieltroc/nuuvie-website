/**
 * Shared motion layer for every page: smooth scroll (Lenis), headline line reveals,
 * soft fade-ins and the blog list's pointer preview. Page-specific scenes live in
 * next.ts, fonty.ts and strefa.ts.
 *
 * Rules: only transform / opacity are animated, entrances use a strong ease-out,
 * and with prefers-reduced-motion nothing moves — content is simply there.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const OUT = 'expo.out';

/* ───── Smooth scroll ───── */
function initScroll() {
  if (reduced) return;
  const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -80 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ───── Reveals ───── */
function initReveals() {
  // Headlines: lines rise out of a mask
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

  // Everything else: soft rise + fade, batched so neighbours stagger
  gsap.set('[data-fade]', { opacity: 0, y: 24 });
  ScrollTrigger.batch('[data-fade]', {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: OUT, stagger: 0.07, overwrite: true }),
  });
}

/* ───── Blog list: image preview follows the pointer (desktop only) ───── */
function initBlogPreview() {
  if (!finePointer) return;
  const list = $('[data-blog-list]');
  const preview = $('[data-blog-preview]');
  if (!list || !preview) return;

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
  list.addEventListener('mousemove', (e) => { x(e.clientX); y(e.clientY); }, { passive: true });
  list.addEventListener('mouseenter', () => gsap.to(preview, { opacity: 1, scale: 1, duration: 0.4, ease: OUT, overwrite: 'auto' }));
  list.addEventListener('mouseleave', () => gsap.to(preview, { opacity: 0, scale: 0.9, duration: 0.2, ease: 'power2.out', overwrite: 'auto' }));
  $$('[data-post]', list).forEach((a) =>
    a.addEventListener('mouseenter', () => imgs.forEach((img, i) => img.classList.toggle('is-active', i === Number(a.dataset.post)))),
  );
}

/* ───── Boot ───── */
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
