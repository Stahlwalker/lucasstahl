---
name: check-seo
description: Analyzes any page (homepage, blog posts, new pages) for SEO best practices including meta tags, structured data, and technical SEO. Use when checking SEO compliance or optimizing pages.
---

When checking SEO, always:

1. **Get the page** - Ask for file path or URL if not provided
2. **Read the page source** - Load the Astro/HTML file
3. **Analyze thoroughly**:
   - **Meta Tags**: Title (50-60 chars), description (150-160 chars), OpenGraph, Twitter Cards
   - **Structured Data**: JSON-LD, Schema.org markup, Article/BlogPosting schema
   - **Technical SEO**: Canonical URLs, H1/H2/H3 hierarchy, image alt text, internal links
   - **Content Quality**: Natural keyword usage, readability, mobile-friendliness
4. **Prioritize issues** by impact (Critical → Warnings → Optimizations)
5. **Provide specific fixes** with code examples

## Output Format

- **SEO Score**: Overall rating (Good/Needs Improvement/Critical Issues)
- **Critical Issues**: Must-fix problems (empty if none)
- **Warnings**: Recommended improvements
- **Optimizations**: Nice-to-have enhancements
- **Summary**: Prioritized action items

Always provide specific, actionable recommendations with code examples where applicable.
