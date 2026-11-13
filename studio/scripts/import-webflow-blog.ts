/**
 * One-off import of the existing blog from the live Webflow site (www.nuuvie.com) into Sanity.
 *
 *   Preview only (writes nothing, no login needed):
 *     npx sanity exec scripts/import-webflow-blog.ts -- --dry-run
 *   Import (uses your Sanity login, run `npx sanity login` first):
 *     npx sanity exec scripts/import-webflow-blog.ts --with-user-token
 *
 * What it does, per post: reads the public page, converts the article HTML to Portable Text,
 * uploads the cover and inline images to Sanity (so nothing depends on Webflow's CDN any more),
 * creates the post with the SAME slug as on Webflow, then links PL and EN versions as translations.
 * Safe to re-run: posts that already exist (same language + slug) are skipped.
 */
import { getCliClient } from 'sanity/cli'
import { createSchema } from 'sanity'
import { htmlToBlocks } from '@portabletext/block-tools'
import { JSDOM } from 'jsdom'
import { writeFileSync } from 'node:fs'
import { schemaTypes } from '../schema-types'

const SITE = 'https://www.nuuvie.com'
const DRY_RUN = process.argv.includes('--dry-run')

/** PL slug → EN slug (from the live sitemap). */
const PAIRS: [string, string][] = [
  ['rebranding-identyfikacji-wizualnej-case-study-old-craft-barbershop-lublin', 'visual-identity-rebrand-old-craft-barbershop-lublin-case-study'],
  ['human-touch-w-designie-dlaczego-marki-w-2026-roku-uciekaja-od-perfekcji', 'human-touch-in-design-why-brands-in-2026-are-moving-away-from-perfection'],
  ['dlaczego-slaby-brand-kosztuje-cie-wiecej-niz-myslisz', 'why-a-weak-brand-costs-you-more-than-you-think'],
  ['audyt-ux-strony-internetowej-zrob-to-sam-lub-zlec-profesjonalistom', 'audyt-ux-strony-internetowej-zrob-to-sam-lub-zlec-profesjonalistom'],
  ['jak-wybrac-ux-ui-designera', 'jak-wybrac-ux-ui-designera'],
  ['ile-kosztuje-strona-internetowa-w-2026-roku', 'ile-kosztuje-strona-internetowa-w-2026-roku'],
]

type Lang = 'pl' | 'en'
type Scraped = {
  language: Lang
  slug: string
  url: string
  title: string
  publishedAt: string
  coverUrl?: string
  bodyHtml: string
  excerpt: string
}

// Block type of the post body, compiled from the real Studio schema
const compiled = createSchema({ name: 'nuuvie', types: schemaTypes })
const bodyType = compiled.get('post').fields.find((f: { name: string }) => f.name === 'body').type

const clean = (s: string) => s.replace(/[​-‍﻿]/g, '').replace(/\s+/g, ' ').trim()

/** "20.04.2026" → ISO date at noon (avoids timezone shifts to the previous day). */
function parseDate(text: string): string {
  const m = text.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/)
  if (!m) throw new Error(`Unrecognised date: "${text}"`)
  const [, d, mo, y] = m
  return new Date(Date.UTC(+y, +mo - 1, +d, 12)).toISOString()
}

/** First sentences of the first paragraph, max ~220 characters. */
function excerptOf(doc: Document): string {
  const p = Array.from(doc.querySelectorAll('.w-richtext p')).map((el) => clean(el.textContent ?? '')).find((t) => t.length > 40) ?? ''
  if (p.length <= 220) return p
  const cut = p.slice(0, 220)
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '))
  return end > 80 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

async function scrape(language: Lang, slug: string): Promise<Scraped> {
  const url = `${SITE}${language === 'en' ? '/en' : ''}/blog-posts/${slug}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} for ${url}`)
  const doc = new JSDOM(await res.text()).window.document
  const rich = doc.querySelector('.w-richtext')
  if (!rich) throw new Error(`No article body on ${url}`)

  // Normalise Webflow's markup before conversion
  rich.querySelectorAll('script, style').forEach((el) => el.remove())
  rich.querySelectorAll('h2 strong, h3 strong, h4 strong, h5 strong').forEach((el) => el.replaceWith(...Array.from(el.childNodes)))
  rich.querySelectorAll('h4, h5, h6').forEach((el) => {
    const h3 = doc.createElement('h3')
    h3.innerHTML = el.innerHTML
    el.replaceWith(h3)
  })
  rich.querySelectorAll('pre').forEach((el) => {
    const p = doc.createElement('p')
    p.textContent = el.textContent ?? ''
    el.replaceWith(p)
  })

  return {
    language,
    slug,
    url,
    title: clean(doc.querySelector('h1')?.textContent ?? ''),
    publishedAt: parseDate(doc.querySelector('.post-header_infos .text-size-small')?.textContent ?? ''),
    coverUrl: doc.querySelector<HTMLImageElement>('img.post-header_image')?.getAttribute('src') ?? undefined,
    bodyHtml: rich.innerHTML,
    excerpt: excerptOf(doc),
  }
}

