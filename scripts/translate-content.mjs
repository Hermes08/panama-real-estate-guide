#!/usr/bin/env node
// =============================================================================
// translate-content.mjs — Auto-translate EN articles to ES, PT, DE via Claude API
// =============================================================================
// Reads project/data.js (PANAMA_DATA.articles + articleBodies), detects which
// articles need (re-)translation by comparing source SHA against
// state/i18n-cache.json, calls the Anthropic API with brand-voice context, and
// writes per-language data + body files into project/<lang>/.
//
// Languages: es, pt, de. EN stays the canonical source.
//
// Requires: ANTHROPIC_API_KEY env var. If missing, the script is a no-op
// (allows the build to proceed in environments without translation budget).
//
// Idempotent: only retranslates articles whose source content changed since the
// last cache hit. First run = full backfill. Subsequent runs = cents.
//
// Output structure:
//   project/<lang>/data-light-<lang>.js              — translated metadata
//   project/<lang>/bodies/articles/<slug>.js         — translated body
//   project/<lang>/articles/<slug>.html              — pre-rendered shell
//   state/i18n-cache.json                            — cache state
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_JS = path.join(ROOT, 'project', 'data.js');
const STATE_DIR = path.join(ROOT, 'state');
const CACHE_PATH = path.join(STATE_DIR, 'i18n-cache.json');
const GLOSSARY_PATH = path.join(STATE_DIR, 'i18n-glossary.json');
const CONTEXT_DIR = path.join(ROOT, 'context');
const PROJECT_DIR = path.join(ROOT, 'project');
const SITE_BASE = 'https://panamarealestateguide.com';

const LANGS = ['es', 'pt', 'de'];
const LANG_NAMES = { es: 'Spanish (Castilian + LATAM-neutral)', pt: 'Brazilian Portuguese', de: 'German (de_DE)' };

// -----------------------------------------------------------------------------
// Env guard: no API key, no-op
// -----------------------------------------------------------------------------
const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.log('[translate] ANTHROPIC_API_KEY not set, skipping translation step.');
  process.exit(0);
}

const MODEL = process.env.TRANSLATE_MODEL || 'claude-sonnet-4-6';
const MAX_CONCURRENT = parseInt(process.env.TRANSLATE_CONCURRENT || '4', 10);
const DRY_RUN = process.env.TRANSLATE_DRY_RUN === '1';
const SINGLE_SLUG = process.env.TRANSLATE_ONLY_SLUG || null;

// -----------------------------------------------------------------------------
// Load EN source via vm sandbox (same approach as inject-article-meta.mjs)
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

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
}

// -----------------------------------------------------------------------------
// Load context files (brand voice, audience, services, guidelines)
// -----------------------------------------------------------------------------
async function loadContext() {
  const files = ['brand-guidelines.md', 'tone-of-voice.md', 'audience.md', 'services.md'];
  const out = {};
  for (const f of files) {
    try {
      out[f] = await fs.readFile(path.join(CONTEXT_DIR, f), 'utf8');
    } catch {
      out[f] = '(missing)';
    }
  }
  return out;
}

