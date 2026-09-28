import type { APIRoute } from 'astro';
import { absolute, href } from '../lib/content';

export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\nDisallow: ${href('danh-muc/')}\n\nSitemap: ${absolute('sitemap.xml', site)}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
