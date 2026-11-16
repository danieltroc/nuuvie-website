import type { SlugValidationContext } from 'sanity'

/** Slugs only have to be unique per document type and language: PL and EN may share a slug. */
export async function isUniqueInLanguage(slug: string, context: SlugValidationContext) {
  const { document, getClient } = context
  const id = document?._id.replace(/^drafts\./, '')
  const params = { draft: `drafts.${id}`, published: id, slug, language: document?.language, type: document?._type }
  const query = `!defined(*[_type == $type && !(_id in [$draft, $published]) && slug.current == $slug && language == $language][0]._id)`
  return getClient({ apiVersion: '2025-01-01' }).fetch(query, params)
}