// -----------------------------------------------------------------------------
// Translation prompt
// -----------------------------------------------------------------------------
function buildPrompt({ lang, article, body, glossary, context }) {
  const langName = LANG_NAMES[lang];
  const langGlossary = Object.fromEntries(
    Object.entries(glossary)
      .filter(([k]) => k !== '_meta')
      .map(([k, v]) => [v.en, v[lang]])
  );

  return `You are translating editorial market-analyst content for panamarealestateguide.com, a multilingual Panama real estate guide. Target language: ${langName} (locale code: ${lang}).

# Brand voice and rules (apply at translation time, not as separate edit)

## tone-of-voice.md
${context['tone-of-voice.md']}

## brand-guidelines.md
${context['brand-guidelines.md']}

## audience.md (relevant segment for ${lang})
${context['audience.md']}

## services.md
${context['services.md']}

# Glossary (use these canonical translations whenever the EN term appears)

${Object.entries(langGlossary).map(([en, tr]) => `- "${en}" -> "${tr}"`).join('\n')}

# Hard rules

1. Output natural, native-sounding ${langName}. The reader must not feel they are reading a translation.
2. Preserve all numbers, prices, dates, proper nouns (project names, zone names, developer names, attorney names, person names).
3. USD prefix stays "USD" (e.g. "USD $342,000"); "B/." stays as "B/." in ES/PT but parenthetically clarified on first occurrence for non-Panama audiences.
4. For dates in prose, convert to ${langName} convention (ES: "22 de abril de 2026"; PT: "22 de abril de 2026"; DE: "22. April 2026"). Dates in tables/schema stay ISO.
5. ABSOLUTELY NO em dashes (—) in output. Use colons, commas, parentheses, or split sentences. Same rule applies in ${langName}.
6. Apply the banned-competitors rule in ${langName} too (International Living, Live and Invest Overseas, Encuentra24, Vivanuncios never appear).
7. Translate the title for SEO impact in the target market, not literally. Lead with the surprising fact or number.
8. Translate the meta description (= excerpt) for SEO. 155-160 chars max. Lead with a number or specific.
9. Translate buyer-agency disclosures and attorney-consult lines using the glossary equivalents exactly.
10. If the EN body has callouts ("Note:", "Important:"), translate the label too ("Nota:", "Importante:" etc).

# Output format

Return STRICTLY a JSON object with this exact shape, no markdown fence:

{
  "title": "...",
  "description": "...",
  "slug": "...",
  "body_markdown": "...",
  "glossary_suggestions": [{"en": "...", "${lang}": "..."}, ...]
}

- "title": translated, 60-70 chars target
- "description": translated, 155-160 chars target
- "slug": KEEP THE EN SLUG (don't translate). Translation pipeline expects URL parity for hreflang.
- "body_markdown": full body in markdown
- "glossary_suggestions": new terms encountered worth adding (1-5 items, or [] if none)

# Input article (EN source)

Metadata:
${JSON.stringify({ id: article.id, title: article.title, excerpt: article.excerpt, category: article.category, author: article.author }, null, 2)}

Body markdown:
${body}

Respond with the JSON object only.`;
}