/** Portable Text from HTML; inline <figure><img> become image blocks (uploaded later). */
function toBlocks(html: string) {
  const blocks = htmlToBlocks(html, bodyType, {
    parseHtml: (h) => new JSDOM(h).window.document,
    rules: [
      {
        deserialize(el) {
          const node = el as HTMLElement
          if (node.tagName?.toLowerCase() !== 'figure') return undefined
          const img = node.querySelector('img')
          if (!img?.getAttribute('src')) return undefined
          return {
            _type: 'image',
            _pendingUrl: img.getAttribute('src'),
            alt: clean(img.getAttribute('alt') ?? ''),
            caption: clean(node.querySelector('figcaption')?.textContent ?? '') || undefined,
          } as never
        },
      },
    ],
  })
  // Drop empty paragraphs left over from Webflow's markup
  return blocks.filter((b) => b._type !== 'block' || (b as { children?: { text?: string }[] }).children?.some((c) => c.text?.trim()))
}

async function main() {
  // 1. Read every post from the live site
  const plan: { pl: Scraped; en?: Scraped; skippedEn?: string }[] = []
  for (const [plSlug, enSlug] of PAIRS) {
    const pl = await scrape('pl', plSlug)
    const en = await scrape('en', enSlug)
    // Webflow served some "EN" pages with the Polish text: do not import those as English
    const untranslated = en.title === pl.title
    plan.push(untranslated ? { pl, skippedEn: en.url } : { pl, en })
  }

  const summary = plan.map(({ pl, en, skippedEn }) => {
    const plBlocks = toBlocks(pl.bodyHtml)
    return {
      pl: { slug: pl.slug, title: pl.title, date: pl.publishedAt.slice(0, 10), blocks: plBlocks.length, images: plBlocks.filter((b) => b._type === 'image').length },
      en: en ? { slug: en.slug, title: en.title, blocks: toBlocks(en.bodyHtml).length } : `not imported (page has Polish text): ${skippedEn}`,
    }
  })
  console.log(JSON.stringify(summary, null, 2))

  if (DRY_RUN) {
    const preview = plan.flatMap(({ pl, en }) => [pl, en].filter(Boolean)).map((p) => ({ ...p!, body: toBlocks(p!.bodyHtml), bodyHtml: undefined }))
    writeFileSync('import-preview.json', JSON.stringify(preview, null, 2))
    console.log('\nDry run: nothing written to Sanity. Full preview saved to studio/import-preview.json')
    return
  }

  // 2. Write to Sanity
  const client = getCliClient({ apiVersion: '2025-01-01' })
  const uploaded = new Map<string, string>()
  async function upload(url: string, filename: string) {
    if (uploaded.has(url)) return uploaded.get(url)!
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${res.status} for image ${url}`)
    const asset = await client.assets.upload('image', Buffer.from(await res.arrayBuffer()), { filename })
    uploaded.set(url, asset._id)
    return asset._id
  }

  async function createPost(p: Scraped): Promise<string> {
    const existing = await client.fetch<string | null>(
      `*[_type == "post" && language == $language && slug.current == $slug][0]._id`,
      { language: p.language, slug: p.slug },
    )
    if (existing) {
      console.log(`= ${p.language} ${p.slug} already exists, skipped`)
      return existing
    }
    const body = await Promise.all(
      toBlocks(p.bodyHtml).map(async (b: Record<string, unknown>) => {
        if (b._type !== 'image' || !b._pendingUrl) return b
        const { _pendingUrl, ...rest } = b
        const ref = await upload(String(_pendingUrl), decodeURIComponent(String(_pendingUrl).split('/').pop() ?? 'image'))
        return { ...rest, asset: { _type: 'reference', _ref: ref } }
      }),
    )
    const coverRef = p.coverUrl ? await upload(p.coverUrl, decodeURIComponent(p.coverUrl.split('/').pop() ?? 'cover')) : undefined
    const doc = await client.create({
      _type: 'post',
      language: p.language,
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      publishedAt: p.publishedAt,
      excerpt: p.excerpt,
      ...(coverRef ? { coverImage: { _type: 'image', asset: { _type: 'reference', _ref: coverRef }, alt: p.title } } : {}),
      body,
    })
    console.log(`+ ${p.language} ${p.slug}`)
    return doc._id
  }

  for (const { pl, en } of plan) {
    const plId = await createPost(pl)
    if (!en) continue
    const enId = await createPost(en)
    const linked = await client.fetch<number>(`count(*[_type == "translation.metadata" && references($pl) && references($en)])`, { pl: plId, en: enId })
    if (linked) continue
    await client.create({
      _type: 'translation.metadata',
      schemaTypes: ['post'],
      translations: [
        { _key: 'pl', _type: 'internationalizedArrayReferenceValue', language: 'pl', value: { _type: 'reference', _ref: plId } },
        { _key: 'en', _type: 'internationalizedArrayReferenceValue', language: 'en', value: { _type: 'reference', _ref: enId } },
      ],
    })
    console.log(`~ linked ${pl.slug} ⇄ ${en.slug}`)
  }
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
