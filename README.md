# lucasstahl.com

## Overview
A modern, developer-focused personal website showcasing projects, blog posts, and technical resources. Built with Astro for optimal performance and maintainability, featuring a dark mode theme and code-aesthetic design throughout.

## Tech Stack

- **Framework**: [Astro](https://astro.build) v5.15.8
- **Deployment**: GitHub Pages
- **Analytics**: PostHog
- **Fonts**: Fira Code and Inter for code aesthetic
- **Icons**: Font Awesome 6

## Features

### Pages
- **Homepage** (`/`): Hero section with featured work, recent articles, and project highlights
- **About** (`/about`): Professional bio, skills, tech stack, and speaking engagements
- **Blog** (`/blog`): Curated collection of articles on web development, CMS platforms, AI tools, and developer marketing
- **Builds** (`/builds`): Portfolio of 20+ projects spanning React, Next.js, TypeScript, and full-stack applications
- **Gems** (`/gems`): Timeline-style resource collection with code-themed presentation
- **Handbook** (`/handbook`): Developer Marketing Handbook with insights and strategies

### Design System
- **Dark Mode Theme**: Developer-focused color palette with custom CSS variables
- **Typography**: Fira Code and Inter fonts for code aesthetic
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Code Styling**: Terminal prompts, syntax highlighting, and monospace fonts throughout
- **Animations**: Smooth transitions, hover effects, and gradient animations

### SEO & Discoverability
- `robots.txt` for search engine crawling
- `sitemap.xml` with all pages
- `llms.txt` for AI discoverability
- Open Graph and Twitter Card meta tags
- Canonical URLs

## Project Structure

```
lucasstahl/
└── astro-site/              # Astro project root
    ├── src/
    │   ├── pages/           # Astro pages (routes)
    │   │   ├── index.astro  # Homepage
    │   │   ├── about.astro  # About page
    │   │   ├── blog.astro   # Blog feed
    │   │   ├── builds.astro # Project portfolio
    │   │   ├── gems.astro   # Resources timeline
    │   │   └── handbook.astro # Developer Marketing Handbook
    │   ├── layouts/
    │   │   └── Layout.astro # Base layout with meta tags
    │   └── components/
    │       ├── Navbar.astro # Navigation component
    │       ├── Footer.astro # Footer component
    │       └── posthog.astro # Analytics tracking
    ├── public/              # Static assets (copied to dist)
    │   ├── assets/
    │   │   ├── css/        # Stylesheets
    │   │   └── images/     # Site images
    │   ├── robots.txt      # Search engine instructions
    │   ├── sitemap.xml     # Site structure for SEO
    │   ├── llms.txt        # AI discoverability
    │   └── .nojekyll       # Disable Jekyll on GitHub Pages
    ├── DARK_MODE_COLOR_REFERENCE.md  # Color palette reference
    ├── package.json
    └── astro.config.mjs
```

## Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Setup
```bash
cd astro-site
npm install
```

### Development Server
```bash
npm run dev
```
Starts the development server at `http://localhost:4321` (default Astro port)

### Build
```bash
npm run build
```
Builds the site for production to the `dist/` directory

### Preview Build
```bash
npm run preview
```
Preview the production build locally

## Deployment

This site is deployed to GitHub Pages from the `master` branch. The deployment process:

1. Make changes to source files in `astro-site/src/` or `astro-site/public/`
2. Commit and push to the `master` branch
3. GitHub Pages automatically serves the site from the repository

**Note**: Static files in `public/` are served directly. For Astro components, you may need to run a build process depending on your GitHub Pages configuration.

## Design Highlights

### Color Palette (Navy Blue Theme)
- Primary Background: `#0a1128`
- Secondary Background: `#0f1a35`
- Tertiary Background: `#162544`
- Text Primary: `#e4e4e7`
- Text Secondary: `#a1a1aa`
- Accent Blue: `#60a5fa`
- Accent Purple: `#818cf8`
- Code Keyword: `#c792ea`
- Code String: `#c3e88d`

### Key Components
- Boxed social icons with hover effects
- Timeline layout with vertical markers and line numbers
- Code-style resource titles (`let ResourceName = {`)
- Comment-style descriptions (`// description... };`)
- Gradient backgrounds with animated shapes
- Responsive navigation with mobile hamburger menu

## Maintenance
This project is actively maintained by Luke Stahl.

## License
© 2025 Luke Stahl. All rights reserved.
