/**
 * Font-set landing page: the hero specimen cycles through pairs from the set, the cards play small
 * scenes (scenes.ts), and the preview lets the visitor pick a pair and switch between the two ways
 * the set shows it (two fonts in one heading, or heading + paragraph). Window tilt, fades and
 * headline reveals come from next.ts / motion.ts.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScenes, fontsReady, type Scene } from './scenes';

gsap.registerPlugin(ScrollTrigger);

type Pair = { n: number; h: string; hw: number; b: string; chapter: string; src: string; lic: string };
const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const spec = $('[data-f-spec]');
const pairs: Pair[] = spec ? JSON.parse(spec.dataset.pairs ?? '[]') : [];

/** Point a block's font variables at a pair and fill in its labels. */
const apply = (root: HTMLElement, p: Pair) => {
  root.style.setProperty('--fh', `'${p.h}'`);
  root.style.setProperty('--fhw', String(p.hw));
  root.style.setProperty('--fb', `'${p.b}'`);
  const set = (sel: string, text: string) => $$(sel, root).forEach((el) => (el.textContent = text));
  set('[data-f-idx]', String(p.n));
  set('[data-f-chap]', p.chapter);
  set('[data-f-hname]', `${p.h} ${p.hw}`);
  set('[data-f-bname]', p.b);
  set('[data-f-src]', p.src);
  set('[data-f-lic]', p.lic);
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
  let i = 0;
  apply(spec, pairs[0]);
  if (reduced) return;
  const show = (n: number) => { i = n; swap(sample, () => apply(spec, pairs[n])); };
  const loop = gsap.delayedCall(3, function tick() { show((i + 1) % pairs.length); loop.restart(true); }).pause();
  ScrollTrigger.create({ trigger: spec, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()) });
}

/* Preview: pick a pair and a way of combining it */
function initDemo() {
  const demo = $('[data-f-demo]');
  const slide = $('[data-f-slide]');
  if (!demo || !slide || !pairs.length) return;
  const body = $('.f-slide__body', slide) ?? slide;
  const chips = $$<HTMLButtonElement>('[data-f-chip]', demo);
  const modes = $$<HTMLButtonElement>('[data-f-mode]', demo);
  const press = (group: HTMLButtonElement[], on: HTMLButtonElement) => group.forEach((b) => b.setAttribute('aria-pressed', String(b === on)));
  apply(slide, pairs[0]);
  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      press(chips, chip);
      swap(slide, () => apply(slide, pairs[Number(chip.dataset.fChip)]));
    }),
  );
  modes.forEach((btn) =>
    btn.addEventListener('click', () => {
      if (slide.dataset.mode === btn.dataset.fMode) return;
      press(modes, btn);
      swap(body, () => (slide.dataset.mode = btn.dataset.fMode));
    }),
  );
}

/* "What's inside": small scenes that play on scroll and again on every hover, like the cards on
   the home, About and Designer Zone pages (scenes.ts). The markup shows each end state. */
const OUT = 'expo.out';
const scenes: Record<string, Scene> = {
  // 250 pairs: the Aa tiles drop in, then one real pair lights up together
  tiles(el) {
    const pair = $$('[data-f-pair]', el);
    return gsap.timeline()
      .fromTo($$('[data-f-tile]', el), { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5, ease: OUT, stagger: { each: 0.03, from: 'random' } }, 0.1)
      .fromTo(pair[0], { backgroundColor: '#ffffff', color: '#0a0a0a' }, { backgroundColor: '#0a0a0a', color: '#ffffff', duration: 0.35, ease: 'power2.out' }, 0.8)
      .fromTo(pair[1], { backgroundColor: '#ffffff', color: '#0a0a0a' }, { backgroundColor: '#864af9', color: '#ffffff', duration: 0.35, ease: 'power2.out' }, 0.95);
  },

  // 12 chapters: the contents rows slide in, then one chapter is picked
  chapters(el) {
    const rows = $$('[data-row]', el);
    const pick = el.querySelector<HTMLElement>('.is-pick');
    const tl = gsap.timeline()
      .fromTo(rows, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.5, ease: OUT, stagger: 0.07 }, 0.1);
    if (pick) tl.fromTo(pick, { backgroundColor: 'rgba(255,255,255,1)', color: '#0a0a0a' }, { backgroundColor: 'rgba(134,74,249,1)', color: '#ffffff', duration: 0.35, ease: 'power2.out' }, 0.75);
    return tl;
  },

  // Licences: every use case gets its tick, one after another
  licence(el) {
    return gsap.timeline()
      .fromTo($$('li', el), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, ease: OUT, stagger: 0.08 }, 0.1)
      .fromTo($$('[data-check]', el), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.5)', stagger: 0.14 }, 0.45);
  },

  // PDF + Figma: the pages fan out from a stack, then the middle pair is picked
  album(el) {
    const pages = $$('[data-f-page]', el);
    return gsap.timeline()
      .fromTo(pages[0], { xPercent: 95, yPercent: 0, rotation: 0 }, { xPercent: 0, yPercent: 5, rotation: -6, duration: 0.7, ease: 'power3.inOut' }, 0.2)
      .fromTo(pages[2], { xPercent: -95, yPercent: 0, rotation: 0 }, { xPercent: 0, yPercent: 5, rotation: 6, duration: 0.7, ease: 'power3.inOut' }, 0.2)
      .fromTo(pages[1], { outlineColor: 'rgba(134,74,249,0)' }, { outlineColor: 'rgba(134,74,249,1)', duration: 0.3, ease: 'power2.out' }, 1)
      .fromTo($('[data-pick]', el), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.5)' }, 1.1);
  },
};

