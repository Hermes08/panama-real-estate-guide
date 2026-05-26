#!/usr/bin/env node
// =============================================================================
// inject-hreflang.mjs — Add hreflang link tags to every EN article + project
// =============================================================================
// For each project/articles/*.html and project/projects/*.html, check whether
// translated versions exist under project/<lang>/articles/<slug>.html or
// project/<lang>/projects/<slug>.html for lang in [es, pt, de]. Inject
// <link rel="alternate" hreflang="<lang>"> for each that exists, plus
// hreflang="x-default" pointing back to the EN URL.
//
// Idempotent. Wraps injected block in HTML comment sentinels for safe re-runs.
//
// Order in workflow: run AFTER inject-article-meta.mjs (which writes the
// BEGIN_ARTICLE_META / END_ARTICLE_META block). hreflang sentinels are
// nested inside that block.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROJECT_DIR = path.join(ROOT, 'project');
const SITE_BASE = 'https://panamarealestateguide.com';

const LANGS = ['es', 'pt', 'de'];
// Now covers all kinds with per-language shells (PR #101). Each EN file gets
// hreflang alternates pointing to every translated version that exists on disk,
// plus x-default → EN.
const KINDS = ['articles', 'projects', 'news', 'videos'];

const SENTINEL_START = '<!-- BEGIN_HREFLANG -->';
const SENTINEL_END = '<!-- END_HREFLANG -->';

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function getTranslationsForSlug(kind, slug) {
  const present = {};
  for (const lang of LANGS) {
    const p = path.join(PROJECT_DIR, lang, kind, `${slug}.html`);
    if (await fileExists(p)) present[lang] = true;
  }
  return present;
}

function buildHreflangBlock(kind, slug, present) {
  const enUrl = `${SITE_BASE}/${kind}/${slug}.html`;
  const lines = [SENTINEL_START];
  lines.push(`<link rel="alternate" hreflang="en" href="${enUrl}">`);
  for (const lang of LANGS) {
    if (present[lang]) {
      lines.push(`<link rel="alternate" hreflang="${lang}" href="${SITE_BASE}/${lang}/${kind}/${slug}.html">`);
    }
  }
  lines.push(`<link rel="alternate" hreflang="x-default" href="${enUrl}">`);
  lines.push(SENTINEL_END);
  return lines.join('\n  ');
}

async function processFile(file, kind, slug) {
  let html = await fs.readFile(file, 'utf8');
  const present = await getTranslationsForSlug(kind, slug);
  const block = buildHreflangBlock(kind, slug, present);

  // Remove any existing hreflang block
  const startIdx = html.indexOf(SENTINEL_START);
  const endIdx = html.indexOf(SENTINEL_END);
  if (startIdx >= 0 && endIdx > startIdx) {
    html = html.slice(0, startIdx) + html.slice(endIdx + SENTINEL_END.length);
  }

  // Insert AFTER the END_ARTICLE_META sentinel (outside the meta block region)
  // so the next inject-article-meta rerun does not wipe the hreflang block.
  const metaEnd = '<!-- END_ARTICLE_META -->';
  const metaEndIdx = html.indexOf(metaEnd);
  if (metaEndIdx >= 0) {
    const after = metaEndIdx + metaEnd.length;
    html = html.slice(0, after) + `\n  ${block}` + html.slice(after);
  } else {
    // No meta block (older shell), inject before </head>
    const headEnd = '</head>';
    const headIdx = html.indexOf(headEnd);
    if (headIdx < 0) return { file, changed: false, reason: 'no </head> found' };
    html = html.slice(0, headIdx) + `  ${block}\n` + html.slice(headIdx);
  }

  await fs.writeFile(file, html);
  return { file, changed: true, present_langs: Object.keys(present) };
}

async function main() {
  let processed = 0;
  let withTranslations = 0;
  for (const kind of KINDS) {
    const dir = path.join(PROJECT_DIR, kind);
    let entries;
    try { entries = await fs.readdir(dir); } catch { continue; }
    for (const entry of entries) {
      if (!entry.endsWith('.html')) continue;
      const slug = entry.replace(/\.html$/, '');
      if (slug === 'index') continue;
      const file = path.join(dir, entry);
      const res = await processFile(file, kind, slug);
      processed++;
      if (res.changed && res.present_langs?.length) withTranslations++;
    }
  }
  console.log(`[hreflang] processed ${processed} files, ${withTranslations} have at least one translation`);
}

main().catch(e => { console.error(e); process.exit(1); });
