# lukestahl.io

Personal website and blog for Luke Stahl.

Built with Astro v5, Notion CMS, deployed to GitHub Pages.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v5.16.0 with [React](https://react.dev/) v19 integration
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (scoped to React components only)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) and [React Bits](https://reactbits.dev/)
- **CMS**: [Notion](https://www.notion.so/)
- **Error Tracking**: [Sentry](https://sentry.io/)
- **Analytics**: [PostHog](https://posthog.com/)
- **Deployment**: GitHub Pages via GitHub Actions
- **Email**: [Resend](https://resend.com/)
- **Dev Tools**: [Agentation](https://agentation.dev/) (development only)

## Project Structure

```
lucasstahl/
└── astro-site/              # Astro project
    ├── src/
    │   ├── pages/           # Routes
    │   │   ├── index.astro  # Homepage
    │   │   ├── about.astro
    │   │   ├── blog.astro
    │   │   ├── blog/[slug].astro  # Dynamic blog posts
    │   │   ├── builds.astro
    │   │   ├── gems.astro
    │   │   ├── sandbox.astro     # Testing ground for React components
    │   │   └── handbook.astro
    │   ├── components/      # React components
    │   │   └── ui/          # shadcn/ui components
    │   ├── layouts/         # Layout components
    │   ├── styles/          # Global styles (Tailwind CSS)
    │   └── lib/             # Utilities (Notion API, utils)
    ├── public/              # Static assets
    │   └── assets/
    │       ├── css/
    │       └── images/
    ├── .github/
    │   └── workflows/       # GitHub Actions
    ├── tailwind.config.js   # Tailwind configuration
    ├── components.json      # shadcn/ui configuration
    └── package.json
```

## Features

### Architecture
- **Astro Islands**: Static HTML with selective React hydration for interactive components
- React components available via `@astrojs/react` integration
- Maintains SSG performance while enabling React-dependent tools
- **Tailwind CSS**: Scoped exclusively to React components (`.jsx`, `.tsx` files)
  - No CSS reset applied (`applyBaseStyles: false`)
  - Preserves existing site styles
  - Zero impact on Astro pages and existing CSS
- **shadcn/ui**: Copy-paste component library built on Radix UI primitives
  - Components live in `src/components/ui/`
  - Fully customizable and accessible
  - Dark mode support via `[data-theme="dark"]`
- **React Bits**: WebGL/Three.js powered visual components for effects and animations

### Content
- Blog posts managed in Notion, synced on build
- RSS feed at `/rss.xml`
- Sitemap with canonical URLs and noindex filtering
- llms.txt for LLM context

### Monitoring
- Sentry error tracking in production (10% sample rate)
- PostHog web analytics
- Giscus comments on blog posts

### Automation
- Weekly link checker (broken link detection)
- Weekly Core Web Vitals checks
- Email alerts via Resend

### SEO
- Canonical URLs with trailing slashes
- OpenGraph and Twitter Card meta tags
- JSON-LD structured data for blog posts
- Sitemap generation
- Dark/light mode

### Development Tools
- **Agentation**: Visual annotation tool for communicating design changes to Claude Code (dev only)
- **React**: Available for interactive components when needed
- Automatic theme detection and toggle

### Component Libraries

#### shadcn/ui
Add shadcn components using the CLI:

```bash
cd astro-site
npx shadcn@latest add <component-name>
```

Example: `npx shadcn@latest add button`

Components are installed to `src/components/ui/` and are fully customizable.

#### React Bits
Add React Bits components using the CLI:

```bash
cd astro-site
npx shadcn@latest add @react-bits/<ComponentName>-<LANG>-<STYLE>
```

Example: `npx shadcn@latest add @react-bits/ColorBends-JS-TW`

- `LANG`: JS (JavaScript) or TS (TypeScript)
- `STYLE`: TW (Tailwind) or CSS (Plain CSS)

## Development

### Prerequisites
- Node.js v18+
- npm

### Setup
```bash
cd astro-site
npm install
```

### Commands

All commands run from the `astro-site` directory:

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview build locally |
| `npm run astro ...` | Run Astro CLI commands |

**Testing Ground**: Visit `/sandbox` during development to test React components, shadcn/ui, and React Bits (page is noindexed).

### Performance & Safety

**Tailwind CSS is production-safe:**
- Scoped to React components only (`tailwind.config.js` content array)
- No CSS reset applied to preserve existing styles
- Existing Astro pages and CSS remain completely unaffected
- CSS bundle size: ~1-2KB for variables + utilities for components used

**Component isolation:**
- All new React components are opt-in via `client:load` directive
- Zero impact on pages that don't use React components
- Sandbox page (`/sandbox`) is excluded from sitemap and noindexed

## Environment Variables

Create `.env` in the `astro-site` directory:

```bash
# Notion API
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id

# Sentry
PUBLIC_SENTRY_DSN=your_sentry_dsn

# Resend
RESEND_API_KEY=your_resend_api_key
RESEND_AUDIENCE_ID=your_resend_audience_id
```

### GitHub Secrets

Add these to repository settings:

- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`
- `PUBLIC_SENTRY_DSN`
- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`

## Deployment

Automatically deploys to GitHub Pages on push to `master`.

**URL**: https://lukestahl.io

### Deploy Process

1. Build site with environment variables
2. Upload to GitHub Pages
3. Deploy to production

## GitHub Actions Workflows

### Deploy (`deploy.yml`)
- Triggers on push to `master` or manual
- Builds with Notion content
- Deploys to GitHub Pages

### Link Checker (`link-checker.yml`)
- Runs Mondays at 9 AM UTC
- Checks for broken links (4xx/5xx)
- Emails via Resend if issues found
- Manual trigger available

### Performance Monitor (`weekly-performance-check.yml`)
- Runs Mondays at 8 AM UTC
- Tests Core Web Vitals on key pages
- Creates GitHub issues if performance drops
- Emails via Resend
- Tracks: LCP, FID, CLS, FCP, TTFB
- Manual trigger available

## Blog Management

Add new post in Notion:

1. Create page in Notion database
2. Add: Title, Slug, Published Date, Status
3. Set Status to "Published"
4. Push to deploy
5. Live at `/blog/{slug}`

## Contact

- Website: [lukestahl.io](https://lukestahl.io)
- GitHub: [@stahlwalker](https://github.com/stahlwalker)
- LinkedIn: [Luke Stahl](https://www.linkedin.com/in/lukestahl/)
