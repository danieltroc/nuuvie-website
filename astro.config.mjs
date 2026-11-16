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
  // `astro dev` has no Worker: send /api (the contact form) to `npm run preview:cf` on port 8787
  vite: { server: { proxy: { '/api': 'http://localhost:8787' } } },
  integrations: [
    // Language pairs are declared on each page (hreflang links in Base.astro), not here
    sitemap({ filter: (page) => !page.includes('/404') }),
  ],
});
