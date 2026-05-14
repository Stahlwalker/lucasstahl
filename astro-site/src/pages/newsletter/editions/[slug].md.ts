import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const editions = await getCollection('newsletter-editions');
  return editions.map(edition => ({
    params: { slug: edition.id },
    props: { edition },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { edition } = props as { edition: Awaited<ReturnType<typeof getCollection<'newsletter-editions'>>>[number] };
  const { title, publishedDate, description, edition: editionNumber } = edition.data;

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `slug: ${edition.id}`,
    publishedDate ? `date: ${publishedDate}` : '',
    description ? `description: ${JSON.stringify(description)}` : '',
    editionNumber != null ? `edition: ${editionNumber}` : '',
    `canonical: https://lukestahl.io/newsletter/editions/${edition.id}/`,
    '---',
  ].filter(Boolean).join('\n');

  return new Response(`${frontmatter}\n\n${edition.body || ''}`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
