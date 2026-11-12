import { pl, type Dict } from './pl';
import { en } from './en';

export type Locale = 'pl' | 'en';
export const locales: Locale[] = ['pl', 'en'];
export const defaultLocale: Locale = 'pl';

const dicts: Record<Locale, Dict> = { pl, en };

export const getDict = (locale: Locale): Dict => dicts[locale];

/** Home URL for a locale. Polish lives at the root, English under /en/. */
export const homePath = (locale: Locale) => (locale === defaultLocale ? '/' : `/${locale}/`);

export const formatDate = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));

export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/nuuvie.studio/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/nuuvie' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@danielznuuvie' },
];

export const clientLogos = [
  'sii', 'tedee', 'netwise', 'polpharma', 'leroymerlin', 'algida',
  'maersk', 'jabra', 'predica', 'heroswipe', 'ams', 'oldcraft',
];

/** Design variants under /design/<id>/ — see src/styles/themes.css */
export const themes = [
  { id: 'apple', label: 'Apple' },
  { id: '2027', label: '2027' },
  { id: 'swiss', label: 'Swiss' },
  // custom: has its own page (src/pages/design/nova.astro) instead of restyling the home page
  { id: 'nova', label: 'Nova', custom: true },
  { id: 'nova-swiss', label: 'Nova Swiss', custom: true },
  { id: 'next', label: 'Next', custom: true },
  { id: 'studio', label: 'Studio', custom: true },
  { id: 'tiles', label: 'Tiles', custom: true },
  { id: 'form', label: 'Form', custom: true },
  { id: 'reel', label: 'Reel', custom: true },
];

export type { Dict };
