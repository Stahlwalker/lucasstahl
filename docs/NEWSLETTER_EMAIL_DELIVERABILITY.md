# Newsletter Email Deliverability

## Google Postmaster Tools domain verification

To keep newsletter sends from landing in spam, `lukestahl.io` needed to be
verified as a domain at [postmaster.google.com](https://postmaster.google.com/).
Verification required adding a DNS record for `lukestahl.io` (via Cloudflare,
the domain's DNS provider — see `DOMAIN_MIGRATION_GUIDE.md`).

- **Why**: Gmail (and other providers) use Postmaster Tools data — domain
  reputation, spam rate, feedback loop — to decide whether to inbox or spam
  mail from a sending domain. Without verification, none of that reputation
  signal is available, which increases the odds of newsletter sends being
  filtered as spam.
- **What was done**: Verified domain ownership of `lukestahl.io` in Google
  Postmaster Tools by adding the verification DNS record it provided.
- **Where**: Cloudflare DNS dashboard for `lukestahl.io`.
- **Status**: Verified 2026-09-16 — `lukestahl.io` shows as "Verified" with
  "No issues" in the Postmaster Tools Manage Domains list.

If newsletter deliverability issues come up again, check:
1. That the Postmaster Tools verification record is still present in
   Cloudflare DNS (records can get pruned during other DNS cleanup).
2. Postmaster Tools' domain reputation/spam-rate dashboard for `lukestahl.io`.
3. That SPF/DKIM/DMARC records for the sending domain (Resend) are intact.
