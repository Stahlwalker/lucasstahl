# Dark Mode Color Reference

This file contains the original midnight blue dark mode color scheme for reference.

## Original Midnight Blue Colors

These were the original dark mode colors before switching to the navy blue variant:

```css
:root {
    /* Dark mode colors (default) - Original Midnight Blue */
    --bg-primary: #0a0e27;
    --bg-secondary: #151932;
    --bg-tertiary: #1e2442;
    --text-primary: #e4e4e7;
    --text-secondary: #a1a1aa;
    --accent-primary: #60a5fa;
    --accent-secondary: #818cf8;
    --accent-yellow: #fbbf24;
    --accent-green: #34d399;
    --accent-blue: #60a5fa;
    --accent-purple: #a855f7;
    --code-keyword: #c792ea;
    --code-string: #c3e88d;
    --code-property: #82aaff;
    --code-comment: #697098;
}
```

## Current Navy Blue Colors

The current dark mode colors (as of December 6, 2025):

```css
:root {
    /* Dark mode colors (default) - Navy blue */
    --bg-primary: #0a1128;
    --bg-secondary: #0f1a35;
    --bg-tertiary: #162544;
    --text-primary: #e4e4e7;
    --text-secondary: #a1a1aa;
    --accent-primary: #60a5fa;
    --accent-secondary: #818cf8;
    --accent-yellow: #fbbf24;
    --accent-green: #34d399;
    --accent-blue: #60a5fa;
    --accent-purple: #a855f7;
    --code-keyword: #c792ea;
    --code-string: #c3e88d;
    --code-property: #82aaff;
    --code-comment: #697098;
}
```

## Differences

The main differences are in the background colors:
- `--bg-primary`: `#0a0e27` → `#0a1128` (more blue, less purple)
- `--bg-secondary`: `#151932` → `#0f1a35` (darker, more blue)
- `--bg-tertiary`: `#1e2442` → `#162544` (more saturated blue)

All other colors (text, accents, code highlighting) remain the same.

## Location

The dark mode colors are defined in:
`/astro-site/public/assets/css/dark-mode.css`
