/**
 * One-off import of case studies (/work/…) and legal pages (/legal/…) from the live Webflow site.
 *
 *   Preview only (writes nothing):  npx sanity exec scripts/import-webflow-pages.ts -- --dry-run
 *   Import (your Sanity login):     npx sanity exec scripts/import-webflow-pages.ts --with-user-token
 *
 * Case studies: Polish text and all images come from the live pages. Webflow's /en/work pages only
 * contained the Polish text, so the English versions below are new translations, to be reviewed.
 * Legal pages: Polish terms + privacy policy and the English terms of service are imported as they are.
 * The English privacy policy on Webflow was Polish text, so it is not imported (redirected instead).
 * Safe to re-run: documents that already exist (same type, language and slug) are skipped.
 */
import { getCliClient } from 'sanity/cli'
import { createSchema } from 'sanity'
import { htmlToBlocks } from '@portabletext/block-tools'
import { JSDOM } from 'jsdom'
import { writeFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { schemaTypes } from '../schema-types'

const SITE = 'https://www.nuuvie.com'
const DRY_RUN = process.argv.includes('--dry-run')
const key = () => randomUUID().slice(0, 12)

const compiled = createSchema({ name: 'nuuvie', types: schemaTypes })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legalBodyType = (compiled.get('legalPage') as any).fields.find((f: { name: string }) => f.name === 'body').type

const clean = (s: string) => s.replace(/[​-‍﻿]/g, '').replace(/\s+/g, ' ').trim()
const fetchDoc = async (path: string) => {
  const res = await fetch(`${SITE}${path}`)
  if (!res.ok) throw new Error(`${res.status} for ${path}`)
  return new JSDOM(await res.text()).window.document
}
const paragraph = (text: string) => ({
  _type: 'block', _key: key(), style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
})

/* ───────────── Case studies ───────────── */

type TextSection = { label: string; heading: string; body: string[] }
type ImageRow = { layout: 'full' | 'grid'; urls: string[] }
type Project = {
  slug: string
  order: number
  pl: { title: string; kicker: string; excerpt: string; tags: string[] }
  en: { kicker: string; headline: string; excerpt: string; tags: string[]; sections: TextSection[] }
}

const PROJECTS: Project[] = [
  {
    slug: 'tedee',
    order: 1,
    pl: { title: 'Tedee', kicker: 'Inteligentne zamki i rozwiązania smart home', excerpt: 'Design, który łączy świat fizyczny i cyfrowy.', tags: ['UX / UI', 'Aplikacja', 'Strona', 'Opakowania'] },
    en: {
      kicker: 'Smart locks and smart home solutions',
      headline: 'Tedee. Design that connects the physical and the digital',
      excerpt: 'Design that connects the physical and the digital.',
      tags: ['UX / UI', 'App', 'Website', 'Packaging'],
      sections: [
        {
          label: 'Intro',
          heading: 'Design in every detail, from the app to the box.',
          body: ['Tedee is a Polish smart home brand where technology and design go hand in hand. We were responsible for creating a complete visual ecosystem – from the UX and UI of the mobile app and web portal, through the website design, to physical elements such as packaging and marketing materials. Our goal was to design an experience that stays consistent at every touchpoint. Every detail, from the app interface to the product box, was refined with intuitiveness, aesthetics and simplicity in mind. Tedee was meant to look the way it works: modern, functional and free of unnecessary complexity. By combining UX, UI and product design, the brand gained a consistent, recognisable image that sets it apart in the world of smart home solutions.'],
        },
        {
          label: 'Results',
          heading: 'Smart design that works naturally.',
          body: ['Our work with Tedee covered the full design process – from concept and UX/UI to implementation and marketing materials. We chose a minimalist style, a clear visual language and consistency between the digital and physical worlds. Our priority was to connect technology with everyday user experience in a natural, pleasant way. The result is an ecosystem in which the app, portal, website and packaging form a single whole. Tedee has become a brand that not only delivers modern products but also communicates simplicity, elegance and functionality – all in the spirit of smart design that simply works.'],
        },
      ],
    },
  },
  {
    slug: 'old-craft-barbershop',
    order: 2,
    pl: { title: 'Old Craft Barbershop', kicker: 'Studio barberskie z charakterem', excerpt: 'Nowe logo. Nowa energia. Ten sam charakter.', tags: ['Logo', 'Identyfikacja', 'Druk'] },
    en: {
      kicker: 'A barber studio with character',
      headline: 'Old Craft – Brand redesign',
      excerpt: 'New logo. New energy. Same character.',
      tags: ['Logo', 'Identity', 'Print'],
      sections: [
        {
          label: 'Intro',
          heading: 'New logo. New energy. Same character.',
          body: ["Old Craft Barbershop needed a brand refresh that would better capture the atmosphere of a modern men's barbershop. The previous logo got lost among hundreds of similar designs and reflected neither the quality nor the style of the place. We designed a new visual identity that shows the spirit of a contemporary barbershop – simple, bold and authentic. We created a full set of materials: logo, business cards, flyers, billboards and a consistent print system. Everything was designed to make the brand stand out in the city and communicate its character better. The new Old Craft image combines class and modernity, catches the eye and builds recognition for a local brand."],
        },
        {
          label: 'Results',
          heading: 'Less classic. More character.',
          body: ["The new Old Craft visual identity is a fresh take on traditional barbering. We changed the brand's visual language, giving it a more modern, clean and considered character. We dropped overloaded motifs and decorations to highlight what matters most – precision, calm and professionalism. The result is branding that works at every scale: from business cards and flyers to large-format advertising. The new logo keeps its strong character but looks modern and classy. Old Craft gained consistent visual communication that catches the eye straight away and earns the trust of clients looking for quality and style."],
        },
      ],
    },
  },
  {
    slug: 'netwise',
    order: 3,
    pl: { title: 'Netwise', kicker: 'Implementacja rozwiązań biznesowych', excerpt: 'Redesign, który przybliżył markę do ludzi.', tags: ['Strona', 'Redesign', 'Social media'] },
    en: {
      kicker: 'Business solutions implementation',
      headline: 'Netwise – Redesign',
      excerpt: 'A redesign that brought the brand closer to people.',
      tags: ['Website', 'Redesign', 'Social media'],
      sections: [
        {
          label: 'Intro',
          heading: 'A redesign that brought the brand closer to people.',
          body: ["The goal of the project was to move away from a cold, corporate tone and create a website that shows the human side of the Netwise brand – with emotion, authenticity and clarity. We changed the way the company communicates its services, giving it a modern, friendly and more engaging character. We designed a new layout for the home page, blog, service pages and case studies, creating a consistent, modern style with plenty of space and balanced typography. We made sure every design element supports readability and a simple message. An important stage was also refreshing the brand's visual language on social media. The new graphics were designed to be light and dynamic while staying consistent with the corporate rhythm of communication. The whole project was completed within a month, in close collaboration with the Netwise marketing team. The result? A brand that used to speak the language of processes and systems now builds relationships with its users and simply communicates like a human."],
        },
        {
          label: 'Results',
          heading: 'Simpler. Clearer. Closer to people.',
          body: ["The new visual identity and refreshed page layout highlight what matters most at Netwise – the people behind the technology. We reduced excess graphic elements, bringing more order and clarity. Every section of the site was designed to communicate the brand's values in a simple, understandable way. Instead of talking about features, the site shows experience, emotion and authenticity. The new design gave Netwise a more human tone while keeping the professionalism and clarity expected of a technology company. The result is an image consistent with its position as a leader in CRM and digital transformation, presenting technology through a human lens."],
        },
      ],
    },
  },
]

type ScrapedProject = { headline: string; coverUrl: string; sequence: (TextSection | ImageRow)[] }

/** Walks the live case study in document order: labels, headings, paragraphs and images. */
async function scrapeProject(slug: string): Promise<ScrapedProject> {
  const doc = await fetchDoc(`/work/${slug}`)
  const main = doc.querySelector('.main-wrapper') ?? doc.body
  main.querySelectorAll('script, style, noscript').forEach((e) => e.remove())

  const headline = clean(main.querySelector('h1')?.textContent ?? '')
  const sequence: (TextSection | ImageRow)[] = []
  let coverUrl = ''
  let section: TextSection | null = null

  const walker = doc.createTreeWalker(main, 1 /* elements */)
  for (let node = walker.nextNode() as Element | null; node; node = walker.nextNode() as Element | null) {
    const tag = node.tagName.toLowerCase()
    const ownText = clean(Array.from(node.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' '))
    if (ownText === 'Next case') break
    if (tag === 'img') {
      const src = node.getAttribute('src') ?? ''
      if (!/\.(jpe?g|png|webp)$/i.test(src)) continue
      if (!coverUrl) { coverUrl = src; continue }
      section = null
      const layout: ImageRow['layout'] = /midpage/i.test(src) ? 'grid' : 'full'
      const last = sequence[sequence.length - 1]
      if (layout === 'grid' && last && 'urls' in last && last.layout === 'grid') last.urls.push(src)
      else sequence.push({ layout, urls: [src] })
    } else if (tag === 'div' && (ownText === 'Wstęp' || ownText === 'Rezultaty')) {
      section = { label: ownText, heading: '', body: [] }
      sequence.push(section)
    } else if (tag === 'h2' && section) {
      section.heading = clean(node.textContent ?? '')
    } else if (tag === 'p' && section) {
      const t = clean(node.textContent ?? '')
      if (t) section.body.push(t)
    }
  }
  return { headline, coverUrl, sequence }
}

/* ───────────── Legal pages ───────────── */

type Legal = { language: 'pl' | 'en'; slug: string; pair?: string }
const LEGAL: Legal[] = [
  { language: 'pl', slug: 'regulamin', pair: 'terms-of-service' },
  { language: 'pl', slug: 'polityka-prywatnosci' },
  { language: 'en', slug: 'terms-of-service', pair: 'regulamin' },
]

async function scrapeLegal({ language, slug }: Legal) {
  const doc = await fetchDoc(`${language === 'en' ? '/en' : ''}/legal/${slug}`)
  const rich = doc.querySelector('.w-richtext')
  if (!rich) throw new Error(`No legal text on ${slug}`)
  rich.querySelectorAll('script, style').forEach((e) => e.remove())
  rich.querySelectorAll('h2 strong, h3 strong').forEach((el) => el.replaceWith(...Array.from(el.childNodes)))
  rich.querySelectorAll('h4, h5, h6').forEach((el) => {
    const h3 = doc.createElement('h3')
    h3.innerHTML = el.innerHTML
    el.replaceWith(h3)
  })
  const dateText = Array.from(doc.querySelectorAll('div')).map((d) => clean(d.textContent ?? '')).find((t) => /^[A-Z][a-z]+ \d{1,2}, \d{4}$/.test(t)) ?? ''
  const date = dateText ? new Date(`${dateText} 12:00 UTC`) : new Date()
  const body = htmlToBlocks(rich.innerHTML, legalBodyType, { parseHtml: (h) => new JSDOM(h).window.document })
    .filter((b) => b._type !== 'block' || (b as { children?: { text?: string }[] }).children?.some((c) => c.text?.trim()))
  return {
    title: clean(doc.querySelector('h1')?.textContent ?? slug),
    updatedAt: date.toISOString().slice(0, 10),
    body,
  }
}

/* ───────────── Run ───────────── */

async function main() {
  const scraped = new Map<string, ScrapedProject>()
  for (const p of PROJECTS) scraped.set(p.slug, await scrapeProject(p.slug))
  const legal = new Map<string, Awaited<ReturnType<typeof scrapeLegal>>>()
  for (const l of LEGAL) legal.set(`${l.language}:${l.slug}`, await scrapeLegal(l))

  const summary = {
    projects: PROJECTS.map((p) => {
      const s = scraped.get(p.slug)!
      return {
        slug: p.slug,
        headline: s.headline,
        cover: s.coverUrl.split('/').pop(),
        sequence: s.sequence.map((x) => ('urls' in x ? `${x.layout}:${x.urls.length} img` : `${x.label}: ${x.heading} (${x.body.length} p)`)),
      }
    }),
    legal: LEGAL.map((l) => {
      const d = legal.get(`${l.language}:${l.slug}`)!
      return { page: `${l.language} ${l.slug}`, title: d.title, updatedAt: d.updatedAt, blocks: d.body.length }
    }),
  }
  console.log(JSON.stringify(summary, null, 2))
  if (DRY_RUN) {
    writeFileSync('import-preview.json', JSON.stringify({ projects: Object.fromEntries(scraped), legal: Object.fromEntries(legal) }, null, 2))
    console.log('\nDry run: nothing written. Preview saved to studio/import-preview.json')
    return
  }

  const client = getCliClient({ apiVersion: '2025-01-01' })
  const uploaded = new Map<string, string>()
  const upload = async (url: string) => {
    if (uploaded.has(url)) return uploaded.get(url)!
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${res.status} for image ${url}`)
    const asset = await client.assets.upload('image', Buffer.from(await res.arrayBuffer()), { filename: decodeURIComponent(url.split('/').pop() ?? 'image') })
    uploaded.set(url, asset._id)
    return asset._id
  }
  const existing = (type: string, language: string, slug: string) =>
    client.fetch<string | null>(`*[_type == $type && language == $language && slug.current == $slug][0]._id`, { type, language, slug })
  const link = async (type: string, plId: string, enId: string) => {
    const done = await client.fetch<number>(`count(*[_type == "translation.metadata" && references($pl) && references($en)])`, { pl: plId, en: enId })
    if (done) return
    await client.create({
      _type: 'translation.metadata',
      schemaTypes: [type],
      translations: [
        { _key: 'pl', _type: 'internationalizedArrayReferenceValue', language: 'pl', value: { _type: 'reference', _ref: plId } },
        { _key: 'en', _type: 'internationalizedArrayReferenceValue', language: 'en', value: { _type: 'reference', _ref: enId } },
      ],
    })
    console.log(`~ linked ${type} ${plId} ⇄ ${enId}`)
  }

  for (const p of PROJECTS) {
    const s = scraped.get(p.slug)!
    const ids: Record<string, string> = {}
    for (const lang of ['pl', 'en'] as const) {
      const found = await existing('project', lang, p.slug)
      if (found) { console.log(`= project ${lang} ${p.slug} exists, skipped`); ids[lang] = found; continue }
      const t = lang === 'pl' ? p.pl : { title: p.pl.title, ...p.en }
      const alt = (n: number) => (lang === 'pl' ? `${p.pl.title} – realizacja Nuuvie, zdjęcie ${n}` : `${p.pl.title} – Nuuvie project, image ${n}`)
      let imageN = 0
      let textN = 0
      const content = []
      for (const item of s.sequence) {
        if ('urls' in item) {
          const images = []
          for (const url of item.urls) images.push({ _type: 'image', _key: key(), asset: { _type: 'reference', _ref: await upload(url) }, alt: alt(++imageN) })
          content.push({ _type: 'projectImages', _key: key(), layout: item.layout, images })
        } else {
          const text = lang === 'pl' ? item : p.en.sections[textN++]
          content.push({ _type: 'projectText', _key: key(), label: text.label, heading: text.heading, body: text.body.map(paragraph) })
        }
      }
      const doc = await client.create({
        _type: 'project',
        language: lang,
        title: t.title,
        slug: { _type: 'slug', current: p.slug },
        kicker: t.kicker,
        headline: lang === 'pl' ? s.headline : p.en.headline,
        excerpt: t.excerpt,
        tags: t.tags,
        order: p.order,
        coverImage: { _type: 'image', asset: { _type: 'reference', _ref: await upload(s.coverUrl) }, alt: lang === 'pl' ? `${p.pl.title} – okładka projektu` : `${p.pl.title} – project cover` },
        content,
      })
      ids[lang] = doc._id
      console.log(`+ project ${lang} ${p.slug}`)
    }
    await link('project', ids.pl, ids.en)
  }

  const legalIds = new Map<string, string>()
  for (const l of LEGAL) {
    const d = legal.get(`${l.language}:${l.slug}`)!
    let id = await existing('legalPage', l.language, l.slug)
    if (id) console.log(`= legal ${l.language} ${l.slug} exists, skipped`)
    else {
      id = (await client.create({ _type: 'legalPage', language: l.language, title: d.title, slug: { _type: 'slug', current: l.slug }, updatedAt: d.updatedAt, body: d.body }))._id
      console.log(`+ legal ${l.language} ${l.slug}`)
    }
    legalIds.set(`${l.language}:${l.slug}`, id)
  }
  for (const l of LEGAL.filter((x) => x.language === 'pl' && x.pair)) {
    await link('legalPage', legalIds.get(`pl:${l.slug}`)!, legalIds.get(`en:${l.pair}`)!)
  }
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
