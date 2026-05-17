#!/usr/bin/env node
// =============================================================================
// inject-article-meta.mjs v1 — per-article SEO meta + Article/Breadcrumb schema
// =============================================================================
// Reads article metadata from project/data.js (PANAMA_DATA.articles +
// articleBodies), then for each /articles/*.html file injects a per-article
// <head> block: title, description, canonical, OpenGraph, Twitter Card,
// Article + BreadcrumbList JSON-LD.
//
// Why this exists:
//   Every articles/*.html ships an identical generic <title> and
//   <meta description>. The real per-article title is only set by client-side
//   JS (document.title = ...). Most SERP snippets are built from the initial
//   HTML head, so Google + Bing + Slack + social previews all see the same
//   generic placeholder across 81 distinct articles. This script materializes
//   the per-article metadata that already lives in data.js into static HTML
//   at deploy time.
//
// Modeled on inject-project-meta.mjs (same idempotency + sentinel pattern).
// Idempotent — re-runs replace content between markers.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..', 'project');
const ARTICLES_DIR = path.join(PROJECT_DIR, 'articles');
const SITE_BASE = 'https://panamarealestateguide.com';
const DEFAULT_OG_IMAGE = `${SITE_BASE}/cover_facebook_1640x856.png`;
const PUBLISHER_LOGO = `${SITE_BASE}/cover_facebook_1640x856.png`;

const HEAD_START = '<!-- BEGIN_ARTICLE_META -->';
const HEAD_END   = '<!-- END_ARTICLE_META -->';

// -----------------------------------------------------------------------------
// data.js parsing — run in a vm sandbox so we get the real PANAMA_DATA object
// (including nested articleBodies arrays). Regex parsing isn't safe here
// because body blocks are mixed strings + objects with markdown/quotes.
// -----------------------------------------------------------------------------
function loadPanamaData(src) {
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { timeout: 5000 });
  if (!sandbox.window.PANAMA_DATA) {
    throw new Error('data.js did not populate window.PANAMA_DATA');
  }
  return sandbox.window.PANAMA_DATA;
}

// -----------------------------------------------------------------------------
// Excerpt sanitization
// 5/81 articles have LLM-prompt residue in their excerpts (e.g.
// "repurposed from the article ...", "specified above 6. 3 social hooks..."
// or numbered list intros). Detect + fall back to body extraction.
// -----------------------------------------------------------------------------
const BAD_EXCERPT_PATTERNS = [
  /^repurposed from /i,
  /^specified above /i,
  /^as specified /i,
  /^short /i,
  /^\d+\.\s/,                   // "3. H1 4. Featured-image alt..."
  /\bsocial hooks\b/i,
  /\bfeatured-image alt\b/i,
];

function excerptLooksUsable(excerpt, title) {
  if (!excerpt) return false;
  const trimmed = excerpt.trim();
  if (trimmed.length < 30) return false;
  if (trimmed.toLowerCase() === title.toLowerCase()) return false; // just the title
  if (trimmed.toLowerCase().startsWith(title.toLowerCase())) {
    // title-prefix + maybe junk after; only keep if there's substantive tail
    const tail = trimmed.slice(title.length).trim();
    if (tail.length < 30) return false;
  }
  for (const p of BAD_EXCERPT_PATTERNS) if (p.test(trimmed)) return false;
  return true;
}

