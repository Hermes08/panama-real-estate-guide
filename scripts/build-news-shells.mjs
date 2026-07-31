#!/usr/bin/env node
// =============================================================================
// build-news-shells.mjs — generate missing news shells + inject SEO meta
// =============================================================================
// Single owner of the SEO head for every /news/ page across en/es/pt/de. Two
// classes of news exist on this site:
//
//   • TRANSLATED — slug present in state/chrome-i18n.json en.news_full_bodies
//     (15 items). Real EN+ES+PT+DE titles and bodies. Each shell
//     self-canonicalises. T-16 (2026-07-31): the EN shell carries NO hreflang
//     (the /es/ /pt/ /de/ trees now 410 per T-02); the /es|/pt|/de shells keep
//     their own en/es/pt/de + x-default cluster, which is moot once those
//     URLs 410 but is left alone as out of scope.
//
//   • LEGACY — slug present only in data.js newsBodies (18 items), English-only.
//     The EN shell self-canonicalises; the /es|/pt|/de shells render the SAME
//     English body, so they canonical → EN and carry NO hreflang (they are not
//     genuine translations — this is the user-chosen dedup for GSC duplicates).
//
// Missing shells (the 8 translated news that never got HTML files → the GSC
// /news/*.html 404s) are generated from the standard React-shell template here.
//
// Order: MUST run before build-sitemap.mjs (which lists /news/*.html from disk)
// and replaces the 'news' kind that inject-hreflang.mjs used to own.
//
// Idempotent: canonical + hreflang live between BEGIN_NEWS_META / END_NEWS_META
// sentinels; <title> and the description meta are rewritten in place.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROJECT_DIR = path.join(ROOT, 'project');
const SITE_BASE = 'https://panamarealestateguide.com';
const LANGS = ['en', 'es', 'pt', 'de'];

const S_START = '<!-- BEGIN_NEWS_META -->';
const S_END = '<!-- END_NEWS_META -->';

const FONTS = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Manrope:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap';
const REACT = '<script defer src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" integrity="sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z" crossorigin="anonymous"></script>';
const REACT_DOM = '<script defer src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" integrity="sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1" crossorigin="anonymous"></script>';
const DEFAULT_DESC = 'Panama real estate news — project launches, infrastructure, market moves and policy updates. Updated weekly by PanamaRealEstateGuide.com.';

function escAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// First paragraph → ~155-char meta description, cut on a word boundary.
function clip(text, n = 155) {
  let s = String(text || '').replace(/\s+/g, ' ').trim();
  if (s.length <= n) return s;
  s = s.slice(0, n);
  const i = s.lastIndexOf(' ');
  if (i > 60) s = s.slice(0, i);
  return s.replace(/[\s,;:.–—-]+$/, '') + '…';
}

function shellTemplate(lang) {
  if (lang === 'en') {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>News — PanamaRealEstateGuide.com</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="${FONTS}" rel="stylesheet"/>
  <link rel="stylesheet" href="../styles.css"/>
  <meta name="description" id="detail-meta-desc" content="${escAttr(DEFAULT_DESC)}"/>

  ${REACT}
  ${REACT_DOM}</head>
<body>
  <div id="root"></div>

  <script defer src="../data-light.js"></script>
  <script defer src="../components.js"></script>
  <script defer src="../detail-chrome.js"></script>
  <script defer src="news-renderer.js"></script>
</body>
</html>
`;
  }
  return `<!doctype html>
<html lang="${lang}" translate="no">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>News — PanamaRealEstateGuide.com</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="${FONTS}" rel="stylesheet"/>
  <link rel="stylesheet" href="../../styles.css"/>
  <meta name="description" id="detail-meta-desc" content="${escAttr(DEFAULT_DESC)}"/>

  ${REACT}
  ${REACT_DOM}</head>
<body>
  <div id="root"></div>

  <script>window.PREG_LANG="${lang}";</script>
  <script defer src="../../i18n-data.js"></script>
  <script defer src="../../data-light.js"></script>
  <script defer src="../../components.js"></script>
  <script defer src="../../detail-chrome.js"></script>
  <script defer src="../../news/news-renderer.js"></script>
</body>
</html>
`;
}

function urlFor(lang, slug) {
  return lang === 'en'
    ? `${SITE_BASE}/news/${slug}.html`
    : `${SITE_BASE}/${lang}/news/${slug}.html`;
}
function fileFor(lang, slug) {
  return lang === 'en'
    ? path.join(PROJECT_DIR, 'news', `${slug}.html`)
    : path.join(PROJECT_DIR, lang, 'news', `${slug}.html`);
}

function metaBlock({ canonical, hreflang }) {
  const lines = [S_START, `<link rel="canonical" href="${escAttr(canonical)}">`];
  if (hreflang) {
    for (const l of LANGS) {
      lines.push(`<link rel="alternate" hreflang="${l}" href="${escAttr(hreflang[l])}">`);
    }
    lines.push(`<link rel="alternate" hreflang="x-default" href="${escAttr(hreflang.en)}">`);
  }
  lines.push(S_END);
  return lines.join('\n  ');
}

function applyMeta(html, { pageTitle, description, canonical, hreflang }) {
  const fullTitle = `${pageTitle} — PanamaRealEstateGuide.com`;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escHtml(fullTitle)}</title>`);
  html = html.replace(
    /(<meta\s+name="description"[^>]*\scontent=")[^"]*("[^>]*>)/i,
    `$1${escAttr(description)}$2`
  );
  // Drop any prior sentinel block, then re-insert before </head>.
  const s = html.indexOf(S_START);
  const e = html.indexOf(S_END);
  if (s >= 0 && e > s) {
    html = html.slice(0, s).replace(/[ \t]*$/, '') + html.slice(e + S_END.length).replace(/^\n/, '');
  }
  const block = metaBlock({ canonical, hreflang });
  const headIdx = html.indexOf('</head>');
  html = html.slice(0, headIdx) + `  ${block}\n` + html.slice(headIdx);
  return html;
}

function loadData() {
  const src = fsReadSync(path.join(PROJECT_DIR, 'data.js'));
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { timeout: 5000 });
  if (!sandbox.window.PANAMA_DATA) throw new Error('PANAMA_DATA missing from data.js');
  return sandbox.window.PANAMA_DATA;
}

