#!/usr/bin/env node
/**
 * Weekly SEO threshold alerts.
 *
 * Pulls last 7 days vs prior 7 days from Search Console (per page) and
 * fires Slack + email alerts when any page crosses a movement threshold.
 * Silent when nothing crossed — that's the point.
 *
 * Usage:
 *   node scripts/seo/threshold-alerts.mjs            # send alerts
 *   node scripts/seo/threshold-alerts.mjs --dry-run  # log only, no posts
 */

import { resolveSiteUrl, querySearchAnalytics, dateOffset } from './lib/gsc.mjs';
import { postSlackMessage } from './lib/slack.mjs';
import { sendEmail } from './lib/email.mjs';

const DRY_RUN = process.argv.includes('--dry-run');

// Tuned for a small personal site: only flag pages with enough volume to matter.
const MIN_CLICKS_LAST_WEEK = 5;
const MIN_IMPRESSIONS_LAST_WEEK = 100;
const CLICK_DROP_THRESHOLD = -0.3; // -30%
const IMPRESSION_DROP_THRESHOLD = -0.4; // -40%
const CLICK_SURGE_THRESHOLD = 1.0; // +100% (something good is happening)

function pct(curr, prev) {
  if (prev === 0) return curr > 0 ? Infinity : 0;
  return (curr - prev) / prev;
}

function formatPct(n) {
  if (!Number.isFinite(n)) return 'new';
  const sign = n >= 0 ? '+' : '';
  return `${sign}${(n * 100).toFixed(0)}%`;
}

async function main() {
  const siteUrl = await resolveSiteUrl();
  console.log(`Site: ${siteUrl}`);

  // GSC data has a ~2 day lag, so "this week" is days -9 through -3.
  const endThis = dateOffset(-3);
  const startThis = dateOffset(-9);
  const endPrior = dateOffset(-10);
  const startPrior = dateOffset(-16);

  console.log(`This week:  ${startThis} → ${endThis}`);
  console.log(`Prior week: ${startPrior} → ${endPrior}`);

  const [thisWeek, priorWeek] = await Promise.all([
    querySearchAnalytics({ siteUrl, startDate: startThis, endDate: endThis, dimensions: ['page'] }),
    querySearchAnalytics({ siteUrl, startDate: startPrior, endDate: endPrior, dimensions: ['page'] }),
  ]);

  const priorByPage = new Map(priorWeek.map((r) => [r.keys[0], r]));
  const movers = [];

  for (const row of thisWeek) {
    const page = row.keys[0];
    const currClicks = row.clicks ?? 0;
    const currImpr = row.impressions ?? 0;
    const prior = priorByPage.get(page);
    const prevClicks = prior?.clicks ?? 0;
    const prevImpr = prior?.impressions ?? 0;

    if (currClicks < MIN_CLICKS_LAST_WEEK && currImpr < MIN_IMPRESSIONS_LAST_WEEK) continue;

    const clickDelta = pct(currClicks, prevClicks);
    const imprDelta = pct(currImpr, prevImpr);

    const reasons = [];
    if (clickDelta <= CLICK_DROP_THRESHOLD && prevClicks >= MIN_CLICKS_LAST_WEEK) {
      reasons.push(`clicks ${formatPct(clickDelta)} (${prevClicks} → ${currClicks})`);
    }
    if (imprDelta <= IMPRESSION_DROP_THRESHOLD && prevImpr >= MIN_IMPRESSIONS_LAST_WEEK) {
      reasons.push(`impressions ${formatPct(imprDelta)} (${prevImpr} → ${currImpr})`);
    }
    if (clickDelta >= CLICK_SURGE_THRESHOLD && currClicks >= MIN_CLICKS_LAST_WEEK * 2) {
      reasons.push(`clicks surged ${formatPct(clickDelta)} (${prevClicks} → ${currClicks})`);
    }

    if (reasons.length > 0) {
      movers.push({ page, reasons, currClicks, currImpr });
    }
  }

  if (movers.length === 0) {
    console.log('No threshold crossings. Nothing to send.');
    return;
  }

  console.log(`${movers.length} pages crossed thresholds:`);
  movers.forEach((m) => console.log(` - ${m.page}: ${m.reasons.join(', ')}`));

  const lines = movers.map(
    (m) => `• <${m.page}|${m.page.replace(/^https?:\/\//, '')}>\n   ${m.reasons.join('\n   ')}`
  );
  const slackText = `🚨 *SEO threshold alerts* (week of ${startThis})\n${lines.join('\n')}`;

  const htmlList = movers
    .map(
      (m) =>
        `<li><a href="${m.page}">${m.page}</a><ul>${m.reasons
          .map((r) => `<li>${r}</li>`)
          .join('')}</ul></li>`
    )
    .join('');
  const html = `
    <h2>SEO threshold alerts — week of ${startThis}</h2>
    <p>${movers.length} page(s) crossed a movement threshold:</p>
    <ul>${htmlList}</ul>
    <p style="color:#666;font-size:12px">Compared ${startThis}→${endThis} vs ${startPrior}→${endPrior}.</p>
  `;

  if (DRY_RUN) {
    console.log('\n--- DRY RUN: would send the following ---');
    console.log('SLACK:', slackText);
    console.log('EMAIL HTML:', html);
    return;
  }

  await Promise.all([
    postSlackMessage({ text: slackText }),
    sendEmail({ subject: `SEO alerts: ${movers.length} page(s) moved`, html }),
  ]);
  console.log('Sent Slack + email.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
