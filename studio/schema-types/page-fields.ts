/** Small helpers so the page schemas read like a content outline. */
import { defineArrayMember, defineField } from 'sanity'

type Extra = Record<string, unknown>

export const str = (name: string, title: string, extra: Extra = {}) => defineField({ name, title, type: 'string', ...extra })
export const txt = (name: string, title: string, rows = 3, extra: Extra = {}) => defineField({ name, title, type: 'text', rows, ...extra })

/** A named group of fields, shown as a collapsible box in the editor. */
export const section = (name: string, title: string, fields: ReturnType<typeof defineField>[], extra: Extra = {}) =>
  defineField({ name, title, type: 'object', options: { collapsible: true, collapsed: true }, fields, ...extra })

/** Button: label + link. */
export const cta = (name: string, title: string) =>
  defineField({ name, title, type: 'object', fields: [str('label', 'Tekst przycisku'), str('href', 'Link', { description: 'Adres strony, np. /strefa-designera, #contact albo https://…' })] })

/** Image with a description (alt). */
export const img = (name: string, title: string) =>
  defineField({ name, title, type: 'image', options: { hotspot: true }, fields: [str('alt', 'Opis obrazka (alt)')] })

/** List of small objects (cards, steps, questions…). */
export const list = (name: string, title: string, fields: ReturnType<typeof defineField>[], previewTitle = 'title', extra: Extra = {}) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [defineArrayMember({ type: 'object', name: `${name}Item`, fields, preview: { select: { title: previewTitle } } })],
    ...extra,
  })

export const strings = (name: string, title: string, extra: Extra = {}) => defineField({ name, title, type: 'array', of: [{ type: 'string' }], ...extra })

/** Fields every page has: hidden language + SEO. */
export const pageBase = [
  defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
  defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
]
