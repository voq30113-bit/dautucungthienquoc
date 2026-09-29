/*
 * Content collections.
 *
 * Astro 6+ requires this file at `src/content.config.ts` (the older
 * `src/content/config.ts` location now throws LegacyContentConfigError).
 *
 * Every collection shares one Zod schema. A frontmatter violation fails
 * `astro build`, so a malformed auto-posted file breaks CI and never deploys.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const marketSnapshot = z
  .object({
    vnindex: z.number(), // 1775.09
    change: z.number(), // -26.56
    changePct: z.number(), // -1.47
    volume: z.number().optional(), // shares, e.g. 638302592
    valueBn: z.number().optional(), // VND bn, e.g. 16681
    foreignNetBn: z.number().optional(), // VND bn, negative = net sell
    advancers: z.number().int().nonnegative().optional(),
    decliners: z.number().int().nonnegative().optional(),
    unchanged: z.number().int().nonnegative().optional(),
  })
  .strict()
  .optional();

const source = z
  .object({
    label: z.string().min(1),
    url: z.url({ protocol: /^https?$/ }).optional(),
  })
  .strict();

export const entrySchema = z
  .object({
    title: z.string().min(1),
    date: z.coerce.date(),
    sessionDate: z.coerce.date().optional(), // trading session the piece covers
    standfirst: z.string().min(1), // 1–3 sentences, shown in lists and OG
    eyebrow: z.string().optional(),
    market: marketSnapshot,
    tags: z.array(z.string()).default([]),
    sources: z.array(source).default([]),
    revision: z.string().optional(), // renders as the accent chip
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  })
  .strict();

const collection = (dir: string) =>
  defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: `./src/content/${dir}` }),
    schema: entrySchema,
  });

export const collections = {
  'diem-tin': collection('diem-tin'),
  'nhan-dinh': collection('nhan-dinh'),
  'tong-ket': collection('tong-ket'),
  'bao-cao': collection('bao-cao'),
  'phan-tich': collection('phan-tich'),

  /*
   * RESERVED — portfolio section (/danh-muc/). Not built yet; see docs/ROADMAP.md.
   * Publishing real position sizes on a public site is a deliberate decision
   * the owner has not taken. Sketch only:
   *
   * danhMuc: defineCollection({
   *   loader: glob({ pattern: '**\/*.json', base: './src/content/danh-muc' }),
   *   schema: z.object({
   *     asOf: z.coerce.date(),
   *     currency: z.literal('VND').default('VND'),
   *     holdings: z.array(z.object({
   *       ticker: z.string().regex(/^[A-Z0-9]{3,10}$/),
   *       quantity: z.number().int().positive(),
   *       averageCost: z.number().positive(),      // VND per share
   *       openDate: z.coerce.date(),
   *     })),
   *     transactions: z.array(z.object({
   *       date: z.coerce.date(),
   *       ticker: z.string(),
   *       side: z.enum(['buy', 'sell']),
   *       quantity: z.number().int().positive(),
   *       price: z.number().positive(),
   *       fees: z.number().nonnegative().default(0),
   *       realisedPnl: z.number().optional(),       // set on closing trades
   *     })).default([]),
   *     unrealised: z.array(z.object({
   *       ticker: z.string(),
   *       marketPrice: z.number().positive(),
   *       unrealisedPnl: z.number(),
   *     })).default([]),
   *     snapshots: z.array(z.object({              // equity-curve history
   *       date: z.coerce.date(),
   *       equity: z.number(),
   *       cash: z.number(),
   *       benchmark: z.number().optional(),         // VN-Index close
   *     })).default([]),
   *   }),
   * }),
   */
};