// Strip markdown bold (**...**) and collapse whitespace.
function cleanMarkdown(s) {
  return String(s)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateAtWord(s, maxLen) {
  if (s.length <= maxLen) return s;
  const cut = s.slice(0, maxLen);
  const i = cut.lastIndexOf(' ');
  return (i > maxLen - 30 ? cut.slice(0, i) : cut) + '…';
}

// Pull the first usable paragraph from the article's body blocks.
// Body shape (from data.js): array of either strings (paragraphs) or
// { h: "..." } (section headings) or { chart: ..., caption, alt } (charts).
//
// A handful of articles have their first 3-4 body blocks polluted with LLM
// prompt scaffolding ("# Meta Description ...", "# H1 ...",
// "# Featured Image Alt Text ...", "---"). When the LLM left a usable
// "# Meta Description X" block, extract X — it's literally a hand-written
// meta description. Otherwise skip any block that's just a markdown header
// or a separator and try the next one.
function firstParagraphFromBody(body) {
  if (!Array.isArray(body)) return '';
  for (const block of body) {
    if (typeof block !== 'string') continue;
    let raw = block.trim();
    if (!raw) continue;
    // Separator lines or pure markdown headings: skip.
    if (/^-{3,}$/.test(raw)) continue;
    // "# Meta Description ..." → take the text after the label.
    const metaLabel = raw.match(/^#+\s*Meta\s*Description\s*[:\-]?\s*(.+)$/is);
    if (metaLabel) {
      const tail = cleanMarkdown(metaLabel[1]);
      if (tail.length >= 40) return tail;
      continue;
    }
    // Any other markdown heading-only line: skip.
    if (/^#+\s/.test(raw) && raw.length < 200 && !/[.!?]/.test(raw)) continue;
    // Drop a leading markdown heading prefix on a normal paragraph (rare but seen).
    raw = raw.replace(/^#+\s*[^\n]{0,80}\n+/, '');
    const clean = cleanMarkdown(raw);
    if (clean.length >= 60) return clean;
  }
  return '';
}

function buildDescription(article, body) {
  if (excerptLooksUsable(article.excerpt, article.title)) {
    return truncateAtWord(cleanMarkdown(article.excerpt), 155);
  }
  const fromBody = firstParagraphFromBody(body);
  if (fromBody) return truncateAtWord(fromBody, 155);
  // Last-ditch generic fallback
  return truncateAtWord(
    `${article.title}. Long-form guide on Panama real estate, residency, and lifestyle from panamarealestateguide.com.`,
    155
  );
}

// -----------------------------------------------------------------------------
// Date normalization — articles store "March 9, 2026", schema wants ISO.
// -----------------------------------------------------------------------------
function isoDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10); // YYYY-MM-DD is valid for schema.org datePublished
}

// -----------------------------------------------------------------------------
// HTML attribute escaping for double-quoted attribute values.
// JSON-LD goes inside <script> so it doesn't need attribute escaping; HTML
// entity-escaping ampersand only would actually break valid JSON. We just
// have to make sure no literal "</script" sneaks through, which our data
// doesn't contain.
// -----------------------------------------------------------------------------
function attrEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function sanitizeForJsonLdScript(s) {
  // Prevent </script> injection breaking the JSON-LD island.
  return String(s).replace(/<\//g, '<\\/');
}

// -----------------------------------------------------------------------------
// Build the per-article <head> block.
// -----------------------------------------------------------------------------
function buildHeadInjection({ slug, article, body, isIndex }) {
  const url = isIndex
    ? `${SITE_BASE}/articles/`
    : `${SITE_BASE}/articles/${slug}.html`;

  const fullTitle = article.title;
  const titleTag = `${fullTitle} — PanamaRealEstateGuide.com`;
  const description = buildDescription(article, body);
  const datePublished = isoDate(article.date);
  const author = article.author || 'Panama Real Estate Guide';
  const category = article.category || 'Article';

  const ldArticle = {
    '@context': 'https://schema.org',
    '@type': isIndex ? 'CollectionPage' : 'Article',
    headline: fullTitle,
    description,
    url,
    image: DEFAULT_OG_IMAGE,
    inLanguage: article.lang === 'es' ? 'es-PA' : 'en-US',
    author: { '@type': 'Person', name: author },
    publisher: {
      '@type': 'Organization',
      name: 'Panama Real Estate Guide',
      logo: { '@type': 'ImageObject', url: PUBLISHER_LOGO },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
  if (datePublished) {
    ldArticle.datePublished = datePublished;
    ldArticle.dateModified = datePublished;
  }
  if (!isIndex) {
    ldArticle.articleSection = category;
  }

  const ldBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `${SITE_BASE}/articles/` },
      ...(isIndex ? [] : [{ '@type': 'ListItem', position: 3, name: fullTitle, item: url }]),
    ],
  };

  const lines = [
    HEAD_START,
    `<title>${attrEscape(titleTag)}</title>`,
    `<meta name="description" id="detail-meta-desc" content="${attrEscape(description)}"/>`,
    `<link rel="canonical" href="${attrEscape(url)}"/>`,
    `<meta property="og:type" content="${isIndex ? 'website' : 'article'}"/>`,
    `<meta property="og:title" content="${attrEscape(titleTag)}"/>`,
    `<meta property="og:description" content="${attrEscape(description)}"/>`,
    `<meta property="og:url" content="${attrEscape(url)}"/>`,
    `<meta property="og:image" content="${attrEscape(DEFAULT_OG_IMAGE)}"/>`,
    `<meta property="og:site_name" content="Panama Real Estate Guide"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:title" content="${attrEscape(titleTag)}"/>`,
    `<meta name="twitter:description" content="${attrEscape(description)}"/>`,
    `<meta name="twitter:image" content="${attrEscape(DEFAULT_OG_IMAGE)}"/>`,
    `<script type="application/ld+json">${sanitizeForJsonLdScript(JSON.stringify(ldArticle))}</script>`,
    `<script type="application/ld+json">${sanitizeForJsonLdScript(JSON.stringify(ldBreadcrumb))}</script>`,
    HEAD_END,
  ];
  return lines.join('\n  ');
}

// -----------------------------------------------------------------------------
// Apply head block to existing HTML. Strips the generic <title> /
// description / og / canonical that ship in the article shell template,
// then inserts the new block right before </head>. Idempotent: if the
// sentinel is already present, just replace the block between sentinels.
// -----------------------------------------------------------------------------
function applyToHtml(html, headBlock) {
  const re = new RegExp(`${HEAD_START}[\\s\\S]*?${HEAD_END}`);
  if (re.test(html)) return html.replace(re, headBlock);

  // First-run: strip the static placeholders that all 82 shells share, so we
  // don't end up with duplicate <title> or <meta description> tags.
  let next = html
    .replace(/^\s*<title>[^<]*<\/title>\s*\n/m, '')
    .replace(/^\s*<meta name="description"[^>]*\/?>\s*\n/m, '')
    .replace(/^\s*<meta property="og:[a-z_]+"[^>]*\/?>\s*\n/gm, '')
    .replace(/^\s*<meta name="twitter:[a-z]+"[^>]*\/?>\s*\n/gm, '')
    .replace(/^\s*<link rel="canonical"[^>]*\/?>\s*\n/m, '')
    .replace(/^\s*<script type="application\/ld\+json">[\s\S]*?<\/script>\s*\n/gm, '');

  return next.replace(/<\/head>/i, `  ${headBlock}\n</head>`);
}

// -----------------------------------------------------------------------------
// Articles index page — the listing under /articles/index.html — gets a
// curated meta block of its own (it isn't in PANAMA_DATA.articles).
// -----------------------------------------------------------------------------
const ARTICLES_INDEX = {
  id: '__articles_index__',
  title: 'Panama Real Estate Journal: Guides & Reports 2026',
  excerpt: 'Long-form guides on Panama real estate, retirement communities, residency, neighborhoods, cost of living, and moving logistics — 80+ articles.',
  author: 'Panama Real Estate Guide',
  category: 'Articles',
  date: null,
  lang: 'en',
};

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
async function main() {
  const dataJsPath = path.join(PROJECT_DIR, 'data.js');
  const dataJsSrc = await fs.readFile(dataJsPath, 'utf8');
  const D = loadPanamaData(dataJsSrc);
  const articles = D.articles || [];
  const bodies = D.articleBodies || {};

  console.log(`inject-article-meta: parsed ${articles.length} articles from data.js`);

  const byId = Object.create(null);
  for (const a of articles) byId[a.id] = a;

  const files = (await fs.readdir(ARTICLES_DIR)).filter(f => f.endsWith('.html'));
  let modified = 0, matched = 0, missing = 0, skipped = 0;
  const missingIds = [];

  for (const f of files) {
    const slug = f.replace(/\.html$/, '');
    const filePath = path.join(ARTICLES_DIR, f);
    const original = await fs.readFile(filePath, 'utf8');

    let payload;
    if (slug === 'index') {
      payload = { slug: 'index', article: ARTICLES_INDEX, body: [], isIndex: true };
    } else {
      const article = byId[slug];
      if (!article) {
        missing++;
        missingIds.push(slug);
        skipped++;
        continue;
      }
      matched++;
      payload = { slug, article, body: bodies[slug] || [], isIndex: false };
    }

    const headBlock = buildHeadInjection(payload);
    const next = applyToHtml(original, headBlock);
    if (next !== original) {
      await fs.writeFile(filePath, next, 'utf8');
      modified++;
    }
  }

  console.log(
    `inject-article-meta: ${modified}/${files.length} files updated · ${matched} matched data.js · ${missing} unmatched (skipped) · ${skipped} skipped`
  );
  if (missingIds.length) {
    console.log(`inject-article-meta: unmatched slugs (no entry in PANAMA_DATA.articles): ${missingIds.join(', ')}`);
  }
}

main().catch((err) => {
  console.error('inject-article-meta failed:', err);
  process.exit(1);
});
