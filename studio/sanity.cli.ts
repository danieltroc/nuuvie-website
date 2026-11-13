import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '89d58rpp',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Published at https://nuuvie.sanity.studio after `npm run deploy`
  studioHost: 'nuuvie',
  deployment: {
    // ID of the deployed Studio, so `npm run deploy` updates it without asking
    appId: 'nswooc31j31l74128z3y89w7',
  },
})
