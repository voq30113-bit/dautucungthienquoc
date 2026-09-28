import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

/*
 * Site origin and base path.
 *
 * In CI the deploy workflow injects SITE_URL / SITE_BASE from
 * actions/configure-pages, so the published site is always correct.
 * These fallbacks are used for local builds.
 *
 * Moving to a custom domain: change these two lines — see docs/DOMAIN.md.
 */
const SITE = process.env.SITE_URL || 'https://voq30113-bit.github.io';
const BASE = process.env.SITE_BASE ?? '/dautucungthienquoc';

export default defineConfig({
  site: SITE,
  base: BASE || '/',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx()],
  // Content images (src/assets/) get width/height, srcset and sizes.
  image: { layout: 'constrained', responsiveStyles: true },
  devToolbar: { enabled: false },
  // Inline all CSS: removes a render-blocking request on first view.
  build: { format: 'directory', inlineStylesheets: 'always' },
  vite: {
    build: {
      rolldownOptions: {
        onLog(level, log, handler) {
          // Astro marks every MDX content entry with a "use astro:head-inject"
          // directive that it reads before bundling; rolldown warns it will not
          // preserve it. Harmless and upstream — drop only that exact warning.
          if (log.code === 'MODULE_LEVEL_DIRECTIVE' && log.message.includes('astro:head-inject')) return;
          handler(level, log);
        },
      },
    },
  },
});
