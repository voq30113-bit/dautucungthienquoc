/*
 * sitemap.xml at the site root. Lists published pages only:
 * drafts, /danh-muc/ (reserved) and 404 are excluded.
 */
import type { APIRoute } from 'astro';
import { COLLECTIONS, PAGE_SIZE, absolute, entryPath, getEntries } from '../lib/content';
import { isoDay } from '../lib/format';
import { esc } from '../lib/xml';

export const GET: APIRoute = async ({ site }) => {
  const urls: { loc: string; lastmod?: string }[] = [];
  const add = (path: string, lastmod?: Date) =>
    urls.push({ loc: absolute(path, site), lastmod: lastmod && isoDay(lastmod) });

  let newest: Date | undefined;
  for (const c of COLLECTIONS) {
    const entries = await getEntries(c);
    const latest = entries[0]?.data.date;
    if (latest && (!newest || latest > newest)) newest = latest;
    add(`${c}/`, latest);
    for (let p = 2; p <= Math.ceil(entries.length / PAGE_SIZE); p++) add(`${c}/trang/${p}/`);
    for (const e of entries) add(entryPath(e), e.data.date);
  }
  add('', newest);
  add('luu-tru/', newest);

  const body = urls
    .map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
