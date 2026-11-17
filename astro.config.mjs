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
    // Pages that only exist in `astro dev` (not built, not online): the font set until it launches.
    // To publish one, move it back into src/pages and delete its line here.
    {
      name: 'dev-only-pages',
      hooks: {
        'astro:config:setup': ({ command, injectRoute }) => {
          if (command !== 'dev') return;
          injectRoute({ pattern: '/fonty', entrypoint: './src/dev/fonty.astro' });
          // Call-to-action variants to choose from (not a real page)
          injectRoute({ pattern: '/cta', entrypoint: './src/dev/cta.astro' });
        },
      },
    },
    // Language pairs are declared on each page (hreflang links in Base.astro), not here
    sitemap({ filter: (page) => !page.includes('/404') }),
  ],
});
