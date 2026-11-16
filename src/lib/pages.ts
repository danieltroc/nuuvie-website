/**
 * Fixed pages (home, about, designer zone) edited in Sanity as one document per language
 * (ids like `homePage-pl`). Falls back to the starting content in src/content/pages.
 */
import { sanityClient, imageUrl } from './sanity';
import type { Locale } from '../i18n';

export type PageType = 'homePage' | 'aboutPage' | 'designerZonePage';

/** Page content from Sanity, or `fallback` if Sanity is not configured or the page is missing. */
export async function getPage<T>(type: PageType, language: Locale, fallback: T): Promise<T> {
  if (!sanityClient) return fallback;
  const doc = await sanityClient.fetch<T | null>('*[_id == $id][0]', { id: `${type}-${language}` });
  return doc ?? fallback;
}

/** URL of an image field: a Sanity image, or the starting content's `{ _upload }` path. */
export function pic(image: unknown, width = 1200): string | undefined {
  if (!image || typeof image !== 'object') return undefined;
  const upload = (image as { _upload?: string })._upload;
  if (upload) return upload;
  return (image as { asset?: unknown }).asset ? imageUrl(image, width) : undefined;
}

/** Splits a text field into paragraphs on blank lines. */
export const paragraphs = (text?: string) => (text ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/** Home URL for a language, and an in-page anchor on it. */
export const homeHref = (language: Locale, hash = '') => (language === 'en' ? `/en${hash}` : `/${hash}`);
