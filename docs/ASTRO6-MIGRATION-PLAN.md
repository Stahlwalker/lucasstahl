# Astro 6 Migration Plan

## Background

lukestahl.io is currently on Astro 5.18.1. Upgrading to Astro 6 resolves three open Dependabot vulnerabilities:

- **fast-xml-parser**: XML Comment and CDATA Injection via Unescaped Delimiters (Moderate)
- **Astro XSS in define:vars** (x2): Incomplete `</script>` tag sanitization (Moderate)

These are moderate severity and do not affect the static site output for visitors. Migration is deferred until there is time to do it properly.

## What's Involved

This upgrade is effectively two migrations bundled together: **Astro 5 → 6** and **Tailwind CSS 3 → 4**.

---

### 1. Astro 5 → 6

**Low effort — likely just works:**

- `@astrojs/sitemap` — compatible version available
- `@astrojs/rss` — compatible version available
- `@astrojs/react` — compatible version available
- `@sentry/astro` — supports Astro 6 in recent releases
- `redirects` config — no known breaking changes, test after upgrade

**Minor behavior change:**

- `trailingSlash: 'ignore'` — Astro 6 no longer accepts trailing slashes on file endpoints (e.g., `/sitemap.xml/`). Unlikely to affect this site but worth checking.

**Cleanup:**

- Remove `legacy` flag from config if present (not currently used)

---

### 2. Tailwind CSS 3 → 4 (the significant part)

`@astrojs/tailwind` is deprecated in Astro 6. The new approach uses Tailwind v4 as a Vite plugin directly.

**Steps:**

1. Remove `@astrojs/tailwind` from `astro.config.mjs` integrations
2. Uninstall `@astrojs/tailwind` package
3. Install `tailwindcss@4.x` and `@tailwindcss/vite`
4. Add `@tailwindcss/vite` to Vite plugins in `astro.config.mjs`
5. Migrate Tailwind config from `tailwind.config.js` (JS-based, v3) to CSS-based config (v4)
6. Audit for renamed or removed utility classes (v4 has breaking changes)

---

## Migration Steps (When Ready)

```bash
# From astro-site/
npx @astrojs/upgrade   # upgrades Astro + official integrations
npm install tailwindcss@latest @tailwindcss/vite
npm uninstall @astrojs/tailwind
```

Then update `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://lukestahl.io',
  trailingSlash: 'ignore',
  integrations: [sitemap({ ... }), sentry(), react()],
  vite: {
    plugins: [tailwindcss()],
    build: { target: 'esnext' }
  }
});
```

Then migrate the Tailwind config and test all pages for visual regressions.

---

## Risk Areas

- Tailwind v4 utility class renames may cause visual regressions across the site
- Dark/light mode implementation may need updates (v4 handles `dark:` variants differently)
- Custom CSS in `astro-site/src/` should be audited for v3-specific syntax

## Testing Checklist

- [ ] Homepage (index.astro) — highlights section, sidebar layout, feature flag
- [ ] Blog post pages — typography, code blocks
- [ ] Dark/light mode toggle
- [ ] Mobile responsive layouts
- [ ] Navbar and footer
- [ ] Search functionality
- [ ] `/builds`, `/gems`, `/tools` pages
