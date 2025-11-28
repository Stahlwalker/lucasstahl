import type { APIContext } from 'astro';
import { buildSearchIndex } from '../lib/searchIndex';

export async function GET(context: APIContext) {
  const searchIndex = await buildSearchIndex();

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
