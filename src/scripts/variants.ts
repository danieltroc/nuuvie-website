/**
 * Interactions for the Tiles / Form / Reel variants. Each block only runs when its
 * hook exists on the page. Smooth scroll, [data-fade], [data-count] and the cursor
 * label come from the shared layer (motion.ts).
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const OUT = 'expo.out';

/* Opening: text settles in */
function initIntro() {
  if (reduced) return;
  gsap.from('[data-v-in]', { opacity: 0, y: 18, duration: 0.9, ease: OUT, stagger: 0.07, delay: 0.1 });
}

/* Tiles: three covers arrive as a fanned stack, scrolling deals them into a row */
function initFan() {
  const hero = $('[data-t-hero]');
  const cards = $$('[data-t-card]');
  if (!hero || cards.length !== 3 || reduced) return;
  const fanned = [
    { xPercent: -34, rotation: -7, scale: 0.88 },
    { xPercent: 0, rotation: 0, scale: 1 },
    { xPercent: 34, rotation: 7, scale: 0.88 },
  ];
  const dealt = [
    { xPercent: -104, rotation: 0, scale: 0.96 },
    { xPercent: 0, rotation: 0, scale: 0.96 },
    { xPercent: 104, rotation: 0, scale: 0.96 },
  ];
  cards.forEach((card, i) => {
    // CSS already fans the cards (for no-JS / reduced motion); hand the same pose to GSAP
    gsap.set(card, { x: 0, y: 0, ...fanned[i] });
    gsap.from(card, { yPercent: 40, opacity: 0, duration: 1.1, ease: OUT, delay: 0.35 + i * 0.08 });
    gsap.to(card, {
      ...dealt[i], ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 55%', scrub: 0.4 },
    });
  });
}

/* Form: the composition keeps quietly rearranging itself; cells also turn on hover */
function initShapes() {
  const grid = $('[data-f-grid]');
  if (!grid) return;
  const shapes = $$('[data-f-shape]', grid);
  if (reduced) return;
  const angle = new WeakMap<HTMLElement, number>();
  const turn = (el: HTMLElement) => {
    const next = (angle.get(el) ?? 0) + 90;
    angle.set(el, next);
    gsap.to(el, { rotation: next, duration: 0.9, ease: 'expo.inOut', overwrite: 'auto' });
  };
  gsap.from(shapes, { scale: 0.9, opacity: 0, duration: 0.9, ease: OUT, stagger: { each: 0.05, from: 'random' }, delay: 0.2 });
  shapes.forEach((el) => el.parentElement!.addEventListener('mouseenter', () => turn(el)));
  const loop = gsap.delayedCall(1.6, function tick() {
    turn(shapes[Math.floor(Math.random() * shapes.length)]);
    loop.restart(true);
  });
  ScrollTrigger.create({ trigger: grid, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()) });
}

/* Reel: on desktop, vertical scroll moves the strip sideways; phones keep native swipe */
function initReel() {
  const reel = $('[data-l-reel]');
  const track = $('[data-l-track]');
  const bar = $('[data-l-bar]');
  if (!reel || !track || reduced) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px) and (hover: hover) and (pointer: fine)', () => {
    reel.classList.add('is-pinned');
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const move = gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: reel, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.5, invalidateOnRefresh: true,
        onUpdate: (self) => { if (bar) bar.style.transform = `scaleX(${self.progress})`; },
      },
    });
    // Each picture slides a little inside its frame as it crosses the screen
    $$('[data-l-img]', track).forEach((img) => {
      gsap.fromTo(img, { xPercent: 0 }, {
        xPercent: -13.8, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
      });
    });
    return () => { reel.classList.remove('is-pinned'); gsap.set(track, { clearProps: 'transform' }); };
  });
}

document.fonts.ready.then(() => {
  initIntro();
  initFan();
  initShapes();
  initReel();
  ScrollTrigger.refresh();
});
