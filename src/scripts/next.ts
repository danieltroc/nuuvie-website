/**
 * "Next" variant: the small UI scenes that stand in for product screenshots.
 * Smooth scroll, [data-fade], [data-split], [data-count] and the blog preview come
 * from the shared layer (motion.ts).
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const OUT = 'expo.out';

/** Run `play` while `el` is on screen, `pause` when it is not. */
const whileVisible = (el: Element, play: () => void, pause: () => void) =>
  ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? play() : pause()) });
const onceVisible = (el: Element, start = 'top 85%') => ({ trigger: el, start, once: true });

/* ───── Hero: title lines rise, then text, then the window; the window un-tilts as you scroll ───── */
function initHero() {
  if (reduced) return;
  const title = $('[data-x-title]');
  if (title) {
    SplitText.create(title, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'sl',
      autoSplit: true,
      onSplit: (self) => {
        gsap.set(title, { opacity: 1 });
        return gsap.fromTo(self.lines, { yPercent: 115 }, { yPercent: 0, duration: 1.15, stagger: 0.085, ease: OUT, delay: 0.05 });
      },
    });
  }
  const items = $$('[data-x-in]');
  if (items.length) {
    gsap.fromTo(items, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: OUT, stagger: 0.08, delay: title ? 0.35 : 0.05 });
  }
  const win = $('[data-x-win]');
  const stage = $('[data-x-stage]');
  if (!win || !stage) return;
  gsap.fromTo(stage, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 1.2, ease: OUT, delay: title ? 0.55 : 0.3 });
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

  // Brand: the mark settles in (its grid draws on hover, in CSS)
  const mark = $('[data-x-mark]');
  if (mark) gsap.from(mark, { opacity: 0, scale: 0.94, transformOrigin: '50% 50%', duration: 0.9, ease: OUT, clearProps: 'opacity', scrollTrigger: onceVisible(mark, 'top 90%') });

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

  // Audit: bars fill and scores count up — on scroll, and again on every hover (about 1.3 s)
  const bars = $$('[data-x-bar]');
  const auditCard = bars[0]?.closest<HTMLElement>('.x-feat');
  if (bars.length && auditCard) {
    const scores = $$('[data-x-score]', auditCard);
    const total = $('[data-x-total]', auditCard);
    const countUp = (tl: gsap.core.Timeline, el: HTMLElement, to: number, at: number, fmt: (n: number) => string) => {
      const o = { v: 0 };
      tl.to(o, { v: to, duration: 1.1, ease: OUT, onUpdate: () => { el.textContent = fmt(Math.round(o.v)); } }, at);
    };
    let run: gsap.core.Timeline | null = null;
    const play = () => {
      if (run?.isActive()) return;
      run = gsap.timeline();
      run.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: OUT, stagger: 0.08 }, 0);
      scores.forEach((el, i) => countUp(run!, el, Number(el.dataset.xScore), i * 0.08, String));
      if (total) countUp(run, total, Number(total.dataset.xTotal), 0.1, (n) => `${n} / 100`);
    };
    gsap.set(bars, { scaleX: 0 });
    scores.forEach((el) => { el.textContent = '0'; });
    if (total) total.textContent = '0 / 100';
    ScrollTrigger.create({ ...onceVisible(bars[0], 'top 90%'), onEnter: play });
    if (finePointer) auditCard.addEventListener('mouseenter', play);
  }

  // Team: issues arrive one by one; on hover a pointer ticks off the open ones
  const issues = $$('[data-x-issue]');
  if (issues.length) gsap.from(issues, { opacity: 0, y: 10, duration: 0.7, ease: OUT, stagger: 0.08, clearProps: 'all', scrollTrigger: onceVisible(issues[0], 'top 92%') });
  const teamCursor = $('[data-x-team-cursor]');
  const teamCard = teamCursor?.closest<HTMLElement>('.x-feat');
  if (teamCursor && teamCard && issues.length) {
    const host = teamCursor.parentElement!;
    const dots = issues.map((r) => $('[data-x-status]', r)!);
    const original = dots.map((d) => d.className);
    const open = issues.filter((_, i) => !original[i].includes('x-st--done'));
    const reset = () => issues.forEach((r, i) => { r.classList.remove('is-done'); dots[i].className = original[i]; gsap.set(dots[i], { clearProps: 'transform' }); });
    let tl: gsap.core.Timeline | null = null;
    const play = () => {
      tl?.kill();
      reset();
      tl = gsap.timeline();
      tl.set(teamCursor, { x: host.clientWidth * 0.92, y: host.clientHeight + 8, opacity: 0 }).to(teamCursor, { opacity: 1, duration: 0.2 });
      open.forEach((row, n) => {
        const dot = $('[data-x-status]', row)!;
        tl!
          .to(teamCursor, { x: dot.offsetLeft + dot.offsetWidth / 2 - 2, y: dot.offsetTop + dot.offsetHeight / 2 - 1, duration: n ? 0.42 : 0.6, ease: 'power3.inOut' })
          .to(dot, { scale: 0.7, transformOrigin: '50% 50%', duration: 0.09, ease: 'power2.out' })
          .add(() => { dot.className = 'x-st x-st--done'; row.classList.add('is-done'); })
          .to(dot, { scale: 1, duration: 0.3, ease: OUT });
      });
      tl.to(teamCursor, { opacity: 0, duration: 0.3 }, '+=0.5');
    };
    const stop = () => { tl?.kill(); tl = null; gsap.to(teamCursor, { opacity: 0, duration: 0.2, overwrite: true }); reset(); };
    if (finePointer) {
      teamCard.addEventListener('mouseenter', play);
      teamCard.addEventListener('mouseleave', stop);
    } else {
      ScrollTrigger.create({ ...onceVisible(teamCard, 'top 70%'), onEnter: play });
    }
  }

  // Business path: the three steps light up in order
  const steps = $$('[data-x-step]');
  if (steps.length) {
    let n = 0;
    const light = () => steps.forEach((s, i) => s.classList.toggle('is-on', i <= n));
    light();
    const loop = gsap.delayedCall(1.3, function tick() { n = (n + 1) % steps.length; light(); loop.restart(true); }).pause();
    whileVisible(steps[0], () => loop.resume(), () => loop.pause());
  }

  // Designer path: three review comments, one after another, each pinned to a project
  const review = $('[data-x-review]');
  if (review) {
    const notes = $$('[data-x-note]', review);
    const pins = $$('[data-x-pin]', review).sort((a, b) => Number(a.dataset.xPin) - Number(b.dataset.xPin));
    const picks = pins.map((p) => p.parentElement!);
    gsap.set([...notes, ...pins], { opacity: 0 });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5, paused: true });
    notes.forEach((note, n) => {
      tl.add(() => picks.forEach((t, i) => t.classList.toggle('is-pick', i === n)))
        .fromTo(pins[n], { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.35, ease: OUT })
        .fromTo(note, { opacity: 0, y: 8, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: OUT }, '-=0.15')
        .to(note, { opacity: 0, y: -4, duration: 0.25, ease: 'power2.out' }, '+=1.6');
    });
    tl.add(() => picks.forEach((t) => t.classList.remove('is-pick'))).to(pins, { opacity: 0, scale: 0.6, duration: 0.3, ease: 'power2.out' }, '+=0.15');
    whileVisible(review, () => tl.play(), () => tl.pause());
  }
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
        if (label) label.textContent = document.documentElement.lang === 'pl' ? 'Skopiowano' : 'Copied';
      } catch {
        window.location.href = `mailto:${value}`;
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { if (label) label.textContent = value; }, 1800);
    });
  });
}

