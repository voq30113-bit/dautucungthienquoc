/*
 * Turns a frontmatter market snapshot into ticker tiles.
 * Figures always come from content — never hardcoded in templates.
 */
import type { TickerItem } from '../components/TickerStrip.astro';
import { vi } from '../i18n/vi';
import { direction, formatNumber } from './format';

export interface MarketSnapshot {
  vnindex: number;
  change: number;
  changePct: number;
  volume?: number;
  valueBn?: number;
  foreignNetBn?: number;
  advancers?: number;
  decliners?: number;
  unchanged?: number;
}

export function marketTicker(m: MarketSnapshot): TickerItem[] {
  const t = vi.ticker;
  const dir = direction(m.change);
  const items: TickerItem[] = [
    { key: t.vnindex, value: m.vnindex, decimals: 2, delta: t.close },
    {
      key: t.change,
      value: m.change,
      decimals: 2,
      signed: true,
      tone: dir,
      delta: `${formatNumber(m.changePct, 2, true)}%`,
      dir,
    },
  ];

  if (m.volume !== undefined) {
    items.push({
      key: t.volume,
      value: m.volume / 1e6,
      decimals: 1,
      unit: t.millionShares,
      delta: m.valueBn !== undefined ? `${formatNumber(m.valueBn)} ${t.bn}` : undefined,
    });
  } else if (m.valueBn !== undefined) {
    items.push({ key: t.value, value: m.valueBn, unit: t.bn });
  }

  if (m.foreignNetBn !== undefined) {
    const fdir = direction(m.foreignNetBn);
    items.push({
      key: t.foreign,
      value: m.foreignNetBn,
      signed: true,
      tone: fdir,
      unit: 'tỷ',
      delta: fdir === 'down' ? t.netSell : fdir === 'up' ? t.netBuy : undefined,
      dir: fdir,
    });
  }

  if (m.advancers !== undefined && m.decliners !== undefined) {
    items.push({
      key: t.breadth,
      value: [m.advancers, m.decliners],
      delta:
        m.unchanged !== undefined
          ? `${t.advDec} · ${t.unchanged(formatNumber(m.unchanged))}`
          : t.advDec,
    });
  }

  return items;
}
