/**
 * Font-set landing page: the hero specimen cycles through example pairs, the demo lets
 * the visitor pick one, and the sample prompt can be copied. Window tilt, fades and
 * headline reveals come from next.ts / motion.ts.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Pair = { h: string; hw: number; b: string };
const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const spec = $('[data-f-spec]');
const pairs: Pair[] = spec ? JSON.parse(spec.dataset.pairs ?? '[]') : [];

/** Point an element's font variables at a pair. */
const apply = (el: HTMLElement, p: Pair) => {
  el.style.setProperty('--fh', `'${p.h}'`);
  el.style.setProperty('--fhw', String(p.hw));
  el.style.setProperty('--fb', `'${p.b}'`);
};

/** Swap content behind a short blur so the font change reads as one object changing. */
const swap = (el: HTMLElement, change: () => void) => {
  if (reduced) return change();
  gsap.timeline()
    .to(el, { opacity: 0, filter: 'blur(6px)', duration: 0.18, ease: 'power2.out', overwrite: true })
    .call(change)
    .to(el, { opacity: 1, filter: 'blur(0px)', duration: 0.45, ease: 'expo.out' });
};

/* Hero specimen: cycles while visible */
function initSpecimen() {
  const sample = $('[data-f-sample]');
  if (!spec || !sample || pairs.length < 2) return;
  const idx = $('[data-f-idx]');
  const hName = $('[data-f-hname]');
  const bName = $('[data-f-bname]');
  let i = 0;
  const show = (n: number) => {
    i = n;
    swap(sample, () => {
      apply(spec, pairs[n]);
      if (idx) idx.textContent = String(n + 1).padStart(2, '0');
      if (hName) hName.textContent = pairs[n].h;
      if (bName) bName.textContent = pairs[n].b;
    });
  };
  apply(spec, pairs[0]);
  if (reduced) return;
  const loop = gsap.delayedCall(3, function tick() { show((i + 1) % pairs.length); loop.restart(true); }).pause();
  ScrollTrigger.create({ trigger: spec, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()) });
}

/* Demo: pick a pair, the whole scale re-sets in it */
function initDemo() {
  const demo = $('[data-f-demo]');
  const scale = $('[data-f-scale]');
  if (!demo || !scale) return;
  const chips = $$<HTMLButtonElement>('[data-f-chip]', demo);
  apply(demo, pairs[0]);
  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      const n = Number(chip.dataset.fChip);
      chips.forEach((c) => c.setAttribute('aria-selected', String(c === chip)));
      swap(scale, () => apply(demo, pairs[n]));
    }),
  );
}

/* Small entrances for the feature graphics */
function initGraphics() {
  if (reduced) return;
  const tiles = $$('[data-f-tile]');
  if (tiles.length) gsap.from(tiles, { opacity: 0, scale: 0.9, duration: 0.6, ease: 'expo.out', stagger: { each: 0.03, from: 'random' }, scrollTrigger: { trigger: tiles[0], start: 'top 90%', once: true } });
  const bubble = $('[data-f-bubble]');
  if (bubble) gsap.from(bubble, { opacity: 0, scale: 0.92, y: 8, duration: 0.6, ease: 'expo.out', delay: 0.3, scrollTrigger: { trigger: bubble, start: 'top 95%', once: true } });
}

/* Copy the sample prompt */
function initCopy() {
  const btn = $<HTMLButtonElement>('[data-f-copy]');
  const text = $('[data-f-prompt]')?.textContent ?? '';
  const label = $('[data-f-copy-label]');
  if (!btn) return;
  let timer = 0;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      if (label) label.textContent = 'Skopiowano';
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { if (label) label.textContent = 'Kopiuj'; }, 1800);
    } catch { /* clipboard blocked: the text is selectable, nothing else to do */ }
  });
}

initCopy();
initDemo();
document.fonts.ready.then(() => {
  initSpecimen();
  initGraphics();
});
