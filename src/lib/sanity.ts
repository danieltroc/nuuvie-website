/**
 * Blog data. Posts come from Sanity (project 89d58rpp) when PUBLIC_SANITY_PROJECT_ID is set and
 * at least one post exists in that language; until then the
 * site falls back to the sample posts in src/i18n so every page still builds and renders.
 * Data is fetched at build time only (static site), so publishing in Sanity triggers a rebuild.
 */
import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { defineQuery } from 'groq';
import { getDict, type Locale } from '../i18n';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) || 'production';

export const sanityEnabled = Boolean(projectId);

const client: SanityClient | null = sanityEnabled
  ? createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: false, perspective: 'published' })
  : null;

const imageBuilder = client ? createImageUrlBuilder(client) : null;

/** URL for a Sanity image (cropped to the hotspot when width and height are given). */
export function imageUrl(source: unknown, width = 1600, height?: number): string | undefined {
  if (!imageBuilder || !source) return undefined;
  let img = imageBuilder.image(source as never).width(width).auto('format').quality(80);
  if (height) img = img.height(height).fit('crop');
  return img.url();
}

export type Translation = { language: Locale; slug: string };
export type Post = {
  title: string;
  slug: string;
  language: Locale;
  publishedAt: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  /** Portable Text from Sanity; absent for local sample posts. */
  body?: unknown[];
  seoTitle?: string;
  seoDescription?: string;
  translations: Translation[];
  /** True for the local placeholder posts shown before Sanity has content. */
  sample?: boolean;
};

/** Public URL of a post (Polish has no prefix; the /blog-posts path matches the old Webflow URLs). */
export const postPath = (language: Locale, slug: string) => `${language === 'en' ? '/en' : ''}/blog-posts/${slug}`;
export const blogPath = (language: Locale) => (language === 'en' ? '/en/blog' : '/blog');

const POST_FIELDS = `
  title,
  "slug": slug.current,
  language,
  publishedAt,
  excerpt,
  coverImage,
  "imageAlt": coverImage.alt,
  body[]{ ..., _type == "image" => { ..., "alt": alt, "caption": caption } },
  "seoTitle": seo.title,
  "seoDescription": seo.description,
  "translations": *[_type == "translation.metadata" && references(^._id)][0].translations[].value->{ language, "slug": slug.current }
`;
const POSTS_QUERY = defineQuery(`*[_type == "post" && language == $language && defined(slug.current)] | order(publishedAt desc){ ${POST_FIELDS} }`);

type RawPost = Omit<Post, 'image' | 'translations'> & { coverImage?: unknown; translations?: (Translation | null)[] | null };

const fromSanity = (p: RawPost): Post => ({
  ...p,
  image: imageUrl(p.coverImage, 1600),
  translations: (p.translations ?? []).filter((x): x is Translation => Boolean(x && x.slug && x.language !== p.language)),
});

/* ───── Placeholder content (shown only until real posts exist in Sanity) ───── */
let keyN = 0;
const block = (text: string, style = 'normal') => ({
  _type: 'block', _key: `k${keyN++}`, style, markDefs: [],
  children: [{ _type: 'span', _key: `s${keyN++}`, text, marks: [] }],
});

/** Demo body so the post layout (headings, contents list, quote) can be reviewed before migration. */
function sampleBody(language: Locale) {
  const pl = language === 'pl';
  const p = pl
    ? 'To jest przykładowy akapit, który pokazuje układ wpisu. Prawdziwa treść pojawi się tutaj po przeniesieniu wpisów z Webflow do Sanity. Długość wiersza, interlinia i odstępy są ustawione tak, żeby dłuższy tekst czytało się wygodnie.'
    : 'This is a sample paragraph that shows the post layout. The real text will appear here once the posts are moved from Webflow to Sanity. Line length, leading and spacing are set so longer text is comfortable to read.';
  const h = pl ? ['Dlaczego to ma znaczenie', 'Jak podejść do tematu', 'Najczęstsze błędy', 'Podsumowanie'] : ['Why it matters', 'How to approach it', 'Common mistakes', 'Summary'];
  return [
    block(p), block(p),
    block(h[0], 'h2'), block(p), block(p),
    block(pl ? 'Dobry design nie zwraca na siebie uwagi. Sprawia, że marka mówi to, co najważniejsze.' : 'Good design does not call attention to itself. It lets the brand say what matters most.', 'blockquote'),
    block(h[1], 'h2'), block(p), block(h[2], 'h3'), block(p),
    block(h[3], 'h2'), block(p),
  ];
}

/** Local sample posts (titles, dates and covers of the current blog) used until Sanity is connected. */
function samplePosts(language: Locale): Post[] {
  const t = getDict(language);
  const other: Locale = language === 'pl' ? 'en' : 'pl';
  const otherPosts = getDict(other).blog.posts;
  return t.blog.posts.map((p, i) => {
    const slug = p.href.split('/').pop() ?? `post-${i}`;
    return {
      title: p.title,
      slug,
      language,
      publishedAt: p.date,
      excerpt: language === 'pl'
        ? 'Przykładowy wpis. Treść pojawi się tutaj po podłączeniu bloga do Sanity.'
        : 'Sample post. The full text will appear here once the blog is connected to Sanity.',
      image: p.img,
      imageAlt: '',
      body: sampleBody(language),
      sample: true,
      translations: [{ language: other, slug: otherPosts[i]?.href.split('/').pop() ?? slug }],
    };
  });
}

const cache = new Map<Locale, Promise<Post[]>>();

/** All published posts in a language, newest first. */
export function getPosts(language: Locale): Promise<Post[]> {
  if (!cache.has(language)) {
    cache.set(
      language,
      client
        ? client
            .fetch<RawPost[]>(POSTS_QUERY, { language })
            // Until the first real post in a language is published, keep showing the samples
            .then((rows) => (rows.length ? rows.map(fromSanity) : samplePosts(language)))
        : Promise.resolve(samplePosts(language)),
    );
  }
  return cache.get(language)!;
}
