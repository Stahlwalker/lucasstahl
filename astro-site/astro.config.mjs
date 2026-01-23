// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';

import react from '@astrojs/react';

// Pages to exclude from sitemap (noindex pages)
const excludedPages = [
  '/retro/',
  '/sandbox/',
  // Add more noindex pages here as needed
];

// https://astro.build/config
export default defineConfig({
  site: 'https://lukestahl.io',
  trailingSlash: 'ignore',
  integrations: [sitemap({
    filter: (page) => !excludedPages.some(excluded => page.includes(excluded)),
    serialize: (item) => item
  }), sentry(), react()],
  redirects: {
    '/contact': '/about',
    '/portfolio': '/',
    '/portfolio.html': '/'
  },
  vite: {
    build: {
      target: 'esnext', // Target modern browsers only, no legacy polyfills
    }
  }
});