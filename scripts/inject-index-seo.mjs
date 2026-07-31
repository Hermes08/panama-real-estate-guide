#!/usr/bin/env node
// =============================================================================
// inject-index-seo.mjs — canonical + <html lang> for the home page and the
// articles/news/videos index pages, in every language.
// =============================================================================
// GSC QA 2026-06-11: the EN home page had NO hreflang cluster while the
// /es/ /pt/ /de/ homes carried the full 5-link cluster (asymmetric clusters
// are ignored by Google), and none of the 16 index pages (/articles/, /news/,
// /videos/ + their 12 language variants — all present in sitemap.xml) carried
// hreflang. The 4 /news/ index pages had no canonical at all. Those pages were
// feeding the "Duplicate without user-selected canonical" and "Discovered -
// currently not indexed" buckets.
//
// T-16 (2026-07-31): the hreflang cluster this script used to add to the EN
// side has been removed. The /es/ /pt/ /de/ trees now return 410 (T-02), so
// advertising them as alternates would be a contradictory signal. The /es/
// /pt/ /de/ homes' hard-coded hreflang cluster lives in their own templates,
// not here, and is out of scope (those pages 410 regardless of what they
// claim about themselves).
//
// For each of project/[lang/][kind/]index.html (kind in articles|news|videos,
// plus the bare home page), this script:
//   1. Adds a self-referencing <link rel="canonical"> if the page has none.
//   2. Normalises the <html lang=".."> attribute to the page's language
//      (fixes /videos/index.html which declared lang="es" on the EN page).
//
// Idempotent: the injected block is wrapped in BEGIN_INDEX_SEO sentinels and
// replaced on every run. Safe to run at any point after the index shells
// exist; wired into the deploy workflow after inject-notranslate.mjs.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROJECT_DIR = path.join(ROOT, 'project');
const SITE_BASE = 'https://panamarealestateguide.com';

const LANGS = ['es', 'pt', 'de'];
// '' = the home page (project/index.html and project/<lang>/index.html)
const KINDS = ['', 'articles', 'news', 'videos'];

const SENTINEL_START = '<!-- BEGIN_INDEX_SEO -->';
const SENTINEL_END = '<!-- END_INDEX_SEO -->';

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

function urlFor(lang, kind) {
  return SITE_BASE + (lang ? `/${lang}` : '') + (kind ? `/${kind}/` : '/');
}

function indexPath(lang, kind) {
  return path.join(PROJECT_DIR, lang || '', kind || '', 'index.html');
}

async function processFile(lang, kind) {
  const file = indexPath(lang, kind);
  if (!(await fileExists(file))) return null;

  let html = await fs.readFile(file, 'utf8');
  const original = html;

  // Remove any previously injected block so re-runs replace, not duplicate.
  const startIdx = html.indexOf(SENTINEL_START);
  const endIdx = html.indexOf(SENTINEL_END);
  if (startIdx >= 0 && endIdx > startIdx) {
    html = html.slice(0, startIdx) + html.slice(endIdx + SENTINEL_END.length);
  }

  // 2. Normalise <html lang=".."> to the page's language.
  const expectedLang = lang || 'en';
  html = html.replace(/(<html[^>]*\blang=")[a-zA-Z-]*(")/, `$1${expectedLang}$2`);

  const lines = [];

  // 1. Self-canonical if the page has none.
  if (!/rel=["']canonical["']/i.test(html)) {
    lines.push(`<link rel="canonical" href="${urlFor(lang, kind)}">`);
  }

  if (lines.length) {
    const block = [SENTINEL_START, ...lines, SENTINEL_END].join('\n  ');
    const headIdx = html.indexOf('</head>');
    if (headIdx < 0) return { file, changed: false, reason: 'no </head>' };
    html = html.slice(0, headIdx) + `  ${block}\n` + html.slice(headIdx);
  }

  if (html === original) return { file, changed: false };
  await fs.writeFile(file, html);
  return { file, changed: true, added: lines.length };
}

async function main() {
  let changed = 0;
  let total = 0;
  for (const lang of ['', ...LANGS]) {
    for (const kind of KINDS) {
      const res = await processFile(lang, kind);
      if (!res) continue;
      total++;
      if (res.changed) changed++;
      const rel = res.file.replace(PROJECT_DIR, '') || '/';
      console.log(`[index-seo] ${rel} ${res.changed ? `updated (+${res.added ?? 0} tags)` : 'ok'}`);
    }
  }
  console.log(`[index-seo] ${changed}/${total} home/index pages updated`);
}

main().catch((e) => { console.error(e); process.exit(1); });
