/*
 * Full-text RSS feed of all published pieces (drafts excluded).
 * MDX bodies are rendered through the Astro container API so reports
 * with embedded components appear in full.
 */
import type { APIRoute } from 'astro';
import { render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer as mdxRenderer } from '@astrojs/mdx/container-renderer';
import * as components from '../components/mdx';
import { vi } from '../i18n/vi';
import { absolute, entryPath, getAllEntries } from '../lib/content';
import { cdata, esc } from '../lib/xml';

const LIMIT = 50;

export const GET: APIRoute = async ({ site }) => {
  const renderers = await loadRenderers([mdxRenderer()]);
  const container = await AstroContainer.create({ renderers });
  const entries = (await getAllEntries()).slice(0, LIMIT);
  const self = absolute('rss.xml', site);

  const items = await Promise.all(
    entries.map(async (e) => {
      const { Content } = await render(e);
      const html = await container.renderToString(Content, { props: { components } });
      const link = absolute(entryPath(e), site);
      const disclaimer = `<hr/><p><em>${esc(vi.disclaimer.text)}</em></p>`;
      return `    <item>
      <title>${esc(e.data.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>
      <pubDate>${e.data.date.toUTCString()}</pubDate>
      <category>${esc(vi.collections[e.collection].title)}</category>
      <dc:creator>${esc(vi.site.author)}</dc:creator>
      <description>${esc(e.data.standfirst)}</description>
      <content:encoded>${cdata(`<p><strong>${esc(e.data.standfirst)}</strong></p>${html}${disclaimer}`)}</content:encoded>
    </item>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(vi.site.name)}</title>
    <link>${esc(absolute('', site))}</link>
    <atom:link href="${esc(self)}" rel="self" type="application/rss+xml"/>
    <description>${esc(vi.site.description)}</description>
    <language>vi</language>
    <lastBuildDate>${(entries[0]?.data.date ?? new Date()).toUTCString()}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
