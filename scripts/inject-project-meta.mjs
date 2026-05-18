#!/usr/bin/env node
// =============================================================================
// inject-project-meta.mjs v5 — per-project SEO meta + RealEstateListing/VideoObject
//                              schema + YouTube video embed + finally guard
// =============================================================================
// Reads project metadata from project/data.js (PANAMA_DATA.projects),
// optionally project/airtable-projects.json, and YouTube video mappings
// from project/youtube-videos.json. Then for each /projects/*.html file
// (the legacy 19 detail-page shells, identical static HTML by default)
// injects:
//   • <title>Project Name — PanamaRealEstateGuide.com</title>
//   • <meta name="description" content="..."/>
//   • <meta property="og:title" content="..."/>
//   • <script type="application/ld+json">RealEstateListing</script>
//   • <script type="application/ld+json">VideoObject</script>  (when mapped)
//   • <script>window.__PROJECT_VIDEOS__ = [...]</script>       (when mapped)
//   • A <section> between hero and "About" that renders a lazy-loaded YouTube
//     iframe + project-video metadata. The JSX is wrapped in idempotency
//     sentinels so re-runs replace cleanly.
//
// Idempotent — re-runs replace content between markers.
// Safe — projects without metadata get a generic schema instead of skipping.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..', 'project');
const PROJECTS_DIR = path.join(PROJECT_DIR, 'projects');
const SITE_BASE = 'https://panamarealestateguide.com';

const HEAD_START = '<!-- BEGIN_PROJECT_META -->';
const HEAD_END   = '<!-- END_PROJECT_META -->';

// JSX sentinel block injected into the React render. Lives between the hero
// </section> and the "ABOUT + AMENITIES" section. When the script writes the
// project's video data into window.__PROJECT_VIDEOS__, this JSX picks it up
// at render time and shows a lazy-loaded YouTube embed.
const JSX_VIDEO_START = '{/* BEGIN_PROJECT_VIDEO */}';
const JSX_VIDEO_END   = '{/* END_PROJECT_VIDEO */}';

// Marker that identifies the ABOUT section — stable anchor for insertion.
const JSX_ABOUT_MARKER = '{/* ABOUT + AMENITIES */}';

const YOUTUBE_VIDEOS_JSON = path.join(PROJECT_DIR, 'youtube-videos.json');
const YT_EMBED_BASE = 'https://www.youtube.com/embed/';
const YT_WATCH_BASE = 'https://www.youtube.com/watch?v=';

// Parse PANAMA_DATA.projects from data.js (it's JS, not JSON, so we extract by regex)
function parseProjectsFromDataJs(src) {
  const out = {};
  const projMatch = src.match(/projects:\s*\[([\s\S]*?)\]\s*,\s*\n\s*regions:/);
  if (!projMatch) return out;
  const block = projMatch[1];

  // Split on top-level "{...}," entries — naive but works since each entry is well-formed
  const entries = [];
  let depth = 0, start = -1;
  for (let i = 0; i < block.length; i++) {
    const c = block[i];
    if (c === '{' && depth === 0) start = i;
    if (c === '{') depth++;
    if (c === '}') { depth--; if (depth === 0 && start >= 0) { entries.push(block.slice(start, i + 1)); start = -1; } }
  }

  for (const e of entries) {
    const get = (k) => {
      const m1 = e.match(new RegExp(`${k}:\\s*'([^']*)'`));
      if (m1) return m1[1];
      const m2 = e.match(new RegExp(`${k}:\\s*"([^"]*)"`));
      if (m2) return m2[1];
      const m3 = e.match(new RegExp(`${k}:\\s*\`([^\`]*)\``));
      if (m3) return m3[1];
      const m4 = e.match(new RegExp(`${k}:\\s*(\\d+)`));
      if (m4) return Number(m4[1]);
      return null;
    };
    const id = get('id');
    if (!id) continue;
    out[id] = {
      slug: id,
      name: get('name') || '',
      developer: get('developer') || '',
      location: get('location') || '',
      region: get('region') || '',
      tagline: get('tagline') || '',
      priceFrom: get('priceFrom') || null,
      fromLabel: get('fromLabel') || '',
      delivery: get('delivery') || '',
      status: get('status') || '',
      about: get('about') || ''
    };
  }
  return out;
}

