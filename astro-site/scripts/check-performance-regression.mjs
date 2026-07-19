#!/usr/bin/env node
/**
 * Reads the results written by pagespeed-check.mjs and flags a regression if
 * any Lighthouse category score falls in Lighthouse's own "red" band (<50 —
 * the same threshold the weekly report email already uses for color-coding)
 * or a homepage Core Web Vital crosses Google's "poor" threshold
 * (LCP >4000ms, CLS >0.25, TBT >600ms).
 *
 * Writes has_regression and reasons to $GITHUB_OUTPUT so the workflow can
 * skip creating a GitHub issue when nothing regressed.
 */

import { readFileSync, appendFileSync } from 'node:fs';
import { resolve } from 'node:path';

const RED_THRESHOLD = 50;
const CWV_POOR = { lcp: 4000, cls: 0.25, tbt: 600 };

const data = JSON.parse(readFileSync(resolve('astro-site/src/data/seo-results.json'), 'utf8'));

const reasons = [];

for (const device of Object.keys(data.results)) {
  for (const [page, scores] of Object.entries(data.results[device])) {
    for (const category of ['performance', 'accessibility', 'bestPractices', 'seo']) {
      const score = scores[category];
      if (typeof score === 'number' && score < RED_THRESHOLD) {
        reasons.push(`${device} ${page} ${category}: ${score} (below ${RED_THRESHOLD})`);
      }
    }
    if (typeof scores.lcp === 'number' && scores.lcp > CWV_POOR.lcp) {
      reasons.push(`${device} ${page} LCP: ${Math.round(scores.lcp)}ms (above ${CWV_POOR.lcp}ms)`);
    }
    if (typeof scores.cls === 'number' && scores.cls > CWV_POOR.cls) {
      reasons.push(`${device} ${page} CLS: ${scores.cls.toFixed(3)} (above ${CWV_POOR.cls})`);
    }
    if (typeof scores.tbt === 'number' && scores.tbt > CWV_POOR.tbt) {
      reasons.push(`${device} ${page} TBT: ${Math.round(scores.tbt)}ms (above ${CWV_POOR.tbt}ms)`);
    }
  }
}

const hasRegression = reasons.length > 0;

console.log(hasRegression ? `Regression detected:\n${reasons.join('\n')}` : 'No regressions detected.');

const githubOutput = process.env.GITHUB_OUTPUT;
if (githubOutput) {
  appendFileSync(githubOutput, `has_regression=${hasRegression}\n`);
  appendFileSync(githubOutput, `reasons<<REGRESSION_EOF\n${reasons.join('\n')}\nREGRESSION_EOF\n`);
}