/* ───── Timelines with [data-x-draw]: CSS draws the line once .is-drawn is added ───── */
function initDraw() {
  $$('[data-x-draw]').forEach((line) => {
    if (reduced) { line.classList.add('is-drawn'); return; }
    ScrollTrigger.create({ trigger: line, start: 'top 75%', once: true, onEnter: () => line.classList.add('is-drawn') });
  });
}

initCopy();
initDraw();
// The hero only fades and rises, so it starts at once; a failure must never leave it hidden
try {
  initHero();
} catch (err) {
  console.error('[next]', err);
  document.documentElement.classList.add('motion-off');
}
// These measure text and layout, so they wait for the font (at most 1.5 s)
Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(() => {
  initCanvas();
  initGraphics();
  initFigures();
  ScrollTrigger.refresh();
});

/* ───── Statement figures: each tells its number once, on scroll ───── */
function initFigures() {
  if (reduced) return;
  $$<SVGSVGElement>('[data-fig]').forEach((svg) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 85%', once: true } });
    const kind = svg.dataset.fig;
    if (kind === 'years') {
      // Bars grow from the axis, year after year
      tl.from($$('[data-fig-bar]', svg), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.9, ease: OUT, stagger: 0.045 })
        .from($$('[data-fig-label]', svg), { opacity: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 }, 0.25);
    } else if (kind === 'countries') {
      // The globe draws, the points appear, then arcs fly out from Poland
      tl.fromTo($$('[data-fig-line]', svg), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: 0.04 })
        .from($$('[data-fig-dot]', svg), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.5, ease: OUT, stagger: 0.05 }, 0.55)
        .fromTo($$('[data-fig-arc]', svg), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12 }, 1);
    } else if (kind === 'projects') {
      // Cells fill column by column (time), then the empty one — yours — lights up
      tl.from($$('[data-fig-cell]', svg), { opacity: 0, scale: 0.5, transformOrigin: '50% 50%', duration: 0.35, ease: 'power2.out', stagger: 0.004 })
        .from($$('[data-fig-you]', svg), { opacity: 0, scale: 0.5, transformOrigin: '50% 50%', duration: 0.6, ease: OUT }, '-=0.15')
        .from($$('[data-fig-label]', svg), { opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
    } else if (kind === 'line') {
      // Generic line figure (Strefa Designera): blocks grow, lines draw, points land, labels last
      tl.from($$('[data-fig-bar]', svg), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.7, ease: OUT, stagger: 0.15 })
        .fromTo($$('[data-fig-line]', svg), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: 0.06 }, 0)
        .from($$('[data-fig-dot]', svg), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.45, ease: OUT, stagger: 0.05 }, 0.45)
        .from($$('[data-fig-label]', svg), { opacity: 0, duration: 0.5, ease: 'power2.out', stagger: 0.06 }, 0.6);
    }
  });
}
