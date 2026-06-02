# Fixing expired GSC OAuth tokens

The `SEO monthly digest` and `SEO threshold alerts` GitHub Actions workflows authenticate to the Google Search Console API using an OAuth refresh token stored in the `GSC_OAUTH_REFRESH_TOKEN` repo secret. When that token expires, both workflows fail with:

```
GaxiosError: invalid_grant — Token has been expired or revoked.
```

## Why it keeps happening

If the OAuth app in Google Cloud is in **Testing** publishing status, Google expires every refresh token **7 days after issue**, regardless of usage. The fix below has two parts: regenerate the token (short-term) and publish the app (permanent).

## Step 1 — Regenerate the refresh token (5 min)

You need the OAuth client JSON downloaded from Google Cloud when this was first set up. If you don't have it, see "Recreating the OAuth client" below.

```bash
cd astro-site
npm run auth:gsc -- /path/to/oauth-client.json
```

The script (`scripts/seo/oauth-init.mjs`):

1. Opens a browser to Google's consent screen
2. You log in as the user that owns the Search Console property for `lukestahl.io`
3. Prints three values — only `GSC_OAUTH_REFRESH_TOKEN` is new

Update the secret:

1. Go to https://github.com/Stahlwalker/lucasstahl/settings/secrets/actions
2. Edit `GSC_OAUTH_REFRESH_TOKEN` → paste the new value
3. Leave `GSC_OAUTH_CLIENT_ID` and `GSC_OAUTH_CLIENT_SECRET` alone unless you regenerated the OAuth client

Re-run both workflows to confirm:

```bash
gh workflow run "SEO monthly digest"
gh workflow run "SEO threshold alerts"
```

## Step 2 — Publish the OAuth app (stops the 7-day expiry)

1. Go to https://console.cloud.google.com/apis/credentials/consent
2. Click **Publish App** → confirm

The `webmasters.readonly` scope is non-sensitive, so Google does not require verification review. Publishing simply removes the 7-day refresh-token expiry.

Skip this step and the token will die again roughly every Monday.

## Recreating the OAuth client (if the JSON is lost)

1. https://console.cloud.google.com/apis/credentials
2. **Create Credentials → OAuth client ID → Desktop app**
3. Download the JSON
4. Run Step 1 with the new JSON
5. Update all three secrets (`GSC_OAUTH_CLIENT_ID`, `GSC_OAUTH_CLIENT_SECRET`, `GSC_OAUTH_REFRESH_TOKEN`)

## Other causes of `invalid_grant`

If the token dies again after publishing the app:

- You changed your Google password (revokes all refresh tokens)
- You revoked the app at https://myaccount.google.com/permissions
- A new refresh token was issued for the same client+user+scope and superseded the old one (Google caps refresh tokens per pair)
- The token went 6 months without use

In every case, the fix is the same: rerun Step 1.
