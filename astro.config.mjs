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
    // Language pairs are declared on each page (hreflang links in Base.astro), not here
    sitemap({ filter: (page) => !page.includes('/404') }),
  ],
});
