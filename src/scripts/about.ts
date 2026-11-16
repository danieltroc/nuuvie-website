/**
 * About page motion: the hero "sketch to brand" strip, the small scenes in the why and principle
 * cards, the process line and the story video. Reveals, line splits and the figures come from
 * motion.ts and next.ts.
 *
 * Scenes play once when they come on screen and again on every hover (each card in a group the
 * same way). With reduced motion nothing moves: the markup already shows each scene's end state.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const OUT = 'expo.out';
const DRAW = 'power2.inOut';

/* ───── Hero strip: draws stage by stage on load; pans sideways on phones as you scroll ───── */
function initSketch() {
  const wrap = $('[data-a-sketch]');
  if (!wrap || reduced) return;
  const svg = $<SVGSVGElement>('svg', wrap)!;
  const stages = $$('[data-stage]', svg);
  const steps = $$('[data-sk-step]', svg);
  const tl = gsap.timeline({ delay: 0.6 });
  tl.fromTo($$(':scope > [data-sk-line]', svg), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: DRAW }, 0);
  stages.forEach((stage, i) => {
    const at = 0.15 + i * 0.28;
    const lines = $$('[data-sk-line]', stage);
    const fills = $$('[data-sk-fill]', stage);
    if (lines.length) tl.fromTo(lines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: DRAW, stagger: 0.03 }, at);
    if (fills.length) tl.fromTo(fills, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.04 }, at + 0.3);
    if (steps[i]) tl.fromTo(steps[i], { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.5, ease: OUT }, at + 0.1);
  });

  // Phones: the strip is wider than the screen, so scrolling past it pans from first to last stage
  ScrollTrigger.matchMedia({
    '(max-width: 799px)': () => {
      gsap.fromTo(svg, { xPercent: 0 }, {
        xPercent: () => -100 * (1 - wrap.clientWidth / svg.clientWidth), ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top 85%', end: 'bottom 15%', scrub: 0.5, invalidateOnRefresh: true },
      });
    },
  });
}

/* ───── Scenes ───── */
type Scene = (el: HTMLElement) => gsap.core.Timeline;

