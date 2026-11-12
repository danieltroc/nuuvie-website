/**
 * Interactions that exist only in the "Nova" variant. The shared layer (motion.ts) still
 * provides smooth scroll, nav, [data-fade], [data-split], [data-count], [data-scrub-words]
 * and the cursor label.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const OUT = 'expo.out';

/* ───── Live clock (Poland) ───── */
function initClock() {
  const el = $('[data-n-clock]');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('pl-PL', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Warsaw' });
  const tick = () => { el.textContent = fmt.format(new Date()); };
  tick();
  window.setInterval(tick, 15_000);
}

/* ───── Hero: intro, rolling word, mark that floods into the work section ───── */
function initHero() {
  const hero = $('[data-n-hero]');
  const roll = $('[data-n-roll]');
  const mark = $('[data-n-mark]');
  if (!hero || !roll) return;
  const words = $$('i', roll);
  const svg = mark?.querySelector('svg');
  const every = Number(roll.dataset.nRollEvery) || 2.4;

  if (reduced) {
    words.slice(1).forEach((w) => (w.style.display = 'none'));
    return;
  }

  // Intro
  gsap.set(words, { yPercent: 115 });
  const intro = gsap.timeline({ defaults: { ease: OUT } })
    .from('[data-n-rise]', { yPercent: 115, duration: 1.2, stagger: 0.16 }, 0.1)
    .to(words[0], { yPercent: 0, duration: 1.2 }, 0.18);
  if (mark) intro.from(mark, { scale: 0.9, opacity: 0, duration: 0.9 }, 0.5);
  intro.from('[data-n-in]', { opacity: 0, y: 14, duration: 0.8, stagger: 0.08 }, 0.55);

  // Rolling word — pauses whenever the hero is not on screen
  let i = 0;
  const next = () => {
    const from = words[i];
    i = (i + 1) % words.length;
    const to = words[i];
    gsap.to(from, { yPercent: -115, duration: 0.7, ease: 'expo.inOut' });
    gsap.fromTo(to, { yPercent: 115 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' });
  };
  const loop = gsap.delayedCall(every, function tick() { next(); loop.restart(true); }).pause();
  ScrollTrigger.create({
    trigger: hero, start: 'top bottom', end: 'bottom top',
    onToggle: (self) => (self.isActive && !document.hidden ? loop.resume() : loop.pause()),
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? loop.pause() : ScrollTrigger.isInViewport(hero) && loop.resume()));

  // Portal: the mark grows from its own left lobe until the screen is solid ink,
  // which is exactly the background of the work section that follows.
  if (!mark || !svg) return; // the Swiss take has no mark: no flood, no pin
  gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: '+=110%', pin: true, scrub: 0.3 } })
    .to('[data-n-content]', { yPercent: -8, opacity: 0, ease: 'none', duration: 0.45 }, 0)
    .to(svg, { scale: 46, ease: 'power2.in', duration: 1 }, 0);

  // The mark leans gently toward the pointer
  if (finePointer) {
    const x = gsap.quickTo(mark, 'x', { duration: 0.9, ease: 'power3.out' });
    const y = gsap.quickTo(mark, 'y', { duration: 0.9, ease: 'power3.out' });
    hero.addEventListener('mousemove', (e) => {
      x((e.clientX / window.innerWidth - 0.5) * 28);
      y((e.clientY / window.innerHeight - 0.5) * 28);
    }, { passive: true });
  }
}

/* ───── Services: the big index number rolls as each block takes focus ───── */
function initServices() {
  const col = $('[data-n-digits]');
  const items = $$('[data-n-svc]');
  if (!items.length) return;
  const step = 100 / items.length;
  const setActive = (idx: number) => {
    items.forEach((el, n) => el.classList.toggle('is-active', n === idx));
    if (col) gsap.to(col, { yPercent: -step * idx, duration: reduced ? 0 : 0.7, ease: OUT, overwrite: true });
  };
  items.forEach((el, idx) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 55%', end: 'bottom 55%',
      onToggle: (self) => self.isActive && setActive(idx),
    });
  });
  setActive(0);
}

/* ───── Testimonials: one at a time, auto-advancing, interruptible ───── */
function initQuotes() {
  const root = $('[data-n-quotes]');
  if (!root) return;
  const tabs = $$<HTMLButtonElement>('[data-n-tab]', root);
  const quotes = $$('[data-n-quote]', root);
  const bars = $$('[data-n-bar]', root);
  let current = 0;
  let progress: gsap.core.Tween | undefined;

  const run = () => {
    progress?.kill();
    gsap.set(bars, { scaleX: 0 });
    if (reduced) return;
    progress = gsap.fromTo(bars[current], { scaleX: 0 }, {
      scaleX: 1, duration: 6, ease: 'none', paused: !ScrollTrigger.isInViewport(root),
      onComplete: () => show((current + 1) % quotes.length),
    });
  };

  const show = (idx: number) => {
    if (idx !== current) {
      const prev = quotes[current];
      const next = quotes[idx];
      current = idx;
      tabs.forEach((tab, n) => tab.setAttribute('aria-selected', String(n === idx)));
      gsap.killTweensOf([prev, next]);
      if (reduced) {
        gsap.set(prev, { autoAlpha: 0 });
        gsap.set(next, { autoAlpha: 1 });
      } else {
        // Blur bridges the two states so the swap reads as one object changing
        gsap.to(prev, { autoAlpha: 0, y: -10, filter: 'blur(6px)', duration: 0.22, ease: 'power2.out' });
        gsap.fromTo(next, { autoAlpha: 0, y: 14, filter: 'blur(6px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: OUT, delay: 0.12 });
      }
    }
    run();
  };

  tabs.forEach((tab, idx) => tab.addEventListener('click', () => show(idx)));
  root.addEventListener('mouseenter', () => progress?.pause());
  root.addEventListener('mouseleave', () => progress?.resume());
  ScrollTrigger.create({ trigger: root, start: 'top 85%', end: 'bottom top', onToggle: (self) => (self.isActive ? progress?.resume() : progress?.pause()) });
  gsap.set(quotes[0], { autoAlpha: 1 });
  run();
}

/* ───── Click the email to copy it ───── */
function initCopy() {
  $$<HTMLButtonElement>('[data-n-copy]').forEach((btn) => {
    const hint = $('[data-n-copy-hint]', btn);
    const idle = hint?.textContent ?? '';
    let timer = 0;
    btn.addEventListener('click', async () => {
      const value = btn.dataset.nCopy ?? '';
      try {
        await navigator.clipboard.writeText(value);
        if (hint) hint.textContent = 'Skopiowano ✓';
      } catch {
        window.location.href = `mailto:${value}`;
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { if (hint) hint.textContent = idle; }, 2000);
    });
  });
}

initClock();
initCopy();
document.fonts.ready.then(() => {
  initHero();
  initServices();
  initQuotes();
  ScrollTrigger.refresh();
});
