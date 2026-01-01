# Content Management

This directory contains the **single source of truth** for all static content on the site.

## How It Works

All static content is defined once in `content.ts` and automatically appears in:
- Your site pages (builds.astro, gems.astro, blog.astro)
- Your search index (searchIndex.ts)

## Adding New Content

### Adding a New Build

1. Open `src/data/content.ts`
2. Add your new project to the `builds` array:

```typescript
{
  title: "My New Project",
  description: "What your project does...",
  url: "https://your-project-url.com/",
  tags: ["React", "TypeScript"],
  icon: "fa-solid fa-code"  // Font Awesome icon class
}
```

3. The project will automatically appear:
   - On your /builds/ page (once you update builds.astro to use content.ts)
   - In your site search

### Adding a New Tiny App

Add to the `tinyApps` array in `content.ts`:

```typescript
{
  title: "My Tiny App",
  description: "What it does...",
  url: "https://app-url.com/",
  tags: ["JavaScript", "API"]
}
```

### Adding a New External Blog Post

Add to the `externalBlogPosts` array in `content.ts`:

```typescript
{
  title: "My Article Title",
  description: "Brief description of the article...",
  url: "https://site.com/blog/article",
  tags: ["AI", "Development"],
  date: "Jan 15, 2025"
}
```

### Adding a New Gem

Add to the `gems` array in `content.ts`:

```typescript
{
  title: "Useful Tool",
  description: "What makes this tool useful...",
  url: "https://tool-url.com/",
  tags: ["Tools", "Productivity"]
}
```

## Important Notes

- **Notion blog posts** are still managed in Notion and pulled automatically via API
- **Only static content** (manually added builds, gems, external posts) needs to be in `content.ts`
- After adding content, search will automatically update - no manual sync needed!
- Make sure to keep descriptions clear and tags relevant for better search results

## File Structure

```
src/data/
  ├── content.ts          # Single source of truth for all static content
  └── README.md           # This file
```

## Questions?

If you're unsure whether something should go in `content.ts`, ask yourself:
- Is it manually added to the site? → Yes, add it to content.ts
- Does it come from Notion? → No, it's already automatic via the API