const scenes: Record<string, Scene> = {
  // 1:1 — a question, Daniel typing, a straight answer
  chat(el) {
    const bubbles = $$('[data-b]', el);
    const typing = $('[data-typing]', el)!;
    gsap.set(bubbles, { opacity: 0, y: 8 });
    return gsap.timeline()
      .to(bubbles[0], { opacity: 1, y: 0, duration: 0.45, ease: OUT }, 0.15)
      .set(typing, { display: 'inline-flex' }, 0.6)
      .fromTo(typing, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: OUT }, 0.6)
      .fromTo($$('i', typing), { y: 0 }, { y: -3, duration: 0.22, ease: 'power1.inOut', yoyo: true, repeat: 3, stagger: 0.1 }, 0.7)
      .set(typing, { display: 'none' }, 1.75)
      .to(bubbles[1], { opacity: 1, y: 0, duration: 0.45, ease: OUT }, 1.75)
      .to(bubbles[2], { opacity: 1, y: 0, duration: 0.45, ease: OUT }, 2.35);
  },

  // Good design — the wireframe's loose blocks settle onto the grid, which shows for a moment
  snap(el) {
    const items = $$('[data-snap]', el);
    const mess = [
      { x: -14, y: 8, r: -4 }, { x: 18, y: -6, r: 3 }, { x: -10, y: 10, r: 2 }, { x: 12, y: 8, r: -5 },
      { x: -12, y: 12, r: 5 }, { x: 8, y: -10, r: -3 }, { x: 14, y: 10, r: 4 },
    ];
    return gsap.timeline()
      .fromTo($('[data-grid]', el), { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.1)
      .fromTo(items, { x: (i) => mess[i].x, y: (i) => mess[i].y, rotation: (i) => mess[i].r }, { x: 0, y: 0, rotation: 0, duration: 0.8, ease: OUT, stagger: 0.06 }, 0.25)
      .to($('[data-grid]', el), { opacity: 0, duration: 0.4, ease: 'power2.out' }, 1.35);
  },

  // Proven process — Logo, Flyer, Brandbook go To do → In progress → Done; the count ticks up to 2540
  kanban(el) {
    const tasks = $$('[data-task]', el);
    const cols = $$('[data-col]', el);
    const count = $('[data-count]', el)!;
    const total = Number(count.dataset.count);
    const at = (col: number, row: number) => ({
      x: cols[col].offsetLeft,
      y: cols[col].offsetTop + row * (tasks[0].offsetHeight + 4),
      width: cols[col].offsetWidth,
    });
    const reset = () => { tasks.forEach((t) => t.classList.remove('is-done')); count.textContent = String(total - tasks.length); };
    reset();
    const tl = gsap.timeline({ onStart: reset });
    tasks.forEach((t, i) => tl.fromTo(t, { x: () => at(0, i).x, y: () => at(0, i).y, width: () => at(0, i).width }, { x: () => at(0, i).x, y: () => at(0, i).y, width: () => at(0, i).width, duration: 0.01 }, 0));
    tasks.forEach((t, i) => {
      const start = 0.4 + i * 0.85;
      tl.to(t, { x: () => at(1, 0).x, y: () => at(1, 0).y, width: () => at(1, 0).width, duration: 0.4, ease: 'power3.inOut' }, start)
        .to(t, { x: () => at(2, i).x, y: () => at(2, i).y, width: () => at(2, i).width, duration: 0.4, ease: 'power3.inOut' }, start + 0.45)
        .add(() => { t.classList.add('is-done'); count.textContent = String(total - tasks.length + i + 1); }, start + 0.85);
    });
    return tl;
  },

  // Goal first — the goal bar fills to 100 %, then the form appears underneath
  target(el) {
    const val = $('[data-val]', el)!;
    const o = { v: 0 };
    return gsap.timeline()
      .fromTo($('[data-bar]', el), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: OUT }, 0.2)
      .fromTo(o, { v: 0 }, { v: 100, duration: 1.1, ease: OUT, onUpdate: () => { val.textContent = `${Math.round(o.v)}%`; } }, 0.2)
      .fromTo($$('[data-form]', el), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5, ease: OUT, stagger: 0.08 }, 0.95);
  },

  // Simplicity — the banner, chips and badges leave; one button stays
  simple(el) {
    return gsap.timeline()
      .fromTo($$('[data-noise]', el), { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.94, duration: 0.3, ease: 'power2.out', stagger: { each: 0.1, from: 'random' } }, 0.6);
  },

  // Consistency — the three surfaces rise, then the same mark lands on all of them at once
  consistent(el) {
    return gsap.timeline()
      .fromTo($$('[data-tile]', el), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: OUT, stagger: 0.1 }, 0.1)
      .fromTo($$('[data-mark]', el), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: OUT }, 0.75);
  },

  // No corporate noise — the email thread folds away into one short message
  quiet(el) {
    const mails = $$('[data-mail]', el);
    const note = $('[data-msg]', el)!;
    // each email slides into the message's place and fades, like a thread being folded
    const toNote = (m: HTMLElement) => note.offsetTop - (m.offsetTop + m.offsetHeight / 2);
    return gsap.timeline()
      .fromTo(mails, { opacity: 1, y: 0, scale: 1 }, { opacity: 0, y: (i, m) => toNote(m), scale: 0.92, duration: 0.5, ease: 'power3.inOut', stagger: { each: 0.08, from: 'end' } }, 0.8)
      .fromTo(note, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.45, ease: OUT }, '-=0.2');
  },
};

function initScenes() {
  $$('[data-scene]').forEach((el) => {
    const make = scenes[el.dataset.scene ?? ''];
    if (!make) return;
    // The kanban card has no CSS position of its own: put it in the last column even without motion
    if (reduced) {
      if (el.dataset.scene === 'kanban') make(el).progress(1).kill();
      return;
    }
    const tl = make(el).pause(0); // shows the start of the scene until it is on screen
    // Replays rewind quickly to the start instead of jumping there, then play again
    const play = () => {
      if (tl.isActive()) return;
      if (tl.progress() === 0) { tl.invalidate().play(0); return; }
      tl.eventCallback('onReverseComplete', () => {
        tl.eventCallback('onReverseComplete', null);
        tl.timeScale(1).invalidate().play(0);
      });
      tl.timeScale(4).reverse();
    };
    ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: play });
    const card = el.closest('.x-card');
    if (finePointer && card) card.addEventListener('mouseenter', play);
  });
}

/* ───── Process line: draws from step to step once on screen (CSS does the drawing) ───── */
function initTimeline() {
  const line = $('[data-a-timeline]');
  if (!line) return;
  if (reduced) { line.classList.add('is-drawn'); return; }
  ScrollTrigger.create({ trigger: line, start: 'top 75%', once: true, onEnter: () => line.classList.add('is-drawn') });
}

/* ───── Story video: plays only while on screen; with reduced motion the poster stays ───── */
function initVideo() {
  const video = $<HTMLVideoElement>('[data-a-video]');
  if (!video || reduced) return;
  ScrollTrigger.create({
    trigger: video, start: 'top bottom', end: 'bottom top',
    onToggle: (self) => { if (self.isActive) video.play().catch(() => {}); else video.pause(); },
  });
}

initSketch();
initTimeline();
initVideo();
// Scenes measure text layout, so they wait for the fonts (at most 1.5 s)
Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(() => {
  initScenes();
  ScrollTrigger.refresh();
});
