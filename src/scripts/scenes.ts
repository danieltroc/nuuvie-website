/**
 * Small UI scenes inside cards (About, Strefa Designera). Each `[data-scene="name"]` gets the
 * timeline `scenes[name]` builds. It plays once when the scene comes on screen and again on every
 * hover over its card, with every card in a group behaving the same. A replay rewinds quickly
 * to the start instead of jumping there.
 *
 * With reduced motion nothing plays: the markup already shows each scene's end state. A scene can
 * opt in to being jumped to its end anyway (`settle`) when its end state needs measuring.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type Scene = (el: HTMLElement) => gsap.core.Timeline;

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function initScenes(scenes: Record<string, Scene>, settle: string[] = []) {
  document.querySelectorAll<HTMLElement>('[data-scene]').forEach((el) => {
    const name = el.dataset.scene ?? '';
    const make = scenes[name];
    if (!make) return;
    if (reduced) {
      if (settle.includes(name)) make(el).progress(1).kill();
      return;
    }
    const tl = make(el).pause(0); // shows the start of the scene until it is on screen
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

/** Scenes measure text layout, so they wait for the fonts (at most 1.5 s). */
export const fontsReady = () => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
