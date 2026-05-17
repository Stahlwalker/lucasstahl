# TODO: Re-add Cloudflare Content Signals to robots.txt

## Status
Removed on 2026-05-17. Track for re-adding once validator support catches up.

## Context
`Content-Signal: ai-train=yes, search=yes, ai-input=yes` was previously on line 4 of `astro-site/public/robots.txt`. It's part of Cloudflare's Content Signals Policy (a 2025 standard) and tells Cloudflare-aware crawlers that AI training, search indexing, and AI input are all allowed for this site.

## Why it was removed
Generic SEO validators don't recognize `Content-Signal:` as a valid robots.txt directive yet and flag it as an "Unknown directive" error. This dropped the site's SEO checker score from 100 → 92.

In the meantime, the explicit `User-agent` allow blocks for GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, and Google-Extended cover most of the same intent.

## When to revisit
- When mainstream SEO validators (Lighthouse, Ahrefs, Search Console, etc.) recognize the directive
- If Cloudflare promotes the policy more aggressively and other CDNs adopt it
- If AI crawler behavior diverges from the explicit allow blocks and the signal becomes load-bearing

## How to restore
Re-add this line under `User-agent: *` in `astro-site/public/robots.txt`:

```
Content-Signal: ai-train=yes, search=yes, ai-input=yes
```

## References
- Cloudflare Content Signals Policy announcement (Sept 2025)
- Original add: see `git log -- astro-site/public/robots.txt`
