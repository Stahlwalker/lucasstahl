# PageSpeed Insights — Weekly Email Notification Action

A GitHub Action that runs PageSpeed Insights against your pages every week and emails you the results. No page updates, no commits — just the report in your inbox.

---

## What you get

A weekly email with:

- Performance, Accessibility, Best Practices, SEO scores (0–100) for each page on both mobile and desktop
- Core Web Vitals (LCP, CLS, TBT) for your homepage
- Agentic Browsing audit results (X/Y passed) — the new PSI category for AI crawlability

---

## Prerequisites

- A [Google PageSpeed Insights API key](https://developers.google.com/speed/docs/insights/v5/get-started) (free)
- A [Resend](https://resend.com) account and API key (free tier covers this easily)
- A verified sending domain on Resend

---

## Step 1 — Add repository secrets

In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|---|---|
| `PAGESPEED_API_KEY` | Your Google PSI API key |
| `RESEND_API_KEY` | Your Resend API key |
| `TO_EMAIL` | Address to receive the report |
| `FROM_EMAIL` | Verified Resend sender (e.g. `reports@yourdomain.com`) |

---

## Step 2 — Add the script

Create `scripts/pagespeed-check.mjs` in your repo:

```js
#!/usr/bin/env node
/**
 * Runs PageSpeed Insights against every page in PAGES × STRATEGIES with retry
 * on flaky 0-score responses, then writes /tmp/psi-results.json.
 *
 * Env: PAGESPEED_API_KEY — required
 */

import { writeFile } from 'node:fs/promises';

// ─── Configure your pages here ───────────────────────────────────────────────
const PAGES = [
  { key: 'home',  url: 'https://yoursite.com/',        withVitals: true  },
  { key: 'about', url: 'https://yoursite.com/about',   withVitals: false },
  { key: 'blog',  url: 'https://yoursite.com/blog',    withVitals: false },
];
// ─────────────────────────────────────────────────────────────────────────────

const STRATEGIES = ['mobile', 'desktop'];
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 10_000;
const STEP_DELAY_MS = 3_000;

const apiKey = process.env.PAGESPEED_API_KEY;
if (!apiKey) { console.error('PAGESPEED_API_KEY missing'); process.exit(1); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callPSI(url, strategy) {
  const params = new URLSearchParams({ url, strategy, key: apiKey });
  for (const c of ['performance', 'accessibility', 'best-practices', 'seo', 'experimental-agentic-browsing']) {
    params.append('category', c);
  }
  const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function extractScores(data) {
  const cats   = data?.lighthouseResult?.categories ?? {};
  const audits = data?.lighthouseResult?.audits ?? {};

  const agRefs = cats['experimental-agentic-browsing']?.auditRefs ?? [];
  const applicable = agRefs.filter((r) => {
    const a = audits[r.id];
    return a && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'informative';
  });

  return {
    performance:   Math.round((cats.performance?.score        ?? 0) * 100),
    accessibility: Math.round((cats.accessibility?.score      ?? 0) * 100),
    bestPractices: Math.round((cats['best-practices']?.score  ?? 0) * 100),
    seo:           Math.round((cats.seo?.score                ?? 0) * 100),
    lcp: audits['largest-contentful-paint']?.numericValue ?? 0,
    cls: audits['cumulative-layout-shift']?.numericValue  ?? 0,
    tbt: audits['total-blocking-time']?.numericValue      ?? 0,
    agenticBrowsingPassed: applicable.length > 0
      ? applicable.filter((r) => (audits[r.id]?.score ?? 0) >= 1).length
      : null,
    agenticBrowsingTotal: applicable.length > 0 ? applicable.length : null,
  };
}

async function checkWithRetry(url, strategy) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[${strategy}] ${url} — attempt ${attempt}/${MAX_RETRIES}`);
      const data = await callPSI(url, strategy);
      if (data?.error?.message)              throw new Error(data.error.message);
      if (data?.lighthouseResult?.runtimeError?.code) throw new Error(data.lighthouseResult.runtimeError.code);
      const scores = extractScores(data);
      if ([scores.performance, scores.accessibility, scores.bestPractices, scores.seo].every((s) => s === 0))
        throw new Error('all-zero scores');
      console.log(`  ✓ perf ${scores.performance} · a11y ${scores.accessibility} · bp ${scores.bestPractices} · seo ${scores.seo}`);
      return scores;
    } catch (err) {
      console.log(`  ✗ ${err.message}`);
      if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS);
    }
  }
  console.log(`  ⚠ giving up on ${url} (${strategy})`);
  return { performance: 0, accessibility: 0, bestPractices: 0, seo: 0, lcp: 0, cls: 0, tbt: 0, agenticBrowsingPassed: null, agenticBrowsingTotal: null };
}

async function main() {
  const results = { mobile: {}, desktop: {} };
  for (const strategy of STRATEGIES) {
    for (const page of PAGES) {
      const s = await checkWithRetry(page.url, strategy);
      results[strategy][page.key] = page.withVitals
        ? { performance: s.performance, accessibility: s.accessibility, bestPractices: s.bestPractices, seo: s.seo, lcp: s.lcp, cls: s.cls, tbt: s.tbt, agenticBrowsingPassed: s.agenticBrowsingPassed, agenticBrowsingTotal: s.agenticBrowsingTotal }
        : { performance: s.performance, accessibility: s.accessibility, bestPractices: s.bestPractices, seo: s.seo, agenticBrowsingPassed: s.agenticBrowsingPassed, agenticBrowsingTotal: s.agenticBrowsingTotal };
      await sleep(STEP_DELAY_MS);
    }
  }
  await writeFile('/tmp/psi-results.json', JSON.stringify({ lastUpdated: new Date().toISOString(), results }, null, 2));
  console.log('\n✓ Wrote /tmp/psi-results.json');
}

