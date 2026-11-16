/**
 * Font-set landing page: the hero specimen cycles through example pairs, the cards play small
 * scenes (scenes.ts), the demo lets
 * the visitor pick one, and the sample prompt can be copied. Window tilt, fades and
 * headline reveals come from next.ts / motion.ts.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScenes, fontsReady, type Scene } from './scenes';

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

/* "What's inside" and the album: small scenes that play on scroll and again on every hover, like
   the cards on the home, About and Designer Zone pages (scenes.ts). The markup shows each end state. */
const OUT = 'expo.out';
const scenes: Record<string, Scene> = {
  // 250 fonts in pairs: the Aa tiles drop in, then one pair lights up together
  tiles(el) {
    const pair = $$('[data-f-pair]', el);
    return gsap.timeline()
      .fromTo($$('[data-f-tile]', el), { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5, ease: OUT, stagger: { each: 0.03, from: 'random' } }, 0.1)
      .fromTo(pair[0], { backgroundColor: '#ffffff', color: '#0a0a0a' }, { backgroundColor: '#0a0a0a', color: '#ffffff', duration: 0.35, ease: 'power2.out' }, 0.8)
      .fromTo(pair[1], { backgroundColor: '#ffffff', color: '#0a0a0a' }, { backgroundColor: '#864af9', color: '#ffffff', duration: 0.35, ease: 'power2.out' }, 0.95);
  },

  // Web parameters: the CSS types itself in, line by line
  code(el) {
    const tl = gsap.timeline();
    $$('[data-line]', el).forEach((line, i) => {
      const chars = (line.textContent ?? '').length;
      tl.fromTo(line, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: Math.min(0.6, chars * 0.025), ease: `steps(${chars})` }, 0.15 + i * 0.4);
    });
    return tl;
  },

  // PDF with prompts: the page fills in, then the prompt is typed and lands as a message
  pdf(el) {
    const typing = $('[data-typing]', el)!;
    return gsap.timeline()
      .fromTo($$('[data-sk]', el), { scaleX: 0 }, { scaleX: 1, transformOrigin: '0% 50%', duration: 0.5, ease: 'power2.inOut', stagger: 0.12 }, 0.1)
      .fromTo($('[data-tag]', el), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35, ease: OUT }, 0.5)
      .fromTo($('[data-f-bubble]', el), { opacity: 0, y: 8, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: OUT }, 1.6)
      .set(typing, { display: 'flex' }, 0.75)
      .fromTo(typing, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, ease: OUT }, 0.75)
      .fromTo($$('i', typing), { y: 0 }, { y: -3, duration: 0.2, ease: 'power1.inOut', yoyo: true, repeat: 3, stagger: 0.1 }, 0.85)
      .set(typing, { display: 'none' }, 1.6);
  },

  // Client album: the pages fan out from a stack, then the client picks the middle pair
  album(el) {
    const pages = $$('[data-f-page]', el);
    return gsap.timeline()
      .fromTo(pages[0], { xPercent: 95, yPercent: 0, rotation: 0 }, { xPercent: 0, yPercent: 5, rotation: -6, duration: 0.7, ease: 'power3.inOut' }, 0.2)
      .fromTo(pages[2], { xPercent: -95, yPercent: 0, rotation: 0 }, { xPercent: 0, yPercent: 5, rotation: 6, duration: 0.7, ease: 'power3.inOut' }, 0.2)
      .fromTo(pages[1], { outlineColor: 'rgba(134,74,249,0)' }, { outlineColor: 'rgba(134,74,249,1)', duration: 0.3, ease: 'power2.out' }, 1)
      .fromTo($('[data-pick]', el), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.5)' }, 1.1);
  },

  // The big album: the pages are laid out one by one
  albumbig(el) {
    return gsap.timeline()
      .fromTo($$('[data-page]', el), { opacity: 0, y: 14, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: OUT, stagger: 0.07 }, 0.1);
  },
};

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
fontsReady().then(() => {
  initSpecimen();
  initScenes(scenes);
  ScrollTrigger.refresh();
});
