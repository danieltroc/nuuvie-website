/**
 * Strefa Designera: small scenes. The review comments and the plan steps take turns;
 * chips and chat bubbles arrive once. Window tilt, fades and headline reveals come from
 * next.ts / motion.ts.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $$ = <T extends HTMLElement = HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Highlight one item of each group at a time while `host` is on screen. */
function takeTurns(host: Element | undefined, groups: HTMLElement[][], every: number, cumulative = false) {
  if (!host || !groups[0]?.length) return;
  const count = groups[0].length;
  let n = 0;
  const light = () => groups.forEach((g) => g.forEach((el, i) => el.classList.toggle('is-on', cumulative ? i <= n : i === n)));
  light();
  if (reduced) return;
  const loop = gsap.delayedCall(every, function tick() { n = (n + 1) % count; light(); loop.restart(true); }).pause();
  ScrollTrigger.create({ trigger: host, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()) });
}

const arrive = (els: HTMLElement[], vars: gsap.TweenVars = {}) => {
  if (reduced || !els.length) return;
  gsap.from(els, { opacity: 0, y: 10, duration: 0.6, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: els[0], start: 'top 92%', once: true }, ...vars });
};

document.fonts.ready.then(() => {
  const pins = $$('[data-z-pin]').sort((a, b) => Number(a.dataset.zPin) - Number(b.dataset.zPin));
  const comments = $$('[data-z-comment]');
  takeTurns(document.querySelector('[data-z-review]') ?? undefined, [pins, comments], 2.4);

  const plan = $$('[data-z-plan]');
  takeTurns(plan[0], [plan], 1.2, true);

  arrive($$('[data-z-chip]'), { scale: 0.92, y: 0, stagger: { each: 0.05, from: 'random' } });
  arrive($$('[data-z-ask]'), { stagger: 0.18 });
});
