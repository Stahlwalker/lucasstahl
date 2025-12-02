# Domain Migration Guide: lucasstahl.com → lukestahl.io

This guide outlines everything needed to migrate from lucasstahl.com to lukestahl.io while maintaining SEO and ensuring proper HTTPS setup.

---

## 1. Before Purchasing the Domain

### Things to Verify:
- ✅ Check if lukestahl.io is actually available
- ✅ Decide if you want to make .io your primary or keep .com as primary
- ✅ Consider SEO implications (changing primary domains can temporarily affect rankings)
- ✅ Budget for maintaining both domains for 6-12 months during transition

---

## 2. After Purchasing - Technical Setup

### A. DNS & Hosting Setup

Since you're using GitHub Pages:

1. Add lukestahl.io to GitHub Pages settings
2. Configure DNS records at your domain registrar:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```
3. Optional: Add CNAME for www subdomain
   ```
   Type: CNAME
   Name: www
   Value: lukestahl.io
   ```
4. Update CNAME file in repo root to new domain

### B. HTTPS/SSL Certificate

**Good news:** HTTPS is automatic and free!

- GitHub Pages provides **automatic SSL** for custom domains
- Certificate is issued via Let's Encrypt
- Takes ~24 hours after DNS propagation
- **No cost, no configuration needed**

**What to do:**
1. Wait 24-48 hours after DNS setup
2. Go to GitHub Pages settings
3. Enable "Enforce HTTPS" toggle once cert is ready

If using a different host (Vercel, Netlify, Cloudflare Pages):
- They all provide free automatic SSL
- Same process: wait for cert, then enable

---

## 3. Redirects - CRITICAL for SEO

You need **301 redirects** (permanent) from lucasstahl.com → lukestahl.io

### Option 1: DNS-level redirect (easiest)

Most domain registrars offer URL forwarding:
- lucasstahl.com → lukestahl.io (301 redirect)
- www.lucasstahl.com → lukestahl.io (301 redirect)

Check your registrar's documentation for "URL forwarding" or "domain forwarding"

### Option 2: Cloudflare Page Rules (recommended for better control)

1. Sign up for Cloudflare (free tier)
2. Point lucasstahl.com DNS to Cloudflare
3. Create Page Rule:
   ```
   URL Pattern: lucasstahl.com/*
   Setting: Forwarding URL (301 - Permanent Redirect)
   Destination: https://lukestahl.io/$1
   ```

This preserves the full path: lucasstahl.com/blog/post → lukestahl.io/blog/post

### Option 3: HTML redirect (fallback)

If other options don't work, create a simple HTML page:

```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=https://lukestahl.io">
    <link rel="canonical" href="https://lukestahl.io" />
    <script>window.location.href = "https://lukestahl.io" + window.location.pathname;</script>
</head>
<body>
    <p>Redirecting to <a href="https://lukestahl.io">lukestahl.io</a>...</p>
</body>
</html>
```

**⚠️ Important:** Redirects must preserve the full URL path for proper SEO!

---

## 4. Code Changes Needed

### Files to Update:

#### 1. `/CNAME` (in root of dist/public)
```
lukestahl.io
```

#### 2. `/astro-site/astro.config.mjs`
```javascript
export default defineConfig({
  site: 'https://lukestahl.io',
  // ... rest of config
});
```

#### 3. All canonical URLs in pages
Search for `canonicalUrl` in your codebase and update:
```astro
// Old
canonicalUrl="https://lucasstahl.com/about"

// New
canonicalUrl="https://lukestahl.io/about"
```

#### 4. Layout.astro (if base URLs are hardcoded)
Update any hardcoded references to lucasstahl.com

#### 5. Social meta tags
Update og:url tags in your layout:
```astro
<meta property="og:url" content="https://lukestahl.io/..." />
```

#### 6. robots.txt
Update sitemap URL:
```
Sitemap: https://lukestahl.io/sitemap.xml
```

### Files that auto-update:
- ✅ sitemap.xml (updates based on astro.config.mjs)
- ✅ RSS feed (if using astro.config site value)

---

## 5. SEO Considerations

### To Minimize SEO Impact:

#### A. Set up 301 redirects (MOST IMPORTANT!)
- Every page on lucasstahl.com must redirect to its equivalent on lukestahl.io
- Path must be preserved: /about → /about, not just → homepage
- Keep redirects active for 6-12 months minimum

#### B. Update Google Search Console
1. Add lukestahl.io as new property
2. Verify ownership
3. Submit new sitemap (https://lukestahl.io/sitemap.xml)
4. Use "Change of Address" tool if available
5. Monitor for any crawl errors

#### C. Update External Links (where possible)
Update your links on:
- LinkedIn profile
- GitHub profile
- Twitter/X bio
- Dev.to profile
- Medium profile
- Any backlinks you control
- Email signatures
- Business cards

#### D. Monitor Rankings
- Use Google Search Console to track position changes
- Expect some temporary fluctuation (2-4 weeks)
- Rankings should stabilize after 4-6 weeks

### Timeline for SEO Recovery:
- Week 1-2: Initial indexing of new domain
- Week 2-4: Possible ranking fluctuations
- Week 4-8: Rankings stabilize
- Month 3-6: Full transition complete

---

## 6. HTTPS Impact - None! ✅

**You'll have HTTPS on lukestahl.io automatically**

- GitHub Pages auto-provisions SSL
- Free via Let's Encrypt
- Auto-renews every 90 days
- No configuration or cost

**The only requirement:**
- Wait 24-48 hours after DNS setup for cert to provision
- Enable "Enforce HTTPS" in GitHub Pages settings
- All traffic will use HTTPS

---

## 7. Recommended Migration Approach

### Phase 1: Purchase & Setup (Day 1)
- [ ] Purchase lukestahl.io
- [ ] Point DNS to GitHub Pages
- [ ] Wait for DNS propagation (24-72 hours)

### Phase 2: SSL Setup (Day 2-3)
- [ ] Wait for SSL certificate to auto-provision
- [ ] Enable "Enforce HTTPS" in GitHub settings
- [ ] Test https://lukestahl.io loads correctly

### Phase 3: Code Updates (Day 3-4)
- [ ] Update CNAME file
- [ ] Update astro.config.mjs
- [ ] Update all canonical URLs
- [ ] Update social meta tags
- [ ] Update robots.txt
- [ ] Build and deploy
- [ ] Test site thoroughly on new domain

### Phase 4: Redirects Setup (Day 4-5)
- [ ] Set up 301 redirects from .com → .io
- [ ] Test every major page redirects correctly
- [ ] Test that paths are preserved (not just → homepage)
- [ ] Test both http:// and https:// redirect properly
- [ ] Test www.lucasstahl.com redirects

### Phase 5: SEO & External Updates (Week 1)
- [ ] Add lukestahl.io to Google Search Console
- [ ] Verify ownership
- [ ] Submit new sitemap
- [ ] Use "Change of Address" tool (if available)
- [ ] Update LinkedIn URL
- [ ] Update GitHub profile URL
- [ ] Update Twitter/X bio
- [ ] Update other social profiles
- [ ] Update email signature

### Phase 6: Monitoring (Months 1-12)
- [ ] Monitor Google Search Console for errors
- [ ] Check rankings weekly
- [ ] Keep redirects active on lucasstahl.com
- [ ] Maintain ownership of lucasstahl.com
- [ ] After 12 months, can consider letting .com expire (but keep redirect if possible)

---

## 8. Quick Checklist

### Before You Buy:
- [ ] Confirm lukestahl.io is available
- [ ] Decide if this is truly what you want (difficult to reverse for SEO)
- [ ] Budget for both domains for ~1 year (~$20-40 total)
- [ ] Consider the branding implications (.io vs .com)

### Immediately After Purchase:
- [ ] Configure DNS records
- [ ] Wait for SSL certificate
- [ ] Test new domain loads

### Code Deployment:
- [ ] Update all code references (see Section 4)
- [ ] Build and test locally
- [ ] Deploy to production
- [ ] Verify new domain works

### SEO Protection:
- [ ] Set up 301 redirects (CRITICAL!)
- [ ] Update Google Search Console
- [ ] Update external profile links
- [ ] Monitor rankings for 2-3 months

### Long-term Maintenance:
- [ ] Keep redirects active for 6-12 months
- [ ] Renew both domains during transition
- [ ] Monitor analytics and search console

---

## 9. Common Pitfalls to Avoid

❌ **DON'T:**
- Launch new domain without 301 redirects (will lose all SEO)
- Point old domain to a 404 page
- Use 302 (temporary) redirects instead of 301 (permanent)
- Redirect all pages to homepage only (preserve paths!)
- Let old domain expire during first year

✅ **DO:**
- Set up proper 301 redirects before switching
- Preserve full URL paths in redirects
- Keep both domains active during transition
- Update Google Search Console immediately
- Monitor rankings closely for first 2 months

---

## 10. Cost Breakdown

| Item | Cost | Frequency |
|------|------|-----------|
| lukestahl.io domain | ~$30-50 | Per year |
| lucasstahl.com renewal | ~$15-20 | Per year (during transition) |
| SSL Certificate | **FREE** | Auto-renews |
| Hosting (GitHub Pages) | **FREE** | N/A |
| Cloudflare (optional) | **FREE** | Free tier available |
| **Total Year 1** | **~$45-70** | One-time + renewals |

After 12 months, you can let lucasstahl.com expire (but maintain redirect if you keep ownership).

---

## 11. Testing Checklist

After migration, test these:

### Functionality Tests:
- [ ] Homepage loads on lukestahl.io
- [ ] All internal links work
- [ ] Blog posts load correctly
- [ ] Images display properly
- [ ] Search functionality works
- [ ] Contact form works (if applicable)
- [ ] Theme switcher works
- [ ] Navigation works

### Redirect Tests:
- [ ] lucasstahl.com → lukestahl.io
- [ ] www.lucasstahl.com → lukestahl.io
- [ ] lucasstahl.com/about → lukestahl.io/about
- [ ] lucasstahl.com/blog/post → lukestahl.io/blog/post
- [ ] http://lucasstahl.com → https://lukestahl.io (HTTP to HTTPS)

### SEO Tests:
- [ ] Sitemap accessible at /sitemap.xml
- [ ] robots.txt accessible and correct
- [ ] Canonical URLs point to new domain
- [ ] Meta tags reference new domain
- [ ] Google Search Console shows new domain
- [ ] Old URLs return 301 status codes

### HTTPS Tests:
- [ ] SSL certificate is valid
- [ ] No mixed content warnings
- [ ] All resources load over HTTPS
- [ ] HTTP redirects to HTTPS automatically

---

## 12. Rollback Plan (If Something Goes Wrong)

If issues arise:

1. **Immediate Rollback:**
   - Point lukestahl.io DNS away from your site
   - Keep lucasstahl.com active
   - No SEO damage if caught quickly

2. **Partial Issues:**
   - Keep both domains live
   - Fix issues on new domain
   - Don't redirect until fully working

3. **Post-Launch Issues:**
   - Monitor Search Console for errors
   - Fix any broken redirects immediately
   - Update sitemap if pages are missing

---

## 13. Resources & Tools

### DNS/Domain Tools:
- [Google DNS Checker](https://dns.google/)
- [DNS Propagation Checker](https://www.whatsmydns.net/)
- [SSL Certificate Checker](https://www.ssllabs.com/ssltest/)

### SEO Tools:
- [Google Search Console](https://search.google.com/search-console)
- [Redirect Checker](https://httpstatus.io/)
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/) (free tier)

### GitHub Pages:
- [GitHub Pages Custom Domain Docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

## Questions or Issues?

If you encounter problems during migration:
1. Check DNS propagation (can take 24-72 hours)
2. Verify SSL certificate is active
3. Test redirects with online tools
4. Monitor Google Search Console for errors
5. Check browser console for mixed content warnings

**Keep this file for reference during the migration process!**
