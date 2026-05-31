#!/usr/bin/env node
// =============================================================================
// build-i18n-data.mjs — assemble window.PANAMA_DATA.chromeI18n + articleMeta
// =============================================================================
//
// Reads:
//   - state/chrome-i18n.json   → static translations (nav, footer, CTA, categories, author bios)
//   - project/{es,pt,de}/articles/*.html → extracts <title> + meta description per slug
//   - project/{es,pt,de}/projects/*.html → extracts <title> + meta description per slug (future)
//   - project/{es,pt,de}/news/*.html → extracts <title> + meta description per slug (future)
//
// Writes:
//   - project/i18n-data.js → IIFE that populates window.PANAMA_DATA.chromeI18n + articleMeta
//
// Loaded BEFORE article-renderer.js / index-renderer.js / detail-chrome.js so the
// chrome can read translated labels at first paint.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const PROJECT_DIR = path.join(REPO_ROOT, 'project');
const I18N_JSON   = path.join(REPO_ROOT, 'state', 'chrome-i18n.json');
const OUTPUT_JS   = path.join(PROJECT_DIR, 'i18n-data.js');

const LANGS = ['es', 'pt', 'de'];

function extractMeta(html) {
  const titleMatch = html.match(/<title>([^<]*?)\s*\|\s*PanamaRealEstateGuide\.com<\/title>/i)
                  || html.match(/<title>([^<]+)<\/title>/i);
  const descMatch  = html.match(/<meta\s+name="description"[^>]*content="([^"]*)"/i)
                  || html.match(/<meta\s+content="([^"]*)"[^>]*name="description"/i);
  const ogTitleMatch = html.match(/<meta\s+property="og:title"[^>]*content="([^"]*)"/i);
  return {
    title: (titleMatch?.[1] || ogTitleMatch?.[1] || '').trim(),
    description: (descMatch?.[1] || '').trim(),
  };
}

async function buildArticleMeta() {
  const meta = {};
  for (const lang of LANGS) {
    meta[lang] = {};
    const dir = path.join(PROJECT_DIR, lang, 'articles');
    let entries;
    try {
      entries = await fs.readdir(dir);
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.endsWith('.html')) continue;
      const slug = entry.replace(/\.html$/, '');
      const html = await fs.readFile(path.join(dir, entry), 'utf8');
      const { title, description } = extractMeta(html);
      if (title || description) {
        meta[lang][slug] = { title, excerpt: description };
      }
    }
  }
  return meta;
}

// ── Inject <script src=".../i18n-data.js"> into every article HTML, idempotent ──
// Sentinel: <!-- BEGIN_I18N_DATA_LOAD --> ... <!-- END_I18N_DATA_LOAD -->
async function injectI18nScriptTag() {
  const SENTINEL_OPEN  = '<!-- BEGIN_I18N_DATA_LOAD -->';
  const SENTINEL_CLOSE = '<!-- END_I18N_DATA_LOAD -->';

  // Walk: project/articles/*.html (EN), project/{es,pt,de}/articles/*.html
  // For each non-EN target, also include <script>window.PREG_LANG="<lang>";</script>
  // INSIDE the sentinel block so it survives every re-run of this script.
  // Without this, article-renderer cannot detect the page language and falls
  // back to English titles / nav even on translated pages.
  const targets = [
    { dir: path.join(PROJECT_DIR, 'articles'),       src: '../i18n-data.js',    lang: 'en' },
    { dir: path.join(PROJECT_DIR, 'es', 'articles'), src: '../../i18n-data.js', lang: 'es' },
    { dir: path.join(PROJECT_DIR, 'pt', 'articles'), src: '../../i18n-data.js', lang: 'pt' },
    { dir: path.join(PROJECT_DIR, 'de', 'articles'), src: '../../i18n-data.js', lang: 'de' },
    // EN news shells also need chromeI18n: the 15 translated news store their full
    // EN body ONLY in chromeI18n.en.news_full_bodies[slug] (never in newsBodies), so
    // without i18n-data.js the EN /news/<slug>.html page falls back to the
    // "Full dispatch coming soon." stub. The /es|/pt|/de news shells already load
    // i18n-data.js from their build-news-shells template — only EN was missing it.
    // (news/index.html has no data-light loader to anchor on, so it's skipped.)
    { dir: path.join(PROJECT_DIR, 'news'),           src: '../i18n-data.js',    lang: 'en' },
  ];

  let injected = 0, alreadyOk = 0;
  for (const t of targets) {
    let entries;
    try { entries = await fs.readdir(t.dir); } catch { continue; }
    const langScript = t.lang === 'en' ? '' : `<script>window.PREG_LANG="${t.lang}";</script>\n  `;
    for (const entry of entries) {
      if (!entry.endsWith('.html')) continue;
      const file = path.join(t.dir, entry);
      let html = await fs.readFile(file, 'utf8');
      const scriptBlock = `${SENTINEL_OPEN}\n  ${langScript}<script defer src="${t.src}"></script>\n  ${SENTINEL_CLOSE}`;
      if (html.includes(SENTINEL_OPEN)) {
        // Replace existing block (PREG_LANG injection or path may have changed)
        const re = new RegExp(SENTINEL_OPEN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + SENTINEL_CLOSE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const next = html.replace(re, scriptBlock);
        if (next !== html) { await fs.writeFile(file, next, 'utf8'); injected++; } else { alreadyOk++; }
        continue;
      }
      // Insert BEFORE the data-light.js loader so chromeI18n is populated first
      const re = /(\s*<script defer src="[^"]*data-light\.js[^"]*"><\/script>)/;
      if (re.test(html)) {
        html = html.replace(re, `\n  ${scriptBlock}$1`);
        await fs.writeFile(file, html, 'utf8');
        injected++;
      }
    }
  }
  console.log(`build-i18n-data: injected/updated <script i18n-data + PREG_LANG> block in ${injected} article HTML files`);
}

async function main() {
  const chromeI18n = JSON.parse(await fs.readFile(I18N_JSON, 'utf8'));
  const articleMeta = await buildArticleMeta();

  const totalArticles = Object.values(articleMeta).reduce((s, m) => s + Object.keys(m).length, 0);

  const payload = {
    chromeI18n,
    articleMeta,
  };

  const js = `// AUTO-GENERATED by scripts/build-i18n-data.mjs — do not edit by hand.
(function () {
  if (!window.PANAMA_DATA) window.PANAMA_DATA = {};
  var data = ${JSON.stringify(payload, null, 2)};
  window.PANAMA_DATA.chromeI18n = data.chromeI18n;
  window.PANAMA_DATA.articleMeta = data.articleMeta;
})();
`;

  await fs.writeFile(OUTPUT_JS, js, 'utf8');
  console.log(`build-i18n-data: wrote ${path.relative(REPO_ROOT, OUTPUT_JS)} · ${LANGS.length} chrome langs · ${totalArticles} translated article meta entries`);

  await injectI18nScriptTag();
}

main().catch(err => { console.error('build-i18n-data failed:', err); process.exit(1); });
