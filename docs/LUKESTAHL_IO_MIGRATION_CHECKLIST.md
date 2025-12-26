# lukestahl.io Migration Checklist

Comprehensive migration guide from lucasstahl.com → lukestahl.io

---

## 🎯 CURRENT STATUS (Updated: 2025-12-26)

**Progress:** Phase 2 of 11 Complete - Waiting for Nameserver Propagation

✅ **Phase 1 COMPLETE**: Added lukestahl.io to Cloudflare
✅ **Phase 2 COMPLETE**: Removed GoDaddy redirect, updated nameservers
⏳ **Phase 3 IN PROGRESS**: Waiting for nameserver propagation (2-48 hours)
⏸️ **Phase 4-11**: Pending (continue after DNS propagates)

**Your Cloudflare Nameservers:**
- `lakas.ns.cloudflare.com`
- `vita.ns.cloudflare.com`

**Next Steps:** Wait for nameserver propagation, then configure DNS records in Cloudflare

---

**Original Setup:**
- lucasstahl.com: GoDaddy (registrar), Cloudflare (DNS), has Transform Rule
- lukestahl.io: GoDaddy (registrar + DNS), redirecting TO lucasstahl.com

**Target Setup:**
- lukestahl.io: Primary domain, Cloudflare (DNS), Transform Rule
- lucasstahl.com: Cloudflare (DNS), 301 redirects TO lukestahl.io

---

## Migration Overview

The migration happens in phases to avoid redirect chains and minimize downtime:

1. **Cloudflare Setup** - Add lukestahl.io to Cloudflare
2. **GoDaddy Changes** - Remove redirect, update nameservers
3. **GitHub & DNS** - Point to GitHub Pages, get SSL cert
4. **Code Changes** - Update all domain references
5. **Cloudflare Rules** - Transform Rule + 301 Redirects
6. **Third-Party Services** - PostHog, Sentry, GSC, Ahrefs, Resend
7. **External Profiles** - Update social media, etc.
8. **Monitoring** - Track SEO impact for 12 months

---

## Phase 1: Cloudflare Setup (Day 1) ✅ COMPLETE

### Add lukestahl.io to Cloudflare

1. [x] Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. [x] Click "Add a Site" or "Add Domain"
3. [x] Enter: `lukestahl.io`
4. [x] Select: **Free plan**
5. [x] Click "Add Site"
6. [x] Cloudflare will scan for existing DNS records
7. [x] Review detected records (might find existing A records or redirect)
8. [x] Click "Continue"
9. [x] **Cloudflare provides nameservers** - COPY THESE:
   ```
   YOUR NAMESERVERS:
   lakas.ns.cloudflare.com
   vita.ns.cloudflare.com
   ```

10. [x] Keep this tab open - you'll need these nameservers next

---

## Phase 2: GoDaddy Changes (Day 1) ✅ COMPLETE

### Remove Redirect from lukestahl.io

**IMPORTANT**: Do this BEFORE changing nameservers, otherwise the redirect will conflict with DNS.

