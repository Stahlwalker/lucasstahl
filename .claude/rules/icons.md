# Icon Rules

This site has migrated off Font Awesome. **New pages must not load FA**, and any FA icons added to existing pages should follow the inline-SVG pattern below.

## The pattern

1. **Use the `<Icon />` component.** It's at `astro-site/src/components/Icon.astro`. Pass the icon name (no prefix, no `fa-`): `<Icon name="envelope" />`. The component inlines the SVG at build time via Vite's `import.meta.glob` with `?raw` — no runtime fetch.

2. **SVGs live in `astro-site/src/icons/`** with the filename `<name>-solid-full.svg` (or `-brands-solid-full.svg` for brand icons). Download them from fontawesome.com (Free, Solid or Brands, "Full" SVG) and drop them in that folder.

3. **In the Layout call**, set `loadFontAwesome={false}` to skip the FA stylesheet and `inlineCriticalCSS={true}` to inline base styles (including `.icon-svg`):

   ```astro
   <Layout
     title="..."
     loadFontAwesome={false}
     inlineCriticalCSS={true}
   >
   ```

4. **Sizing.** The base CSS in `public/assets/css/style.css` renders `.icon-svg svg` at `1em` square with `fill: currentColor`. For sized contexts (buttons, badges, etc.) add an override:

   ```css
   .my-button :global(.icon-svg svg) {
     width: 1.1rem;
     height: 1.1rem;
     fill: var(--accent-primary); /* optional, only if you need a non-inherited color */
   }
   ```

   Use `:global()` inside Astro scoped styles because the SVG markup lives inside the `<Icon />` component's scope, not the parent page's.

## Common pitfalls (these all bit me — don't repeat)

- **`define:vars` + `<script>` ES imports are incompatible** (`define:vars` forces `is:inline`, which breaks `import Fuse from 'fuse.js'`). When a script needs to read SVG markup, use the **hidden-span pattern**: render `<span hidden id="svg-foo"><Icon name="foo" /></span>` and read `document.getElementById('svg-foo').innerHTML` in JS.

- **Animated/dynamic icons** (e.g. a spinner that swaps in on form submit, theme-toggle that switches moon/sun/display): use hidden-span sources, then `target.innerHTML = source.innerHTML`. For rotation, attach a CSS class (e.g. `.icon-spin`) with a `@keyframes` rule on `:global(.icon-spin svg)`.

- **Vertical alignment.** Base `.icon-svg svg` is `display: block` inside an inline-block wrapper. If an icon sits next to text and looks low or high, set `vertical-align: -0.15em` on the SVG (FA's own offset) — middle/baseline alignment usually misses the text x-height.

- **Wrapping (text + icon on separate lines).** When an icon trails text in a tight container, add `white-space: nowrap` to the parent so it stays inline.

- **Icon name collisions.** The Icon component matches `${name}-solid-full.svg` exactly — don't rely on `startsWith`, or `pen` will match `pen-fancy`.

- **Don't preload icons or font files past 50KB into critical path.** A 344KB Inter preload made LCP worse on mobile; subsetted to 117KB. Same principle for icons — inline SVG is small (~1KB each) and beats CDN fetches.

## When adding new icons to a page

1. Find the FA icon name on fontawesome.com.
2. Download the SVG (Solid → Full, or Brands → Full).
3. Save to `src/icons/<name>-solid-full.svg` (or `-brands-solid-full.svg`).
4. Use `<Icon name="..." />` in the page.
5. If the icon looks too small/large/misaligned, add a `:global(.icon-svg svg)` rule scoped to its container.

## Pages still on Font Awesome

As of 2026-05-22, these indexed pages still load FA and should be migrated when touched:

- `/design-system/` (62 icons — biggest perf hit)
- `/status/` (10)
- `/seo/` (5)
- `/handbook/` (2)
- `/404/` (1)

The `noindex` test pages (`/sandbox/`, `/home-test/`) and the unused `components/Footer.astro` (legacy — `FooterV2.astro` is what renders) don't affect SEO and can stay on FA or be cleaned up incidentally.
