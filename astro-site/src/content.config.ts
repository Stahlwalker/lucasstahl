import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const newsletterEditions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/newsletter-editions' }),
  schema: z.object({
    title: z.string(),
    edition: z.number(),
    publishedDate: z.string(),
    description: z.string(),
    heroImage: z.string(),
  }),
});

export const collections = {
  'newsletter-editions': newsletterEditions,
};
