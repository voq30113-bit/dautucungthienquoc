#!/usr/bin/env node
/*
 * Publish one content file through the GitHub Contents API.
 * The commit to `main` triggers the deploy workflow.
 *
 *   GITHUB_TOKEN=… npm run publish -- --collection nhan-dinh --file ./2026-09-29.md
 *
 * Options
 *   --collection  diem-tin | nhan-dinh | tong-ket | bao-cao | phan-tich   (required)
 *   --file        path to the local .md / .mdx file               (required)
 *   --message     commit message (default: "content(<collection>): <file>")
 *   --repo        owner/name (default: $GITHUB_REPOSITORY, else the `origin` remote)
 *   --branch      target branch (default: main)
 *   --dry-run     validate and show what would be sent, without writing
 *
 * Re-running with the same file updates it: the existing blob `sha` is
 * resolved first, and a conflict (409/422) is retried once with a fresh sha.
 */
import { execSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { parseArgs } from 'node:util';

const COLLECTIONS = ['diem-tin', 'nhan-dinh', 'tong-ket', 'bao-cao', 'phan-tich'];
const NAME = /^\d{4}-\d{2}-\d{2}(-[a-z0-9]+(?:-[a-z0-9]+)*)?\.mdx?$/;
const API = 'https://api.github.com';

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

const { values: args } = parseArgs({
  options: {
    collection: { type: 'string' },
    file: { type: 'string' },
    message: { type: 'string' },
    repo: { type: 'string' },
    branch: { type: 'string', default: 'main' },
    'dry-run': { type: 'boolean', default: false },
  },
});

if (!args.collection || !COLLECTIONS.includes(args.collection)) {
  fail(`--collection phải là một trong: ${COLLECTIONS.join(', ')}`);
}
if (!args.file) fail('thiếu --file');

const filename = basename(args.file);
if (!NAME.test(filename)) fail(`tên file "${filename}" phải có dạng YYYY-MM-DD.md hoặc YYYY-MM-DD-slug.md(x)`);

let body;
try {
  body = await readFile(args.file, 'utf8');
} catch (e) {
  fail(`không đọc được file: ${e.message}`);
}
if (!/^﻿?---\r?\n[\s\S]*?\r?\n---/.test(body)) fail('file thiếu khối frontmatter (--- … ---) ở đầu');

function resolveRepo() {
  if (args.repo) return args.repo;
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY;
  try {
    const url = execSync('git remote get-url origin', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const m = url.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/);
    if (m) return `${m[1]}/${m[2]}`;
  } catch {
    /* no git remote */
  }
  return fail('không xác định được repository — dùng --repo owner/name hoặc đặt GITHUB_REPOSITORY');
}

const repo = resolveRepo();
const branch = args.branch;
const path = `src/content/${args.collection}/${filename}`;
const message = args.message ?? `content(${args.collection}): ${filename}`;
const token = process.env.GITHUB_TOKEN;

if (args['dry-run']) {
  console.log(`(dry-run) PUT ${API}/repos/${repo}/contents/${path}`);
  console.log(`(dry-run) branch=${branch} message="${message}" bytes=${Buffer.byteLength(body)}`);
  process.exit(0);
}
if (!token) fail('thiếu biến môi trường GITHUB_TOKEN');

const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'dautucungthienquoc-publish',
};
const url = `${API}/repos/${repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;

async function currentSha() {
  const res = await fetch(`${url}?ref=${encodeURIComponent(branch)}`, { headers });
  if (res.status === 404) return undefined;
  if (!res.ok) fail(`không đọc được ${path}: HTTP ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.sha;
}

async function put(sha) {
  return fetch(url, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: Buffer.from(body, 'utf8').toString('base64'),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
}

let sha = await currentSha();
let res = await put(sha);
if (res.status === 409 || res.status === 422) {
  // Someone else changed the file in between (or the sha was missing): refresh and retry once.
  sha = await currentSha();
  res = await put(sha);
}
if (!res.ok) {
  const text = await res.text();
  const hint =
    res.status === 401 ? ' (token sai hoặc đã hết hạn)'
    : res.status === 403 || res.status === 404 ? ' (token không có quyền Contents: Read and write trên repository này)'
    : '';
  fail(`GitHub trả về HTTP ${res.status}${hint}: ${text}`);
}

const json = await res.json();
console.log(`✓ ${sha ? 'Đã cập nhật' : 'Đã tạo'} ${path}`);
console.log(`  commit: ${json.commit?.html_url ?? json.commit?.sha}`);
console.log(`  theo dõi build: https://github.com/${repo}/actions`);
