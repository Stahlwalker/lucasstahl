// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://lucasstahl.com',
  integrations: [
    sitemap(),
    sentry()
  ],
  redirects: {
    '/contact': '/about',
    '/portfolio': '/',
    '/portfolio.html': '/'
  }
});
