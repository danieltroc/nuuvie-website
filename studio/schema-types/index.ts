import { postType } from './post'
import { projectType } from './project'
import { legalPageType } from './legal-page'
import { seoType } from './seo'
import { homePageType } from './page-home'
import { designerZonePageType } from './page-designer-zone'
import { aboutPageType } from './page-about'

export const schemaTypes = [postType, projectType, legalPageType, homePageType, designerZonePageType, aboutPageType, seoType]

/** One document per language with a fixed id `${type}-${language}` (edited from the "Strony" menu). */
export const PAGE_TYPES = [
  { type: 'homePage', title: 'Strona główna' },
  { type: 'aboutPage', title: 'O Nuuvie' },
  { type: 'designerZonePage', title: 'Strefa Designera' },
] as const

/** Document types that exist once per language and are linked as translations. */
export const LOCALIZED_TYPES = ['post', 'project', 'legalPage'] as const
