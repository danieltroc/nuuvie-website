import { defineType } from 'sanity'
import { cta, img, list, pageBase, section, str, txt } from './page-fields'

/** About page (/o-nuuvie), one document per language. */
export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'O Nuuvie',
  type: 'document',
  fields: [
    ...pageBase,
    section('hero', 'Hero', [str('title', 'Nagłówek'), txt('text', 'Tekst', 3), cta('primary', 'Przycisk główny'), cta('secondary', 'Przycisk drugi')]),
    list('facts', 'Fakty (4 boksy)', [str('label', 'Etykieta'), str('value', 'Wartość')], 'label'),
    section('why', 'Dlaczego Nuuvie', [str('title', 'Nagłówek'), list('items', 'Powody', [str('title', 'Tytuł'), txt('body', 'Opis', 3), img('image', 'Ilustracja')])]),
    section('story', 'Moja droga', [str('title', 'Nagłówek'), txt('text', 'Tekst (akapity oddziel pustą linią)', 8), img('portrait', 'Zdjęcie (opcjonalnie)')]),
    list('stats', 'Liczby', [str('value', 'Liczba'), str('text', 'Opis')], 'value'),
    section('process', 'Jak pracuję', [str('title', 'Nagłówek'), txt('text', 'Tekst', 2), list('steps', 'Kroki', [str('title', 'Tytuł'), txt('body', 'Opis', 2)])]),
    section('principles', 'W co wierzę', [str('title', 'Nagłówek'), list('items', 'Zasady', [str('title', 'Tytuł'), txt('body', 'Opis', 2)])]),
    section('quote', 'Cytat', [txt('text', 'Cytat', 2), str('author', 'Podpis')]),
    section('final', 'Zakończenie (czarny boks)', [str('title', 'Nagłówek'), txt('text', 'Tekst', 2), str('ctaLabel', 'Przycisk rezerwacji')]),
  ],
  preview: { select: { language: 'language' }, prepare: ({ language }) => ({ title: 'O Nuuvie', subtitle: (language ?? '').toUpperCase() }) },
})
