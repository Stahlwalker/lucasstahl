# Using React + Tailwind Safely in Astro

This guide explains how to integrate React-based tools (React Bits, Shadcn UI) into your Astro project **without breaking your existing site**.

## ⚠️ Important Context

**Past Issue:** Previously attempted to add React + Tailwind, which caused conflicts with the existing site styles. React Bits uses Tailwind CSS internally, which can override your carefully crafted designs.

**This guide provides a SAFE approach** to avoid those conflicts.

## What You Can Build With React

### React Bits
Tool for creating animations in React applications.
- **Pros:** Beautiful pre-built animations
- **Cons:** Requires Tailwind CSS (conflict risk)
- **Official Docs:** https://reactbits.dev/get-started/installation

### Shadcn UI
Component library with beautiful, accessible components.
- **Pros:** High-quality components, customizable
- **Cons:** Requires React + Tailwind
- **Official Docs:** https://ui.shadcn.com

## The Problem: Tailwind CSS Conflicts

When you add Tailwind CSS for React components, it can break your site:

### What Goes Wrong
1. **Tailwind Preflight** - Resets all default browser styles globally
2. **Utility Class Conflicts** - Tailwind utilities override your custom CSS
3. **CSS Specificity Wars** - Hard to predict what breaks
4. **Global Style Pollution** - Affects pages you don't want it on

### Bundle Size Impact
- React core: ~40-50kb gzipped
- React DOM: ~130kb gzipped
- Tailwind CSS: ~10-50kb
- Total: 200kb+ added

## The Solution: Scoped Tailwind Setup

The key is **isolating Tailwind so it only affects React components**, not your entire site.

### Safety Measures

1. ✅ **Disable Tailwind Preflight** (CSS reset)
2. ✅ **Scope content paths** to React folder only
3. ✅ **Conditional loading** on specific pages
4. ✅ **Separate layouts** for React vs non-React pages
5. ✅ **Optional prefix** for extra safety

## Step-by-Step Safe Setup

### 1. Add React to Astro

```bash
cd astro-site
npx astro add react
```

This installs `@astrojs/react` and configures Astro automatically.

### 2. Install Tailwind + Shadcn (for React components)

```bash
# Install Tailwind
npm install -D tailwindcss

# Initialize Shadcn UI (optional, if you want it)
npx shadcn-ui@latest init
```

### 3. Configure Tailwind SAFELY

**Critical:** This config prevents Tailwind from affecting your site.

```js
// tailwind.config.mjs
export default {
  content: [
    './src/components/react/**/*.{jsx,tsx}', // Only scan React components folder
  ],

  // CRITICAL: Disable preflight to prevent CSS reset
  corePlugins: {
    preflight: false, // This is the most important line!
  },

  // Optional: Scope to specific container ID
  important: '#react-root',

  // Optional: Add prefix to all utilities for extra safety
  // prefix: 'tw-', // Uncomment if you want tw-flex, tw-grid, etc.
}
```

### 4. Create Separate Tailwind Stylesheet

```css
/* src/styles/tailwind.css */
/* Only import this on pages that need React components */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Create React-Specific Layout

```astro
---
// src/layouts/ReactLayout.astro
import '../styles/tailwind.css'; // Tailwind ONLY loaded here
---

<div id="react-root" class="react-components">
  <slot />
</div>
```

### 6. Create React Components Folder

```
astro-site/src/components/
├── react/                    # NEW: React components only
│   ├── ui/                   # Shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── AnimatedCard.jsx      # React Bits components
│   └── ...
└── ...                       # Existing Astro components (untouched)
```

### 7. Use React Components on Specific Pages Only

```astro
---
// src/pages/components-demo.astro (NEW PAGE for testing)
import ReactLayout from '../layouts/ReactLayout.astro';
import { Button } from '../components/react/ui/button';
---

<ReactLayout>
  <h1>React Components Demo</h1>
  <Button client:load>Click me</Button>
</ReactLayout>
```

**Your existing pages remain untouched:**
```astro
---
// src/pages/index.astro (NO CHANGES)
import Layout from '../layouts/Layout.astro'; // Your normal layout
---

<Layout>
  <!-- Your site works exactly as before -->
