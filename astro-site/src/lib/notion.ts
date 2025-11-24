import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

// Initialize Notion client
const auth = import.meta.env.NOTION_API_KEY;
if (!auth) {
  throw new Error('NOTION_API_KEY is not defined in environment variables');
}

const notion = new Client({ auth });
const n2m = new NotionToMarkdown({ notionClient: notion });

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedDate: string;
  tags: string[];
  featured: boolean;
  featuredImage?: string;
  content?: string;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const databaseId = import.meta.env.NOTION_DATABASE_ID;

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Published',
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: 'PublishedDate',
        direction: 'descending',
      },
    ],
  });

  const posts: BlogPost[] = [];

  for (const page of response.results) {
    if ('properties' in page) {
      const properties = page.properties;

      const title = properties.Name?.type === 'title'
        ? properties.Name.title[0]?.plain_text || 'Untitled'
        : 'Untitled';

      const slug = properties.Slug?.type === 'rich_text'
        ? properties.Slug.rich_text[0]?.plain_text || ''
        : '';

      const excerpt = properties.Excerpt?.type === 'rich_text'
        ? properties.Excerpt.rich_text[0]?.plain_text || ''
        : '';

      const publishedDate = properties.PublishedDate?.type === 'date'
        ? properties.PublishedDate.date?.start || ''
        : '';

      const tags = properties.Tags?.type === 'multi_select'
        ? properties.Tags.multi_select.map((tag: any) => tag.name)
        : [];

      const featured = properties.Featured?.type === 'checkbox'
        ? properties.Featured.checkbox
        : false;

      const featuredImage = properties.FeaturedImage?.type === 'url'
        ? properties.FeaturedImage.url || ''
        : '';

      posts.push({
        id: page.id,
        title,
        slug,
        excerpt,
        publishedDate,
        tags,
        featured,
        featuredImage,
      });
    }
  }

  return posts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  const post = posts.find(p => p.slug === slug);

  if (!post) return null;

  // Fetch the full content from Notion page body
  try {
    const mdblocks = await n2m.pageToMarkdown(post.id);
    const mdString = n2m.toMarkdownString(mdblocks);

    return {
      ...post,
      content: mdString.parent,
    };
  } catch (error) {
    console.error('Error fetching content for post:', post.slug, error);
    return {
      ...post,
      content: '',
    };
  }
}
