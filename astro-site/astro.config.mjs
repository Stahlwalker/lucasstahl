// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';

// Pages to exclude from sitemap (noindex pages)
const excludedPages = [
  '/retro/',
  // Add more noindex pages here as needed
];

// https://astro.build/config
export default defineConfig({
  site: 'https://lukestahl.io',
  integrations: [
    sitemap({
      filter: (page) => !excludedPages.some(excluded => page.includes(excluded)),
      serialize: (item) => item
    }),
    sentry()
  ],
  redirects: {
    '/contact': '/about',
    '/portfolio': '/',
    '/portfolio.html': '/'
  }
});