main().catch((err) => { console.error(err); process.exit(1); });
```

---

## Step 3 — Add the workflow

Create `.github/workflows/weekly-pagespeed-email.yml`:

```yaml
name: Weekly PageSpeed Email

on:
  schedule:
    - cron: '0 9 * * 0'   # Every Sunday at 9 AM UTC
  workflow_dispatch:        # Allow manual runs from the Actions tab

jobs:
  pagespeed-email:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Run PageSpeed checks
        env:
          PAGESPEED_API_KEY: ${{ secrets.PAGESPEED_API_KEY }}
        run: node scripts/pagespeed-check.mjs

      - name: Send email via Resend
        env:
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
          TO_EMAIL:       ${{ secrets.TO_EMAIL }}
          FROM_EMAIL:     ${{ secrets.FROM_EMAIL }}
        run: |
          node - << 'EOF'
          const fs   = require('fs');
          const data = JSON.parse(fs.readFileSync('/tmp/psi-results.json', 'utf8'));
          const { results, lastUpdated } = data;

          const date = new Date(lastUpdated).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          });

          const scoreColor = (n) => n >= 90 ? '#16a34a' : n >= 50 ? '#d97706' : '#dc2626';
          const badge = (n) => `<span style="font-weight:700;color:${scoreColor(n)}">${n}</span>`;

          const tableRows = (strategy) => Object.entries(results[strategy])
            .map(([page, s]) => {
              const ab = s.agenticBrowsingTotal != null
                ? `${s.agenticBrowsingPassed}/${s.agenticBrowsingTotal}`
                : 'N/A';
              return `<tr>
                <td style="padding:8px 12px;text-transform:capitalize">${page}</td>
                <td style="padding:8px 12px;text-align:center">${badge(s.performance)}</td>
                <td style="padding:8px 12px;text-align:center">${badge(s.accessibility)}</td>
                <td style="padding:8px 12px;text-align:center">${badge(s.bestPractices)}</td>
                <td style="padding:8px 12px;text-align:center">${badge(s.seo)}</td>
                <td style="padding:8px 12px;text-align:center;color:#16a34a;font-weight:700">${ab}</td>
              </tr>`;
            }).join('');

          const th = (label) => `<th style="padding:8px 12px;background:#f5f5f5;text-align:${label === 'Page' ? 'left' : 'center'}">${label}</th>`;
          const headers = ['Page','Performance','Accessibility','Best Practices','SEO','Agentic Browsing'].map(th).join('');

          const vitals = results.mobile.home;
          const vitalsHtml = vitals ? `
            <h3>Core Web Vitals — Mobile Homepage</h3>
            <ul>
              <li>LCP: <strong>${(vitals.lcp / 1000).toFixed(2)}s</strong> (target &lt;2.5s)</li>
              <li>CLS: <strong>${vitals.cls.toFixed(3)}</strong> (target &lt;0.1)</li>
              <li>TBT: <strong>${vitals.tbt}ms</strong> (target &lt;300ms)</li>
            </ul>` : '';

          const html = `
            <h2>📊 Weekly PageSpeed Report — ${date}</h2>
            <h3>📱 Mobile</h3>
            <table border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
              <tr>${headers}</tr>${tableRows('mobile')}
            </table>
            <h3>🖥️ Desktop</h3>
            <table border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
              <tr>${headers}</tr>${tableRows('desktop')}
            </table>
            ${vitalsHtml}
            <hr>
            <p><a href="https://pagespeed.web.dev/">Test on PageSpeed Insights</a></p>
          `;

          const payload = JSON.stringify({
            from: process.env.FROM_EMAIL,
            to:   [process.env.TO_EMAIL],
            subject: `📊 Weekly PageSpeed Report — ${date}`,
            html,
          });

          const https = require('https');
          const req = https.request(
            { hostname: 'api.resend.com', path: '/emails', method: 'POST',
              headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }
            },
            (res) => {
              let body = '';
              res.on('data', (c) => body += c);
              res.on('end', () => {
                console.log(`Resend → HTTP ${res.statusCode}`, body);
                if (res.statusCode !== 200) process.exit(1);
              });
            }
          );
          req.on('error', (e) => { console.error(e); process.exit(1); });
          req.write(payload);
          req.end();
          EOF
```

---

## Customisation notes

**Change the schedule** — edit the `cron` line. [crontab.guru](https://crontab.guru) is handy for this.

**Add or remove pages** — edit the `PAGES` array at the top of `pagespeed-check.mjs`. Set `withVitals: true` on whichever page you want Core Web Vitals (LCP/CLS/TBT) tracked; usually just the homepage.

**Agentic Browsing** — this is currently labelled `experimental` in PSI and is subject to change. The script handles a missing response gracefully (shows `N/A` in the email if the category isn't returned).

**Different email provider** — swap out the Resend `https.request` block in the workflow for whatever provider you use. The `html` variable is just a string.

**Manual test run** — go to **Actions → Weekly PageSpeed Email → Run workflow** to trigger it immediately without waiting for Sunday.

---

## How it works

1. The workflow checks out your repo and runs `pagespeed-check.mjs` with Node 20.
2. The script calls the PSI API v5 for each page × strategy combination, with up to 3 retries on flaky responses. Results are written to `/tmp/psi-results.json`.
3. A second inline Node script reads that file, builds an HTML email, and posts it to the Resend API.
4. Nothing is committed back to the repo — the run is read-only.