// -----------------------------------------------------------------------------
// Anthropic API call
// -----------------------------------------------------------------------------
async function callClaude(prompt) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Anthropic API ${resp.status}: ${txt.slice(0, 500)}`);
  }
  const data = await resp.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error('Anthropic returned no text content');
  // Extract JSON (be tolerant of surrounding text)
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart < 0 || jsonEnd < 0) throw new Error('No JSON in response: ' + text.slice(0, 200));
  const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
  return { parsed, usage: data.usage };
}

// -----------------------------------------------------------------------------
// Lint translated content against brand-guidelines (post-processing)
// -----------------------------------------------------------------------------
function lintTranslation(translated) {
  const issues = [];
  const all = [translated.title, translated.description, translated.body_markdown].join('\n');
  if (all.includes('—')) issues.push('em-dash present');
  for (const banned of ['International Living', 'Live and Invest Overseas', 'Encuentra24', 'Vivanuncios']) {
    if (all.toLowerCase().includes(banned.toLowerCase())) issues.push(`banned competitor: ${banned}`);
  }
  if (translated.description && translated.description.length > 200) {
    issues.push(`description too long (${translated.description.length} chars)`);
  }
  return issues;
}

// -----------------------------------------------------------------------------
// Generate the per-language HTML shell + body JS file + add to per-lang data
// -----------------------------------------------------------------------------
function renderHtmlShell(lang, slug, translated, sourceArticle) {
  const enUrl = `${SITE_BASE}/articles/${slug}.html`;
  const altLangs = ['en', 'es', 'pt', 'de'].filter(l => true);
  const hreflangs = altLangs.map(l => {
    const url = l === 'en' ? enUrl : `${SITE_BASE}/${l}/articles/${slug}.html`;
    return `<link rel="alternate" hreflang="${l}" href="${url}">`;
  }).join('\n  ');
  const xDefault = `<link rel="alternate" hreflang="x-default" href="${enUrl}">`;

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Manrope:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="../../styles.css"/>
  <script defer src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin="anonymous"></script>
  <script defer src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
  <!-- BEGIN_ARTICLE_META -->
  <title>${escapeHtml(translated.title)} | PanamaRealEstateGuide.com</title>
  <meta name="description" id="detail-meta-desc" content="${escapeHtml(translated.description)}"/>
  <link rel="canonical" href="${SITE_BASE}/${lang}/articles/${slug}.html"/>
  ${hreflangs}
  ${xDefault}
  <meta property="og:type" content="article"/>
  <meta property="og:locale" content="${lang}"/>
  <meta property="og:title" content="${escapeHtml(translated.title)}"/>
  <meta property="og:description" content="${escapeHtml(translated.description)}"/>
  <meta property="og:url" content="${SITE_BASE}/${lang}/articles/${slug}.html"/>
  <meta property="og:image" content="${SITE_BASE}/cover_facebook_1640x856.png"/>
  <meta property="og:site_name" content="Panama Real Estate Guide"/>
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": translated.title,
    "description": translated.description,
    "url": `${SITE_BASE}/${lang}/articles/${slug}.html`,
    "image": `${SITE_BASE}/cover_facebook_1640x856.png`,
    "inLanguage": lang,
    "author": { "@type": "Person", "name": sourceArticle.author || "David Aguirre", "url": SITE_BASE },
    "publisher": { "@type": "Organization", "name": "Panama Real Estate Guide", "logo": { "@type": "ImageObject", "url": `${SITE_BASE}/cover_facebook_1640x856.png` } },
    "translationOfWork": { "@type": "Article", "url": enUrl },
    "datePublished": sourceArticle.date || "2026-05-19",
    "dateModified": new Date().toISOString().slice(0, 10),
  })}</script>
  <!-- END_ARTICLE_META -->
</head>
<body>
  <div id="root"></div>
  <script>window.PREG_LANG="${lang}";</script>
  <script defer src="../../data-light.js"></script>
  <script defer src="bodies/${slug}.js"></script>
  <script defer src="../../components.js"></script>
  <script defer src="../../detail-chrome.js"></script>
  <script defer src="../article-renderer.js"></script>
  <!-- ML translated by Claude on ${new Date().toISOString().slice(0,10)}. Source: ${enUrl} -->
</body>
</html>
`;
}