// -----------------------------------------------------------------------------
// YouTube video map loader. Returns { slug: [video, video, ...] }.
// Missing file or malformed JSON is fine — the inject just skips video emission
// for that run. This lets the script also work in environments where the
// youtube sync step hasn't run yet (initial deploy, no network in CI, etc.).
// -----------------------------------------------------------------------------
async function loadYoutubeVideos() {
  try {
    const raw = await fs.readFile(YOUTUBE_VIDEOS_JSON, 'utf8');
    const data = JSON.parse(raw);
    const out = {};
    for (const v of data.videos || []) {
      if (!v.videoId || !v.projectSlug) continue;
      (out[v.projectSlug] ||= []).push(v);
    }
    // Sort each project's videos newest-first so [0] is the primary embed.
    for (const slug of Object.keys(out)) {
      out[slug].sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''));
    }
    return out;
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.warn(`inject-project-meta: youtube-videos.json present but unparseable (${e.message}) — skipping video schema`);
    }
    return {};
  }
}

// Strip the boilerplate hashtag block + Spanish disclaimer that every video
// description ends with. Same logic as inject-video-meta.mjs; kept inline
// here to keep the two scripts independently runnable. Order matters: kill
// the trailing warning/disclaimer first, then the hashtag block (which then
// becomes the new end-of-string), then collapse.
function cleanVideoDescription(d) {
  if (!d) return '';
  return String(d)
    .trim()
    .replace(/\n+⚠️[\s\S]+$/g, '')
    .replace(/\n+\*[^*]+\*\s*$/g, '')
    .replace(/\n+#[A-Za-z0-9_# ]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build a YouTube VideoObject JSON-LD per Google's docs:
//   https://developers.google.com/search/docs/appearance/structured-data/video
// Required: name, description, thumbnailUrl, uploadDate. Optional but ranking-
// helpful: duration (ISO 8601), contentUrl, embedUrl, publisher.
function buildVideoObjectLd(video) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: cleanVideoDescription(video.description) || video.title,
    thumbnailUrl: [
      video.thumbnailUrl,
      `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
    ].filter(Boolean),
    uploadDate: video.publishDate,
    duration: video.duration || 'PT3S',
    contentUrl: `${YT_WATCH_BASE}${video.videoId}`,
    embedUrl: `${YT_EMBED_BASE}${video.videoId}`,
    publisher: {
      '@type': 'Organization',
      name: 'Panama Real Estate Guide',
      logo: { '@type': 'ImageObject', url: `${SITE_BASE}/cover_facebook_1640x856.png` },
    },
    inLanguage: video.lang || 'es',
  };
}

// Build a basic RealEstateListing schema + meta block.
// When `videos` is a non-empty array, emits a VideoObject JSON-LD for the
// primary video (most recent) and a window.__PROJECT_VIDEOS__ globals script
// so the React render can pick up the embed metadata.
function buildHeadInjection(project, slug, videos = []) {
  const url = `${SITE_BASE}/projects/${slug}.html`;
  const name = project?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const desc = project?.about
    ? project.about.slice(0, 155).replace(/\s+\S*$/, '') + '…'
    : `${name} — Panama real estate project. Developer-direct units, refundable reservation deposit from $5,000.`;
  const location = project?.location || 'Panama';
  const fromLabel = project?.fromLabel || 'Reserve from $5,000';

  const ldjson = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    'name': name,
    'description': desc,
    'url': url,
    'image': `${SITE_BASE}/cover_facebook_1640x856.png`,
    'address': { '@type': 'PostalAddress', 'addressLocality': location, 'addressCountry': 'PA' }
  };
  if (project?.priceFrom) {
    ldjson['offers'] = {
      '@type': 'AggregateOffer', 'lowPrice': project.priceFrom, 'priceCurrency': 'USD'
    };
  }
  if (project?.developer) {
    ldjson['provider'] = { '@type': 'Organization', 'name': project.developer };
  }

  const videoLines = [];
  if (videos.length > 0) {
    // Primary VideoObject — Google's video carousel reads the first one if
    // multiple are present on the page.
    videoLines.push(`<script type="application/ld+json">${JSON.stringify(buildVideoObjectLd(videos[0]))}</script>`);
    // Per-page video globals. The React render reads window.__PROJECT_VIDEOS__
    // and renders a <section> between hero and About. Keeping the data on
    // window (rather than re-fetching json on the client) avoids a network
    // round-trip and a CLS hit on first render.
    const safeJson = JSON.stringify(videos).replace(/</g, '\\u003c');
    videoLines.push(`<script>window.__PROJECT_VIDEOS__ = ${safeJson};</script>`);
  }

  const lines = [
    HEAD_START,
    `<title>${name} — PanamaRealEstateGuide.com</title>`,
    `<meta name="description" content="${desc.replace(/"/g, '&quot;')}"/>`,
    `<meta property="og:title" content="${name} — PanamaRealEstateGuide.com"/>`,
    `<meta property="og:description" content="${desc.replace(/"/g, '&quot;')}"/>`,
    `<meta property="og:url" content="${url}"/>`,
    `<meta property="og:type" content="website"/>`,
    `<link rel="canonical" href="${url}"/>`,
    `<script type="application/ld+json">${JSON.stringify(ldjson)}</script>`,
    ...videoLines,
    HEAD_END
  ];
  return lines.join('\n  ');
}

