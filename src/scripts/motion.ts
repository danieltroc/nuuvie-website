/**
 * Nuuvie motion layer — GSAP + ScrollTrigger + SplitText, Lenis for smooth scroll.
 *
 * Rules this file follows:
 *  - only transform / opacity / clip-path are animated
 *  - entrances use strong ease-out (expo.out); on-screen travel uses expo.inOut
 *  - press + hover feedback lives in CSS (interruptible transitions), not here
 *  - prefers-reduced-motion: no movement at all, content is simply there
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

const html = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const OUT = 'expo.out';
const IN_OUT = 'expo.inOut';

let lenis: Lenis | null = null;

/* ───────────── Smooth scroll ───────────── */
function initScroll() {
  if (reduced) return;
  lenis = new Lenis({ lerp: 0.11, anchors: { offset: -80 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ───────────── Nav: hide on scroll down, mobile menu ───────────── */
function initNav() {
  const nav = $('[data-nav]');
  const toggle = $<HTMLButtonElement>('[data-menu-toggle]');
  if (!nav || !toggle) return;

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      if (html.classList.contains('menu-open')) return;
      nav.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 240);
    },
  });

  const setMenu = (open: boolean) => {
    html.classList.toggle('menu-open', open);
    html.classList.toggle('is-locked', open);
    toggle.setAttribute('aria-expanded', String(open));
    open ? lenis?.stop() : lenis?.start();
  };
  toggle.addEventListener('click', () => setMenu(!html.classList.contains('menu-open')));
  $$('[data-menu-link]').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => e.matches && setMenu(false));
}

/* ───────────── Services accordion (CSS does the motion) ───────────── */
function initAccordion() {
  const buttons = $$<HTMLButtonElement>('[data-accordion]');
  buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      buttons.forEach((b) => b.setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', String(!open));
      window.setTimeout(() => ScrollTrigger.refresh(), 560);
    }),
  );
}

