/**
 * Strefa Designera: the hero review window (comments and pins take turns) and the four scenes in
 * "What you get". The scenes play on scroll and on every hover, like the home and About cards
 * (scenes.ts). Fades, headline reveals and the timeline line come from next.ts.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScenes, fontsReady, type Scene } from './scenes';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const OUT = 'expo.out';

/** Highlight one item of each group at a time while `host` is on screen. */
function takeTurns(host: Element | null, groups: HTMLElement[][], every: number) {
  if (!host || !groups[0]?.length) return;
  const count = groups[0].length;
  let n = 0;
  const light = () => groups.forEach((g) => g.forEach((el, i) => el.classList.toggle('is-on', i === n)));
  light();
  if (reduced) return;
  const loop = gsap.delayedCall(every, function tick() { n = (n + 1) % count; light(); loop.restart(true); }).pause();
  ScrollTrigger.create({ trigger: host, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()) });
}

/** Counts `el` from 0 up to `to` over `duration`, as part of a timeline. */
const countUp = (el: HTMLElement, to: number, duration: number) => {
  const o = { v: 0 };
  return gsap.fromTo(o, { v: 0 }, { v: to, duration, ease: 'none', onUpdate: () => { el.textContent = String(Math.floor(o.v)); } });
};

const scenes: Record<string, Scene> = {
  // Portfolio review: the projects swap into the right order, then each gets its verdict
  portfolio(el) {
    const cards = $$('[data-card]', el);
    const from = [2, 0, 1]; // where each card starts before it moves to its place
    const offset = (card: HTMLElement, i: number) => cards[from[i]].offsetLeft - card.offsetLeft;
    return gsap.timeline()
      .fromTo(cards, { x: (i, c) => offset(c, i) }, { x: 0, duration: 0.7, ease: 'power3.inOut', stagger: 0.08 }, 0.3)
      .fromTo($$('[data-tag]', el), { opacity: 0, y: 4, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: OUT, stagger: 0.12 }, 1.1);
  },

  // Growth plan: the steps tick off one by one while the bar fills
  plan(el) {
    const steps = $$('[data-step]', el);
    const each = 0.35;
    const tl = gsap.timeline()
      .fromTo($('[data-bar]', el), { scaleX: 0 }, { scaleX: 1, duration: steps.length * each, ease: 'power1.inOut' }, 0.3)
      .add(countUp($('[data-done]', el)!, steps.length, steps.length * each), 0.3);
    steps.forEach((step, i) => {
      tl.fromTo(step, { opacity: 0.45 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.3 + i * each)
        .fromTo($('[data-check]', step), { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: OUT }, 0.3 + i * each);
    });
    return tl;
  },

  // Feedback: each area gets looked at, one after another, and the count climbs
  areas(el) {
    const chips = $$('[data-chip]', el);
    const each = 0.14;
    return gsap.timeline()
      .fromTo(chips,
        { backgroundColor: '#ffffff', color: '#737373', boxShadow: 'inset 0 0 0 1px rgba(10,10,10,0.12)' },
        { backgroundColor: '#f3eeff', color: '#5b23d6', boxShadow: 'inset 0 0 0 1px rgba(134,74,249,0.35)', duration: 0.3, ease: 'power2.out', stagger: each }, 0.3)
      .fromTo($$('i', el), { width: 0, marginRight: 0, opacity: 0 }, { width: '0.95rem', marginRight: '0.3rem', opacity: 1, duration: 0.35, ease: OUT, stagger: each }, 0.3)
      .add(countUp($('[data-n]', el)!, chips.length, chips.length * each), 0.3);
  },

  // Q&A: two questions come in, Daniel types, a straight answer
  chat(el) {
    const bubbles = $$('[data-b]', el);
    const typing = $('[data-typing]', el)!;
    const answer = bubbles[bubbles.length - 1];
    gsap.set(bubbles, { opacity: 0, y: 8 });
    return gsap.timeline()
      .to(bubbles.slice(0, -1), { opacity: 1, y: 0, duration: 0.45, ease: OUT, stagger: 0.45 }, 0.15)
      .set(typing, { display: 'inline-flex' }, 1.05)
      .fromTo(typing, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: OUT }, 1.05)
      .fromTo($$('i', typing), { y: 0 }, { y: -3, duration: 0.22, ease: 'power1.inOut', yoyo: true, repeat: 3, stagger: 0.1 }, 1.15)
      .set(typing, { display: 'none' }, 2.2)
      .to(answer, { opacity: 1, y: 0, duration: 0.45, ease: OUT }, 2.2);
  },

  // Opinions: someone is typing… then the message lands and gets a heart
  dm(el) {
    const typing = $('[data-typing]', el)!;
    return gsap.timeline()
      .fromTo($('[data-msg]', el), { opacity: 0, y: 8, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, transformOrigin: '0% 100%', duration: 0.5, ease: OUT }, 1.2)
      .set(typing, { display: 'flex' }, 0.15)
      .fromTo(typing, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, ease: OUT }, 0.15)
      .fromTo($$('i', typing), { y: 0 }, { y: -3, duration: 0.22, ease: 'power1.inOut', yoyo: true, repeat: 3, stagger: 0.1 }, 0.25)
      .set(typing, { display: 'none' }, 1.2)
      .fromTo($('[data-heart]', el), { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.5)' }, 1.75);
  },
};

