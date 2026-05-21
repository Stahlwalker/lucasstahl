/**
 * Slack chat.postMessage helper.
 * Uses the bot token from the existing alerts bot.
 */

export async function postSlackMessage({ text, blocks }) {
  const { SLACK_BOT_TOKEN, SLACK_ANALYTICS_CHANNEL_ID } = process.env;
  if (!SLACK_BOT_TOKEN || !SLACK_ANALYTICS_CHANNEL_ID) {
    throw new Error('Missing SLACK_BOT_TOKEN or SLACK_ANALYTICS_CHANNEL_ID');
  }

  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      channel: SLACK_ANALYTICS_CHANNEL_ID,
      text,
      ...(blocks ? { blocks } : {}),
    }),
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Slack chat.postMessage failed: ${data.error}`);
  }
  return data;
}
