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

  // Static pages
  const staticPages = [
    {
      type: 'website' as const,
      title: 'About',
      description: 'Learn about Luke Stahl - developer marketer, background, experience, and the tools and companies he works with.',
      url: '/about/',
      tags: ['about', 'bio', 'background', 'experience', 'contact', 'freelance']
    },
    {
      type: 'website' as const,
      title: 'Developer Marketing Handbook',
      description: 'A handbook for developer marketing that covers goals, strategy, journey, personas, messaging, campaigns, content, community, and metrics.',
      url: '/handbook/',
      tags: ['handbook', 'guide', 'developer marketing', 'strategy', 'messaging', 'content', 'community', 'metrics', 'devrel']
    },
    {
      type: 'website' as const,
      title: 'Status Dashboard',
      description: 'Real-time status dashboard showing uptime, performance metrics, and operational health of developer marketing systems and infrastructure.',
      url: '/status/',
      tags: ['status', 'uptime', 'performance', 'monitoring', 'dashboard', 'health']
    },
    {
      type: 'website' as const,
      title: 'SEO Performance Dashboard',
      description: 'Real-time SEO and performance metrics for lukestahl.io. View PageSpeed Insights scores, Core Web Vitals, and Lighthouse metrics for all pages.',
      url: '/seo/',
      tags: ['seo', 'performance', 'lighthouse', 'core web vitals', 'pagespeed', 'metrics', 'lcp', 'cls', 'tbt', 'monitoring']
    },
    {
      type: 'website' as const,
      title: 'Dev Marketing Cheat Sheet',
      description: 'Quick reference guide for developer marketing covering key responsibilities, strategies, and tactics.',
      url: '/dev-marketing-cheat-sheet/',
      tags: ['cheat sheet', 'reference', 'developer marketing', 'guide', 'quick reference', 'devrel']
    },
    {
      type: 'website' as const,
      title: 'Design System',
      description: 'Design system for lukestahl.io - colors, typography, spacing, icons, and reusable component examples.',
      url: '/design-system/',
      tags: ['design', 'components', 'colors', 'typography', 'ui', 'ux', 'font', 'logo', 'brand', 'spacing', 'icons', 'buttons', 'badges']
    }
  ];

  staticPages.forEach(page => {
    searchIndex.push(page);
  });

  return searchIndex;
}
