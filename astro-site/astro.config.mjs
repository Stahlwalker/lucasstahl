// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// Pages to exclude from sitemap (noindex pages)
const excludedPages = [
  '/retro/',
  '/sandbox/',
  '/newsletter/confirmed/',
  // Add more noindex pages here as needed
];

// https://astro.build/config
export default defineConfig({
  site: 'https://lukestahl.io',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !excludedPages.some(excluded => page.includes(excluded)),
      serialize: (item) => item
    }),
    sentry(),
    react()
  ],
  redirects: {
    '/contact': '/about',
    '/portfolio': '/',
    '/portfolio.html': '/'
  },
  // Perf: embed bundled CSS inline in each page's <head> instead of as a
  // separate render-blocking <link> file. Trades ~3KB per-page HTML growth
  // for the ~630ms render-blocking request the bundled CSS used to cause.
  // TO REVERT: change `inlineStylesheets: 'always'` → `inlineStylesheets: 'auto'`
  // (Astro default) or remove the `build` block entirely.
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      target: 'esnext', // Target modern browsers only, no legacy polyfills
    }
  }
});