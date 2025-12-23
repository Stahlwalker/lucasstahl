# lucasstahl.com

Personal website and blog for Luke Stahl.

Built with Astro v5, Notion CMS, deployed to GitHub Pages.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v5.16.0
- **CMS**: [Notion](https://www.notion.so/)
- **Error Tracking**: [Sentry](https://sentry.io/)
- **Analytics**: [PostHog](https://posthog.com/)
- **Deployment**: GitHub Pages via GitHub Actions
- **Email**: [Resend](https://resend.com/)

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
    │   │   └── handbook.astro
    │   ├── layouts/         # Layout components
    │   └── lib/             # Utilities (Notion API)
    ├── public/              # Static assets
    │   └── assets/
    │       ├── css/
    │       └── images/
    ├── .github/
    │   └── workflows/       # GitHub Actions
    └── package.json
```

## Features

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

**URL**: https://lucasstahl.com

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

- Website: [lucasstahl.com](https://lucasstahl.com)
- GitHub: [@stahlwalker](https://github.com/stahlwalker)
- LinkedIn: [Luke Stahl](https://www.linkedin.com/in/lukestahl/)
