#!/usr/bin/env node
// =============================================================================
// inject-hreflang.mjs — Strip hreflang link tags from every EN article/
// project/video shell (T-16)
// =============================================================================
// Hreflang injection is disabled: the /es/, /pt/, /de/ trees now return 410
// (T-02) rather than being genuine translations, so no EN page should
// advertise alternates that no longer resolve to 200. This script now only
// removes any pre-existing BEGIN_HREFLANG/END_HREFLANG block (defensive —
// the block is never committed to git, so on a normal CI checkout there is
// nothing to strip) and chains into inject-index-seo.mjs, which still owns
// canonical + <html lang> normalisation for the home/index pages.
//
// Order in workflow: run AFTER inject-article-meta.mjs (which writes the
// BEGIN_ARTICLE_META / END_ARTICLE_META block). hreflang sentinels, if any
// remain from a stale build, are nested inside that block.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROJECT_DIR = path.join(ROOT, 'project');

// Kinds whose EN shells may carry a stale hreflang block to strip, plus their
// /<lang>/ counterparts (translate-content.mjs and prior runs of this script
// wrote hreflang into both sides).
const LANGS = ['es', 'pt', 'de'];
const KINDS = ['articles', 'projects', 'videos'];

const SENTINEL_START = '<!-- BEGIN_HREFLANG -->';
const SENTINEL_END = '<!-- END_HREFLANG -->';

async function processFile(file) {
  const html = await fs.readFile(file, 'utf8');
  const startIdx = html.indexOf(SENTINEL_START);
  const endIdx = html.indexOf(SENTINEL_END);
  if (startIdx < 0 || endIdx <= startIdx) return { file, changed: false };

  const stripped = html.slice(0, startIdx) + html.slice(endIdx + SENTINEL_END.length);
  await fs.writeFile(file, stripped);
  return { file, changed: true };
}

async function main() {
  let processed = 0;
  let stripped = 0;
  for (const kind of KINDS) {
    const dirs = [path.join(PROJECT_DIR, kind), ...LANGS.map(l => path.join(PROJECT_DIR, l, kind))];
    for (const dir of dirs) {
      let entries;
      try { entries = await fs.readdir(dir); } catch { continue; }
      for (const entry of entries) {
        if (!entry.endsWith('.html')) continue;
        const file = path.join(dir, entry);
        const res = await processFile(file);
        processed++;
        if (res.changed) stripped++;
      }
    }
  }

  console.log(`[hreflang] scanned ${processed} files, stripped a stale hreflang block from ${stripped}`);

  // Chained script: canonical + <html lang> normalisation for the HOME page
  // and the articles/news/videos INDEX pages. Lives in its own script
  // (scripts/inject-index-seo.mjs); chained here because the deploy workflow
  // file could not be modified via the GitHub App token that originally wired
  // this up (needs the `workflows` permission).
  const idx = spawnSync(process.execPath, [path.join(__dirname, 'inject-index-seo.mjs')], { stdio: 'inherit' });
  if (idx.status !== 0) {
    console.error('[hreflang] inject-index-seo.mjs failed');
    process.exit(idx.status ?? 1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
