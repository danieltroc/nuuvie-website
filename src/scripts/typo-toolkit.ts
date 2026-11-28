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

const spec = $('[data-pairs]');
const pairs: Pair[] = spec ? JSON.parse(spec.dataset.pairs ?? '[]') : [];
// Load every pair's fonts up front, so switching pairs in the demo never flashes a fallback font
pairs.forEach((p) => {
  document.fonts.load(`${p.hw} 1em "${p.h}"`).catch(() => {});
  document.fonts.load(`400 1em "${p.b}"`).catch(() => {});
});

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
   Windows and the launch time live in src/lib/typo-toolkit.ts. ?stan=59|69|79 previews one. */
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
      const fill = (sel: string, v: string | null) => $$(sel).forEach((el) => { el.textContent = v ?? ''; el.hidden = !v; });
      fill('[data-tt-price]', `${p.price} zł`);
      fill('[data-tt-label]', p.label);
      fill('[data-tt-until]', p.untilText);
      fill('[data-tt-next]', p.next);
      fill('[data-tt-badge]', p.badge);
      fill('[data-tt-bar-text]', p.bar);
      // Buy buttons go to the checkout (or to the prices while there is no checkout link)
      $$<HTMLAnchorElement>('[data-tt-buy]').forEach((a) => (a.href = CHECKOUT || '#cena'));
      $$('[data-tt-row]').forEach((el) => el.classList.toggle('is-now', el.dataset.ttRow === p.id));
    }
    // Countdown to the end of this window (none in the open-ended one, none in a ?stan= preview)
    const left = p.until && !forced ? Date.parse(p.until) - Date.now() : 0;
    $$('[data-tt-count]').forEach((el) => (el.hidden = left <= 0));
    if (left > 0) {
      const s = Math.floor(left / 1000);
      const v: Record<string, number> = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
      $$('[data-tt-cd]').forEach((el) => (el.textContent = two(v[el.dataset.ttCd!])));
    }
  };
  render();
  setInterval(render, 1000);
}

/* Hero: album slides cross-fade. The active dot fills up over the slide's time (CSS); when the
   fill ends the next slide comes in. Off screen the fill pauses, so nothing runs unseen. */
function initDeck() {
  const deck = $('[data-tt-deck]');
  if (!deck) return;
  const slides = $$('[data-tt-deck-slide]', deck);
  const dots = $$('[data-tt-deck-dot]', deck);
  const cap = $('[data-tt-deck-cap]', deck);
  let i = 0;
  const show = (n: number) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-on', k === i));
    dots.forEach((d, k) => d.setAttribute('aria-pressed', String(k === i)));
    if (cap) cap.textContent = slides[i].dataset.cap ?? '';
  };
  dots.forEach((d, k) => {
    d.addEventListener('click', () => show(k));
    d.querySelector('i')?.addEventListener('animationend', () => { if (k === i) show(i + 1); });
  });
  new IntersectionObserver(([e]) => deck.classList.toggle('is-paused', !e.isIntersecting), { threshold: 0.3 }).observe(deck);
}

/* "I co? Znowu Inter?": the picker scrolls, picks a heading font, hunts for a pair and lands on
   Inter while the clock runs to an hour. Loops while on screen; reduced motion shows the end. */