1. [x] Log in to [GoDaddy](https://www.godaddy.com/)
2. [x] Go to "My Products"
3. [x] Find `lukestahl.io` domain
4. [x] Click "DNS" or "Manage DNS"
5. [x] Look for "Forwarding" section (usually at top or bottom)
6. [x] Find the redirect: `lukestahl.io → lucasstahl.com`
7. [x] Click **"Delete"** or **"Remove"** next to the forwarding rule
8. [x] Confirm deletion
9. [x] **Verify**: The forwarding section should now be empty or say "No forwarding"

### Update Nameservers for lukestahl.io

1. [x] Still in GoDaddy, on the `lukestahl.io` DNS management page
2. [x] Scroll to "Nameservers" section
3. [x] Click "Change" or "Manage"
4. [x] Current setting: "GoDaddy Nameservers" (default)
5. [x] Select: **"I'll use my own nameservers"** or **"Custom"**
6. [x] Enter the Cloudflare nameservers from Step 1:
   ```
   Nameserver 1: lakas.ns.cloudflare.com
   Nameserver 2: vita.ns.cloudflare.com
   ```
7. [x] Click "Save"
8. [x] GoDaddy may show a warning - this is normal, proceed
9. [x] **Wait 2-48 hours for nameserver propagation** ⏳ **IN PROGRESS**

### Verify Nameserver Change

After a few hours:
1. [ ] Use command line: `dig lukestahl.io NS`
2. [ ] Or use: [whatsmydns.net](https://www.whatsmydns.net/)
3. [ ] Should show Cloudflare nameservers globally
4. [ ] Once propagated, proceed to next phase

---

## Phase 3: Cloudflare DNS Configuration (Day 2-3)

### Configure DNS Records for lukestahl.io

Once nameservers have propagated to Cloudflare:

1. [ ] Go back to Cloudflare Dashboard
2. [ ] Select `lukestahl.io` domain
3. [ ] Navigate to **DNS** → **Records**
4. [ ] Delete any existing A or CNAME records that might conflict
5. [ ] Add GitHub Pages A records:

**Add Record #1:**
```
Type: A
Name: @ (or lukestahl.io)
IPv4 address: 185.199.108.153
Proxy status: DNS only (gray cloud icon)
TTL: Auto
```

**Add Record #2:**
```
Type: A
Name: @
IPv4 address: 185.199.109.153
Proxy status: DNS only (gray cloud)
TTL: Auto
```

**Add Record #3:**
```
Type: A
Name: @
IPv4 address: 185.199.110.153
Proxy status: DNS only (gray cloud)
TTL: Auto
```

**Add Record #4:**
```
Type: A
Name: @
IPv4 address: 185.199.111.153
Proxy status: DNS only (gray cloud)
TTL: Auto
```

6. [ ] **Optional** - Add www subdomain:
```
Type: CNAME
Name: www
Target: lukestahl.io
Proxy status: DNS only (gray cloud)
TTL: Auto
```

7. [ ] Click "Save" for each record
8. [ ] **IMPORTANT**: Keep "Proxy status" as **DNS only** (gray cloud) for now
   - You can enable Cloudflare proxy (orange cloud) later after verifying everything works
   - GitHub Pages requires seeing the actual client IP initially for SSL provisioning

### Wait for DNS Propagation

1. [ ] Wait 24-72 hours for full DNS propagation
2. [ ] Test with: `dig lukestahl.io A`
3. [ ] Should return the 4 GitHub Pages IP addresses
4. [ ] Test with: [whatsmydns.net](https://www.whatsmydns.net/) - check globally

---

## Phase 4: GitHub Pages Configuration (Day 3-4)

### Update Custom Domain

**IMPORTANT**: Only do this after DNS has fully propagated!

1. [ ] Go to your GitHub repository
2. [ ] Navigate to **Settings** → **Pages**
3. [ ] Under "Custom domain":
   - Current value: `lucasstahl.com`
   - Change to: `lukestahl.io`
4. [ ] Click "Save"
5. [ ] GitHub will:
   - Create/update the CNAME file in your repo
   - Start DNS check
   - Begin SSL certificate provisioning
6. [ ] **Wait 24-48 hours** for SSL certificate to be issued
7. [ ] Check back - page will show "HTTPS" checkbox
8. [ ] Once available, enable: ✅ **"Enforce HTTPS"**
9. [ ] Test: Visit https://lukestahl.io in browser
10. [ ] Should load with valid SSL certificate (lock icon)

### Troubleshooting

If SSL doesn't provision after 48 hours:
- [ ] Verify DNS is correct: `dig lukestahl.io A`
- [ ] Verify CNAME file in repo contains `lukestahl.io`
- [ ] Try removing and re-adding custom domain in GitHub Pages settings
- [ ] Check GitHub Pages status: [githubstatus.com](https://www.githubstatus.com/)

---

## Phase 5: Code Changes (Day 4-5)

### Create Feature Branch

```bash
cd astro-site
git checkout -b feature/migrate-to-lukestahl-io
```

### A. Core Configuration Files

**1. CNAME File**

File: `/astro-site/public/CNAME`

Current:
```
lucasstahl.com
```

Update to:
```
lukestahl.io
```

*Note: GitHub may have already updated this when you changed the custom domain in settings. Verify it's correct.*

---

**2. Astro Config**

File: `/astro-site/astro.config.mjs`

Line 14, change:
```javascript
site: 'https://lucasstahl.com',
```

To:
```javascript
site: 'https://lukestahl.io',
```

---

**3. Robots.txt**

File: `/astro-site/public/robots.txt`

Line 6, change:
```
Sitemap: https://lucasstahl.com/sitemap.xml
```

To:
```
Sitemap: https://lukestahl.io/sitemap.xml
```

---

### B. Layout Files

**4. Main Layout**

File: `/astro-site/src/layouts/Layout.astro`

Update the following lines:

**Line 30** - Default OG Image:
```javascript
ogImage = "https://lucasstahl.com/assets/images/Hero_OG.png",
```
To:
```javascript
ogImage = "https://lukestahl.io/assets/images/Hero_OG.png",
```

**Line 31** - Default Canonical URL:
```javascript
canonicalUrl = "https://lucasstahl.com",
```
To:
```javascript
canonicalUrl = "https://lukestahl.io",
```

**Line 50** - HTTPS Redirect Script:
```javascript
var host = "lucasstahl.com";
```
To:
```javascript
var host = "lukestahl.io";
```

**Line 58** - RSS Feed Link:
```astro
<link rel="alternate" type="application/rss+xml" title="Luke Stahl's Blog" href="https://lucasstahl.com/rss.xml" />
```
To:
```astro
<link rel="alternate" type="application/rss+xml" title="Luke Stahl's Blog" href="https://lukestahl.io/rss.xml" />
```

**Line 85** - JSON-LD Person Schema URL:
```javascript
"url": "https://lucasstahl.com",
```
To:
```javascript
"url": "https://lukestahl.io",
```

**Line 86** - JSON-LD Person Schema Image:
```javascript
"image": "https://lucasstahl.com/assets/images/Luke_Stahl_Headshot.jpg",
```
To:
```javascript
"image": "https://lukestahl.io/assets/images/Luke_Stahl_Headshot.jpg",
```

**Line 135** - MS Application Tile Image:
```html
<meta name="msapplication-TileImage" content="https://lucasstahl.com/LS.ico" />
```
To:
```html
<meta name="msapplication-TileImage" content="https://lukestahl.io/LS.ico" />
```

---

**5. MinimalLayout**

File: `/astro-site/src/layouts/MinimalLayout.astro`

- [ ] Search for `lucasstahl.com` in the file
- [ ] Replace all instances with `lukestahl.io`

---

**6. PostHogLayout**

File: `/astro-site/src/layouts/PostHogLayout.astro`

- [ ] Search for `lucasstahl.com` in the file
- [ ] Replace all instances with `lukestahl.io`

---

### C. Page Files - Canonical URLs

Update all pages with hardcoded canonical URLs:

- [ ] `/astro-site/src/pages/index.astro`
- [ ] `/astro-site/src/pages/about.astro`
- [ ] `/astro-site/src/pages/blog.astro`
- [ ] `/astro-site/src/pages/blog/[slug].astro`
- [ ] `/astro-site/src/pages/retro.astro`
- [ ] `/astro-site/src/pages/dev-marketing-cheat-sheet.astro`
- [ ] `/astro-site/src/pages/status.astro`
- [ ] `/astro-site/src/pages/gems.astro`
- [ ] `/astro-site/src/pages/handbook.astro`
- [ ] `/astro-site/src/pages/builds.astro`
- [ ] `/astro-site/src/pages/404.astro`

**Find and Replace**:
```
Find: canonicalUrl="https://lucasstahl.com
Replace: canonicalUrl="https://lukestahl.io
```

Or search for `og:url` and `twitter:url` properties and update those as well.

---

**7. RSS Feed**

File: `/astro-site/src/pages/rss.xml.ts`

- [ ] Search for `lucasstahl.com` in the file
- [ ] Update site URL to `lukestahl.io`

---

### D. Documentation

**8. README**

File: `/README.md`

Update these lines:

**Line 1** - Title (if it includes domain):
```markdown
# lucasstahl.com
```
To:
```markdown
# lukestahl.io
```

**Line 121** - Production URL:
```markdown
**URL**: https://lucasstahl.com
```
To:
```markdown
**URL**: https://lukestahl.io
```

**Line 162** - Contact website:
```markdown
- Website: [lucasstahl.com](https://lucasstahl.com)
```
To:
```markdown
- Website: [lukestahl.io](https://lukestahl.io)
```

---

### Test Locally

```bash
cd astro-site
npm run dev
```

- [ ] Visit http://localhost:4321
- [ ] Check browser console for errors
- [ ] Test navigation
- [ ] View page source, verify canonical URLs
- [ ] Test a few blog posts

---

### Commit Changes

```bash
git add .
git commit -m "Migrate domain from lucasstahl.com to lukestahl.io

- Update CNAME to lukestahl.io
- Update astro.config.mjs site URL
- Update robots.txt sitemap URL
- Update all canonical URLs in layouts and pages
- Update OG tags and JSON-LD schema
- Update RSS feed URL
- Update README.md documentation

🤖 Generated with Claude Code"

git push origin feature/migrate-to-lukestahl-io
```

**WAIT** - Don't merge yet! First verify DNS and GitHub Pages are fully working.

---

## Phase 6: Cloudflare Rules (Day 5-6)

### A. Create Transform Rule for lukestahl.io

This replicates your existing rule for the new domain.

1. [ ] Go to Cloudflare Dashboard
2. [ ] Select `lukestahl.io` zone
3. [ ] Navigate to **Rules** → **Transform Rules**
4. [ ] Click **"Create rule"**
5. [ ] Select **"Modify Response Header"**

**Configure the rule:**

- **Rule name (required)**:
  ```
  Prevent carrier proxy transform
  ```

- **If incoming requests match**:
  - Select: ⚫ **Custom filter expression**

- **Field**: `Hostname`
- **Operator**: `equals`
- **Value**: `lukestahl.io`

- **Then**:
  - **Modify response header**: `Set static`
  - **Header name**: `Cache-Control`
  - **Value**: `public, max-age=0, must-revalidate, no-transform`

**Expression Preview should show**:
```
(http.host eq "lukestahl.io")
```

6. [ ] Click **"Deploy"**
7. [ ] Rule should now be active (1 out of 10 Transform Rules used)

---

### B. Set Up 301 Redirects (lucasstahl.com → lukestahl.io)

**CRITICAL**: This reverses your current setup!

**Current**: lukestahl.io → lucasstahl.com
**New**: lucasstahl.com → lukestahl.io

1. [ ] Go to Cloudflare Dashboard
2. [ ] Select `lucasstahl.com` zone
3. [ ] Navigate to **Rules** → **Redirect Rules** (if available) or **Page Rules** (legacy)

#### Option A: Redirect Rules (Recommended - Newer)

**Rule 1: Main domain redirect**

1. [ ] Click **"Create rule"**
2. [ ] Rule name: `Redirect to lukestahl.io`
3. [ ] **When incoming requests match**:
   - Field: `Hostname`
   - Operator: `equals`
   - Value: `lucasstahl.com`
4. [ ] **Then**:
   - **URL redirect**
   - Type: `Dynamic`
   - Expression: `concat("https://lukestahl.io", http.request.uri.path)`
   - Status code: `301`
   - Preserve query string: ✅ Yes
5. [ ] Click **"Deploy"**

**Rule 2: WWW subdomain redirect**

1. [ ] Click **"Create rule"**
2. [ ] Rule name: `Redirect www to lukestahl.io`
3. [ ] **When incoming requests match**:
   - Field: `Hostname`
   - Operator: `equals`
   - Value: `www.lucasstahl.com`
4. [ ] **Then**:
   - **URL redirect**
   - Type: `Dynamic`
   - Expression: `concat("https://lukestahl.io", http.request.uri.path)`
   - Status code: `301`
   - Preserve query string: ✅ Yes
5. [ ] Click **"Deploy"**

#### Option B: Page Rules (Legacy)

If Redirect Rules aren't available, use Page Rules:

**Rule 1: Main domain**
- URL pattern: `lucasstahl.com/*`
- Setting: **Forwarding URL**
- Status code: `301 - Permanent Redirect`
- Destination URL: `https://lukestahl.io/$1`

**Rule 2: WWW subdomain**
- URL pattern: `www.lucasstahl.com/*`
- Setting: **Forwarding URL**
- Status code: `301 - Permanent Redirect`
- Destination URL: `https://lukestahl.io/$1`

---

### C. Verify Cloudflare Settings

**For lukestahl.io:**
- [ ] SSL/TLS → Overview → Encryption mode: **Full** or **Full (strict)**
- [ ] SSL/TLS → Edge Certificates → Always Use HTTPS: **On**
- [ ] Speed → Optimization → Auto Minify: Enable as desired
- [ ] Caching settings: As desired

**For lucasstahl.com:**
- [ ] Same settings as above
- [ ] Redirects should be active

---

## Phase 7: Deploy Code Changes (Day 6)

### Merge and Deploy

1. [ ] Verify GitHub Pages is working on lukestahl.io
2. [ ] Verify Cloudflare rules are active
3. [ ] Test one redirect manually: `curl -I https://lucasstahl.com`
   - Should show: `HTTP/2 301` and `location: https://lukestahl.io/`

4. [ ] Create Pull Request on GitHub:
   - Base: `master`
   - Compare: `feature/migrate-to-lukestahl-io`
   - Title: "Migrate domain from lucasstahl.com to lukestahl.io"
   - Description: Include list of changes

5. [ ] Review PR carefully
6. [ ] Merge PR to master
7. [ ] GitHub Actions will deploy automatically
8. [ ] Monitor deployment in Actions tab
9. [ ] Wait for deployment to complete (usually 2-5 minutes)

### Verify Deployment

- [ ] Visit https://lukestahl.io
- [ ] Site should load with all changes
- [ ] Check a blog post
- [ ] View page source, verify canonical URLs are updated
- [ ] Check sitemap: https://lukestahl.io/sitemap.xml
- [ ] Check robots.txt: https://lukestahl.io/robots.txt
- [ ] Check RSS feed: https://lukestahl.io/rss.xml

---

## Phase 8: Third-Party Services (Week 1)

### A. PostHog Analytics

**Action**: Add lukestahl.io to allowed domains

1. [ ] Log in to [PostHog](https://app.posthog.com/)
2. [ ] Select your project (key: `phc_4ruyfwFBGDiEiFhDLbLn5wIkpKvgDqpsuGhaPTiMpzP`)
3. [ ] Go to **Settings** → **Project**
4. [ ] Find **"Authorized URLs"** or **"Permitted domains"** or **"CORS origins"**
5. [ ] Add: `https://lukestahl.io`
6. [ ] Keep: `https://lucasstahl.com` (for transition period)
7. [ ] Save changes

**Test**:
- [ ] Visit https://lukestahl.io
- [ ] Open browser DevTools → Network tab
- [ ] Look for requests to `us.i.posthog.com`
- [ ] Should see successful requests (200 status)
- [ ] Check PostHog dashboard for new events

**Note**: No code changes needed - project key stays the same.

---

### B. Sentry Error Tracking

**Action**: Add lukestahl.io to allowed origins

1. [ ] Log in to [Sentry](https://sentry.io/)
2. [ ] Select your project
3. [ ] Go to **Settings** → **Client Keys (DSN)**
4. [ ] Find **"Allowed Domains"** or **"CORS Allowed Origins"**
5. [ ] Add: `https://lukestahl.io`
6. [ ] Add: `lukestahl.io`
7. [ ] Keep: `https://lucasstahl.com` and `lucasstahl.com`
8. [ ] Save changes

**Test**:
- [ ] Visit https://lukestahl.io
- [ ] Open browser DevTools → Console
- [ ] Look for any Sentry errors
- [ ] Optionally trigger a test error
- [ ] Check Sentry dashboard for events from new domain

**Current DSN**: `https://dc6ccb6dad84ef6fef587e9f200de223@o4510585672957952.ingest.us.sentry.io/4510585685868544`

**Note**: DSN stays the same, no code changes needed.

---

### C. Google Search Console

**Action**: Add new property and use Change of Address tool

#### Step 1: Add lukestahl.io Property

1. [ ] Log in to [Google Search Console](https://search.google.com/search-console)
2. [ ] Click **"Add property"** (usually top-left)
3. [ ] Choose property type:
   - **Option A**: Domain property (recommended)
     - Enter: `lukestahl.io`
     - Requires DNS TXT record verification
   - **Option B**: URL prefix
     - Enter: `https://lukestahl.io`
     - Multiple verification options

#### Step 2: Verify Ownership (DNS Method)

1. [ ] GSC provides a DNS TXT record, like:
   ```
   google-site-verification=abc123xyz...
   ```
2. [ ] Go to Cloudflare Dashboard → `lukestahl.io` zone
3. [ ] DNS → Records → **Add record**:
   ```
   Type: TXT
   Name: @
   Content: google-site-verification=abc123xyz...
   TTL: Auto
   ```
4. [ ] Save in Cloudflare
5. [ ] Wait 5-10 minutes
6. [ ] Go back to GSC and click **"Verify"**
7. [ ] Should show: ✅ Ownership verified

#### Step 3: Submit Sitemap

1. [ ] In lukestahl.io property
2. [ ] Go to **Sitemaps** (left sidebar)
3. [ ] Add new sitemap: `sitemap.xml`
4. [ ] Full URL: `https://lukestahl.io/sitemap.xml`
5. [ ] Click **"Submit"**
6. [ ] Status should change to "Success" after processing

#### Step 4: Use Change of Address Tool

This notifies Google of the domain migration:

1. [ ] Go to **lucasstahl.com** property (old domain)
2. [ ] Left sidebar → **Settings** ⚙️
3. [ ] Look for **"Change of Address"** tool
4. [ ] Select new site: `lukestahl.io`
5. [ ] GSC will verify:
   - You own both properties ✅
   - Old domain redirects to new (301) ✅
   - New sitemap exists ✅
6. [ ] Click **"Submit"**
7. [ ] Google will process this over several weeks

#### Step 5: Monitor Both Properties

For the next 3-6 months:

**lukestahl.io (new domain)**:
- [ ] Check **Index Coverage** weekly
- [ ] Monitor **Performance** (search impressions, clicks)
- [ ] Check **Enhancements** (Core Web Vitals, mobile usability)
- [ ] Watch for **crawl errors**

**lucasstahl.com (old domain)**:
- [ ] Keep active for historical data
- [ ] Monitor redirects are working
- [ ] Check for any residual traffic

---

### D. Ahrefs SEO Tool

**Action**: Update project to monitor lukestahl.io

1. [ ] Log in to [Ahrefs](https://ahrefs.com/)
2. [ ] Go to **Projects** or **Site Explorer**
3. [ ] Find your `lucasstahl.com` project

**Option A: Add New Project** (Recommended)
1. [ ] Click **"+ New Project"**
2. [ ] Enter: `lukestahl.io`
3. [ ] Configure alerts:
   - New backlinks
   - Lost backlinks
   - Keyword ranking changes
   - Organic traffic drops
4. [ ] Keep the `lucasstahl.com` project active
5. [ ] Monitor both for 6-12 months

**Option B: Update Existing Project**
1. [ ] Edit project settings
2. [ ] Change primary domain to `lukestahl.io`
3. [ ] Add `lucasstahl.com` as secondary domain

#### Monitor During Transition

Track these metrics:

- [ ] **Backlinks**: Verify they resolve through redirect
- [ ] **Keyword rankings**: Watch for fluctuations
- [ ] **Organic traffic**: Monitor trends
- [ ] **Domain rating**: Should transfer over time
- [ ] **Referring domains**: Check for any drops

**Timeline**:
- Weeks 1-2: Initial indexing
- Weeks 3-6: Ranking fluctuations expected
- Months 2-3: Rankings stabilize
- Months 6-12: Full link equity transfer

---

### E. Resend Email Service

**Current Setup**: Used for automated alerts (link checker, performance monitoring)

#### Option 1: Keep Current Setup (Easiest)

- [ ] No changes needed
- [ ] Emails continue working
- [ ] API key and settings stay the same

**Files that use Resend**:
- `.github/workflows/link-checker.yml`
- `.github/workflows/weekly-performance-check.yml`

#### Option 2: Update Email Domain (Optional - Better Long-term)

If you want emails to come from `@lukestahl.io`:

1. [ ] Log in to [Resend](https://resend.com/)
2. [ ] Go to **Domains** → **Add Domain**
3. [ ] Enter: `lukestahl.io`
4. [ ] Resend provides DNS records
5. [ ] Add to Cloudflare DNS for lukestahl.io:

   **SPF Record**:
   ```
   Type: TXT
   Name: @
   Content: v=spf1 include:_spf.resend.com ~all
   ```

   **DKIM Records** (Resend provides 3 records):
   ```
   Type: TXT
   Name: resend._domainkey
   Content: [provided by Resend]

   Type: TXT
   Name: resend2._domainkey
   Content: [provided by Resend]

   Type: TXT
   Name: resend3._domainkey
   Content: [provided by Resend]
   ```

   **DMARC Record** (optional but recommended):
   ```
   Type: TXT
   Name: _dmarc
   Content: v=DMARC1; p=none; rua=mailto:your-email@lukestahl.io
   ```

6. [ ] Wait for verification (1-24 hours)
7. [ ] Once verified, update "From" addresses in workflows if desired

**Note**: This is optional. Your current setup will continue working fine.

---

## Phase 9: External Profile Updates (Week 1-2)

Update your domain on all external platforms:

### Social Media
- [ ] **LinkedIn**: Profile → Contact Info → Website
- [ ] **Twitter/X**: Profile → Edit profile → Website
- [ ] **GitHub**: Profile → Edit profile → Website
- [ ] **Dev.to**: Settings → Profile → Website URL
- [ ] **Medium**: Profile → Edit profile → Homepage
- [ ] **Hashnode**: Blog settings → Domain
- [ ] **YouTube**: Channel settings → Links (if applicable)

### Developer Platforms
- [ ] **npm**: Profile settings (if applicable)
- [ ] **Stack Overflow**: Profile → Website
- [ ] **Product Hunt**: Profile → Website

### Professional
- [ ] **Email signature**: Update personal and work signatures
- [ ] **Resume/CV**: Update contact information
- [ ] **Business cards**: Note for next reprint
- [ ] **Other portfolios**: Update any hosted elsewhere

### Update Backlinks (Where Possible)
- [ ] Guest posts or articles you've written
- [ ] Forum signatures
- [ ] Directory listings
- [ ] Community profiles
- [ ] Press releases or media mentions (if you have contacts)

---

## Phase 10: Testing & Validation

### A. DNS Tests

- [ ] Test DNS propagation: [whatsmydns.net](https://www.whatsmydns.net/)
  - Search: `lukestahl.io`
  - Type: `A`
  - Should show GitHub Pages IPs globally
- [ ] Command line: `dig lukestahl.io A`
- [ ] Command line: `dig lukestahl.io NS` (should show Cloudflare nameservers)

### B. SSL/HTTPS Tests

- [ ] Visit https://lukestahl.io in browser
- [ ] Click lock icon → Certificate should show:
  - Issued to: lukestahl.io
  - Issued by: GitHub Pages
  - Valid dates
- [ ] Test with [SSL Labs](https://www.ssllabs.com/ssltest/):
  - Enter: `lukestahl.io`
  - Should get A or A+ rating
- [ ] Check for mixed content:
  - Open DevTools → Console
  - Look for any http:// warnings

### C. Redirect Tests

**Test each of these URLs** and verify they redirect to lukestahl.io with 301 status:

- [ ] `http://lucasstahl.com` → `https://lukestahl.io/` (301)
- [ ] `https://lucasstahl.com` → `https://lukestahl.io/` (301)
- [ ] `http://www.lucasstahl.com` → `https://lukestahl.io/` (301)
- [ ] `https://www.lucasstahl.com` → `https://lukestahl.io/` (301)
- [ ] `https://lucasstahl.com/about` → `https://lukestahl.io/about` (301)
- [ ] `https://lucasstahl.com/blog` → `https://lukestahl.io/blog` (301)
- [ ] `https://lucasstahl.com/blog/some-post-slug` → `https://lukestahl.io/blog/some-post-slug` (301)

**Tools**:
- Browser DevTools → Network tab (check status codes)
- [httpstatus.io](https://httpstatus.io/) - Enter URLs to check
- [Redirect Checker](https://www.redirect-checker.org/)
- Command line: `curl -I https://lucasstahl.com`

**What to verify**:
- ✅ Status code is **301** (permanent redirect)
- ✅ Location header points to `https://lukestahl.io/[same-path]`
- ✅ Full URL path is preserved (not redirecting everything to homepage)
- ✅ Query strings are preserved if applicable

### D. Site Functionality Tests

- [ ] Homepage loads correctly
- [ ] Navigation menu works
- [ ] All nav links work (About, Blog, Builds, etc.)
- [ ] Blog index page loads
- [ ] Individual blog posts load
- [ ] Blog pagination works
- [ ] Images display correctly:
  - Hero image
  - Blog post images
  - OG images
  - Profile pictures
- [ ] Search functionality works
- [ ] Dark/light theme toggle works
- [ ] Footer links work
- [ ] Handbook/dev console works (if applicable)
- [ ] Mobile responsive (test on phone or DevTools)

### E. SEO Tests

- [ ] **Sitemap**: Visit https://lukestahl.io/sitemap.xml
  - Should load as XML
  - URLs should reference lukestahl.io
  - All major pages included

- [ ] **Robots.txt**: Visit https://lukestahl.io/robots.txt
  - Should show correct sitemap URL
  - Allow rules intact

- [ ] **RSS Feed**: Visit https://lukestahl.io/rss.xml
  - Should load as XML/RSS
  - Links should reference lukestahl.io

- [ ] **Canonical URLs**: View page source on key pages
  - Search for `<link rel="canonical"`
  - Should point to lukestahl.io

- [ ] **Open Graph Tags**: View page source
  - `<meta property="og:url"` should be lukestahl.io
  - `<meta property="og:image"` should be lukestahl.io

- [ ] **JSON-LD Schema**: View page source
  - Search for `<script type="application/ld+json"`
  - URLs should reference lukestahl.io

### F. Analytics & Monitoring Tests

- [ ] **PostHog**:
  - Visit a few pages
  - Open DevTools → Network
  - Filter for `posthog`
  - Should see successful requests (200)
  - Check PostHog dashboard for events from lukestahl.io

- [ ] **Sentry**:
  - Check Sentry dashboard
  - Should see project is receiving data
  - No errors related to CORS or blocked domains

- [ ] **Browser Console**:
  - Open DevTools → Console
  - Should see no errors
  - May see the easter egg: "Hello. Appreciate you being here. — Luke"

- [ ] **Network Tab**:
  - All resources loading successfully
  - No 404 errors
  - No blocked resources

### G. Cloudflare Transform Rule Test

Verify the `no-transform` header is being set:

- [ ] Visit https://lukestahl.io
- [ ] Open DevTools → Network tab
- [ ] Reload page
- [ ] Click on the main document request (usually first row)
- [ ] Go to **Headers** tab
- [ ] Look at **Response Headers**
- [ ] Find `cache-control` header
- [ ] Should include: `no-transform`

Expected:
```
cache-control: public, max-age=0, must-revalidate, no-transform
```

### H. GitHub Actions Tests

- [ ] Go to repository → Actions tab
- [ ] Check latest deploy workflow
- [ ] Should show success ✅
- [ ] Manually trigger link checker workflow (if available)
- [ ] Manually trigger performance monitor workflow (if available)
- [ ] Verify Resend emails still work

---

## Phase 11: Monitoring (Months 1-12)

### Week 1-2: Intensive Monitoring

**Daily checks**:
- [ ] PostHog dashboard - verify traffic on new domain
- [ ] Sentry dashboard - watch for new errors
- [ ] Test a random old URL: `lucasstahl.com/blog/[post]`
- [ ] Verify redirect still works
- [ ] Check Google Search Console:
  - Index coverage for lukestahl.io
  - Any crawl errors
  - Mobile usability issues

### Month 1: Weekly Checks

- [ ] **Google Search Console**:
  - Index coverage progress
  - Search impressions/clicks trending
  - Core Web Vitals
  - Any manual actions or security issues

- [ ] **Ahrefs**:
  - Keyword ranking changes
  - Backlink changes (should see redirects in referring domains)
  - Organic traffic trends
  - Domain rating stability

- [ ] **Analytics**:
  - Overall traffic trends (PostHog)
  - Any unusual drops or spikes
  - User behavior changes

- [ ] **Redirects**:
  - Spot check old URLs still redirect
  - Test from different locations/devices

### Months 2-6: Bi-weekly Checks

- [ ] GSC - Rankings stabilizing
- [ ] Ahrefs - Link equity transferring
- [ ] Traffic trends returning to normal
- [ ] No persistent crawl errors

### Months 6-12: Monthly Checks

- [ ] Maintain both domains
- [ ] Keep redirects active
- [ ] Monitor for any long-tail SEO effects
- [ ] Update any missed external profiles

### After 12 Months

**Decision Point**: Keep or let lucasstahl.com expire?

**Recommendation**: Keep both domains indefinitely
- Cost: ~$15-20/year for lucasstahl.com
- Benefit: Permanent redirect, protects SEO
- Risk of letting expire: Someone else could buy it, create redirect chains, harm SEO

If you must let it expire:
- [ ] Wait at least 12-18 months
- [ ] Verify SEO is fully stable
- [ ] Check Ahrefs - most backlinks pointing to new domain
- [ ] Download any remaining data from old GSC property
- [ ] Archive old domain in GSC

---

## Troubleshooting

### Issue: DNS Not Propagating

**Symptoms**: lukestahl.io doesn't resolve, shows error page

**Solutions**:
- [ ] Verify nameservers updated at GoDaddy: `dig lukestahl.io NS`
- [ ] Wait up to 48 hours for global propagation
- [ ] Clear local DNS cache: `sudo dscacheutil -flushcache` (Mac)
- [ ] Try different DNS server: `nslookup lukestahl.io 8.8.8.8`

### Issue: SSL Certificate Not Provisioning

**Symptoms**: https://lukestahl.io shows certificate error

**Solutions**:
- [ ] Wait full 48 hours after DNS propagates
- [ ] Verify DNS points to GitHub Pages IPs: `dig lukestahl.io A`
- [ ] Check GitHub Pages settings - custom domain set correctly
- [ ] Verify CNAME file in repo: `cat astro-site/public/CNAME`
- [ ] Try removing and re-adding custom domain in GitHub Pages
- [ ] Check [GitHub Status](https://www.githubstatus.com/) for issues

### Issue: Redirects Not Working

**Symptoms**: lucasstahl.com shows 404 or doesn't redirect

**Solutions**:
- [ ] Check Cloudflare rules are deployed and active
- [ ] Verify lucasstahl.com DNS is pointing to Cloudflare
- [ ] Test with curl: `curl -I https://lucasstahl.com`
- [ ] Check rule order in Cloudflare (redirects should be first)
- [ ] Try disabling and re-enabling the rule

### Issue: Redirect Chain Detected

**Symptoms**: Too many redirects, infinite loop

**Solutions**:
- [ ] Verify GoDaddy redirect was removed from lukestahl.io
- [ ] Check Cloudflare rules don't conflict
- [ ] Clear browser cache and cookies
- [ ] Test in incognito/private mode
- [ ] Use redirect checker tool to visualize chain

### Issue: PostHog Not Tracking

**Symptoms**: No events showing in PostHog dashboard

**Solutions**:
- [ ] Verify lukestahl.io added to allowed domains
- [ ] Check browser console for CORS errors
- [ ] Verify PostHog script is loading (Network tab)
- [ ] Check project key is correct in `posthog.astro`
- [ ] Test in different browser
- [ ] Wait a few minutes - PostHog can have slight delay

### Issue: Sentry Not Receiving Errors

**Symptoms**: Errors not appearing in Sentry dashboard

**Solutions**:
- [ ] Verify lukestahl.io added to allowed origins
- [ ] Check browser console for blocked requests
- [ ] Verify DSN is correct in `.env`
- [ ] Check Sentry project settings
- [ ] Trigger a test error to verify

### Issue: Google Not Indexing New Domain

**Symptoms**: New domain not appearing in search results

**Solutions**:
- [ ] Verify sitemap submitted in GSC
- [ ] Check robots.txt allows indexing
- [ ] Use URL Inspection tool in GSC to request indexing
- [ ] Verify redirects are 301 (permanent), not 302 (temporary)
- [ ] Be patient - can take 2-4 weeks for full indexing
- [ ] Check for any "noindex" meta tags in pages

### Issue: Rankings Dropped

**Symptoms**: Significant loss in search rankings

**Solutions**:
- [ ] Verify redirects are 301, not 302
- [ ] Check all old URLs properly redirect
- [ ] Ensure canonical URLs point to new domain
- [ ] Verify sitemap only includes new domain URLs
- [ ] Check GSC for manual actions or security issues
- [ ] Give it time - temporary fluctuations are normal (4-8 weeks)
- [ ] If severe drop persists beyond 8 weeks, investigate deeper

---

## Critical Reminders

### DON'T:
- ❌ Launch without 301 redirects from lucasstahl.com
- ❌ Use 302 (temporary) redirects - must be 301 (permanent)
- ❌ Redirect all old pages to new homepage - preserve full paths!
- ❌ Let lucasstahl.com expire in first 12-18 months
- ❌ Skip updating Google Search Console
- ❌ Forget to replicate the Transform Rule for lukestahl.io
- ❌ Remove GoDaddy redirect without first moving nameservers
- ❌ Enable Cloudflare proxy before verifying GitHub Pages SSL works
- ❌ Merge code changes before DNS is fully working

### DO:
- ✅ Remove GoDaddy redirect BEFORE changing nameservers
- ✅ Set up proper 301 redirects with path preservation
- ✅ Replicate Transform Rule for `no-transform` on new domain
- ✅ Test thoroughly - all redirects, all major pages
- ✅ Add both domains to all services during transition
- ✅ Use Google Search Console "Change of Address" tool
- ✅ Monitor rankings closely for 2-3 months
- ✅ Keep both domains active for at least 12 months
- ✅ Update external backlinks where you have control
- ✅ Be patient - SEO takes 4-8 weeks to stabilize

---

## Quick Reference

### Key URLs

| What | URL |
|------|-----|
| New site | https://lukestahl.io |
| Old site (redirects) | https://lucasstahl.com |
| Sitemap | https://lukestahl.io/sitemap.xml |
| Robots.txt | https://lukestahl.io/robots.txt |
| RSS Feed | https://lukestahl.io/rss.xml |

### Service Dashboards

| Service | Dashboard | What to Update |
|---------|-----------|----------------|
| Cloudflare | [dash.cloudflare.com](https://dash.cloudflare.com/) | Add lukestahl.io, DNS, Rules |
| GoDaddy | [godaddy.com](https://www.godaddy.com/) | Remove redirect, change nameservers |
| GitHub Pages | Repository Settings → Pages | Custom domain |
| PostHog | [app.posthog.com](https://app.posthog.com/) | Allowed domains |
| Sentry | [sentry.io](https://sentry.io/) | Allowed origins |
| Google Search Console | [search.google.com/search-console](https://search.google.com/search-console) | Add property, change of address |
| Ahrefs | [ahrefs.com](https://ahrefs.com/) | Add/update project |
| Resend | [resend.com](https://resend.com/) | Optional: add domain |

### Timeline Summary

| Phase | Duration | Key Tasks |
|-------|----------|-----------|
| Cloudflare Setup | Day 1 | Add lukestahl.io to Cloudflare |
| GoDaddy Changes | Day 1 | Remove redirect, update nameservers |
| DNS Propagation | Days 2-3 | Wait, verify with dig/whatsmydns |
| GitHub Pages | Day 3-4 | Update custom domain, wait for SSL |
| Code Changes | Day 4-5 | Update all domain references |
| Cloudflare Rules | Day 5-6 | Transform Rule, 301 redirects |
| Deploy | Day 6 | Merge PR, deploy via GitHub Actions |
| Third-Party Services | Week 1 | Update PostHog, Sentry, GSC, etc. |
| Profile Updates | Week 1-2 | Social media, external links |
| Intensive Monitoring | Weeks 1-2 | Daily checks |
| Monitoring | Months 1-12 | Weekly → monthly checks |

### Files to Update

```
Configuration:
✏️ astro-site/public/CNAME
✏️ astro-site/astro.config.mjs
✏️ astro-site/public/robots.txt

Layouts:
✏️ astro-site/src/layouts/Layout.astro (multiple lines)
✏️ astro-site/src/layouts/MinimalLayout.astro
✏️ astro-site/src/layouts/PostHogLayout.astro

Pages:
✏️ astro-site/src/pages/*.astro (all with canonical URLs)
✏️ astro-site/src/pages/rss.xml.ts

Documentation:
✏️ README.md
```

---

## Cost Summary

| Item | Annual Cost | Notes |
|------|-------------|-------|
| lukestahl.io domain | $30-50 | Already purchased |
| lucasstahl.com domain | $15-20 | Keep for minimum 12 months |
| Cloudflare | FREE | Free plan sufficient |
| GitHub Pages | FREE | Always free |
| SSL Certificates | FREE | Auto via GitHub Pages |
| PostHog | FREE | Current tier |
| Sentry | FREE | Current tier |
| Resend | FREE | Current tier |
| Google Search Console | FREE | Always free |
| Ahrefs | Existing | No additional cost |
| **Total Year 1** | **$45-70** | Both domains |

---

**Migration prepared on**: 2025-12-26
**Keep this document for reference throughout the migration process!**
**Also reference**: `DOMAIN_MIGRATION_GUIDE.md` for additional context

---

Good luck with the migration! 🚀
