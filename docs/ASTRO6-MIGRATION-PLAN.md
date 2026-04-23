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

### 2. Tailwind CSS 3 → 4 (lower risk than it sounds)

`@astrojs/tailwind` is deprecated in Astro 6. The new approach uses Tailwind v4 as a Vite plugin directly.

**Why this is low risk for this site:**

- Tailwind is only used in 5 React component files: `ui/button.tsx`, `ui/calendar.tsx`, `ui/popover.tsx`, `DatePickerTest.jsx`, `ColorBends.jsx`
- No `.astro` files use Tailwind — they use custom CSS
- The existing `tailwind.config.js` uses CSS variables for all colors and border radius, which is natively compatible with v4's approach
- Content scanning is auto-detected in v4 (no `content` array needed)

**The one thing that needs updating:**

- `darkMode: ['class', '[data-theme="dark"]']` — v4 moves this to CSS using `@custom-variant`

**Steps:**

1. Remove `@astrojs/tailwind` from `astro.config.mjs` integrations
2. Uninstall `@astrojs/tailwind` package
3. Install `tailwindcss@4.x` and `@tailwindcss/vite`
4. Add `@tailwindcss/vite` to Vite plugins in `astro.config.mjs`
5. Replace `tailwind.config.js` with CSS-based config (see below)
6. Spot-check the 5 affected React components visually

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

Replace `tailwind.config.js` with a CSS file (e.g., `src/styles/tailwind.css`):

```css
@import "tailwindcss";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme {
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}
```

---

## Risk Areas

- Dark mode variant syntax change (handled above with `@custom-variant`)
- Spot-check the 5 React components that use Tailwind classes

## Testing Checklist

- [ ] `ui/button.tsx` — check variants (default, outline, ghost, etc.)
- [ ] `ui/calendar.tsx` — check date picker styling
- [ ] `ui/popover.tsx` — check popover positioning and styling
- [ ] Dark/light mode toggle — verify `data-theme="dark"` variant still applies
- [ ] Any page that renders these components (`/sandbox`, `/tools`, etc.)
