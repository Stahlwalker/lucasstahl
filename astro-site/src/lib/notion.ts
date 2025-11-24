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
  ogImage?: string;
  metaTitle?: string;
  metaDescription?: string;
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

      const ogImage = properties.OGImage?.type === 'url'
        ? properties.OGImage.url || ''
        : '';

      const metaTitle = properties.MetaTitle?.type === 'rich_text'
        ? properties.MetaTitle.rich_text[0]?.plain_text || ''
        : '';

      const metaDescription = properties.MetaDescription?.type === 'rich_text'
        ? properties.MetaDescription.rich_text[0]?.plain_text || ''
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
        ogImage,
        metaTitle,
        metaDescription,
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

    // Extract first image from content if no OG image is set
    let firstImageUrl = '';
    if (!post.ogImage && !post.featuredImage) {
      // Fetch blocks to find first image
      const blocks = await notion.blocks.children.list({
        block_id: post.id,
        page_size: 100,
      });

      for (const block of blocks.results) {
        if ('type' in block && block.type === 'image') {
          const imageBlock = block as any;
          if (imageBlock.image?.type === 'external') {
            firstImageUrl = imageBlock.image.external.url;
            break;
          } else if (imageBlock.image?.type === 'file') {
            firstImageUrl = imageBlock.image.file.url;
            break;
          }
        }
      }
    }

    return {
      ...post,
      content: mdString.parent,
      ogImage: post.ogImage || post.featuredImage || firstImageUrl || '',
    };
  } catch (error) {
    console.error('Error fetching content for post:', post.slug, error);
    return {
      ...post,
      content: '',
    };
  }
}
