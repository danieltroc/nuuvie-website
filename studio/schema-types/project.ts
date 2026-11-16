import { defineArrayMember, defineField, defineType } from 'sanity'
import { isUniqueInLanguage } from './slug'
import { altImageFields, richTextBlock } from './rich-text'

/** A case study (/work/…). Content is a free sequence of text sections and image rows. */
export const projectType = defineType({
  name: 'project',
  title: 'Case study',
  type: 'document',
  groups: [
    { name: 'content', title: 'Treść', default: true },
    { name: 'card', title: 'Karta na stronie głównej' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
    defineField({ name: 'title', title: 'Nazwa klienta / projektu', type: 'string', group: ['content', 'card'], validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Adres (slug)',
      type: 'slug',
      group: 'content',
      description: 'Końcówka adresu: /work/… (po angielsku /en/work/…). Nie zmieniaj go po publikacji.',
      options: { source: 'title', maxLength: 96, isUnique: isUniqueInLanguage },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'kicker', title: 'Branża / opis klienta', type: 'string', group: ['content', 'card'], description: 'Np. „Inteligentne zamki i rozwiązania smart home”.' }),
    defineField({ name: 'headline', title: 'Nagłówek strony', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({
      name: 'excerpt',
      title: 'Jedno zdanie o projekcie',
      type: 'string',
      group: 'card',
      description: 'Na karcie projektu na stronie głównej i w „Następny projekt”.',
    }),
    defineField({ name: 'tags', title: 'Zakres prac', type: 'array', group: ['content', 'card'], of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'year', title: 'Rok', type: 'number', group: 'content' }),
    defineField({ name: 'coverImage', title: 'Okładka', type: 'image', group: ['content', 'card'], options: { hotspot: true }, fields: altImageFields, validation: (r) => r.required() }),
    defineField({
      name: 'content',
      title: 'Treść',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'projectText',
          title: 'Sekcja tekstu',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Etykieta', type: 'string', description: 'Np. „Wstęp”, „Rezultaty”.' }),
            defineField({ name: 'heading', title: 'Nagłówek', type: 'string' }),
            defineField({ name: 'body', title: 'Tekst', type: 'array', of: [richTextBlock] }),
          ],
          preview: {
            select: { label: 'label', heading: 'heading' },
            prepare: ({ label, heading }) => ({ title: heading || 'Sekcja tekstu', subtitle: label }),
          },
        }),
        defineArrayMember({
          name: 'projectImages',
          title: 'Zdjęcia',
          type: 'object',
          fields: [
            defineField({
              name: 'layout',
              title: 'Układ',
              type: 'string',
              initialValue: 'full',
              options: { list: [{ title: 'Na całą szerokość', value: 'full' }, { title: 'Siatka (2 kolumny)', value: 'grid' }], layout: 'radio', direction: 'horizontal' },
            }),
            defineField({
              name: 'images',
              title: 'Zdjęcia',
              type: 'array',
              of: [defineArrayMember({ type: 'image', options: { hotspot: true }, fields: altImageFields })],
              validation: (r) => r.min(1),
            }),
          ],
          preview: {
            select: { layout: 'layout', images: 'images', media: 'images.0' },
            prepare: ({ layout, images, media }) => ({
              title: `${(images ?? []).length} zdj. – ${layout === 'grid' ? 'siatka' : 'cała szerokość'}`,
              media,
            }),
          },
        }),
      ],
    }),
    defineField({ name: 'order', title: 'Kolejność na stronie głównej', type: 'number', group: 'card', description: 'Mniejsza liczba = wyżej.', initialValue: 10 }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [{ title: 'Kolejność', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', language: 'language', media: 'coverImage', kicker: 'kicker' },
    prepare: ({ title, language, media, kicker }) => ({ title, subtitle: `${(language ?? '?').toUpperCase()} · ${kicker ?? ''}`, media }),
  },
})
