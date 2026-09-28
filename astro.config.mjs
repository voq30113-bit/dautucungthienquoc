// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

/*
 * Site origin and base path.
 *
 * In CI the deploy workflow injects SITE_URL / SITE_BASE from
 * actions/configure-pages, so the published site is always correct.
 * These fallbacks are used for local builds.
 *
 * TODO(owner): replace `TODO-github-username` with your GitHub username.
 * Moving to a custom domain: change these two lines — see docs/DOMAIN.md.
 */
const SITE = process.env.SITE_URL || 'https://TODO-github-username.github.io';
const BASE = process.env.SITE_BASE ?? '/dautucungthienquoc';

export default defineConfig({
  site: SITE,
  base: BASE || '/',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx()],
  devToolbar: { enabled: false },
  build: { format: 'directory' },
});
