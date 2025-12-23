# lucasstahl.com

Personal website and blog for Luke Stahl - Developer Marketer.

Built with Astro v5, Notion CMS, and deployed to GitHub Pages.

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build/) v5.16.0
- **CMS**: [Notion](https://www.notion.so/) for blog content management
- **Error Tracking**: [Sentry](https://sentry.io/) for production monitoring
- **Analytics**: [PostHog](https://posthog.com/) for web analytics
- **Deployment**: GitHub Pages via GitHub Actions
- **Email Notifications**: [Resend](https://resend.com/) for automated alerts

## 📁 Project Structure

```text
/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and static files
│   ├── layouts/        # Page layouts
│   ├── lib/            # Utilities (Notion API client)
│   └── pages/          # Route pages
│       ├── blog/       # Blog posts (dynamic from Notion)
│       ├── about.astro
│       ├── builds.astro
│       ├── gems.astro
│       ├── handbook.astro
│       └── index.astro
├── .github/
│   └── workflows/      # GitHub Actions workflows
└── package.json
```

## ✨ Key Features

### Content Management
- **Notion CMS Integration**: Blog posts are managed in Notion and automatically synced on build
- **RSS Feed**: Auto-generated RSS feed at `/rss.xml`
- **Sitemap**: Auto-generated sitemap with proper canonical URLs and noindex filtering
- **llms.txt**: LLM-optimized site documentation

### Monitoring & Analytics
- **Sentry Error Tracking**: Production-only error monitoring with 10% sampling rate
- **PostHog Analytics**: Web analytics and user behavior tracking
- **Giscus Comments**: GitHub-based commenting system for blog posts

### Automated Workflows
- **Link Checker**: Weekly scan for broken links with Slack/email notifications
- **Core Web Vitals Monitoring**: Weekly performance checks with automated GitHub issue creation
- **Email Notifications**: Resend integration for workflow alerts

### SEO & Performance
- Canonical URL management with trailing slash normalization
- OpenGraph and Twitter Card meta tags
- Structured data (JSON-LD) for blog posts
- Optimized sitemap generation
- Dark/light mode support

## 🧞 Commands

All commands are run from the `astro-site` directory:

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro ...` | Run Astro CLI commands |
| `npm run astro -- --help` | Get help with Astro CLI |

## 🔧 Environment Variables

Create a `.env` file in the `astro-site` directory:

```bash
# Notion API
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id

# Sentry (production only)
PUBLIC_SENTRY_DSN=your_sentry_dsn

# Resend (for email notifications)
RESEND_API_KEY=your_resend_api_key
RESEND_AUDIENCE_ID=your_resend_audience_id
```

### GitHub Secrets

Add these secrets to your GitHub repository settings for workflows:

- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`
- `PUBLIC_SENTRY_DSN`
- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`

## 🚢 Deployment

The site automatically deploys to GitHub Pages via GitHub Actions on every push to `master`.

**Deployment URL**: https://lucasstahl.com

### Deployment Workflow

1. Builds Astro site with production environment variables
2. Uploads build artifacts to GitHub Pages
3. Deploys to production

## 🔗 GitHub Actions Workflows

### Deploy (`deploy.yml`)
- Triggers on push to `master` or manual dispatch
- Builds site with Notion content
- Deploys to GitHub Pages

### Link Checker (`link-checker.yml`)
- Runs weekly on Mondays at 9 AM UTC
- Scans all pages for broken links (HTTP 4xx/5xx)
- Sends email notifications via Resend if issues found
- Can be manually triggered

### Performance Monitor (`weekly-performance-check.yml`)
- Runs weekly on Mondays at 8 AM UTC
- Tests Core Web Vitals on key pages
- Creates GitHub issues automatically if performance degrades
- Sends email notifications via Resend
- Tracks metrics: LCP, FID, CLS, FCP, TTFB
- Can be manually triggered

## 📝 Blog Management

Blog posts are managed in Notion. To add a new post:

1. Create a new page in the Notion database
2. Fill in required properties: Title, Slug, Published Date, Status
3. Set Status to "Published"
4. Push to trigger a new deployment
5. Post will be live at `/blog/{slug}`

## 🎨 Customization

### Adding New Pages
Create new `.astro` files in `src/pages/` - they'll automatically become routes.

### Updating Styles
Page-specific CSS is in `public/assets/css/` and linked via `additionalCss` prop in Layout components.

### Dark Mode
Dark mode toggle is available site-wide with theme persistence via localStorage.

## 🔍 SEO Configuration

All pages use the `Layout.astro` component which handles:
- Title and meta descriptions
- Canonical URLs (with trailing slash normalization)
- OpenGraph tags
- Twitter Card tags
- Custom OG images
- Structured data for blog posts

## 📬 Contact

- Website: [lucasstahl.com](https://lucasstahl.com)
- GitHub: [@stahlwalker](https://github.com/stahlwalker)
- LinkedIn: [Luke Stahl](https://www.linkedin.com/in/lukestahl/)