// -----------------------------------------------------------------------------
// JSX video-section injector.
//
// The project HTMLs are identical templates with React inline. We insert a
// new `<section>` between the hero and the "ABOUT + AMENITIES" section, gated
// on `window.__PROJECT_VIDEOS__` being present at render time (set by the
// head-injected globals script). The section uses YouTube's privacy-enhanced
// nocookie domain and lazy-loads via the iframe `loading="lazy"` attribute.
//
// The block is wrapped in JSX comment sentinels so re-runs replace cleanly.
// First-run injection happens once (when sentinels are absent); subsequent
// runs replace the existing block — the JSX content is hardcoded so the
// only thing that changes is presence/absence, not content.
// -----------------------------------------------------------------------------
const PROJECT_VIDEO_JSX_BLOCK = `${JSX_VIDEO_START}
          {typeof window !== 'undefined' && Array.isArray(window.__PROJECT_VIDEOS__) && window.__PROJECT_VIDEOS__.length > 0 && (
            <section className="project-video-section" style={{ padding: 'clamp(48px, 6vw, 90px) 0', background: 'var(--paper)' }}>
              <div className="container">
                <div className="eyebrow" style={{ marginBottom: 16 }}>
                  <span className="rule-coral"></span>Video tour
                </div>
                <h2 className="display" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', margin: '0 0 24px', lineHeight: 1.1 }}>
                  See <em>{p.name}</em> in motion.
                </h2>
                <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 14, overflow: 'hidden', maxWidth: 980, margin: '0 auto', background: '#000' }}>
                  <iframe
                    src={\`https://www.youtube-nocookie.com/embed/\${window.__PROJECT_VIDEOS__[0].videoId}?rel=0\`}
                    title={window.__PROJECT_VIDEOS__[0].title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  />
                </div>
                {window.__PROJECT_VIDEOS__.length > 1 && (
                  <p style={{ marginTop: 20, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)', letterSpacing: '0.08em' }}>
                    {window.__PROJECT_VIDEOS__.length} videos · <a href={\`https://www.youtube.com/@panamarealestateguidetv\`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>more on YouTube →</a>
                  </p>
                )}
              </div>
            </section>
          )}
          ${JSX_VIDEO_END}

          `;

function injectVideoJsx(html) {
  // If sentinels already present, replace the block in case the content
  // template was updated by a script revision.
  const sentinelRe = new RegExp(
    `${JSX_VIDEO_START.replace(/[{}/*]/g, c => '\\' + c)}[\\s\\S]*?${JSX_VIDEO_END.replace(/[{}/*]/g, c => '\\' + c)}\\s*`
  );
  if (sentinelRe.test(html)) {
    return html.replace(sentinelRe, PROJECT_VIDEO_JSX_BLOCK);
  }
  // First-run: insert before the ABOUT marker. If the marker isn't found,
  // the project HTML uses a different template — skip the JSX inject (the
  // head VideoObject schema still gets emitted, which is the main SEO win).
  if (!html.includes(JSX_ABOUT_MARKER)) return html;
  return html.replace(JSX_ABOUT_MARKER, PROJECT_VIDEO_JSX_BLOCK + JSX_ABOUT_MARKER);
}


// =============================================================================
// PHASE 2: patch the existing inline-Babel template at the bottom of every
// /projects/*.html so that its airtable fetch MERGES into data.js demos
// instead of REPLACING them. The original template did:
//
//   window.PANAMA_DATA.projects = d.projects;          // drops 6 demos
//
// We replace it with a merge that preserves the 6 demo slugs (palma-blanca,
// coral-cove, etc.) so their detail pages keep working AND the 13 airtable
// projects get hydrated into PANAMA_DATA so altos-del-maria etc. resolve.
//
// Also: removes the BEGIN_DETAIL_HYDRATE block from a previous version of
// this script (the merge now lives in the existing template instead).
// =============================================================================
const TEMPLATE_REPLACE_LINE  = 'window.PANAMA_DATA.projects = d.projects;';
const TEMPLATE_MERGE_LINE    = '(function(){var byId={};window.PANAMA_DATA.projects.forEach(function(p){byId[p.id]=p;});d.projects.forEach(function(p){byId[p.id||p.slug]=Object.assign({},byId[p.id||p.slug]||{},p);});window.PANAMA_DATA.projects=Object.values(byId);window.PANAMA_DATA._projectsSource=\'airtable+demo\';})();';


// Also patch the .finally() mutation cycle so it doesn't clobber demo project
// objects when `p` and `cur` are the same reference.
const TEMPLATE_FINALLY_BAD = `        if (cur) {
          for (const k in p) delete p[k];
          Object.assign(p, cur);
        }`;
