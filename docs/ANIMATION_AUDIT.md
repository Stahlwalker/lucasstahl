# Animation Audit — lukestahl.io vs Emil Design-Engineering Rules

Reviewed against [Emil Kowalski's design-engineering philosophy](https://animations.dev/).

---

## Findings

| Before | After | Why | File(s) |
|--------|-------|-----|---------|
| `transition: all 0.3s ease` (×40+ instances) | `transition: transform 0.2s ease-out, opacity 0.2s ease-out` | `all` forces the browser to watch every property for changes on every frame — causes layout recalc on every hover | `about.css`, `builds.css`, `blog.css`, `gems.css`, `dark-mode.css`, `design-system.css`, `status.css` |
| `transition: all 1s` on `img, #portImg, #portImgAbout` | Delete it | Dead selectors + 1s with `all` on images is worst-case perf scenario | `style.css` L254–274 |
| No `prefers-reduced-motion` guard anywhere | Single block in `dark-mode.css` (global): see snippet below | Zero coverage across 10 CSS files — this causes real harm for vestibular disorders | **Every file** |
| `animation: fadeInUp 0.8s ease-out` (hero, blog, builds, status) | `animation: fadeInUp 0.4s ease-out both` | 800ms is ~3× over the 300ms ceiling for UI animations; `both` properly fills start/end states | `dark-mode.css`, `about.css`, `builds.css`, `blog.css`, `status.css` |
| `animation: fadeInUp 1s ease-out` (hero section) | `animation: fadeInUp 0.4s ease-out both` | 1000ms — almost a full second before the hero is readable | `dark-mode.css` L260 |
| `animation: fadeInLeft 0.6s ease forwards` | `animation: fadeInLeft 0.4s ease-out both` | `ease` on an enter animation starts slow — the wrong direction; `ease-out` gives instant motion | `gems.css` L309 |
| No `:active` state on `.btn-modern`, `.btn-primary`, `.build-card` | `.btn-modern:active { transform: scale(0.97); transition-duration: 50ms; }` | Buttons with no press feedback feel broken — the interface doesn't acknowledge the tap | `dark-mode.css`, `design-system.css`, `builds.css` |
| All hover rules unguarded: `.card:hover { transform: ... }` | Wrap in `@media (hover: hover) and (pointer: fine)` | Touch devices get a sticky hover state after tap; the cursor glow already guards this in JS — CSS needs the same | All files with `:hover` transitions |
| `@keyframes fadeInUp { from { translateY(40px) } }` | `from { opacity: 0; transform: translateY(12px); }` | 40px of travel makes elements appear to fall from the sky — 12–16px is enough for direction without theatrics | `gems.css` |
| `.gem-card:hover { animation: bounce 1s ease infinite }` | `animation: bounce 0.4s ease-out 1` (play once) | `infinite` on a hover means the element bounces forever while the cursor dwells — it never settles | `gems.css` L45 |
| `transition: transform 0.5s ease` on `.blog-thumbnail img` | `transition: transform 0.25s ease-out` | 500ms for an image scale-on-hover is sluggish; `ease` makes it start even slower | `blog.css` L224 |
| `transition: width 0.6s, height 0.6s` on ripple | `transition: width 0.3s ease-out, height 0.3s ease-out` | 600ms ripple outlasts the tap by ~3× | `dark-mode.css` L480 |

---

## `prefers-reduced-motion` Fix

Add this single block to `dark-mode.css` — it's loaded globally and covers the entire site:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Priority Order

| Done | # | Fix | Effort | ROI |
|------|---|-----|--------|-----|
| ✅ | P0 | Add `prefers-reduced-motion` block to `dark-mode.css` | 8 lines | Covers entire site instantly |
| ⏭ | P0 | Replace `transition: all` → specific properties sitewide | ~1hr | Removes layout thrash on every hover |
| ✅ | P1 | Halve all `0.8s`/`1s` enter animations to `0.4s` | 15 min | Site will feel noticeably faster to load |
| ✅ | P1 | Add `:active { transform: scale(0.97) }` to all buttons/cards | 20 min | Biggest perceived quality boost on mobile |
| ✅ | P2 | Wrap hover rules in `(hover: hover) and (pointer: fine)` | 1hr | Fixes sticky-hover on iOS |
| ✅ | P2 | `ease` → `ease-out` on remaining enter animations | 10 min | Polish |
| ✅ | P3 | `translateY(40px)` → `translateY(12px)` in keyframes | 5 min | Less theatrical |
| ⏭ | P3 | Fix infinite bounce on gem card hover | 2 min | Never-settling animation is distracting |

---

## Reference — Emil's Duration Targets

| Element | Target Duration |
|---------|----------------|
| Button press feedback | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modals, drawers | 200–500ms |
| Page-load / hero animations | Under 400ms |

## Reference — Easing Decision

| Situation | Easing |
|-----------|--------|
| Element entering / appearing | `ease-out` |
| Element moving on screen | `ease-in-out` |
| Hover / color change | `ease` |
| Constant motion (marquee, progress) | `linear` |
| Default | `ease-out` |

Custom curves with more punch:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```
