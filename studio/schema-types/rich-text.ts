import { defineArrayMember, defineField } from 'sanity'

/** Simple rich text: paragraphs, H2/H3, lists, bold, italic and links. Shared by several types. */
export const richTextBlock = defineArrayMember({
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
})

/** Image with a required description (alt) and optional caption. */
export const altImageFields = [
  defineField({
    name: 'alt',
    title: 'Opis obrazka (alt)',
    type: 'string',
    description: 'Co widać na obrazku. Ważne dla dostępności i Google.',
    validation: (rule) => rule.required().warning('Dodaj opis obrazka.'),
  }),
]