// data.js / chrome-i18n.json are small; read synchronously for clarity.
import { readFileSync } from 'node:fs';
function fsReadSync(p) { return readFileSync(p, 'utf8'); }

async function main() {
  const D = loadData();
  const i18n = JSON.parse(fsReadSync(path.join(ROOT, 'state', 'chrome-i18n.json')));
  const newsBodies = D.newsBodies || {};
  const enI18n = (i18n.en && i18n.en.news_full_bodies) || {};
  const translated = Object.keys(enI18n);
  const legacy = Object.keys(newsBodies).filter((s) => !enI18n[s]);

  let created = 0;
  let touched = 0;

  // TRANSLATED — all four languages, self-canonical. The EN shell carries no
  // hreflang (T-16: the /es/ /pt/ /de/ trees now 410 per T-02); the /es/ /pt/
  // /de/ shells keep their own cluster since it's moot once those URLs 410.
  for (const slug of translated) {
    const hreflang = {};
    for (const l of LANGS) hreflang[l] = urlFor(l, slug);
    for (const lang of LANGS) {
      const file = fileFor(lang, slug);
      let html;
      try {
        html = await fs.readFile(file, 'utf8');
      } catch {
        html = shellTemplate(lang);
        await fs.mkdir(path.dirname(file), { recursive: true });
        created++;
      }
      const li = i18n[lang] || {};
      const title = (li.news_titles && li.news_titles[slug]) || (i18n.en.news_titles && i18n.en.news_titles[slug]) || slug;
      const body = (li.news_full_bodies && li.news_full_bodies[slug]) || enI18n[slug] || [];
      html = applyMeta(html, {
        pageTitle: title,
        description: clip(body[0] || title),
        canonical: urlFor(lang, slug),
        hreflang: lang === 'en' ? null : hreflang,
      });
      await fs.writeFile(file, html);
      touched++;
    }
  }

  // LEGACY — English-only. EN self-canonical; per-lang canonical → EN; no hreflang.
  for (const slug of legacy) {
    const nb = newsBodies[slug];
    for (const lang of LANGS) {
      const file = fileFor(lang, slug);
      let html;
      try {
        html = await fs.readFile(file, 'utf8');
      } catch {
        continue; // legacy shells already exist on disk; never fabricate translations
      }
      html = applyMeta(html, {
        pageTitle: nb.title,
        description: clip((nb.body && nb.body[0]) || nb.title),
        canonical: urlFor('en', slug), // EN: self; per-lang: → EN
        hreflang: null,
      });
      await fs.writeFile(file, html);
      touched++;
    }
  }

  console.log(
    `[news-shells] ${translated.length} translated + ${legacy.length} legacy · ` +
    `created ${created} missing shell(s) · injected meta into ${touched} file(s)`
  );
}

main().catch((e) => { console.error('build-news-shells failed:', e); process.exit(1); });
