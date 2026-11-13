/**
 * Blog post page: reading progress bar, active item in the contents list, copy-link button.
 * Fades and headline reveals come from motion.ts.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const article = document.querySelector<HTMLElement>('[data-b-article]');
const bar = document.querySelector<HTMLElement>('[data-b-progress]');

if (article && bar) {
  ScrollTrigger.create({
    trigger: article,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => { bar.style.transform = `scaleX(${self.progress})`; },
  });
}

// Highlight the section being read
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-b-toc]'));
const setActive = (id: string) => links.forEach((a) => a.classList.toggle('is-on', a.dataset.bToc === id));
document.querySelectorAll<HTMLElement>('[data-b-heading]').forEach((h, i, all) => {
  ScrollTrigger.create({
    trigger: h,
    start: 'top 40%',
    endTrigger: all[i + 1] ?? article ?? h,
    end: all[i + 1] ? 'top 40%' : 'bottom top',
    onToggle: (self) => self.isActive && setActive(h.id),
  });
});

// Copy the post link
document.querySelectorAll<HTMLButtonElement>('[data-b-copy]').forEach((btn) => {
  const label = btn.querySelector('[data-b-copy-label]');
  const idle = label?.textContent ?? '';
  let timer = 0;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.bCopy ?? location.href);
      if (label) label.textContent = document.documentElement.lang === 'pl' ? 'Skopiowano' : 'Copied';
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { if (label) label.textContent = idle; }, 1800);
    } catch { /* clipboard blocked: nothing else to do */ }
  });
});

document.fonts.ready.then(() => ScrollTrigger.refresh());
