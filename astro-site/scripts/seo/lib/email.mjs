/**
 * Resend email helper. Matches the env var names already used by the
 * link-checker and weekly-performance-check automation.
 */

export async function sendEmail({ subject, html, text }) {
  const { RESEND_API_KEY, FROM_EMAIL, NOTIFICATION_EMAIL } = process.env;
  if (!RESEND_API_KEY || !FROM_EMAIL || !NOTIFICATION_EMAIL) {
    throw new Error('Missing RESEND_API_KEY, FROM_EMAIL, or NOTIFICATION_EMAIL');
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: NOTIFICATION_EMAIL,
      subject,
      html,
      ...(text ? { text } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend send failed: ${res.status}: ${body}`);
  }
  return res.json();
}