const TEMPLATE_FINALLY_GOOD = `        if (cur && cur !== p) {
          for (const k in p) delete p[k];
          Object.assign(p, cur);
        }`;

function patchTemplateFinally(html) {
  if (html.includes(TEMPLATE_FINALLY_GOOD)) return html;
  if (html.includes(TEMPLATE_FINALLY_BAD)) {
    return html.replace(TEMPLATE_FINALLY_BAD, TEMPLATE_FINALLY_GOOD);
  }
  return html;
}

function patchTemplateMerge(html) {
  if (html.includes(TEMPLATE_MERGE_LINE)) return html; // already patched
  if (html.includes(TEMPLATE_REPLACE_LINE)) {
    return html.replace(TEMPLATE_REPLACE_LINE, TEMPLATE_MERGE_LINE);
  }
  return html;
}

// Strip a leftover BEGIN_DETAIL_HYDRATE block from the previous version of
// this script — it was a duplicate hydrate that ran before the template's
// own fetch (which then overwrote it). Now we patch the template directly
// so the duplicate is unnecessary.
function stripLegacyHydrateBlock(html) {
  return html.replace(
    /[ \t]*<!-- BEGIN_DETAIL_HYDRATE -->[\s\S]*?<!-- END_DETAIL_HYDRATE -->\n?/,
    ''
  );
}


function applyToHtml(html, headBlock) {
  const re = new RegExp(`${HEAD_START}[\\s\\S]*?${HEAD_END}`);
  if (re.test(html)) return html.replace(re, headBlock);

  // Replace the existing <title> and <meta description>; insert OG/canonical/JSON-LD after.
  // Simplest: drop in right before </head>, removing the static <title>Project ...</title>
  // and the static description so we don't duplicate.
  let next = html
    .replace(/<title>[^<]*<\/title>\n?/, '')
    .replace(/<meta name="description"[^>]*>\n?/, '')
    .replace(/<meta property="og:title"[^>]*>\n?/, '')
    .replace(/<meta property="og:description"[^>]*>\n?/, '')
    .replace(/<meta property="og:url"[^>]*>\n?/, '')
    .replace(/<link rel="canonical"[^>]*>\n?/, '');
  return next.replace(/<\/head>/i, `  ${headBlock}\n</head>`);
}

async function main() {
  const dataJs = await fs.readFile(path.join(PROJECT_DIR, 'data.js'), 'utf8');
  const projects = parseProjectsFromDataJs(dataJs);
  console.log(`inject-project-meta: parsed ${Object.keys(projects).length} projects from data.js`);

  // Try to merge airtable JSON if present
  const airtableJson = path.join(PROJECT_DIR, 'airtable-projects.json');
  try {
    const airtable = JSON.parse(await fs.readFile(airtableJson, 'utf8'));
    const list = airtable.projects || airtable;
    if (Array.isArray(list)) {
      for (const p of list) {
        const id = p.slug || p.id;
        if (!id) continue;
        projects[id] = { ...projects[id], ...p, slug: id };
      }
      console.log(`inject-project-meta: merged ${list.length} airtable projects`);
    }
  } catch (e) {
    console.log(`inject-project-meta: no airtable JSON (${e.code || e.message}) — using data.js only`);
  }

  const videosBySlug = await loadYoutubeVideos();
  const videoCount = Object.values(videosBySlug).reduce((n, vs) => n + vs.length, 0);
  console.log(`inject-project-meta: ${videoCount} YouTube videos mapped across ${Object.keys(videosBySlug).length} projects`);

  const files = await fs.readdir(PROJECTS_DIR);
  let modified = 0, withMeta = 0, generic = 0, withVideo = 0;
  for (const f of files) {
    if (!f.endsWith('.html')) continue;
    const slug = f.replace(/\.html$/, '');
    const proj = projects[slug];
    const videos = videosBySlug[slug] || [];
    if (proj) withMeta++; else generic++;
    if (videos.length) withVideo++;

    const filePath = path.join(PROJECTS_DIR, f);
    const original = await fs.readFile(filePath, 'utf8');
    const headBlock = buildHeadInjection(proj, slug, videos);
    let next = applyToHtml(original, headBlock);
    next = stripLegacyHydrateBlock(next);
    next = patchTemplateMerge(next);
    next = patchTemplateFinally(next);
    next = injectVideoJsx(next);
    if (next !== original) {
      await fs.writeFile(filePath, next, 'utf8');
      modified++;
    }
  }
  console.log(`inject-project-meta: ${modified}/${files.length} files updated · ${withMeta} with rich data, ${generic} with generic fallback, ${withVideo} with video embed`);
}

main().catch((err) => { console.error('inject-project-meta failed:', err); process.exit(1); });
