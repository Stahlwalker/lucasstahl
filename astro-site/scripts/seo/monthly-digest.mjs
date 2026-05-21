#!/usr/bin/env node
/**
 * Monthly SEO digest.
 *
 * Pulls last 30 days vs prior 30 days from Search Console, identifies stuck
 * pages (URLs in the sitemap with 0 impressions over 30d), asks Claude to
 * write a tight commentary on the top movers, then sends to Slack + email
 * and commits the report as seo/digests/YYYY-MM.md.
 *
 * Usage:
 *   node scripts/seo/monthly-digest.mjs            # send + commit
 *   node scripts/seo/monthly-digest.mjs --dry-run  # log only
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolveSiteUrl, querySearchAnalytics, dateOffset } from './lib/gsc.mjs';
import { postSlackMessage } from './lib/slack.mjs';
import { sendEmail } from './lib/email.mjs';

const DRY_RUN = process.argv.includes('--dry-run');
const SITE_ROOT = resolve(import.meta.dirname, '../..');
const DIGEST_DIR = resolve(SITE_ROOT, '../seo/digests');

function pct(curr, prev) {
  if (prev === 0) return curr > 0 ? Infinity : 0;
  return (curr - prev) / prev;
}

function formatPct(n) {
  if (!Number.isFinite(n)) return 'new';
  const sign = n >= 0 ? '+' : '';
  return `${sign}${(n * 100).toFixed(0)}%`;
}

function parseSitemap() {
  const sitemapPath = resolve(SITE_ROOT, 'dist/sitemap.xml');
  let xml;
  try {
    xml = readFileSync(sitemapPath, 'utf8');
  } catch {
    // Fall back to the source list — only used to identify stuck pages
    return [];
  }
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function generateCommentary({ summary, topMovers, stuckPages }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return '_AI commentary skipped — no ANTHROPIC_API_KEY set._';
  }

  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic();

  const prompt = `You are reviewing SEO performance for lukestahl.io for the last 30 days. Be concrete and brief.

Aggregate (this 30d vs prior 30d):
${JSON.stringify(summary, null, 2)}

Top page movers (this 30d vs prior 30d, sorted by absolute click delta):
${JSON.stringify(topMovers.slice(0, 10), null, 2)}

Pages in the sitemap with zero impressions in the last 30d:
${JSON.stringify(stuckPages.slice(0, 15))}

Write 4-6 sentences. Lead with the single most important fact. Identify the 2-3 most interesting movers (up or down), quote actual numbers, and if you can plausibly infer a reason from the URL or page name, say so in one short clause. End with one specific suggestion about a stuck page or a declining page. Do not pad. No bullet headers. Plain prose.`;

  const res = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  });
  return res.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
}

async function main() {
  const siteUrl = await resolveSiteUrl();
  console.log(`Site: ${siteUrl}`);

  const endThis = dateOffset(-3);
  const startThis = dateOffset(-32);
  const endPrior = dateOffset(-33);
  const startPrior = dateOffset(-62);

  console.log(`This 30d:  ${startThis} → ${endThis}`);
  console.log(`Prior 30d: ${startPrior} → ${endPrior}`);

  const [thisAgg, priorAgg, thisByPage, priorByPage, thisByQuery] = await Promise.all([
    querySearchAnalytics({ siteUrl, startDate: startThis, endDate: endThis }),
    querySearchAnalytics({ siteUrl, startDate: startPrior, endDate: endPrior }),
    querySearchAnalytics({ siteUrl, startDate: startThis, endDate: endThis, dimensions: ['page'] }),
    querySearchAnalytics({ siteUrl, startDate: startPrior, endDate: endPrior, dimensions: ['page'] }),
    querySearchAnalytics({ siteUrl, startDate: startThis, endDate: endThis, dimensions: ['query'], rowLimit: 25 }),
  ]);

  const aggThis = thisAgg[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  const aggPrior = priorAgg[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };

  const summary = {
    clicks: { this: aggThis.clicks, prior: aggPrior.clicks, delta: formatPct(pct(aggThis.clicks, aggPrior.clicks)) },
    impressions: { this: aggThis.impressions, prior: aggPrior.impressions, delta: formatPct(pct(aggThis.impressions, aggPrior.impressions)) },
    avgPosition: { this: aggThis.position?.toFixed(1), prior: aggPrior.position?.toFixed(1) },
    avgCtr: { this: ((aggThis.ctr ?? 0) * 100).toFixed(2) + '%', prior: ((aggPrior.ctr ?? 0) * 100).toFixed(2) + '%' },
  };

  const priorMap = new Map(priorByPage.map((r) => [r.keys[0], r]));
  const movers = thisByPage
    .map((row) => {
      const page = row.keys[0];
      const prior = priorMap.get(page);
      const currClicks = row.clicks ?? 0;
      const prevClicks = prior?.clicks ?? 0;
      const currImpr = row.impressions ?? 0;
      const prevImpr = prior?.impressions ?? 0;
      return {
        page,
        clicks: currClicks,
        priorClicks: prevClicks,
        clickDelta: formatPct(pct(currClicks, prevClicks)),
        impressions: currImpr,
        priorImpressions: prevImpr,
        impressionDelta: formatPct(pct(currImpr, prevImpr)),
        avgPosition: row.position?.toFixed(1),
      };
    })
    .sort((a, b) => Math.abs(b.clicks - b.priorClicks) - Math.abs(a.clicks - a.priorClicks));

  const sitemapUrls = parseSitemap();
  const pagesWithImpressions = new Set(thisByPage.map((r) => r.keys[0]));
  const stuckPages = sitemapUrls.filter((u) => !pagesWithImpressions.has(u));

  const commentary = await generateCommentary({ summary, topMovers: movers, stuckPages });

  const month = new Date().toISOString().slice(0, 7);
  const md = `# SEO digest — ${month}

_Reporting window: ${startThis} → ${endThis} (vs ${startPrior} → ${endPrior})_

## Commentary

${commentary}

## Summary

| Metric | This 30d | Prior 30d | Δ |
|---|---|---|---|
| Clicks | ${summary.clicks.this} | ${summary.clicks.prior} | ${summary.clicks.delta} |
| Impressions | ${summary.impressions.this} | ${summary.impressions.prior} | ${summary.impressions.delta} |
| Avg. position | ${summary.avgPosition.this} | ${summary.avgPosition.prior} | — |
| Avg. CTR | ${summary.avgCtr.this} | ${summary.avgCtr.prior} | — |

## Top movers (by absolute click change)

| Page | Clicks | Δ | Impressions | Δ | Avg. pos |
|---|---|---|---|---|---|
${movers.slice(0, 10).map((m) => `| [${m.page.replace(/^https?:\/\/[^/]+/, '')}](${m.page}) | ${m.clicks} | ${m.clickDelta} | ${m.impressions} | ${m.impressionDelta} | ${m.avgPosition ?? '—'} |`).join('\n')}

## Top queries

| Query | Clicks | Impressions | CTR | Avg. pos |
|---|---|---|---|---|
${thisByQuery.slice(0, 10).map((r) => `| ${r.keys[0]} | ${r.clicks} | ${r.impressions} | ${((r.ctr ?? 0) * 100).toFixed(1)}% | ${r.position?.toFixed(1)} |`).join('\n')}

## Stuck pages (sitemap URLs with 0 impressions in 30d)

${stuckPages.length === 0 ? '_None — every page in the sitemap earned at least one impression._' : stuckPages.map((u) => `- ${u}`).join('\n')}
`;

  console.log(md);

  if (DRY_RUN) {
    console.log('\n--- DRY RUN: would commit and send the above ---');
    return;
  }

  // Commit to repo so the digest is archived and grep-able later.
  mkdirSync(DIGEST_DIR, { recursive: true });
  const digestPath = resolve(DIGEST_DIR, `${month}.md`);
  writeFileSync(digestPath, md);
  console.log(`Wrote ${digestPath}`);

  const slackText = `📊 *SEO digest — ${month}*\nClicks: ${summary.clicks.this} (${summary.clicks.delta}) · Impressions: ${summary.impressions.this} (${summary.impressions.delta})\n\n${commentary}\n\n_Full report committed to repo: \`seo/digests/${month}.md\`_`;

  await Promise.all([
    postSlackMessage({ text: slackText }),
    sendEmail({
      subject: `SEO digest — ${month}`,
      html: `<pre style="font-family:system-ui;white-space:pre-wrap;font-size:14px">${md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')}</pre>`,
    }),
  ]);
  console.log('Sent Slack + email.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
