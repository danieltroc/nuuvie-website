/**
 * "Studio" variant. Deliberately little motion: pictures are unveiled once, then drift
 * slightly as they pass. Headline line reveals, soft fades, smooth scroll and the cursor
 * label come from the shared layer (motion.ts).
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initPictures() {
  if (reduced) return;
  document.querySelectorAll<HTMLElement>('[data-s-reveal]').forEach((frame) => {
    const img = frame.querySelector('img');
    if (!img) return;

    // Unveil: the frame opens from the bottom edge while the picture settles back
    gsap.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut',
      scrollTrigger: { trigger: frame, start: 'top 88%', once: true },
    });
    gsap.from(img, { scale: 1.18, duration: 1.9, ease: 'expo.out', scrollTrigger: { trigger: frame, start: 'top 88%', once: true } });

    // Drift: the picture is 12% taller than its frame and travels that slack
    gsap.fromTo(img, { yPercent: 0 }, {
      yPercent: -10.7, ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

document.fonts.ready.then(() => {
  initPictures();
  ScrollTrigger.refresh();
});
