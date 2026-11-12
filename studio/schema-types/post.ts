import { defineArrayMember, defineField, defineType, type SlugValidationContext } from 'sanity'

/** Slugs only have to be unique within one language: PL and EN posts may share a slug. */
async function isUniqueInLanguage(slug: string, context: SlugValidationContext) {
  const { document, getClient } = context
  const id = document?._id.replace(/^drafts\./, '')
  const params = { draft: `drafts.${id}`, published: id, slug, language: document?.language }
  const query = `!defined(*[_type == "post" && !(_id in [$draft, $published]) && slug.current == $slug && language == $language][0]._id)`
  return getClient({ apiVersion: '2025-01-01' }).fetch(query, params)
}

export const postType = defineType({
  name: 'post',
  title: 'Wpis na blogu',
  type: 'document',
  groups: [
    { name: 'content', title: 'Treść', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
    defineField({
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Adres (slug)',
      type: 'slug',
      group: 'content',
      description: 'Końcówka adresu: /blog-posts/… (po angielsku /en/blog-posts/…). Nie zmieniaj go po publikacji.',
      options: { source: 'title', maxLength: 96, isUnique: isUniqueInLanguage },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Zajawka',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Jedno–dwa zdania pod tytułem i na liście wpisów.',
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: 'coverImage',
      title: 'Okładka',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Opis obrazka (alt)',
          type: 'string',
          description: 'Co widać na obrazku. Ważne dla dostępności i Google.',
          validation: (rule) => rule.required().warning('Dodaj opis obrazka.'),
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Treść',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Akapit', value: 'normal' },
            { title: 'Nagłówek H2', value: 'h2' },
            { title: 'Nagłówek H3', value: 'h3' },
            { title: 'Cytat', value: 'blockquote' },
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
                fields: [
                  defineField({
                    name: 'href',
                    title: 'Adres',
                    type: 'url',
                    validation: (rule) => rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Opis obrazka (alt)', type: 'string' }),
            defineField({ name: 'caption', title: 'Podpis', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { title: 'Najnowsze', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', language: 'language', date: 'publishedAt', media: 'coverImage' },
    prepare({ title, language, date, media }) {
      const day = date ? new Date(date).toLocaleDateString('pl-PL') : 'bez daty'
      return { title, subtitle: `${(language ?? '?').toUpperCase()} · ${day}`, media }
    },
  },
})
