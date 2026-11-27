/**
 * Typo Toolkit 2027: launch date and price windows. One source for the page (src/pages/sklep/
 * typo-toolkit.astro), its script (scripts/typo-toolkit.ts) and the Worker, which keeps the page
 * hidden on nuuvie.com until LAUNCH. Times are Polish time (CET, UTC+1).
 */
export const PATH = '/sklep/typo-toolkit';
/** Sale opens: 30.11.2026, 8:00 */
export const LAUNCH = '2026-11-30T08:00:00+01:00';

/** Checkout on easy.tools. Empty = the buy buttons point to the price section. */
export const CHECKOUT = '';
/** Free sample: 5 pairs, 9 pages (public/sklep/typo-toolkit/). The Worker hides it before LAUNCH too. */
export const SAMPLE = '/sklep/typo-toolkit/typo-toolkit-2027-probka.pdf';

export type Phase = {
  id: '59' | '69' | '79';
  /** When this window ends (exclusive); null = open-ended */
  until: string | null;
  price: number;
  /** Name of the window, e.g. "Cena premierowa" */
  label: string;
  /** When it ends, in words; null = open-ended */
  untilText: string | null;
  /** The next price; null = this is the last window */
  next: string | null;
  /** Short label for the sticky bar */
  bar: string;
  badge: string | null;
};

const SKILL_IN = 'Skill do Claude w cenie zestawu';
// No "coming soon" state: the page goes public at LAUNCH already in the first window (59 zł).
// Before that it is only the workers.dev preview, which shows the first window too.
export const PHASES: Phase[] = [
  { id: '59', until: '2026-12-02T00:00:00+01:00', price: 59, label: 'Cena premierowa', untilText: 'do 1.12, 23:59', next: 'Od 2.12: 69 zł', bar: 'Typo Toolkit 2027 · 59 zł · do 1.12', badge: SKILL_IN },
  { id: '69', until: '2026-12-08T00:00:00+01:00', price: 69, label: 'Cena startowa', untilText: 'do 7.12, 23:59', next: 'Od 8.12: 79 zł', bar: 'Typo Toolkit 2027 · 69 zł · do 7.12', badge: SKILL_IN },
  { id: '79', until: null, price: 79, label: 'Cena regularna', untilText: 'od 8.12', next: null, bar: 'Typo Toolkit 2027 · 79 zł', badge: 'Skill do Claude: +29 zł przy zakupie zestawu (razem 108 zł)' },
];

export const phaseAt = (now: number) => PHASES.find((p) => !p.until || now < Date.parse(p.until)) ?? PHASES[PHASES.length - 1];
export const isLive = (now: number) => now >= Date.parse(LAUNCH);
