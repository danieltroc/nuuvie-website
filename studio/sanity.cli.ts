import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '89d58rpp',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Published at https://nuuvie.sanity.studio after `npm run deploy`
  studioHost: 'nuuvie',
})
