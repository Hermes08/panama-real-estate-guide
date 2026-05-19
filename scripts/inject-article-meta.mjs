#!/usr/bin/env node
// =============================================================================
// inject-article-meta.mjs v2 — per-article SEO meta + Article/Breadcrumb/FAQ
// =============================================================================
// Reads article metadata from project/data.js (PANAMA_DATA.articles +
// articleBodies), then for each /articles/*.html file injects a per-article
// <head> block: title, description, canonical, OpenGraph, Twitter Card,
// Article + BreadcrumbList JSON-LD, and (when the article declares a
// well-formed faqs array) FAQPage JSON-LD.
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
// "# Featured Image Alt Text ...", "---"). Strategy:
//
// 1. First pass: scan ALL body strings for an explicit "# Meta Description X"
//    label — that's a hand-authored meta description that beats anything
//    we'd extract from prose. (Without this pass, we sometimes hit a usable
//    body[0] before reaching the better body[1] meta-label block — see
//    sending-money-panama-wire-transfer.)
// 2. Second pass: first block that's real prose (has a sentence terminator
//    or is comfortably long), skipping markdown headings and separators.
function firstParagraphFromBody(body, articleTitle = '') {
  if (!Array.isArray(body)) return '';

  // Pass 1: explicit "# Meta Description ..." label anywhere in the body.
  for (const block of body) {
    if (typeof block !== 'string') continue;
    const m = block.trim().match(/^#+\s*Meta\s*Description\s*[:\-]?\s*(.+)$/is);
    if (m) {
      const tail = cleanMarkdown(m[1]);
      if (tail.length >= 40) return tail;
    }
  }

  // Pass 2: first real prose paragraph.
  const titleLower = articleTitle.toLowerCase().trim();
  for (const block of body) {
    if (typeof block !== 'string') continue;
    let raw = block.trim();
    if (!raw) continue;
    // Separator lines: skip.
    if (/^-{3,}$/.test(raw)) continue;
    // Any markdown-style heading line: skip.
    if (/^#+\s/.test(raw)) continue;
    // Title-only fragments (e.g. "Send Money to Panama 2026: Wire Transfers..."
    // sitting as body[0]) — short, no sentence terminator, and either is the
    // title or strongly resembles it: skip.
    if (raw.length < 120 && !/[.!?]/.test(raw)) {
      if (titleLower && raw.toLowerCase().includes(titleLower.slice(0, 30))) continue;
      continue; // also skip any short headline-like block with no period
    }
    const clean = cleanMarkdown(raw);
    if (clean.length >= 60) return clean;
  }
  return '';
}

function buildDescription(article, body) {
  // Prefer an explicit "# Meta Description X" block from the body over the
  // excerpt — those are hand-written for SEO, while excerpts often duplicate
  // the title or leak LLM scaffolding. Then fall back to excerpt, then to
  // first prose paragraph, then to a generic synthesis.
  const fromBody = firstParagraphFromBody(body, article.title);
  // If we got an explicit meta-description label, use it (it's already cleaned
  // up to ≥40 chars and is the highest-signal option).
  if (fromBody && /^[A-Z]/.test(fromBody) && fromBody.length >= 60) {
    // Only prefer body over excerpt if excerpt looks junky.
    if (!excerptLooksUsable(article.excerpt, article.title)) {
      return truncateAtWord(fromBody, 155);
    }
  }
  if (excerptLooksUsable(article.excerpt, article.title)) {
    return truncateAtWord(cleanMarkdown(article.excerpt), 155);
  }
  if (fromBody) return truncateAtWord(fromBody, 155);
  return truncateAtWord(
    `${article.title}. Long-form guide on Panama real estate, residency, and lifestyle from panamarealestateguide.com.`,
    155
  );
}

// -----------------------------------------------------------------------------
// Date normalization — articles store "March 9, 2026". Google's Rich Results
// Test flags date-only strings ("2026-03-09") as "Invalid datetime value /
// missing a timezone" even though schema.org technically accepts them.
// Emit full ISO 8601 with explicit UTC timezone to satisfy the validator.
// -----------------------------------------------------------------------------
function isoDate(dateStr) {
  if (!dateStr) return null;
  // Force UTC interpretation so the output is deterministic regardless of
  // whether this runs on the CI runner (UTC) or a dev machine in another zone.
  // "March 9, 2026" parsed as local-midnight in EST would shift by 5h in the
  // ISO string; appending " UTC" anchors it to 00:00Z.
  const d = new Date(dateStr + ' UTC');
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString(); // e.g. "2026-03-09T00:00:00.000Z"
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
  // Append the brand suffix only when there's room: a handful of editorial
  // titles (Spanish/Portuguese country guides) are already 100-142 chars and
  // appending " — PanamaRealEstateGuide.com" pushes them well past Google's
  // ~600px SERP cutoff. Skip the suffix for titles ≥ 80 chars so the brand
  // doesn't get truncated mid-word and the title content keeps all the
  // available pixels. Short titles still get the brand for recall.
  const titleTag = fullTitle.length >= 80
    ? fullTitle
    : `${fullTitle} — PanamaRealEstateGuide.com`;
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
    // author.url is "optional" per Google, but its absence is one of the
    // non-critical warnings the Rich Results Test flags. Site root is a
    // reasonable canonical entity URL for the author since we don't have
    // per-author archive pages yet.
    author: { '@type': 'Person', name: author, url: `${SITE_BASE}/` },
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

  // FAQPage JSON-LD — emitted only when the article entry declares a faqs
  // array with at least 3 well-formed Q&A pairs. Google's FAQPage rich-result
  // eligibility requires a minimum of 2; we use 3 as a quality threshold so
  // sparse stubs don't ship. Q/A text runs through cleanMarkdown to strip
  // any bold/link markdown that crept in from copy-pasted body content.
  const ldFaq = buildFaqLd(article.faqs, url);

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
    ...(ldFaq ? [`<script type="application/ld+json">${sanitizeForJsonLdScript(JSON.stringify(ldFaq))}</script>`] : []),
    HEAD_END,
  ];
  return lines.join('\n  ');
}

// -----------------------------------------------------------------------------
// FAQPage JSON-LD builder.
//
// Accepts an article.faqs array of {q, a} objects (or {question, answer}).
// Returns null when the input is missing, malformed, or has fewer than 3
// valid pairs — Google's documented minimum for FAQ rich results is 2, but
// we use 3 as a quality bar to keep half-finished entries out of the SERP.
//
// Q/A text is run through cleanMarkdown to strip the bold/link markdown that
// commonly creeps in when FAQs are copy-pasted from body prose. The cap is
// 300 chars on questions and 1000 chars on answers — Google rejects FAQs
// where the answer text doesn't roughly match the on-page text, but very
// long answers tank the rich-result rendering, so we truncate at a word
// boundary if the prose runs over.
// -----------------------------------------------------------------------------
function buildFaqLd(faqs, url) {
  if (!Array.isArray(faqs)) return null;
  const cleaned = [];
  for (const f of faqs) {
    if (!f) continue;
    const q = cleanMarkdown(f.q || f.question || '');
    const a = cleanMarkdown(f.a || f.answer || '');
    if (q.length < 6 || a.length < 20) continue;
    cleaned.push({
      '@type': 'Question',
      name: truncateAtWord(q, 300),
      acceptedAnswer: {
        '@type': 'Answer',
        text: truncateAtWord(a, 1000),
      },
    });
  }
  if (cleaned.length < 3) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cleaned,
    // Tying the FAQPage to its host URL is not required by Google but it
    // helps the validator resolve which page the markup belongs to.
    url,
  };
}

