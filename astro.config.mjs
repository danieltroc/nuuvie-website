// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.nuuvie.com',
  // Addresses without a trailing slash, as on the old Webflow site (/blog, not /blog/).
  // Cloudflare serves dist/blog/index.html at /blog (see wrangler.jsonc).
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'pl', locales: { pl: 'pl-PL', en: 'en-GB' } },
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
