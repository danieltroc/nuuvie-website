import { defineType } from 'sanity'
import { cta, img, list, pageBase, section, str, txt } from './page-fields'

/** Home page, one document per language (ids homePage-pl, homePage-en). Graphics stay in code. */
export const homePageType = defineType({
  name: 'homePage',
  title: 'Strona główna',
  type: 'document',
  fields: [
    ...pageBase,
    section('hero', 'Hero', [str('title', 'Nagłówek'), txt('text', 'Tekst pod nagłówkiem', 2), cta('primary', 'Przycisk główny'), cta('secondary', 'Przycisk drugi')]),
    section('statement', 'Zdanie o studiu', [txt('lead', 'Część wyraźna', 2), txt('rest', 'Część szara (dalsza)', 3)]),
    list('figures', 'Trzy liczby z rysunkami (kolejność = rysunki 1–3)', [str('title', 'Tytuł'), str('text', 'Opis')]),
    section('work', 'Sekcja „Wybrane projekty”', [str('title', 'Nagłówek'), txt('text', 'Tekst', 2), str('linkLabel', 'Tekst linku przy karcie')]),
    section('services', 'Usługi', [
      str('title', 'Nagłówek'),
      txt('text', 'Tekst', 2),
      str('linkLabel', 'Tekst linku'),
      list('items', 'Usługi (kolejność = grafiki: logo, UX/UI, grafika, audyt, zespół)', [str('title', 'Nazwa'), txt('body', 'Opis', 2)]),
    ]),
    section('testimonials', 'Opinie klientów', [
      str('title', 'Nagłówek'),
      list('items', 'Opinie', [txt('quote', 'Opinia', 3), str('name', 'Imię i nazwisko'), str('company', 'Firma'), img('photo', 'Zdjęcie')], 'name'),
    ]),
    section('paths', 'Dwie ścieżki', [
      str('title', 'Nagłówek'),
      txt('text', 'Tekst', 2),
      section('business', 'Dla biznesu', [str('title', 'Tytuł'), txt('text', 'Tekst', 2), cta('cta', 'Przycisk')]),
      section('designer', 'Dla designerów', [str('title', 'Tytuł'), txt('text', 'Tekst', 2), cta('cta', 'Przycisk')]),
    ]),
    section('blog', 'Blog', [str('title', 'Nagłówek'), str('linkLabel', 'Tekst linku')]),
    section('contact', 'Kontakt (czarny boks na końcu)', [str('title', 'Nagłówek'), txt('text', 'Tekst', 2), str('ctaLabel', 'Tekst przycisku rezerwacji')]),
  ],
  preview: { select: { language: 'language' }, prepare: ({ language }) => ({ title: 'Strona główna', subtitle: (language ?? '').toUpperCase() }) },
})
