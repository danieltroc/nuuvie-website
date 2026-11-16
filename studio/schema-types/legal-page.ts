import { defineArrayMember, defineField, defineType } from 'sanity'
import { isUniqueInLanguage } from './slug'

/** Legal pages (/legal/…): terms, privacy policy. */
export const legalPageType = defineType({
  name: 'legalPage',
  title: 'Strona prawna',
  type: 'document',
  fields: [
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
    defineField({ name: 'title', title: 'Tytuł', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Adres (slug)',
      type: 'slug',
      description: 'Końcówka adresu: /legal/… (po angielsku /en/legal/…). Nie zmieniaj go po publikacji.',
      options: { source: 'title', maxLength: 96, isUnique: isUniqueInLanguage },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'updatedAt', title: 'Ostatnia aktualizacja', type: 'date', validation: (r) => r.required() }),
    defineField({
      name: 'body',
      title: 'Treść',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Akapit', value: 'normal' },
            { title: 'Nagłówek H2', value: 'h2' },
            { title: 'Nagłówek H3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Pogrubienie', value: 'strong' },
              { title: 'Kursywa', value: 'em' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [defineField({ name: 'href', title: 'Adres', type: 'url', validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }) })],
              }),
            ],
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', language: 'language', updatedAt: 'updatedAt' },
    prepare: ({ title, language, updatedAt }) => ({ title, subtitle: `${(language ?? '?').toUpperCase()} · ${updatedAt ?? ''}` }),
  },
})
