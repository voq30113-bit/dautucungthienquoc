/*
 * Ticker figures count up from zero on first view (~700ms, ease-out),
 * keeping decimal places and Vietnamese number formatting. Under reduced
 * motion nothing runs and the server-rendered final values stay put.
 *
 *   <span data-count="1775.09" data-decimals="2" data-signed>1.775,09</span>
 */
import { formatNumber } from '../lib/format';
import { prefersReducedMotion } from './reveal';

const DURATION = 700;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

let observer: IntersectionObserver | null = null;

function run(el: HTMLElement) {
  const target = Number(el.dataset.count);
  const decimals = Number(el.dataset.decimals ?? 0);
  const signed = el.hasAttribute('data-signed');
  const final = el.textContent ?? '';
  if (!Number.isFinite(target)) return;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / DURATION);
    if (t < 1) {
      el.textContent = formatNumber(target * easeOutCubic(t), decimals, signed);
      requestAnimationFrame(tick);
    } else {
      el.textContent = final;
    }
  };
  el.textContent = formatNumber(0, decimals, false);
  requestAnimationFrame(tick);
}

export function initCountUp() {
  observer?.disconnect();
  observer = null;
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll<HTMLElement>('[data-count]:not([data-counted])');
  if (!els.length) return;
  observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.setAttribute('data-counted', '');
        obs.unobserve(el);
        run(el);
      }
    },
    { threshold: 0.15 },
  );
  els.forEach((el) => observer!.observe(el));
}
