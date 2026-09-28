/*
 * Content queries and URL helpers. Every internal link goes through
 * `href()` so the site works under a GitHub Pages path prefix and
 * after a move to a custom domain without template changes.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { vi, type CollectionKey } from '../i18n/vi';

export const COLLECTIONS = ['nhan-dinh', 'tong-ket', 'bao-cao', 'phan-tich'] as const satisfies readonly CollectionKey[];
export type Key = (typeof COLLECTIONS)[number];
export type Entry = CollectionEntry<Key>;

/** Drafts are visible in `astro dev` only; production builds drop them everywhere. */
const SHOW_DRAFTS = import.meta.env.DEV;

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Base-aware internal path: href('nhan-dinh/') → '/dautucungthienquoc/nhan-dinh/'. */
export function href(path = ''): string {
  const clean = path.replace(/^\/+/, '');
  return `${BASE}/${clean}`;
}

/** Absolute URL for canonical, OG, RSS and sitemap. */
export function absolute(path: string, site: URL | undefined): string {
  return new URL(href(path), site ?? 'http://localhost:4321').toString();
}

export const entryPath = (e: Entry) => `${e.collection}/${e.id}/`;
export const entryHref = (e: Entry) => href(entryPath(e));

/** Unique view-transition name so list headlines morph into the article h1. */
export const vtName = (e: Entry) => `h-${e.collection}-${e.id}`.replace(/[^a-zA-Z0-9_-]/g, '-');

export function isCollection(key: string): key is Key {
  return (COLLECTIONS as readonly string[]).includes(key);
}

export const collectionLabel = (key: Key) => vi.collections[key].label;

function byDateDesc(a: Entry, b: Entry): number {
  const d = b.data.date.getTime() - a.data.date.getTime();
  if (d !== 0) return d;
  return b.id.localeCompare(a.id);
}

export async function getEntries(key: Key): Promise<Entry[]> {
  const list = (await getCollection(key, (e) => SHOW_DRAFTS || !e.data.draft)) as Entry[];
  return list.sort(byDateDesc);
}

export async function getAllEntries(): Promise<Entry[]> {
  const lists = await Promise.all(COLLECTIONS.map((k) => getEntries(k)));
  return lists.flat().sort(byDateDesc);
}

/** Reading time for Vietnamese prose (~220 syllable-words per minute). */
export function readingTime(e: Entry): number {
  const text = (e.body ?? '')
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`|[\]()-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Session date the piece covers, falling back to the publish date. */
export const dataDate = (e: Entry) => e.data.sessionDate ?? e.data.date;

export const PAGE_SIZE = 12;
