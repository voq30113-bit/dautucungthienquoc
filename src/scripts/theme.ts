/*
 * Theme toggle. The blocking inline script in BaseLayout applies the stored
 * choice before first paint; this module wires the button.
 * An explicit choice overrides the OS setting in both directions.
 */
const KEY = 'theme';
type Theme = 'light' | 'dark';

const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function effective(): Theme {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  return media().matches ? 'dark' : 'light';
}

function sync(button: HTMLButtonElement) {
  const current = effective();
  button.setAttribute('aria-label', current === 'dark' ? button.dataset.toLight! : button.dataset.toDark!);
  button.dataset.current = current;
}

let bound = false;

export function initTheme() {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!button) return;
  sync(button);
  button.onclick = () => {
    const next: Theme = effective() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable: choice lasts for this page view */
    }
    sync(button);
  };
  if (!bound) {
    bound = true;
    media().addEventListener('change', () => {
      if (stored()) return;
      const b = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
      if (b) sync(b);
    });
  }
}
