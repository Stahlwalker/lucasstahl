import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';

export const GET: APIRoute = async () => {
  const entry = await getEntry('pages', 'handbook');
  if (!entry) {
    return new Response('Not Found', { status: 404 });
  }

  const { title, description } = entry.data;
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `canonical: https://lukestahl.io/handbook/`,
    '---',
  ].join('\n');

  return new Response(`${frontmatter}\n\n${entry.body || ''}`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
