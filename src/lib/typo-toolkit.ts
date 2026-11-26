/**
 * TYPO Toolkit 2027: launch date and price windows. One source for the page (src/pages/sklep/
 * typo-toolkit.astro), its script (scripts/typo-toolkit.ts) and the Worker, which keeps the page
 * hidden on nuuvie.com until LAUNCH. Times are Polish time (CET, UTC+1).
 */
export const PATH = '/sklep/typo-toolkit';
/** Sale opens: 30.11.2026, 8:00 */
export const LAUNCH = '2026-11-30T08:00:00+01:00';

/** Checkout on easy.tools. Empty = the buy buttons point to the price section. */
export const CHECKOUT = '';
/** Free sample (PDF, no e-mail needed). Empty = "coming soon". */
export const SAMPLE = '';

export type Phase = {
  id: 'pre' | '59' | '69' | '79';
  /** When this window ends (exclusive); null = open-ended */
  until: string | null;
  price: number | null;
  /** Line under the price */
  note: string;
  /** Short label for the sticky bar */
  bar: string;
  badge: string | null;
};

const SKILL_IN = 'Skill do Claude w cenie zestawu';
export const PHASES: Phase[] = [
  { id: 'pre', until: LAUNCH, price: null, note: 'Premiera 30.11, 8:00', bar: 'TYPO Toolkit 2027 · premiera 30.11', badge: null },
  { id: '59', until: '2026-12-02T00:00:00+01:00', price: 59, note: 'Cena premierowa do 1.12, 23:59. Potem 69 zł.', bar: 'TYPO Toolkit 2027 · 59 zł · do 1.12', badge: SKILL_IN },
  { id: '69', until: '2026-12-08T00:00:00+01:00', price: 69, note: 'Cena startowa do 7.12, 23:59. Od 8.12: 79 zł.', bar: 'TYPO Toolkit 2027 · 69 zł · do 7.12', badge: SKILL_IN },
  { id: '79', until: null, price: 79, note: 'Skill do Claude możesz dodać przy zakupie za 29 zł.', bar: 'TYPO Toolkit 2027 · 79 zł', badge: 'Skill do Claude: +29 zł przy zakupie zestawu' },
];

export const phaseAt = (now: number) => PHASES.find((p) => !p.until || now < Date.parse(p.until)) ?? PHASES[PHASES.length - 1];
export const isLive = (now: number) => now >= Date.parse(LAUNCH);
