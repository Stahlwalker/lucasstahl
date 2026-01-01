// Search index builder for Fuse.js
import { getBlogPosts } from './notion';
import { builds, tinyApps, externalBlogPosts, gems } from '../data/content';

export interface SearchItem {
  type: 'blog' | 'build' | 'gem' | 'website';
  title: string;
  description: string;
  url: string;
  tags?: string[];
  date?: string;
}

export async function buildSearchIndex(): Promise<SearchItem[]> {
  const searchIndex: SearchItem[] = [];

  // Get Notion blog posts (dynamic)
  const notionPosts = await getBlogPosts();
  notionPosts.forEach(post => {
    searchIndex.push({
      type: 'blog',
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}/`,
      tags: post.tags,
      date: post.publishedDate
    });
  });

  // External blog posts (imported from content.ts)
  externalBlogPosts.forEach(post => {
    searchIndex.push({
      type: 'blog',
      title: post.title,
      description: post.description,
      url: post.url,
      tags: post.tags,
      date: post.date
    });
  });

  // Main builds (imported from content.ts)
  builds.forEach(build => {
    searchIndex.push({
      type: 'build',
      title: build.title,
      description: build.description,
      url: build.url,
      tags: build.tags
    });
  });

  // Tiny apps (imported from content.ts)
  tinyApps.forEach(app => {
    searchIndex.push({
      type: 'build',
      title: app.title,
      description: app.description,
      url: app.url,
      tags: app.tags
    });
  });

  // Gems (imported from content.ts)
  gems.forEach(gem => {
    searchIndex.push({
      type: 'gem',
      title: gem.title,
      description: gem.description,
      url: gem.url,
      tags: gem.tags
    });
  });

  return searchIndex;
}
