# check-seo Examples

## Example 1: Check any page (homepage)

```bash
/check-seo astro-site/src/pages/index.astro
```

Analyzes your homepage for SEO best practices.

## Example 2: Check a new page (builds, gems, handbook, etc.)

```bash
/check-seo astro-site/src/pages/builds.astro
/check-seo astro-site/src/pages/gems.astro
/check-seo astro-site/src/pages/about.astro
```

Works for any page on your site - especially useful for newly created pages.

## Example 3: Check a blog post

```bash
/check-seo astro-site/src/pages/blog/[slug].astro
```

Reviews the blog post template for SEO elements.

## Example 4: Check live URL

```bash
/check-seo https://lukestahl.io/blog/my-latest-post
```

Analyzes the live page (useful after deployment).

## Example 5: Interactive check

```bash
/check-seo
```

You'll be prompted to specify which page to analyze.

## Sample Output

```
SEO Score: Good (8/10)

Critical Issues: None

Warnings:
- Meta description is 175 characters (recommended: 150-160)
- Missing og:image:width and og:image:height properties
- H1 tag contains 12 words (recommended: 6-8 for better impact)

Optimizations:
- Consider adding FAQ schema for the Q&A section
- Internal link to related blog posts for better navigation
- Add "published" and "modified" dates to JSON-LD

Summary:
1. Trim meta description to 155 characters
2. Add og:image dimensions (1200x630)
3. Tighten H1 headline
4. Add FAQ schema markup
5. Link to 2-3 related posts

Overall: Strong SEO foundation. Minor tweaks will improve click-through rates and search visibility.
```

## What gets checked

**Meta Tags:**
```html
<title>Optimized Title | Luke Stahl</title>
<meta name="description" content="Compelling 155-char description">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:url" content="...">
<meta name="twitter:card" content="summary_large_image">
```

**Structured Data:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "...",
  "author": {...},
  "datePublished": "...",
  ...
}
</script>
```

**Technical Elements:**
```html
<link rel="canonical" href="https://lukestahl.io/page/">
<h1>Single, Clear Heading</h1>
<img src="..." alt="Descriptive alt text">
```
