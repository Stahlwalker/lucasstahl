# Project Context

This file provides context and guidelines for working on this project.

## Project Overview

Personal website and blog for Luke Stahl, deployed at lukestahl.io. The site features:

- Blog posts managed in Notion CMS and synced on build
- Automated monitoring and performance checks
- Dark/light mode support
- SEO optimizations with OpenGraph, JSON-LD structured data
- RSS feed and sitemap generation
- Weekly link checking and Core Web Vitals monitoring
- Email alerts for broken links and performance issues

## Tech Stack

- **Framework**: Astro v5.15.8
- **CMS**: Notion API with notion-to-md
- **Error Tracking**: Sentry (10% sample rate in production)
- **Analytics**: PostHog
- **Email**: Resend
- **Domain Management**: Cloudflare
- **Deployment**: GitHub Pages via GitHub Actions
- **Key Dependencies**:
  - marked (Markdown parsing)
  - fuse.js (Search functionality)
  - motion (Animations)
  - Giscus (Blog comments)

## Coding Style

- Write concise, functional code with optimized performance, early return error handling, and descriptive naming
- See `.claude/rules/coding-style.md` for detailed guidelines on architecture, testing, security, and methodology

### Running Locally

All development work happens in the `astro-site` directory. You must cd into it first:

```bash
cd astro-site
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:4321
npm run build        # Build to ./dist/
npm run preview      # Preview build locally
```

**Important**: Always `cd astro-site` before running any npm commands.

## Architecture

- **Static Site Generation**: Astro builds the entire site at build time (SSG), no server-side rendering
- **Notion Content Flow**: Blog posts are fetched from Notion API during build via `@notionhq/client` and converted to markdown using `notion-to-md`
- **Blog Routing**: Dynamic routes at `/blog/[slug].astro` map to Notion page slugs
- **Build Process**: Standard build + postbuild step that copies `sitemap-0.xml` to `sitemap.xml` and removes sitemap index
- **Deployment Flow**: Push to master → GitHub Actions builds with Notion content → deploys to GitHub Pages → Cloudflare DNS
- **Monitoring Architecture**:
  - Sentry for error tracking (10% sample rate)
  - PostHog for analytics
  - Weekly automated checks via GitHub Actions (link checker, Core Web Vitals)
  - Resend for email alerts
- **Project Structure**: Monorepo with `astro-site/` containing the full Astro app, `docs/` for project documentation

## Instructions for Claude

- **Writing Style**: When generating page content, documentation, or site copy, always reference `docs/Lukes-Developer-Writing-Style.md` for tone, style, and formatting guidelines (Note: blog posts are written by Luke in Notion)
- NEVER commit .env files
- Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.