function initLoop() {
  const root = $('[data-tt-loop]');
  if (!root) return;
  const list = $('[data-loop-list]', root)!;
  const rows = $$('li', list);
  const h = $('[data-loop-h]', root)!;
  const b = $('[data-loop-b]', root)!;
  const slotH = $('[data-loop-slot="h"]', root)!;
  const slotB = $('[data-loop-slot="b"]', root)!;
  const key = $('[data-loop-key]', root)!;
  const count = $('[data-loop-count]', root)!;
  const clock = $('[data-loop-clock]', root)!;
  const stamp = $('[data-loop-stamp]', root)!;
  const steps = $$('[data-loop-step]', root);
  const fonts = rows.map((r) => r.textContent ?? '');
  const HEAD = 7;
  const LAST = fonts.length - 1;
  let presses = 0;

  const fmt = (s: number) => (s >= 3600 ? '1:00:00' : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`);
  // Keep the highlighted row in the middle of the visible part of the list (3 rows on phones, ~7 on desktop)
  const scrollTo = (k: number) => {
    const rowH = rows[0].offsetHeight;
    const visible = Math.max(1, Math.floor((list.parentElement?.clientHeight ?? rowH) / rowH));
    const top = Math.min(Math.max(0, k - Math.floor(visible / 2)), Math.max(0, rows.length - visible));
    list.style.transform = `translateY(${-top * rowH}px)`;
  };
  const step = (n: number) => steps.forEach((el, k) => el.classList.toggle('is-on', k === n));
  const at = (k: number, target: 'h' | 'b') => {
    rows.forEach((r, j) => r.classList.toggle('is-on', j === k));
    scrollTo(k);
    (target === 'h' ? h : b).style.fontFamily = `'${fonts[k]}'`;
    presses += 1;
    count.textContent = `×${presses}`;
    key.classList.remove('is-down');
    void key.offsetWidth;
    key.classList.add('is-down');
  };
  const reset = () => {
    presses = 0;
    count.textContent = '×0';
    h.style.fontFamily = b.style.fontFamily = '';
    slotH.textContent = '…';
    slotB.textContent = '?';
    stamp.classList.remove('is-on');
    root.classList.remove('is-done');
    rows.forEach((r) => r.classList.remove('is-on', 'is-picked'));
    list.style.transform = '';
    clock.textContent = '0:00';
    step(0);
  };
  const end = () => {
    rows.forEach((r, j) => r.classList.toggle('is-on', j === LAST));
    scrollTo(LAST);
    h.style.fontFamily = b.style.fontFamily = "'Inter'";
    slotH.textContent = slotB.textContent = 'Inter';
    stamp.classList.add('is-on');
    root.classList.add('is-done');
    clock.textContent = fmt(3600);
    step(2);
  };

  if (reduced) { end(); steps.forEach((el) => el.classList.add('is-on')); return; }

  const time = { s: 0 };
  const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 3 });
  tl.call(reset, [], 0);
  tl.fromTo(time, { s: 0 }, { s: 3600, duration: 8.2, ease: 'power2.in', onUpdate: () => (clock.textContent = fmt(time.s)) }, 0.2);
  // 1. Scroll the list
  for (let k = 0; k <= HEAD; k++) tl.call(at, [k, 'h'], 0.4 + k * 0.34);
  // 2. Pick a heading font, then hunt for a pair, faster
  const t2 = 0.4 + HEAD * 0.34 + 0.6;
  tl.call(() => { rows[HEAD].classList.add('is-picked'); slotH.textContent = fonts[HEAD]; step(1); }, [], t2);
  for (let k = HEAD + 1; k < LAST; k++) tl.call(at, [k, 'b'], t2 + 0.5 + (k - HEAD - 1) * 0.24);
  // 3. Give up: Inter
  tl.call(end, [], 8.4);
  ScrollTrigger.create({ trigger: root, start: 'top 75%', end: 'bottom top', onToggle: (self) => (self.isActive ? tl.play() : tl.pause()) });
}

/* Skill demo: type "/ty", the skill menu opens, pick /typo-toolkit, type the brief, send.
   Loops while on screen; reduced motion shows the finished message. */
function initChat() {
  const win = $('[data-tt-chat]');
  const prompt = $('#skill')?.dataset.chatPrompt ?? '';
  if (!win || !prompt) return;
  const text = $('[data-chat-text]', win)!;
  const cls = (name: string, on: boolean) => win.classList.toggle(name, on);
  const finished = () => { cls('has-chip', true); cls('is-typing', true); cls('can-send', true); text.textContent = ` ${prompt}`; };
  if (reduced) return finished();

  let run = 0;
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const typeIn = async (str: string, id: number, speed: number) => {
    for (const ch of str) {
      if (id !== run) return false;
      text.textContent += ch;
      await sleep(ch === ' ' ? speed * 0.6 : speed + Math.random() * speed * 0.8);
    }
    return id === run;
  };
  const reset = () => {
    ['has-chip', 'is-typing', 'can-send', 'has-menu', 'is-sent'].forEach((c) => cls(c, false));
    text.textContent = '';
  };
  const play = async () => {
    const id = ++run;
    while (id === run) {
      reset();
      await sleep(700);
      cls('is-typing', true);
      if (!(await typeIn('/', id, 90))) return;
      cls('has-menu', true);
      if (!(await typeIn('ty', id, 120))) return;
      await sleep(650);
      if (id !== run) return;
      cls('has-menu', false);
      text.textContent = ' ';
      cls('has-chip', true);
      await sleep(350);
      if (!(await typeIn(prompt, id, 22))) return;
      cls('can-send', true);
      await sleep(900);
      if (id !== run) return;
      cls('is-sent', true);
      await sleep(180);
      cls('is-sent', false);
      await sleep(3200);
    }
  };
  new IntersectionObserver(([e]) => { if (e.isIntersecting) play(); else { run++; finished(); } }, { threshold: 0.35 }).observe(win);
}

/* Gallery: category tabs, a swipeable track (scroll-snap) and arrows, all kept in step */
function initGallery() {
  const root = $('[data-tt-gal]');
  if (!root) return;
  const data: { cat: string; info: string; pair: string; page: number; n: string }[] = JSON.parse(root.dataset.gal ?? '[]');
  const track = $('[data-gal-track]', root)!;
  const slides = $$('[data-gal-slide]', root);
  const tabs = $$('[data-gal-tab]', root);
  const tabBar = tabs[0]?.parentElement;
  const prev = $('[data-gal-prev]', root)!;
  const next = $('[data-gal-next]', root)!;
  const set = (sel: string, v: string) => { const el = $(sel, root); if (el) el.textContent = v; };
  let cur = 0;

  const mark = (i: number) => {
    if (i === cur && root.dataset.ready) return;
    cur = i;
    root.dataset.ready = '1';
    tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
    const tab = tabs[i];
    if (tab && tabBar) tabBar.scrollTo({ left: tab.offsetLeft - (tabBar.clientWidth - tab.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
    const d = data[i];
    if (d) { set('[data-gal-cat]', d.cat); set('[data-gal-info]', d.info); set('[data-gal-pair]', d.pair); set('[data-gal-page]', `s.\u00a0${d.page}`); set('[data-gal-n]', d.n); }
    prev.toggleAttribute('disabled', i === 0);
    next.toggleAttribute('disabled', i === slides.length - 1);
  };
  const go = (i: number) => {
    const k = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: slides[k].offsetLeft - track.offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
    mark(k);
  };

  tabs.forEach((t, k) => t.addEventListener('click', () => go(k)));
  prev.addEventListener('click', () => go(cur - 1));
  next.addEventListener('click', () => go(cur + 1));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
  });
  // Swiping or trackpad scrolling: the slide that is mostly in view becomes the current one
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) mark(Number((e.target as HTMLElement).dataset.galSlide)); });
  }, { root: track, threshold: 0.6 });
  slides.forEach((sl) => io.observe(sl));
  mark(0);
  // Links from other sections ("Dla kogo"): scroll to the explorer and open that category
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLElement>('[data-gal-go]');
    if (!link) return;
    root.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(() => go(Number(link.dataset.galGo)), reduced ? 0 : 450);
  });
}

/* "Dla kogo", variant C: pick who you are, see your categories */
function initWhoPick() {
  const root = $('[data-tt-who-pick]');
  if (!root) return;
  const tabs = $$('[data-who-tab]', root);
  const panels = $$('[data-who-panel]', root);
  tabs.forEach((t, k) => t.addEventListener('click', () => {
    tabs.forEach((x, j) => x.setAttribute('aria-selected', String(j === k)));
    panels.forEach((p, j) => (p.hidden = j !== k));
  }));
}

/* Big numbers count up once, when they scroll into view */
function initCounts() {
  const els = $$('[data-tt-count-to]');
  if (!els.length || reduced || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target as HTMLElement;
      const obj = { v: 0 };
      gsap.to(obj, { v: Number(el.dataset.ttCountTo), duration: 1.4, ease: 'power3.out', onUpdate: () => (el.textContent = String(Math.round(obj.v))) });
    });
  }, { threshold: 0.6 });
  els.forEach((el) => { el.textContent = '0'; io.observe(el); });
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
initCounts();
initDeck();
initLoop();
initChat();
initGallery();
initWhoPick();
