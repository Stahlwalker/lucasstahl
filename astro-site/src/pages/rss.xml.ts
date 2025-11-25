import rss from '@astrojs/rss';
import { getBlogPosts, getBlogPostBySlug } from '../lib/notion';
import { marked } from 'marked';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getBlogPosts();

  // Fetch full content for all posts
  const postsWithContent = await Promise.all(
    posts.map(async (post) => {
      const fullPost = await getBlogPostBySlug(post.slug);
      return fullPost || post;
    })
  );

  return rss({
    title: "Luke Stahl's Blog",
    description: 'Articles on web development, CMS platforms, AI tools, and developer marketing',
    site: context.site || 'https://lucasstahl.com',
    items: postsWithContent.map((post) => ({
      title: post.title,
      pubDate: new Date(post.publishedDate),
      description: post.excerpt,
      link: `/blog/${post.slug}/`,
      content: post.content ? marked(post.content) : post.excerpt,
      categories: post.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
