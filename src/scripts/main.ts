/*
 * Site-wide client entry. `astro:page-load` fires on first load and after
 * every client-side navigation, so each module re-initialises per page.
 */
import { initTheme } from './theme';
import { initReveal, teardownReveal } from './reveal';
import { initCountUp } from './countup';

document.addEventListener('astro:page-load', () => {
  initTheme();
  initReveal();
  initCountUp();
});
document.addEventListener('astro:before-swap', teardownReveal);
