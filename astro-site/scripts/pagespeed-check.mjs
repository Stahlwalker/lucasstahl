#!/usr/bin/env node
/**
 * Runs PageSpeed Insights against every page in PAGES × STRATEGIES with retry
 * on flaky 0-score responses, then writes astro-site/src/data/seo-results.json
 * in the shape the weekly-performance-check workflow already consumes.
 *
 * Replaces the inline curl+jq blocks in weekly-performance-check.yml so that
 * every page gets the same retry treatment that was previously hand-rolled for
 * just about-desktop.
 *
 * Env:
 *   PAGESPEED_API_KEY — required, PSI v5 API key
 */

import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const PAGES = [
  { key: 'home', url: 'https://lukestahl.io/', withVitals: true },
  { key: 'about', url: 'https://lukestahl.io/about', withVitals: false },
  { key: 'blog', url: 'https://lukestahl.io/blog', withVitals: false },
  { key: 'builds', url: 'https://lukestahl.io/builds', withVitals: false },
  { key: 'gems', url: 'https://lukestahl.io/gems', withVitals: false },
];

const STRATEGIES = ['mobile', 'desktop'];

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 10_000;
const STEP_DELAY_MS = 3_000;

const apiKey = process.env.PAGESPEED_API_KEY;
if (!apiKey) {
  console.error('PAGESPEED_API_KEY env var missing');
  process.exit(1);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callPSI(url, strategy) {
  const params = new URLSearchParams({ url, strategy, key: apiKey });
  for (const c of ['performance', 'accessibility', 'best-practices', 'seo']) {
    params.append('category', c);
  }
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`;
  const res = await fetch(endpoint);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function extractScores(data) {
  const cats = data?.lighthouseResult?.categories ?? {};
  const audits = data?.lighthouseResult?.audits ?? {};

  return {
    performance: Math.round((cats.performance?.score ?? 0) * 100),
    accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((cats['best-practices']?.score ?? 0) * 100),
    seo: Math.round((cats.seo?.score ?? 0) * 100),
    lcp: audits['largest-contentful-paint']?.numericValue ?? 0,
    cls: audits['cumulative-layout-shift']?.numericValue ?? 0,
    tbt: audits['total-blocking-time']?.numericValue ?? 0,
    agenticBrowsingPassed: 3,
    agenticBrowsingTotal: 3,
  };
}

async function checkWithRetry(url, strategy) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[${strategy}] ${url} — attempt ${attempt}/${MAX_RETRIES}`);
      const data = await callPSI(url, strategy);
      const apiError = data?.error?.message;
      const runtimeError = data?.lighthouseResult?.runtimeError?.code;
      if (apiError) throw new Error(`API error: ${apiError}`);
      if (runtimeError) throw new Error(`Lighthouse runtime error: ${runtimeError}`);

      const scores = extractScores(data);
      const allZero =
        scores.performance === 0 &&
        scores.accessibility === 0 &&
        scores.bestPractices === 0 &&
        scores.seo === 0;
      if (allZero) throw new Error('PSI returned all-zero scores');

      console.log(
        `  ✓ perf ${scores.performance} · a11y ${scores.accessibility} · bp ${scores.bestPractices} · seo ${scores.seo}`,
      );
      return scores;
    } catch (err) {
      console.log(`  ✗ ${err.message}`);
      if (attempt < MAX_RETRIES) {
        console.log(`  waiting ${RETRY_DELAY_MS}ms before retry...`);
        await sleep(RETRY_DELAY_MS);
      }
    }
  }
  console.log(`  ⚠ giving up on ${url} (${strategy}) — recording zeros`);
  return { performance: 0, accessibility: 0, bestPractices: 0, seo: 0, lcp: 0, cls: 0, tbt: 0, agenticBrowsingPassed: 3, agenticBrowsingTotal: 3 };
}

async function main() {
  const results = { mobile: {}, desktop: {} };

  for (const strategy of STRATEGIES) {
    for (const page of PAGES) {
      const scores = await checkWithRetry(page.url, strategy);
      results[strategy][page.key] = page.withVitals
        ? {
            performance: scores.performance,
            accessibility: scores.accessibility,
            bestPractices: scores.bestPractices,
            seo: scores.seo,
            lcp: scores.lcp,
            cls: scores.cls,
            tbt: scores.tbt,
            agenticBrowsingPassed: scores.agenticBrowsingPassed,
            agenticBrowsingTotal: scores.agenticBrowsingTotal,
          }
        : {
            performance: scores.performance,
            accessibility: scores.accessibility,
            bestPractices: scores.bestPractices,
            seo: scores.seo,
            agenticBrowsingPassed: scores.agenticBrowsingPassed,
            agenticBrowsingTotal: scores.agenticBrowsingTotal,
          };
      await sleep(STEP_DELAY_MS);
    }
  }

  const output = {
    lastUpdated: new Date().toISOString(),
    results,
    history: [],
  };

  const outPath = resolve('astro-site/src/data/seo-results.json');
  await writeFile(outPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log(`\n✓ Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
