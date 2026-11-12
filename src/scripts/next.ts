/**
 * "Next" variant: the small UI scenes that stand in for product screenshots.
 * Smooth scroll, [data-fade], [data-split], [data-count] and the blog preview come
 * from the shared layer (motion.ts).
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const OUT = 'expo.out';

/** Run `play` while `el` is on screen, `pause` when it is not. */
const whileVisible = (el: Element, play: () => void, pause: () => void) =>
  ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? play() : pause()) });
const onceVisible = (el: Element, start = 'top 85%') => ({ trigger: el, start, once: true });

/* ───── Hero: text in, window rises and un-tilts as you scroll ───── */
function initHero() {
  const win = $('[data-x-win]');
  const stage = $('[data-x-stage]');
  if (reduced || !win || !stage) return;
  gsap.from('[data-x-in]', { opacity: 0, y: 16, duration: 0.9, ease: OUT, stagger: 0.08, delay: 0.05 });
  gsap.from(stage, { opacity: 0, y: 48, duration: 1.2, ease: OUT, delay: 0.3 });
  gsap.fromTo(win, { rotateX: 16, scale: 0.95 }, {
    rotateX: 0, scale: 1, ease: 'none',
    scrollTrigger: { trigger: stage, start: 'top 90%', end: 'top 22%', scrub: 0.4 },
  });
}

/* ───── Hero canvas: a pointer selects each artboard in turn ───── */
function initCanvas() {
  const canvas = $('[data-x-canvas]');
  const sel = $('[data-x-sel]');
  const cursor = $('[data-x-cursor]');
  const size = $('[data-x-size]');
  if (!canvas || !sel || !cursor) return;
  const arts = $$('[data-x-art]', canvas);
  const layers = $$('[data-x-layer]');
  let current = 0;

  const select = (i: number, instant = false) => {
    current = i;
    const a = arts[i];
    const box = { x: a.offsetLeft, y: a.offsetTop, width: a.offsetWidth, height: Math.min(a.offsetHeight, canvas.clientHeight - a.offsetTop) };
    layers.forEach((l, n) => l.classList.toggle('is-on', n === i));
    if (size) size.textContent = `${Math.round(box.width * 2)} × ${Math.round(box.height * 2)}`;
    if (instant || reduced) {
      gsap.set(sel, box);
      gsap.set(cursor, { x: box.x + box.width * 0.6, y: box.y + box.height * 0.55 });
      return;
    }
    gsap.to(cursor, { x: box.x + box.width * 0.6, y: box.y + box.height * 0.55, duration: 0.8, ease: 'power3.inOut', overwrite: true });
    gsap.to(sel, { ...box, duration: 0.5, ease: OUT, delay: 0.55, overwrite: true });
  };

  select(0, true);
  ScrollTrigger.addEventListener('refresh', () => select(current, true));
  if (reduced) return;
  const loop = gsap.delayedCall(2.6, function tick() { select((current + 1) % arts.length); loop.restart(true); }).pause();
  whileVisible(canvas, () => loop.resume(), () => loop.pause());
}

/* ───── Service graphics ───── */
function initGraphics() {
  if (reduced) return;

  // Brand: the mark draws itself over its construction circles
  const stroke = $<SVGPathElement>('[data-x-draw]');
  if (stroke) {
    const len = stroke.getTotalLength();
    const svg = stroke.ownerSVGElement!;
    gsap.set(stroke, { strokeDasharray: len });
    gsap.timeline({ scrollTrigger: onceVisible(svg) })
      .from('.x-g-circles circle', { opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' })
      .fromTo(stroke, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0.2)
      .from('.x-g-fill', { opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
  }

  // UX: a pointer travels to the button and presses it
  const uxCursor = $('[data-x-ux-cursor]');
  const tap = $('[data-x-tap]');
  if (uxCursor && tap) {
    const host = uxCursor.parentElement!;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.4, paused: true });
    tl.fromTo(uxCursor, { x: () => host.clientWidth * 0.82, y: () => host.clientHeight * 0.9 }, {
      x: () => tap.offsetLeft + tap.offsetWidth * 0.6 + 14, y: () => tap.offsetTop + tap.offsetHeight * 0.5 + 14,
      duration: 1, ease: 'power3.inOut',
    })
      .to(tap, { scale: 0.9, duration: 0.12, ease: 'power2.out' })
      .to(tap, { scale: 1, backgroundColor: '#864af9', duration: 0.35, ease: OUT })
      .to(tap, { backgroundColor: '#0a0a0a', duration: 0.5, ease: 'power1.out' }, '+=0.7');
    whileVisible(host, () => tl.play(), () => tl.pause());
  }

  // Audit: bars fill
  const bars = $$('[data-x-bar]');
  if (bars.length) gsap.from(bars, { scaleX: 0, duration: 1.1, ease: OUT, stagger: 0.09, scrollTrigger: onceVisible(bars[0], 'top 90%') });

  // Team: issues arrive one by one
  const issues = $$('[data-x-issue]');
  if (issues.length) gsap.from(issues, { opacity: 0, y: 10, duration: 0.7, ease: OUT, stagger: 0.08, scrollTrigger: onceVisible(issues[0], 'top 92%') });

  // Business path: the three steps light up in order
  const steps = $$('[data-x-step]');
  if (steps.length) {
    let n = 0;
    const light = () => steps.forEach((s, i) => s.classList.toggle('is-on', i <= n));
    light();
    const loop = gsap.delayedCall(1.3, function tick() { n = (n + 1) % steps.length; light(); loop.restart(true); }).pause();
    whileVisible(steps[0], () => loop.resume(), () => loop.pause());
  }

  // Designer path: the review note pops in from its corner
  const note = $('[data-x-note]');
  if (note) gsap.from(note, { opacity: 0, scale: 0.92, y: 8, duration: 0.6, ease: OUT, delay: 0.3, scrollTrigger: onceVisible(note, 'top 95%') });
}

/* ───── Copy the email address ───── */
function initCopy() {
  $$<HTMLButtonElement>('[data-x-copy]').forEach((btn) => {
    const label = $('[data-x-copy-label]', btn);
    const value = btn.dataset.xCopy ?? '';
    let timer = 0;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(value);
        if (label) label.textContent = 'Skopiowano';
      } catch {
        window.location.href = `mailto:${value}`;
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { if (label) label.textContent = value; }, 1800);
    });
  });
}

initCopy();
document.fonts.ready.then(() => {
  initHero();
  initCanvas();
  initGraphics();
  ScrollTrigger.refresh();
});

/* ───── Statement figures: lines draw in once ───── */
if (!reduced) {
  document.fonts.ready.then(() => {
    document.querySelectorAll<SVGSVGElement>('[data-x-fig]').forEach((svg) => {
      const paths = Array.from(svg.querySelectorAll('path'));
      gsap.from(paths, {
        opacity: 0, y: 14, duration: 0.8, ease: 'expo.out', stagger: 0.07,
        scrollTrigger: { trigger: svg, start: 'top 85%', once: true },
      });
    });
  });
}