/* ───── Questions: the pixel designer walks to the question you point at ─────
   Hovering (or tapping) a card sends him there: feet alternate every 10 px, he faces the way he
   walks, and the card he heads for lights up. With reduced motion he simply appears there. */
function initWalk() {
  const walk = $('[data-z-walk]');
  if (!walk) return;
  const walker = $('[data-walker]', walk)!;
  const body = $('[data-body]', walk)!;
  const bubble = $('[data-bubble]', walk)!;
  const frames = Object.fromEntries($$('[data-frame]', walk).map((f) => [f.dataset.frame!, f]));
  const icons = $$('[data-icon]', walk);
  const cards = $$('[data-q]', walk);
  let frame = 'stand';
  let index = 0;
  let moving: gsap.core.Tween | null = null;

  const show = (name: string) => {
    if (name === frame) return;
    frames[frame]?.classList.remove('is-on');
    frames[name]?.classList.add('is-on');
    frame = name;
  };
  // Where he stands over card i; when the cards stack (phones) he stays put at the left
  const inRow = () => cards.length > 1 && cards[0].offsetTop === cards[1].offsetTop;
  const spot = (i: number) => (inRow() ? cards[i].offsetLeft + cards[i].offsetWidth / 2 - walker.offsetWidth / 2 : 0);
  const showIcon = (i: number, pop: boolean) => {
    icons.forEach((el, n) => el.classList.toggle('is-on', n === i));
    // pixel-style pop: a few hard steps instead of a smooth curve
    if (pop) gsap.fromTo(bubble, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: 'steps(3)', overwrite: true });
    else gsap.set(bubble, { scale: 1, opacity: 1 });
  };

  const goTo = (i: number) => {
    if (i === index && !moving) return;
    index = i;
    cards.forEach((el, n) => el.classList.toggle('is-on', n === i));
    const from = Number(gsap.getProperty(walker, 'x'));
    const to = spot(i);
    const distance = Math.abs(to - from);
    moving?.kill();
    moving = null;
    if (reduced || distance < 2) { gsap.set(walker, { x: to }); show('stand'); showIcon(i, !reduced); return; }
    body.classList.toggle('is-back', to < from);
    // the bubble ducks away while he walks, then pops up with the new icon
    gsap.to(bubble, { scale: 0.4, opacity: 0, duration: 0.12, ease: 'steps(2)', overwrite: true });
    moving = gsap.to(walker, {
      x: to,
      duration: gsap.utils.clamp(0.35, 1.3, distance / 320),
      ease: 'power1.inOut',
      onUpdate: () => show(Math.floor(Number(gsap.getProperty(walker, 'x')) / 10) % 2 ? 'a' : 'b'),
      onComplete: () => { moving = null; show('stand'); showIcon(i, true); },
    });
  };

  cards.forEach((card, i) => {
    if (finePointer) card.addEventListener('mouseenter', () => goTo(i));
    card.addEventListener('click', () => goTo(i));
  });
  cards[0].classList.add('is-on');
  // Keep him over the current card when the layout changes (fonts, resize)
  const place = () => { if (!moving) gsap.set(walker, { x: spot(index) }); };
  place();
  window.addEventListener('resize', place);
  fontsReady().then(place);
}
initWalk();


const pins = $$('[data-z-pin]').sort((a, b) => Number(a.dataset.zPin) - Number(b.dataset.zPin));
takeTurns($('[data-z-review]'), [pins, $$('[data-z-comment]')], 2.4);

fontsReady().then(() => {
  initScenes(scenes);
  ScrollTrigger.refresh();
});
