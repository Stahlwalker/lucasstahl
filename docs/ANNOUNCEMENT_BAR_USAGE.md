# Announcement Bar Usage Guide

The announcement bar appears above the navbar and is perfect for highlighting important news, new blog posts, speaking engagements, or special announcements.

## Features

- ✅ Dismissible with close button (persists in localStorage)
- ✅ Entire bar is clickable (like Netlify's announcement style)
- ✅ Simple "New: [message]" format with arrow
- ✅ Smooth animations (slide down on load, slide up on dismiss)
- ✅ Dark/light mode support
- ✅ Fully responsive
- ✅ Easy toggle on/off per page

## How to Use

### Enable on a Specific Page

In any `.astro` page file that uses the Layout component:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout
  title="Your Page Title"
  showAnnouncement={true}
  announcementMessage="New: Speaking at Webflow Conf 2025 on September 18th"
  announcementLink="/about/"
  announcementId="webflow-conf-2025"
>
  <!-- Your page content -->
</Layout>
```

### Enable Site-Wide

To show the announcement on all pages, update the default values in `Layout.astro` (lines 35-38):

```astro
const {
  // ... other props
  showAnnouncement = true,  // Change to true
  announcementMessage = "New: Blog post on Markdown + AI for modern websites",
  announcementLink = "/blog/markdown-vs-cms/",
  announcementId = "announcement-1"
} = Astro.props;
```

### Announcement ID

The `announcementId` is important for dismissal tracking:

- Each unique announcement should have a unique ID
- Once dismissed, users won't see that specific announcement again
- Change the ID when you update the announcement message to show it again to users who dismissed the previous one

**Example IDs:**
- `"announcement-1"`
- `"webflow-conf-2025"`
- `"new-blog-post-jan-2025"`
- `"speaking-event-sept"`

## Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `showAnnouncement` | boolean | No | `false` | Toggle announcement bar on/off |
| `announcementMessage` | string | Yes* | `""` | Main announcement text (e.g., "New: [your message]") |
| `announcementLink` | string | No | `""` | URL to link to (entire bar becomes clickable) |
| `announcementId` | string | Yes* | `"announcement-1"` | Unique ID for dismissal tracking |

*Required when `showAnnouncement` is `true`

## Examples

### Simple Text Announcement (No Link)

```astro
<Layout
  showAnnouncement={true}
  announcementMessage="Site maintenance scheduled for Jan 15th, 2025"
  announcementId="maintenance-jan-2025"
>
```

### Announcement with Link

```astro
<Layout
  showAnnouncement={true}
  announcementMessage="New: Blog post on Markdown vs CMS"
  announcementLink="/blog/markdown-vs-cms/"
  announcementId="blog-post-jan-2025"
>
```

### External Link

```astro
<Layout
  showAnnouncement={true}
  announcementMessage="New: Watch my talk from Webflow Conf 2025"
  announcementLink="https://www.youtube.com/watch?v=KtXlsaPwS2U"
  announcementId="webflow-conf-video"
>
```

## Styling

The announcement bar automatically adapts to your site's dark/light theme. Styles are defined in `/src/components/AnnouncementBar.astro`.

**Colors:**
- Dark mode: Blue/purple gradient with light text
- Light mode: Softer blue gradient with dark text
- CTA button: Blue accent (matches site design)

## Testing

To test the announcement bar:

1. Enable it on a page
2. Visit the page - you should see the announcement slide down
3. Click the X button to dismiss
4. Refresh the page - announcement should stay hidden
5. Clear localStorage or change the `announcementId` to see it again

**Clear dismissed announcements:**
```javascript
// In browser console:
localStorage.removeItem('dismissedAnnouncements');
```

## Best Practices

1. **Use "New:" prefix**: Start messages with "New:" like Netlify for consistency
2. **Keep it concise**: Announcement messages should be short (1-2 sentences max)
3. **Use unique IDs**: Change the ID whenever you update the message
4. **Don't overuse**: Only show announcements for truly important updates
5. **Test on mobile**: The bar is responsive but always test on small screens
6. **Update regularly**: Remove old announcements by setting `showAnnouncement={false}`
7. **Entire bar is clickable**: When you provide a link, the whole bar becomes interactive (no separate button needed)
