// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';

// Pages to exclude from sitemap (noindex pages)
const excludedPages = [
  '/retro',
  // Add more noindex pages here as needed
];

// https://astro.build/config
export default defineConfig({
  site: 'https://lucasstahl.com',
  integrations: [
    sitemap({
      filter: (page) => !excludedPages.some(excluded => page.includes(excluded)),
      serialize: (item) => {
        // Remove trailing slashes to match canonical URLs (except for homepage)
        if (item.url !== 'https://lucasstahl.com/') {
          item.url = item.url.replace(/\/$/, '');
        }
        return item;
      }
    }),
    sentry()
  ],
  redirects: {
    '/contact': '/about',
    '/portfolio': '/',
    '/portfolio.html': '/'
  }
});
