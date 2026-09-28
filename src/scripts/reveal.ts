/*
 * Scroll reveal. Content is visible by default; this module only hides
 * elements that start below the fold, then settles them into place once.
 *
 *   data-reveal           reveal the element itself
 *   data-reveal-stagger   reveal each child, 70ms apart (max six steps)
 *   data-reveal-bars      animate .fill scaleX 0 → 1 on first view
 */
const STAGGER_MS = 70;
const MAX_STEPS = 6;

let observer: IntersectionObserver | null = null;

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initReveal() {
  observer?.disconnect();
  observer = null;
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  const fold = window.innerHeight;
  const below = (el: Element) => el.getBoundingClientRect().top > fold * 0.92;

  observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        if (el.hasAttribute('data-reveal-bars')) el.classList.add('bars-in');
        else el.classList.add('rv-in');
        obs.unobserve(el);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
  );

  document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger]').forEach((group) => {
    const items = group.hasAttribute('data-reveal-stagger')
      ? (Array.from(group.children) as HTMLElement[])
      : [group];
    items.forEach((el, i) => {
      if (el.classList.contains('rv') || !below(el)) return;
      el.style.setProperty('--rv-delay', `${Math.min(i, MAX_STEPS - 1) * STAGGER_MS}ms`);
      el.classList.add('rv');
      observer!.observe(el);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-reveal-bars]').forEach((el) => {
    if (el.classList.contains('bars-armed')) return;
    el.classList.add('bars-armed');
    observer!.observe(el);
  });
}

export function teardownReveal() {
  observer?.disconnect();
  observer = null;
}
