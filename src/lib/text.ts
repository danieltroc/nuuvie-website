/** Small text helpers for blog pages. */

const MAP: Record<string, string> = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' };

/** URL-safe id for a heading: "Jak wybrać designera?" → "jak-wybrac-designera". */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (c) => MAP[c] ?? c)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

type Block = { _type?: string; style?: string; children?: { text?: string }[] };

/** Plain text of one Portable Text block. */
export const blockText = (b: Block) => (b.children ?? []).map((c) => c.text ?? '').join('');

/** H2 headings of a post body, for the contents list. */
export const headingsOf = (body: unknown[] | undefined) =>
  ((body ?? []) as Block[])
    .filter((b) => b._type === 'block' && b.style === 'h2')
    .map((b) => ({ id: slugify(blockText(b)), text: blockText(b) }));

/** Estimated reading time in minutes (about 200 words per minute, at least 1). */
export const readingMinutes = (body: unknown[] | undefined) => {
  const words = ((body ?? []) as Block[])
    .filter((b) => b._type === 'block')
    .map(blockText)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};
