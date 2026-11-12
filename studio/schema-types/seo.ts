import { defineField, defineType } from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł w Google',
      type: 'string',
      description: 'Zostaw puste, żeby użyć tytułu wpisu. Najlepiej do 60 znaków.',
      validation: (rule) => rule.max(70).warning('Google skraca tytuły powyżej ~60 znaków.'),
    }),
    defineField({
      name: 'description',
      title: 'Opis w Google',
      type: 'text',
      rows: 3,
      description: 'Zostaw puste, żeby użyć zajawki. Najlepiej 120–160 znaków.',
      validation: (rule) => rule.max(180).warning('Google skraca opisy powyżej ~160 znaków.'),
    }),
  ],
})