function renderBodyJs(slug, translated, lang) {
  return `// Auto-generated ${lang} body for article: ${slug}
// Source: project/data.js articleBodies.${slug} (EN)
// Translated by Claude on ${new Date().toISOString().slice(0, 10)}
(function () {
  if (!window.PANAMA_DATA) window.PANAMA_DATA = {};
  if (!window.PANAMA_DATA.articleBodies) window.PANAMA_DATA.articleBodies = {};
  window.PANAMA_DATA.articleBodies[${JSON.stringify(slug)}] = ${JSON.stringify({
    title: translated.title,
    description: translated.description,
    body: translated.body_markdown,
    lang,
    machine_translated: true,
    translated_at: new Date().toISOString().slice(0, 10),
  }, null, 2)};
})();
`;
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

// -----------------------------------------------------------------------------
// Body extraction (the body in data.js is a structured array of sections/items)
// -----------------------------------------------------------------------------
function bodyToMarkdown(body) {
  if (!body) return '';
  if (typeof body === 'string') return body;
  if (Array.isArray(body)) {
    return body.map(section => {
      if (typeof section === 'string') return section;
      if (section.h2) return `## ${section.h2}\n\n${(section.body || []).map(b => typeof b === 'string' ? b : (b.text || JSON.stringify(b))).join('\n\n')}`;
      if (section.h3) return `### ${section.h3}\n\n${section.body || ''}`;
      if (section.text) return section.text;
      return JSON.stringify(section);
    }).join('\n\n');
  }
  return JSON.stringify(body);
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
async function main() {
  await fs.mkdir(STATE_DIR, { recursive: true });
  const dataSrc = await fs.readFile(DATA_JS, 'utf8');
  const data = loadPanamaData(dataSrc);
  const articles = (data.articles || []).filter(a => !a.lang || a.lang === 'en');
  console.log(`[translate] ${articles.length} EN articles in source`);

  const glossary = JSON.parse(await fs.readFile(GLOSSARY_PATH, 'utf8'));
  const context = await loadContext();

  let cache = {};
  try {
    cache = JSON.parse(await fs.readFile(CACHE_PATH, 'utf8'));
  } catch {}

  const tasks = [];
  for (const a of articles) {
    if (SINGLE_SLUG && a.id !== SINGLE_SLUG) continue;
    const bodyRaw = data.articleBodies?.[a.id];
    const bodyMd = bodyToMarkdown(bodyRaw);
    const srcSha = sha256(JSON.stringify({ title: a.title, excerpt: a.excerpt, body: bodyMd }));
    for (const lang of LANGS) {
      const cacheKey = `${a.id}.${lang}`;
      if (cache[cacheKey]?.src_sha === srcSha) continue;
      tasks.push({ article: a, body: bodyMd, lang, srcSha, cacheKey });
    }
  }
  console.log(`[translate] ${tasks.length} translations needed (skipped ${articles.length * LANGS.length - tasks.length} cached)`);

  if (DRY_RUN) {
    console.log('[translate] DRY_RUN, exiting');
    process.exit(0);
  }

  let done = 0;
  let totalTokens = { input: 0, output: 0 };
  const errors = [];

  async function runOne(task) {
    const { article, body, lang, srcSha, cacheKey } = task;
    try {
      const prompt = buildPrompt({ lang, article, body, glossary, context });
      const { parsed, usage } = await callClaude(prompt);
      const issues = lintTranslation(parsed);
      if (issues.length) console.log(`  [warn ${article.id} ${lang}] ${issues.join(', ')}`);

      const outDir = path.join(PROJECT_DIR, lang, 'articles');
      const bodyDir = path.join(PROJECT_DIR, lang, 'articles', 'bodies');
      await fs.mkdir(outDir, { recursive: true });
      await fs.mkdir(bodyDir, { recursive: true });
      await fs.writeFile(path.join(outDir, `${article.id}.html`), renderHtmlShell(lang, article.id, parsed, article));
      await fs.writeFile(path.join(bodyDir, `${article.id}.js`), renderBodyJs(article.id, parsed, lang));

      cache[cacheKey] = { src_sha: srcSha, translated_at: new Date().toISOString().slice(0, 10), tokens: usage };
      totalTokens.input += usage?.input_tokens || 0;
      totalTokens.output += usage?.output_tokens || 0;
      done++;
      console.log(`  [${done}/${tasks.length}] ${article.id} ${lang} (in=${usage?.input_tokens}, out=${usage?.output_tokens})`);

      // Append glossary suggestions
      for (const sug of parsed.glossary_suggestions || []) {
        const key = sug.en?.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
        if (key && !glossary[key]) {
          glossary[key] = { en: sug.en, [lang]: sug[lang] };
        }
      }
    } catch (e) {
      errors.push({ slug: article.id, lang, error: e.message });
      console.error(`  [err] ${article.id} ${lang}: ${e.message}`);
    }
  }

  // Concurrent batch runner
  const queue = tasks.slice();
  const workers = Array.from({ length: MAX_CONCURRENT }, async () => {
    while (queue.length) {
      const t = queue.shift();
      if (t) await runOne(t);
    }
  });
  await Promise.all(workers);

  // Persist updated cache and glossary
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
  await fs.writeFile(GLOSSARY_PATH, JSON.stringify(glossary, null, 2));

  console.log(`\n[translate] complete: ${done}/${tasks.length} succeeded, ${errors.length} errors`);
  console.log(`[translate] tokens: in=${totalTokens.input.toLocaleString()}, out=${totalTokens.output.toLocaleString()}`);
  // Rough cost at $3/M input, $15/M output
  const cost = (totalTokens.input / 1e6) * 3 + (totalTokens.output / 1e6) * 15;
  console.log(`[translate] estimated cost: $${cost.toFixed(2)}`);
  if (errors.length) {
    console.error('\n[translate] errors:');
    errors.forEach(e => console.error(`  ${e.slug} ${e.lang}: ${e.error}`));
    process.exit(1);
  }
}

main().catch(e => {
  console.error('[translate] fatal:', e);
  process.exit(1);
});
