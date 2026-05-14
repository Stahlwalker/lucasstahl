import type { APIRoute } from 'astro';
import { getBlogPosts, getBlogPostBySlug } from '../../lib/notion';

export async function getStaticPaths() {
  const posts = await getBlogPosts();
  return posts
    .filter(post => post.slug && post.slug.trim() !== '')
    .map(post => ({ params: { slug: post.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const post = await getBlogPostBySlug(params.slug!);
  if (!post) {
    return new Response('Not Found', { status: 404 });
  }

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(post.title)}`,
    `slug: ${post.slug}`,
    post.publishedDate ? `date: ${post.publishedDate}` : '',
    post.excerpt ? `description: ${JSON.stringify(post.excerpt)}` : '',
    post.tags?.length ? `tags: [${post.tags.map(t => JSON.stringify(t)).join(', ')}]` : '',
    `canonical: https://lukestahl.io/blog/${post.slug}/`,
    '---',
  ].filter(Boolean).join('\n');

  return new Response(`${frontmatter}\n\n${post.content || ''}`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
