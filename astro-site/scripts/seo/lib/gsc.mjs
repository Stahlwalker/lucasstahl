/**
 * Google Search Console client.
 *
 * Uses OAuth user credentials (refresh token) rather than a service account
 * because GSC's "Add user" flow can be flaky for service accounts on personal
 * properties. The refresh token is non-expiring (until revoked).
 */

import { OAuth2Client } from 'google-auth-library';

const GSC_BASE = 'https://searchconsole.googleapis.com/webmasters/v3';

let cachedClient = null;

function getOAuthClient() {
  if (cachedClient) return cachedClient;

  const { GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET, GSC_OAUTH_REFRESH_TOKEN } = process.env;
  if (!GSC_OAUTH_CLIENT_ID || !GSC_OAUTH_CLIENT_SECRET || !GSC_OAUTH_REFRESH_TOKEN) {
    throw new Error('Missing GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET, or GSC_OAUTH_REFRESH_TOKEN');
  }

  cachedClient = new OAuth2Client(GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET);
  cachedClient.setCredentials({ refresh_token: GSC_OAUTH_REFRESH_TOKEN });
  return cachedClient;
}

async function getAccessToken() {
  const client = getOAuthClient();
  const { token } = await client.getAccessToken();
  if (!token) throw new Error('Failed to mint access token from refresh token');
  return token;
}

async function gscFetch(path, init = {}) {
  const token = await getAccessToken();
  const res = await fetch(`${GSC_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GSC ${init.method ?? 'GET'} ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

/**
 * Resolves the canonical GSC site URL for lukestahl.io.
 * Prefers the explicit GSC_SITE_URL env var; otherwise picks the first
 * matching property the authenticated user owns.
 */
export async function resolveSiteUrl() {
  if (process.env.GSC_SITE_URL) return process.env.GSC_SITE_URL;

  const { siteEntry = [] } = await gscFetch('/sites');
  const match = siteEntry.find(
    (s) =>
      s.siteUrl === 'https://lukestahl.io/' ||
      s.siteUrl === 'sc-domain:lukestahl.io'
  );
  if (!match) {
    throw new Error(
      'No lukestahl.io property found in GSC. Set GSC_SITE_URL to override.'
    );
  }
  return match.siteUrl;
}

/**
 * Runs a searchAnalytics.query against GSC.
 * @param {object} opts
 * @param {string} opts.siteUrl
 * @param {string} opts.startDate - YYYY-MM-DD
 * @param {string} opts.endDate - YYYY-MM-DD
 * @param {string[]} [opts.dimensions] - e.g. ['page'], ['query'], ['page','query']
 * @param {number} [opts.rowLimit] - default 1000
 */
export async function querySearchAnalytics({
  siteUrl,
  startDate,
  endDate,
  dimensions = [],
  rowLimit = 1000,
}) {
  const encoded = encodeURIComponent(siteUrl);
  const data = await gscFetch(`/sites/${encoded}/searchAnalytics/query`, {
    method: 'POST',
    body: JSON.stringify({ startDate, endDate, dimensions, rowLimit }),
  });
  return data.rows ?? [];
}

/**
 * Returns YYYY-MM-DD for the given offset in days from today.
 */
export function dateOffset(days, baseDate = new Date()) {
  const d = new Date(baseDate);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
