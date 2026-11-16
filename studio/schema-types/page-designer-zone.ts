import { defineType } from 'sanity'
import { list, pageBase, section, str, strings, txt } from './page-fields'

/** Designer Zone (/strefa-designera), one document per language. */
export const designerZonePageType = defineType({
  name: 'designerZonePage',
  title: 'Strefa Designera',
  type: 'document',
  fields: [
    ...pageBase,
    section('links', 'Linki zakupu i rezerwacji', [str('buyHref', 'Link do zakupu konsultacji'), str('introHref', 'Link do darmowego intro'), str('email', 'E-mail kontaktowy')]),
    section('hero', 'Hero', [str('title', 'Nagłówek'), txt('text', 'Tekst', 2), str('buyLabel', 'Przycisk zakupu'), str('introLabel', 'Przycisk intro'), strings('facts', 'Fakty pod przyciskami')]),
    section('problem', 'Problem', [str('title', 'Nagłówek'), strings('questions', 'Pytania (4)')]),
    section('gets', 'Co otrzymasz', [
      str('title', 'Nagłówek'),
      txt('text', 'Tekst', 2),
      list('items', 'Elementy (kolejność = grafiki: portfolio, plan, feedback, Q&A)', [str('title', 'Tytuł'), txt('body', 'Opis', 2)]),
    ]),
    section('intro', 'Boks „darmowe intro”', [str('title', 'Nagłówek'), txt('text', 'Tekst', 4), str('ctaLabel', 'Przycisk')]),
    section('notFor', 'Boks „dla kogo nie jest”', [str('title', 'Nagłówek'), txt('text', 'Tekst', 2)]),
    section('opinions', 'Opinie', [str('title', 'Nagłówek'), list('items', 'Opinie', [str('name', 'Imię'), txt('text', 'Opinia', 4)], 'name')]),
    section('forms', 'Formy współpracy', [
      str('title', 'Nagłówek'),
      txt('text', 'Tekst', 2),
      list('items', 'Kroki (pierwszy to konsultacja 1:1)', [str('title', 'Tytuł'), txt('body', 'Opis', 3)]),
    ]),
    section('about', 'O mnie', [str('title', 'Nagłówek'), txt('text', 'Tekst (akapity oddziel pustą linią)', 8)]),
    section('pricing', 'Cennik', [
      str('title', 'Nagłówek'),
      txt('text', 'Tekst', 2),
      list('plans', 'Opcje (pierwsza wyróżniona na czarno)', [
        str('audience', 'Dla kogo'),
        str('title', 'Nazwa'),
        txt('text', 'Opis', 3),
        str('price', 'Cena'),
        str('oldPrice', 'Cena przed obniżką'),
        str('ctaLabel', 'Przycisk'),
        str('ctaHref', 'Link przycisku'),
      ]),
      txt('note', 'Notka pod cennikiem', 2),
    ]),
    section('faq', 'FAQ', [str('title', 'Nagłówek'), list('items', 'Pytania', [str('question', 'Pytanie'), txt('answer', 'Odpowiedź', 5)], 'question')]),
    section('final', 'Zakończenie (czarny boks)', [str('title', 'Nagłówek'), txt('text', 'Tekst', 2)]),
  ],
  preview: { select: { language: 'language' }, prepare: ({ language }) => ({ title: 'Strefa Designera', subtitle: (language ?? '').toUpperCase() }) },
})