</Layout>
```

## Project Structure

```
astro-site/
├── src/
│   ├── components/
│   │   ├── react/                    # NEW: React + Tailwind components
│   │   │   ├── ui/                   # Shadcn UI components
│   │   │   │   ├── button.tsx
│   │   │   │   └── card.tsx
│   │   │   ├── AnimatedCard.jsx      # React Bits animations
│   │   │   └── ...
│   │   └── ...                       # Existing Astro components (safe)
│   ├── layouts/
│   │   ├── Layout.astro              # Your current layout (no Tailwind)
│   │   └── ReactLayout.astro         # NEW: React pages only (with Tailwind)
│   ├── pages/
│   │   ├── index.astro               # SAFE: Uses Layout.astro
│   │   ├── gems.astro                # SAFE: Uses Layout.astro
│   │   ├── builds.astro              # SAFE: Uses Layout.astro
│   │   ├── sandbox.astro             # YOUR CHOICE: Can use either layout
│   │   └── components-demo.astro     # NEW: Uses ReactLayout.astro
│   └── styles/
│       ├── tailwind.css              # NEW: Only imported in ReactLayout
│       └── ...                       # Your existing styles (untouched)
├── astro.config.mjs                  # Updated with React integration
├── tailwind.config.mjs               # NEW: Scoped Tailwind config
└── package.json
```

## Installing React Bits (Optional)

If you want React Bits animations after the safe setup:

```bash
# Follow official installation
# https://reactbits.dev/get-started/installation

# Example (check docs for exact command):
npm install react-bits
# or
npx react-bits init
```

## Astro Client Directives

Control when React components hydrate:

| Directive | When to Use | Performance |
|-----------|-------------|-------------|
| `client:load` | Critical, immediate interaction | Loads immediately |
| `client:idle` | Non-critical animations | Loads when browser idle |
| `client:visible` | Below the fold content | Loads when scrolled into view |
| `client:media="{QUERY}"` | Responsive components | Loads based on screen size |
| `client:only="react"` | Browser-only code | Skips SSR |

**Example:**
```astro
<AnimatedCard client:visible />  <!-- Best for animations below fold -->
<ShadcnButton client:load />     <!-- For interactive buttons -->
```

## Testing Strategy

Follow this order to test safely:

1. ✅ **Add React integration** (`npx astro add react`)
2. ✅ **Install Tailwind with safe config** (preflight disabled)
3. ✅ **Create ReactLayout.astro** (separate layout)
4. ✅ **Create one test page** (`/components-demo`)
5. ✅ **Add one Shadcn component** (test it works)
6. ✅ **Verify main site unchanged**:
   - Check homepage
   - Check /gems
   - Check /builds
   - Check /about
   - Inspect styles in dev tools
7. ✅ **If all good, expand usage**
8. ❌ **If conflicts occur, easy rollback**

## Troubleshooting

### Tailwind affecting main site
- ❌ Forgot `preflight: false` in tailwind.config.mjs
- ❌ Imported tailwind.css in wrong layout
- ❌ Content paths too broad (scanning non-React files)

### React components not styling
- Check Tailwind content paths include your component folder
- Verify tailwind.css is imported in ReactLayout
- Check component is wrapped in `<div id="react-root">`

### Build errors
- Clear `.astro` cache: `rm -rf .astro node_modules/.vite`
- Reinstall: `npm install`
- Check for SSR issues: use `client:only="react"` if needed

## Alternative: Pure Vanilla Animations

If you want to avoid React/Tailwind complexity entirely, you already have great options:

### Option 1: Motion.js (Already Installed)
```javascript
import { animate } from 'motion';
// Lightweight, no conflicts, great performance
```

### Option 2: GSAP
```bash
npm install gsap
```
- Industry standard
- Powerful, well-documented
- Works with vanilla JS
- No CSS framework needed

### Option 3: Anime.js
```bash
npm install animejs
```
- Lightweight (~6kb)
- Simple API
- Great for complex animations

### Option 4: Pure CSS + Canvas
What we've been building in the sandbox:
- Isometric diamond with gradients
- Floating code windows with spotlights
- Gradient footers with particles
- Full control, zero dependencies

## Performance Tips

1. **Use client:visible** for below-fold content
2. **Use client:idle** for non-critical features
3. **Lazy load** heavy libraries
4. **Keep React components small** - only wrap interactive parts
5. **Consider alternatives** - do you really need React for this?

## Recommendations

### For Sandbox Experiments
**Keep using vanilla JS/CSS** - the animations we built are fantastic and have zero conflicts.

### For Production Features
**Use React + Tailwind scoped approach** if you need:
- Shadcn UI components
- Complex form interactions
- React-specific libraries

### Separate Pages Strategy
- `/` - Main site (vanilla, no React)
- `/gems/` - No React
- `/builds/` - No React
- `/sandbox/` - Pure experiments (vanilla)
- `/components/` - NEW page for React/Shadcn demos

## Resources

- [React Bits Installation](https://reactbits.dev/get-started/installation)
- [Shadcn UI](https://ui.shadcn.com)
- [Astro React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Astro Client Directives](https://docs.astro.build/en/reference/directives-reference/#client-directives)
- [Tailwind CSS](https://tailwindcss.com/docs/installation)

## Next Steps

1. **Decide if you need React** - consider vanilla alternatives first
2. **If yes, follow safe setup** with preflight disabled
3. **Test on isolated page** before expanding
4. **Monitor bundle size** - keep site fast
5. **Document what works** for future reference

---

**Remember:** The safest approach is to keep React/Tailwind isolated to specific pages. Your main site should remain untouched.