initDemo();
fontsReady().then(() => {
  initSpecimen();
  initScenes(scenes);
  ScrollTrigger.refresh();
});

/* ───── Price windows: the price, countdown, badge and buy buttons follow the clock ─────
   Windows and the launch time live in src/lib/typo-toolkit.ts. ?stan=pre|59|69|79 previews one. */
import { PHASES, CHECKOUT, phaseAt, type Phase } from '../lib/typo-toolkit';

function initPrices() {
  const root = $('[data-tt]');
  if (!root) return;
  const forced = new URLSearchParams(location.search).get('stan');
  const pick = (): Phase => PHASES.find((p) => p.id === forced) ?? phaseAt(Date.now());
  const two = (n: number) => String(n).padStart(2, '0');
  let current: Phase | null = null;

  const render = () => {
    const p = pick();
    if (p !== current) {
      current = p;
      root.dataset.phase = p.id;
      const label = p.price ? `${p.price} zł` : 'Wkrótce';
      $$('[data-tt-price]').forEach((el) => (el.textContent = label));
      $$('[data-tt-note]').forEach((el) => (el.textContent = p.note));
      $$('[data-tt-badge]').forEach((el) => { el.textContent = p.badge ?? ''; el.hidden = !p.badge; });
      $$('[data-tt-bar-text]').forEach((el) => (el.textContent = p.bar));
      $$('[data-tt-buy-label]').forEach((el) => (el.textContent = p.price ? `Kup TYPO Toolkit 2027 · ${label}` : 'Wkrótce: premiera 30.11, 8:00'));
      // Before the launch the buttons do nothing; afterwards they go to the checkout (or the prices)
      $$<HTMLAnchorElement>('[data-tt-buy]').forEach((a) => {
        a.href = CHECKOUT || '#cena';
        if (p.id === 'pre') a.setAttribute('aria-disabled', 'true'); else a.removeAttribute('aria-disabled');
      });
      $$('[data-tt-row]').forEach((el) => el.classList.toggle('is-now', el.dataset.ttRow === p.id));
    }
    // Countdown to the end of this window (none in the open-ended one)
    const left = p.until && !forced ? Date.parse(p.until) - Date.now() : 0;
    $$('[data-tt-count]').forEach((el) => {
      el.hidden = left <= 0;
      if (left <= 0) return;
      const s = Math.floor(left / 1000);
      const d = Math.floor(s / 86400);
      const time = `${two(Math.floor((s % 86400) / 3600))}:${two(Math.floor((s % 3600) / 60))}:${two(s % 60)}`;
      el.textContent = `${p.id === 'pre' ? 'Do premiery' : 'Do zmiany ceny'}: ${d ? `${d} d ` : ''}${time}`;
    });
  };
  render();
  setInterval(render, 1000);
}

/* Sticky bar: shows once the hero is off screen, hides again at the final CTA */
function initBar() {
  const bar = $('[data-tt-bar]');
  const hero = $('[data-tt-hero]');
  const final = $('[data-tt-final]');
  if (!bar || !hero || !final) return;
  let pastHero = false;
  let atFinal = false;
  const sync = () => {
    const on = pastHero && !atFinal;
    bar.classList.toggle('is-on', on);
    bar.setAttribute('aria-hidden', String(!on));
    bar.querySelector('a')?.setAttribute('tabindex', on ? '0' : '-1');
  };
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; sync(); }).observe(hero);
  new IntersectionObserver(([e]) => { atFinal = e.isIntersecting; sync(); }).observe(final);
}

initPrices();
initBar();
