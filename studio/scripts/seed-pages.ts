/**
 * Creates the fixed pages (home, about, designer zone; PL and EN) in Sanity from the starting
 * content in src/content/pages, uploading their images.
 *
 *   npx sanity exec scripts/seed-pages.ts --with-user-token            create missing pages only
 *   npx sanity exec scripts/seed-pages.ts --with-user-token -- --force  overwrite (loses edits made in Sanity!)
 */
import { getCliClient } from 'sanity/cli'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { homeContent } from '../../src/content/pages/home'
import { aboutContent } from '../../src/content/pages/about'
import { designerZoneContent } from '../../src/content/pages/designer-zone'

const FORCE = process.argv.includes('--force')
const PUBLIC_DIR = join(process.cwd(), '..', 'public')
const client = getCliClient({ apiVersion: '2025-01-01' })

const PAGES = [
  { type: 'homePage', content: homeContent },
  { type: 'aboutPage', content: aboutContent },
  { type: 'designerZonePage', content: designerZoneContent },
] as const

const uploaded = new Map<string, string>()
async function upload(src: string) {
  if (uploaded.has(src)) return uploaded.get(src)!
  const buffer = src.startsWith('http')
    ? Buffer.from(await (await fetch(src)).arrayBuffer())
    : readFileSync(join(PUBLIC_DIR, src))
  const asset = await client.assets.upload('image', buffer, { filename: decodeURIComponent(src.split('/').pop() ?? 'image') })
  uploaded.set(src, asset._id)
  return asset._id
}

/** Walks the content: uploads `{ _upload }` images and gives every array object a `_key`. */
async function prepare(value: unknown): Promise<unknown> {
  if (Array.isArray(value)) {
    return Promise.all(
      value.map(async (item) => {
        const out = await prepare(item)
        return out && typeof out === 'object' && !Array.isArray(out) ? { _key: randomUUID().slice(0, 12), ...out } : out
      }),
    )
  }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (typeof obj._upload === 'string') {
      return { _type: 'image', asset: { _type: 'reference', _ref: await upload(obj._upload) }, alt: obj.alt ?? '' }
    }
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) out[k] = await prepare(v)
    return out
  }
  return value
}

async function main() {
  for (const { type, content } of PAGES) {
    for (const language of ['pl', 'en'] as const) {
      const _id = `${type}-${language}`
      const exists = await client.fetch<boolean>('defined(*[_id == $id][0]._id)', { id: _id })
      if (exists && !FORCE) {
        console.log(`= ${_id} exists, skipped`)
        continue
      }
      const doc = { _id, _type: type, language, ...((await prepare(content[language])) as object) }
      await client.createOrReplace(doc)
      console.log(`${exists ? '!' : '+'} ${_id}`)
    }
  }
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