/* ───────────── Hero intro ───────────── */
function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: OUT, duration: 1.2 } });
  const hero = $('[data-hero]');
  if (!hero) return tl;

  const wordmark = SplitText.create('[data-hero-wordmark] > span', { type: 'chars' });
  let titleTween: gsap.core.Tween | undefined;
  let titleReady = false;
  SplitText.create('[data-hero-title]', {
    type: 'lines',
    mask: 'lines',
    linesClass: 'sl',
    autoSplit: true,
    onSplit: (self) => {
      titleTween = gsap.from(self.lines, { yPercent: 115, duration: 1.2, stagger: 0.09, ease: OUT, paused: !titleReady });
      return titleTween;
    },
  });

  tl.from(wordmark.chars, { yPercent: 118, duration: 1.4, stagger: 0.045 }, 0)
    .from('.nav__bar', { yPercent: -180, duration: 1.1 }, 0.35)
    .from('[data-hero-meta]', { opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.4)
    .from('[data-hero-rule]', { scaleX: 0, duration: 1.3, stagger: 0.08, ease: IN_OUT }, 0.3)
    .from('[data-hero-svc]', { y: 14, opacity: 0, duration: 0.9, stagger: 0.035 }, 0.75)
    .from('[data-hero-portrait]', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: IN_OUT }, 0.45)
    .from('[data-hero-portrait] img', { scale: 1.3, duration: 1.9 }, 0.45)
    .call(() => { titleReady = true; titleTween?.play(); }, [], 0.45)
    .from('[data-hero-fade]', { y: 22, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.75);

  // Wordmark drifts up and apart a touch as the hero leaves
  gsap.to('[data-hero-wordmark]', {
    yPercent: -18,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
  return tl;
}

/* ───────────── Preloader ───────────── */
function runPreloader(onDone: () => void) {
  const pre = $('[data-preloader]');
  const count = $('[data-preloader-count]');

  let first = true;
  try {
    first = !sessionStorage.getItem('nuuvie:seen');
    sessionStorage.setItem('nuuvie:seen', '1');
  } catch { /* private mode — just play the full intro */ }

  if (reduced) {
    if (!pre) return onDone();
    gsap.to(pre, { opacity: 0, duration: 0.3, ease: 'power1.out', onComplete: () => { pre.remove(); onDone(); } });
    return;
  }

  // The curtain is a first-visit, top-of-page moment only.
  const skipCurtain = !first || !!window.location.hash || window.scrollY > 4;
  if (!pre || skipCurtain) {
    pre?.remove();
    heroIntro().eventCallback('onComplete', onDone);
    return;
  }

  lenis?.stop();
  const state = { v: 0 };
  const tl = gsap.timeline({ onComplete: () => { pre.remove(); onDone(); } });

  tl.from('[data-preloader-mark]', { scale: 0.9, opacity: 0, duration: 0.4, ease: OUT })
    .to(state, {
      v: 100, duration: 0.7, ease: 'power2.inOut',
      onUpdate: () => { if (count) count.textContent = String(Math.round(state.v)); },
    }, 0.05)
    .call(() => lenis?.start())
    .to(pre, { yPercent: -100, duration: 0.8, ease: IN_OUT })
    .to('[data-preloader-mark], [data-preloader-count]', { yPercent: 60, duration: 0.8, ease: IN_OUT }, '<')
    .add(heroIntro(), '<0.3');
}

/* ───────────── Scroll reveals ───────────── */
function initReveals() {
  // Headlines: lines rise out of a mask
  $$('[data-split="lines"]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'sl',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 115, duration: 1.15, stagger: 0.085, ease: OUT,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
    });
  });

  // Single-line pieces that carry their own mask in markup
  $$('[data-rise]').forEach((el, i) => {
    gsap.from(el, {
      yPercent: 115, duration: 1.3, ease: OUT, delay: (i % 2) * 0.1,
      scrollTrigger: { trigger: el.parentElement, start: 'top 90%', once: true },
    });
  });

  // Everything else: soft rise + fade, batched so neighbours stagger
  gsap.set('[data-fade]', { opacity: 0, y: 24 });
  ScrollTrigger.batch('[data-fade]', {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: OUT, stagger: 0.07, overwrite: true }),
  });

  // Hairlines draw in
  $$('[data-rule]').forEach((el) => {
    gsap.from(el, { scaleX: 0, duration: 1.4, ease: IN_OUT, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });

  // Counters
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const state = { v: 0 };
    el.textContent = '0';
    gsap.to(state, {
      v: end, duration: 1.8, ease: 'power3.out',
      onUpdate: () => { el.textContent = String(Math.round(state.v)); },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Manifesto: words light up as you read
  $$('[data-scrub-words]').forEach((el) => {
    const split = SplitText.create(el.querySelectorAll('p'), { type: 'words' });
    gsap.fromTo(split.words, { opacity: 0.14 }, {
      opacity: 1, ease: 'none', stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.4 },
    });
  });

  // Parallax (value = percent of travel)
  $$('[data-parallax]').forEach((el) => {
    const v = Number(el.dataset.parallax) || 8;
    gsap.fromTo(el, { yPercent: -v }, {
      yPercent: v, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ───────────── Client logos marquee, scroll-velocity aware ───────────── */
function initMarquee() {
  $$('[data-marquee]').forEach((el) => {
    const track = $('.marquee__track', el);
    if (!track) return;
    const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    let settle: gsap.core.Tween | undefined;
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      onUpdate: (self) => {
        const boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 260);
        const dir = boost < 0 ? -1 : 1;
        settle?.kill();
        loop.timeScale(dir * (1 + Math.abs(boost)));
        settle = gsap.to(loop, { timeScale: dir, duration: 0.9, ease: 'power2.out', overwrite: true });
      },
    });
  });
}

/* ───────────── Work: sticky stack ───────────── */
function initWork() {
  const cards = $$('[data-work-card]');
  cards.forEach((card, i) => {
    const inner = $('[data-work-inner]', card);
    const media = $('[data-work-media]', card);
    const shade = $('[data-work-shade]', card);
    const next = cards[i + 1];

    if (media) {
      gsap.fromTo(media, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'top top', scrub: true },
      });
    }
    if (next && inner && shade) {
      const st = { trigger: next, start: 'top bottom', end: 'top 12%', scrub: true };
      gsap.to(inner, { scale: 0.93, ease: 'none', scrollTrigger: st });
      gsap.to(shade, { opacity: 0.6, ease: 'none', scrollTrigger: st });
    }
  });
}

/* ───────────── Footer wordmark ───────────── */
function initFooter() {
  const word = $('[data-footer-word]');
  if (!word) return;
  const split = SplitText.create(word, { type: 'chars' });
  gsap.from(split.chars, {
    yPercent: 100, ease: 'none', stagger: 0.06,
    scrollTrigger: { trigger: word, start: 'top bottom', end: 'bottom bottom', scrub: 0.5 },
  });
}

/* ───────────── Pointer-only delights ───────────── */
function initPointer() {
  if (!finePointer) return;

  // Cursor label over work cards
  const cursor = $('[data-cursor-el]');
  if (cursor) {
    const label = $('span', cursor)!;
    const x = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3.out' });
    const y = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3.out' });
    gsap.set(cursor, { scale: 0.6 });
    window.addEventListener('mousemove', (e) => { x(e.clientX); y(e.clientY); }, { passive: true });
    $$('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        label.textContent = el.dataset.cursor ?? '';
        gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.35, ease: OUT, overwrite: 'auto' });
      });
      el.addEventListener('mouseleave', () => gsap.to(cursor, { opacity: 0, scale: 0.6, duration: 0.2, ease: 'power2.out', overwrite: 'auto' }));
    });
  }

  // Blog: image preview follows the pointer
  const list = $('[data-blog-list]');
  const preview = $('[data-blog-preview]');
  if (list && preview) {
    const imgs = $$<HTMLImageElement>('img', preview);
    imgs[0]?.classList.add('is-active');
    // Fetch + decode before the first hover so the preview never shows an empty box
    ScrollTrigger.create({
      trigger: list,
      start: 'top 150%',
      once: true,
      onEnter: () => imgs.forEach((img) => {
        img.loading = 'eager';
        img.decode().catch(() => {});
      }),
    });
    const x = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3.out' });
    gsap.set(preview, { scale: 0.9 });
    list.addEventListener('mousemove', (e) => { x(e.clientX); y(e.clientY); }, { passive: true });
    list.addEventListener('mouseenter', () => gsap.to(preview, { opacity: 1, scale: 1, duration: 0.4, ease: OUT, overwrite: 'auto' }));
    list.addEventListener('mouseleave', () => gsap.to(preview, { opacity: 0, scale: 0.9, duration: 0.2, ease: 'power2.out', overwrite: 'auto' }));
    $$('[data-post]', list).forEach((a) =>
      a.addEventListener('mouseenter', () => imgs.forEach((img, i) => img.classList.toggle('is-active', i === Number(a.dataset.post)))),
    );
  }

  // Magnetic elements
  $$('[data-magnetic]').forEach((el) => {
    const inner = el.firstElementChild as HTMLElement | null;
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      x(dx * 0.35); y(dy * 0.35);
      if (inner) gsap.to(inner, { x: dx * 0.12, y: dy * 0.12, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.45)', overwrite: true });
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.45)', overwrite: true });
    });
  });
}

/* ───────────── Boot ───────────── */
async function boot() {
  initScroll();
  initNav();
  initAccordion();

  // Line splitting needs final font metrics
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);

  if (reduced) {
    runPreloader(() => {});
    return;
  }

  initReveals();
  initMarquee();
  initWork();
  initFooter();
  initPointer();
  runPreloader(() => ScrollTrigger.refresh());
}

boot().catch((err) => {
  console.error('[motion]', err);
  $('[data-preloader]')?.remove();
  gsap.set('[data-fade]', { clearProps: 'all' });
});
