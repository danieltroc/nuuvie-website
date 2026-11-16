import { postType } from './post'
import { projectType } from './project'
import { legalPageType } from './legal-page'
import { seoType } from './seo'

export const schemaTypes = [postType, projectType, legalPageType, seoType]

/** Document types that exist once per language and are linked as translations. */
export const LOCALIZED_TYPES = ['post', 'project', 'legalPage'] as const
