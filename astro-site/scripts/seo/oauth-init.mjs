#!/usr/bin/env node
/**
 * One-time OAuth init for the GSC scripts.
 *
 * Usage:
 *   npm run auth:gsc -- /path/to/oauth-client.json
 *
 * Reads the OAuth client JSON downloaded from GCP, opens a browser to log in
 * as a user who owns the Search Console property, captures the refresh token,
 * and prints the three values to paste into GitHub secrets.
 */

import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { exec } from 'node:child_process';
import { OAuth2Client } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

const clientJsonPath = process.argv[2];
if (!clientJsonPath) {
  console.error('Usage: npm run auth:gsc -- /path/to/oauth-client.json');
  process.exit(1);
}

const raw = JSON.parse(readFileSync(clientJsonPath, 'utf8'));
const creds = raw.installed ?? raw.web;
if (!creds?.client_id || !creds?.client_secret) {
  console.error('That file does not look like a Desktop OAuth client JSON.');
  process.exit(1);
}

const { client_id, client_secret } = creds;

const server = createServer();
server.listen(0, '127.0.0.1', () => {
  const port = server.address().port;
  const redirectUri = `http://127.0.0.1:${port}`;
  const oauth = new OAuth2Client(client_id, client_secret, redirectUri);

  const url = oauth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });

  console.log('\nOpening your browser to authorize...');
  console.log(`If it does not open, visit:\n${url}\n`);
  exec(`open "${url}"`);

  server.on('request', async (req, res) => {
    const reqUrl = new URL(req.url, redirectUri);
    const code = reqUrl.searchParams.get('code');
    const err = reqUrl.searchParams.get('error');

    if (err) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Auth failed: ${err}. You can close this tab.`);
      console.error(`Auth failed: ${err}`);
      server.close();
      process.exit(1);
    }

    if (!code) {
      res.end('Waiting for auth code...');
      return;
    }

    try {
      const { tokens } = await oauth.getToken(code);
      res.end('Auth complete. Return to your terminal — you can close this tab.');
      server.close();

      if (!tokens.refresh_token) {
        console.error('\nNo refresh_token returned. Revoke the app at https://myaccount.google.com/permissions and re-run.');
        process.exit(1);
      }

      console.log('\n=== Add these to GitHub repo secrets ===');
      console.log(`GSC_OAUTH_CLIENT_ID=${client_id}`);
      console.log(`GSC_OAUTH_CLIENT_SECRET=${client_secret}`);
      console.log(`GSC_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
      console.log('========================================\n');
      console.log('Paste each as a separate secret at:');
      console.log('https://github.com/Stahlwalker/lucasstahl/settings/secrets/actions');
    } catch (e) {
      console.error('Token exchange failed:', e.message);
      server.close();
      process.exit(1);
    }
  });
});
