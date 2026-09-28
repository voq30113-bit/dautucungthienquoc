#!/usr/bin/env node
/*
 * Content lint — runs in CI before the build (npm run check).
 *
 * Astro's Zod schema already fails the build on invalid frontmatter; this
 * script adds fast, readable checks that the schema cannot express:
 *   - file naming: YYYY-MM-DD.md(x) or YYYY-MM-DD-ascii-slug.md(x)
 *   - every file has a parseable YAML frontmatter block
 *   - required fields present, dates valid
 *   - every sources[].url is a well-formed http(s) URL
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT = join(ROOT, 'src', 'content');
const COLLECTIONS = ['nhan-dinh', 'tong-ket', 'bao-cao', 'phan-tich'];
const NAME = /^\d{4}-\d{2}-\d{2}(-[a-z0-9]+(?:-[a-z0-9]+)*)?\.mdx?$/;

const errors = [];
const warnings = [];
let checked = 0;

const vnDay = (d) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

function validUrl(value) {
  try {
    const u = new URL(value);
    return (u.protocol === 'http:' || u.protocol === 'https:') && !!u.hostname && u.hostname.includes('.');
  } catch {
    return false;
  }
}

for (const collection of COLLECTIONS) {
  const dir = join(CONTENT, collection);
  let files = [];
  try {
    files = (await readdir(dir)).filter((f) => !f.startsWith('.') && !f.startsWith('_'));
  } catch {
    continue;
  }
  for (const file of files) {
    const path = relative(ROOT, join(dir, file)).split('\\').join('/');
    const err = (msg) => errors.push(`${path}: ${msg}`);
    checked++;

    if (!NAME.test(file)) {
      err('tên file phải có dạng YYYY-MM-DD.md, YYYY-MM-DD.mdx hoặc YYYY-MM-DD-slug-khong-dau.md(x)');
      continue;
    }

    const raw = (await readFile(join(dir, file), 'utf8')).replace(/^\uFEFF/, '');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (!match) {
      err('thiếu khối frontmatter mở và đóng bằng ---');
      continue;
    }

    let data;
    try {
      data = yaml.load(match[1], { schema: yaml.JSON_SCHEMA }) ?? {};
    } catch (e) {
      err(`frontmatter YAML không hợp lệ: ${e.reason ?? e.message}${e.mark ? ` (dòng ${e.mark.line + 2})` : ''}`);
      continue;
    }
    if (typeof data !== 'object' || Array.isArray(data)) {
      err('frontmatter phải là một đối tượng key: value');
      continue;
    }

    for (const key of ['title', 'date', 'standfirst']) {
      if (data[key] === undefined || data[key] === null || String(data[key]).trim() === '') err(`thiếu trường bắt buộc "${key}"`);
    }
    for (const key of ['date', 'sessionDate']) {
      if (data[key] !== undefined && Number.isNaN(new Date(data[key]).getTime())) err(`"${key}" không phải ngày hợp lệ: ${data[key]}`);
    }
    if (data.date && !Number.isNaN(new Date(data.date).getTime())) {
      const day = file.slice(0, 10);
      const dates = [data.date, data.sessionDate].filter(Boolean).map((d) => vnDay(new Date(d)));
      if (!dates.includes(day)) warnings.push(`${path}: ngày trong tên file (${day}) khác với date/sessionDate (${dates.join(', ')})`);
    }

    if (data.sources !== undefined) {
      if (!Array.isArray(data.sources)) err('"sources" phải là một danh sách');
      else
        data.sources.forEach((s, i) => {
          if (!s || typeof s !== 'object') return err(`sources[${i}] phải có dạng { label, url }`);
          if (typeof s.label !== 'string' || !s.label.trim()) err(`sources[${i}].label bị thiếu hoặc rỗng`);
          if (s.url !== undefined && !validUrl(String(s.url))) err(`sources[${i}].url không hợp lệ: ${s.url}`);
        });
    }

    if (data.market !== undefined) {
      const m = data.market;
      if (!m || typeof m !== 'object') err('"market" phải là một đối tượng');
      else
        for (const [k, v] of Object.entries(m)) {
          if (typeof v !== 'number' || !Number.isFinite(v)) err(`market.${k} phải là số (dùng dấu chấm thập phân, không có dấu phân cách hàng nghìn): ${v}`);
        }
    }
  }
}

for (const w of warnings) console.warn(`⚠ ${w}`);
if (errors.length) {
  console.error(`\n✗ Kiểm tra nội dung thất bại — ${errors.length} lỗi:\n`);
  for (const e of errors) console.error(`  • ${e}`);
  console.error('');
  process.exit(1);
}
console.log(`✓ Nội dung hợp lệ: ${checked} file.`);
