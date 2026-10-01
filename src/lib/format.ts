/*
 * Vietnamese number and date formatting. Pure functions, safe to import
 * from both server templates and client scripts.
 *
 * Numbers: `.` thousands, `,` decimals, true minus sign (U+2212).
 */
const TZ = 'Asia/Ho_Chi_Minh';
const MINUS = '−';

const nfCache = new Map<number, Intl.NumberFormat>();
function nf(decimals: number): Intl.NumberFormat {
  let f = nfCache.get(decimals);
  if (!f) {
    f = new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    nfCache.set(decimals, f);
  }
  return f;
}

/** 1775.09 → "1.775,09"; -26.56 → "−26,56"; signed → "+26,56". */
export function formatNumber(value: number, decimals = 0, signed = false): string {
  const abs = nf(decimals).format(Math.abs(value));
  const isZero = Number(abs.replace(/\./g, '').replace(',', '.')) === 0;
  if (value < 0 && !isZero) return MINUS + abs;
  if (signed && value > 0 && !isZero) return '+' + abs;
  return abs;
}

/**
 * Decimal places needed to show every value without rounding (max 4).
 * Used when authors pass raw numbers without an explicit `decimals`.
 */
export function precision(...values: number[]): number {
  let max = 0;
  for (const v of values) {
    if (!Number.isFinite(v)) continue;
    const frac = String(v).split('.')[1];
    if (frac) max = Math.max(max, Math.min(frac.length, 4));
  }
  return max;
}

export type Direction = 'up' | 'down' | 'flat';

export function direction(value: number | undefined): Direction {
  if (value === undefined || value === 0) return 'flat';
  return value > 0 ? 'up' : 'down';
}

/** Arrow glyph so direction never relies on colour alone. */
export function arrow(dir: Direction): string {
  return dir === 'up' ? '▲' : dir === 'down' ? '▼' : '■';
}

const dateFmt = new Intl.DateTimeFormat('vi-VN', {
  timeZone: TZ,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});
const shortFmt = new Intl.DateTimeFormat('vi-VN', { timeZone: TZ, day: '2-digit', month: '2-digit' });
const longFmt = new Intl.DateTimeFormat('vi-VN', {
  timeZone: TZ,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const partsFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** "28/09/2026" */
export const formatDate = (d: Date) => dateFmt.format(d);
/** "28/09" */
export const formatShortDate = (d: Date) => shortFmt.format(d);
/** "Thứ Hai, 28 tháng 9, 2026" */
export function formatLongDate(d: Date): string {
  const s = longFmt.format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
/** "2026-09-28" in Vietnam time. */
export const isoDay = (d: Date) => partsFmt.format(d);
/** { year, month } in Vietnam time. */
export function yearMonth(d: Date): { year: number; month: number } {
  const [y, m] = isoDay(d).split('-').map(Number);
  return { year: y, month: m };
}

const ROMAN: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];
export function toRoman(n: number): string {
  let out = '';
  for (const [v, s] of ROMAN) while (n >= v) { out += s; n -= v; }
  return out;
}

export const pad2 = (n: number) => String(n).padStart(2, '0');