// -----------------------------------------------------------------------------
// Body-loader injection. After PR-data-split, each article shell loads only
// the light core (data-light.js, ~60 KB) instead of the full 1.8 MB data.js.
// The per-article body lives at /bodies/articles/{slug}.js (generated by
// scripts/build-data-split.mjs on every deploy). This function injects a
// <script src="../bodies/articles/{slug}.js"></script> tag right after the
// data-light.js loader in each article shell, so the React render finds
// PANAMA_DATA.articleBodies[slug] available synchronously like before.
//
// Sentinels keep re-runs idempotent. First-run looks for the data-light.js
// loader line and inserts the body script immediately after it.
// -----------------------------------------------------------------------------
const BODY_LOADER_START = '<!-- BEGIN_ARTICLE_BODY_LOAD -->';
const BODY_LOADER_END   = '<!-- END_ARTICLE_BODY_LOAD -->';

function injectBodyLoader(html, slug) {
  if (!slug || slug === 'index') return html; // index page has no per-slug body
  // `defer` so this runs AFTER data-light.js (also defer). Without defer, this
  // sync script would run during parse, BEFORE data-light's defer fires, and
  // data-light's `window.PANAMA_DATA = {...}` assignment would clobber the
  // articleBodies the body script just set. With both deferred, execution
  // happens in document order: data-light → body.
  const tag = `<script defer src="../bodies/articles/${slug}.js"></script>`;
  const block = `  ${BODY_LOADER_START}\n  ${tag}\n  ${BODY_LOADER_END}`;
  const sentinelRe = new RegExp(
    `\\s*${BODY_LOADER_START.replace(/[<!\->\/]/g, c => '\\' + c)}[\\s\\S]*?${BODY_LOADER_END.replace(/[<!\->\/]/g, c => '\\' + c)}`
  );
  if (sentinelRe.test(html)) {
    return html.replace(sentinelRe, '\n' + block);
  }
  // First-run: insert after the data-light.js loader line. The shells use a
  // few variants (defer attribute, cache-bust ?v=... query string), so the
  // regex is permissive.
  const dataLightLineRe = /(<script[^>]*src="\.\.\/data-light\.js(?:\?[^"]*)?"[^>]*><\/script>)/;
  if (dataLightLineRe.test(html)) {
    return html.replace(dataLightLineRe, `$1\n${block}`);
  }
  return html;
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
    let next = applyToHtml(original, headBlock);
    next = injectBodyLoader(next, slug);
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
