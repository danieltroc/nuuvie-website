import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'
import { schemaTypes } from './schema-types'
import { LANGUAGES } from './locales'

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
            ...LANGUAGES.map((lang) =>
              S.listItem()
                .title(`Blog (${lang.id.toUpperCase()})`)
                .schemaType('post')
                .child(
                  S.documentTypeList('post')
                    .title(`Wpisy – ${lang.title}`)
                    .filter('_type == "post" && language == $lang')
                    .params({ lang: lang.id })
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                    .initialValueTemplates([S.initialValueTemplateItem(`post-${lang.id}`)]),
                ),
            ),
          ]),
    }),
    documentInternationalization({
      supportedLanguages: LANGUAGES,
      schemaTypes: ['post'],
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // One "new post" template per language, so a post always knows its language
    templates: (prev) => [
      ...prev.filter((t) => t.schemaType !== 'post'),
      ...LANGUAGES.map((lang) => ({
        id: `post-${lang.id}`,
        title: `Wpis (${lang.title})`,
        schemaType: 'post',
        value: { language: lang.id },
      })),
    ],
  },
})
