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
    // Pages kept out of src/pages until they launch.
    // /fonty is built, but before the launch it opens only on *.workers.dev (preview): the Worker
    // returns 404 for it on nuuvie.com (worker/index.ts) and the page is noindex.
    // /cta exists only in `astro dev`.
    {
      name: 'dev-only-pages',
      hooks: {
        'astro:config:setup': ({ command, injectRoute }) => {
          injectRoute({ pattern: '/fonty', entrypoint: './src/dev/fonty.astro' });
          if (command !== 'dev') return;
          // Call-to-action variants to choose from (not a real page)
          injectRoute({ pattern: '/cta', entrypoint: './src/dev/cta.astro' });
        },
      },
    },
    // Cloudflare serves the nearest 404.html for an unknown address, so the English one must sit at
    // dist/en/404.html (Astro writes en/404/index.html, it special-cases only the root 404)
    {
      name: 'en-404',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const { rename, rmdir } = await import('node:fs/promises');
          const folder = new URL('en/404/', dir);
          await rename(new URL('index.html', folder), new URL('en/404.html', dir));
          await rmdir(folder);
        },
      },
    },
    // Language pairs are declared on each page (hreflang links in Base.astro), not here
    sitemap({ filter: (page) => !page.includes('/404') && !page.includes('/fonty') }),
  ],
});
