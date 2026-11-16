import { defineConfig } from 'sanity'
import { structureTool, type StructureBuilder } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'
import { schemaTypes, LOCALIZED_TYPES, PAGE_TYPES } from './schema-types'
import { LANGUAGES } from './locales'

/** Sidebar sections; each one is split into a list per language. */
const SECTIONS = [
  { type: 'post', title: 'Blog', ordering: [{ field: 'publishedAt', direction: 'desc' as const }] },
  { type: 'project', title: 'Case studies', ordering: [{ field: 'order', direction: 'asc' as const }] },
  { type: 'legalPage', title: 'Strony prawne', ordering: [{ field: 'title', direction: 'asc' as const }] },
]

const TEMPLATE_TITLES: Record<string, string> = { post: 'Wpis', project: 'Case study', legalPage: 'Strona prawna' }

const section = (S: StructureBuilder, { type, title, ordering }: (typeof SECTIONS)[number]) =>
  S.listItem()
    .title(title)
    .child(
      S.list()
        .title(title)
        .items(
          LANGUAGES.map((lang) =>
            S.listItem()
              .title(`${title} (${lang.id.toUpperCase()})`)
              .schemaType(type)
              .child(
                S.documentTypeList(type)
                  .title(`${title} – ${lang.title}`)
                  .filter('_type == $type && language == $lang')
                  .params({ type, lang: lang.id })
                  .defaultOrdering(ordering)
                  .initialValueTemplates([S.initialValueTemplateItem(`${type}-${lang.id}`)]),
              ),
          ),
        ),
    )

export default defineConfig({
  name: 'nuuvie',
  title: 'Nuuvie',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '89d58rpp',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Treści')
          .items([
            // Fixed pages: one document per language, opened directly (no list, no duplicates)
            S.listItem()
              .title('Strony')
              .child(
                S.list()
                  .title('Strony')
                  .items(
                    PAGE_TYPES.flatMap(({ type, title }) =>
                      LANGUAGES.map((lang) =>
                        S.listItem()
                          .title(`${title} (${lang.id.toUpperCase()})`)
                          .id(`${type}-${lang.id}`)
                          .child(S.document().schemaType(type).documentId(`${type}-${lang.id}`).title(`${title} (${lang.id.toUpperCase()})`)),
                      ),
                    ),
                  ),
              ),
            S.divider(),
            ...SECTIONS.map((s) => section(S, s)),
          ]),
    }),
    documentInternationalization({
      supportedLanguages: LANGUAGES,
      schemaTypes: [...LOCALIZED_TYPES],
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // One "new document" template per type and language, so every document knows its language
    templates: (prev) => [
      // Fixed pages are never created from the "new document" menu
      ...prev.filter((t) => ![...LOCALIZED_TYPES, ...PAGE_TYPES.map((p) => p.type)].includes(t.schemaType as never)),
      ...LOCALIZED_TYPES.flatMap((type) =>
        LANGUAGES.map((lang) => ({
          id: `${type}-${lang.id}`,
          title: `${TEMPLATE_TITLES[type]} (${lang.title})`,
          schemaType: type,
          value: { language: lang.id },
        })),
      ),
    ],
  },
})
