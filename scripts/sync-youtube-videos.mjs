#!/usr/bin/env node
// =============================================================================
// sync-youtube-videos.mjs — pull recent videos from YouTube RSS, merge with
//                          existing youtube-videos.json, write back.
// =============================================================================
// Source: https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}
// Auth:   None required — RSS feed is public.
// Volume: ~12KB per fetch, refreshes ~hourly upstream. YouTube limits the
//         feed to the 15 most recent videos. Older videos persist in the
//         local JSON because we MERGE rather than replace.
//
// Matching: video → project slug AND video → article slug.
//   1. Build {name → slug} from PANAMA_DATA.projects (data.js + airtable) and
//      {title → id} from PANAMA_DATA.articles.
//   2. For each video title, find a project whose name appears as a substring
//      (case-insensitive, accent-folded). Longest match wins so that
//      "Bioma Costa del Este" beats "Costa del Este" when both exist. Articles
//      match the same way but only on the full (long) article title, so the
//      auto-matcher almost never fires by accident.
//   3. Manual projectSlug/articleSlug overrides in the existing JSON are
//      preserved verbatim — never overwritten by the matcher. Topical commentary
//      Shorts (areas/zones with no same-named article) are connected by hand via
//      `articleSlug` in youtube-videos.json.
//
// Duration: the RSS feed does not include duration. We default to PT3S
// (matches the cinemagraph format the channel ships today). When/if longer
// videos are added, swap this for the YouTube Data API v3 (videos.list?part=
// contentDetails) — that requires an API key but returns accurate durations.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..', 'project');
const VIDEOS_JSON = path.join(PROJECT_DIR, 'youtube-videos.json');
const DATA_JS = path.join(PROJECT_DIR, 'data.js');
const AIRTABLE_JSON = path.join(PROJECT_DIR, 'airtable-projects.json');

const CHANNEL_ID = 'UCWFIZR077P4XCVhsKOhF_pQ';
const CHANNEL_HANDLE = 'panamarealestateguidetv';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

// Default duration for new entries — the RSS feed omits duration. Override
// per-video by editing youtube-videos.json directly or by adding a YouTube
// Data API v3 call when longer-form content starts shipping.
const DEFAULT_DURATION = 'PT3S';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function foldAccents(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Naive XML extractor for the small set of fields we care about. Good enough
// for YouTube's RSS feed, which has a very stable shape. Avoids pulling in
// a parser dependency.
function extractAll(xml, tag) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(xml)) !== null) out.push(m[1]);
  return out;
}
function extractOne(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return m ? m[1] : null;
}
function decodeXml(s) {
  if (!s) return s;
  return String(s)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

// -----------------------------------------------------------------------------
// Project name → slug map from data.js + airtable JSON
// -----------------------------------------------------------------------------
async function loadProjectNameToSlugMap() {
  const out = [];

  // Read PANAMA_DATA from data.js via vm sandbox.
  try {
    const src = await fs.readFile(DATA_JS, 'utf8');
    const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
    vm.createContext(sandbox);
    vm.runInContext(src, sandbox, { timeout: 5000 });
    for (const p of (sandbox.window.PANAMA_DATA?.projects || [])) {
      if (p?.id && p?.name) out.push({ slug: p.id, name: p.name });
    }
  } catch (e) {
    console.warn(`sync-youtube-videos: failed to read data.js (${e.message})`);
  }

  // Airtable JSON if present.
  try {
    const at = JSON.parse(await fs.readFile(AIRTABLE_JSON, 'utf8'));
    const list = Array.isArray(at) ? at : (at.projects || []);
    for (const p of list) {
      const slug = p.slug || p.id;
      const name = p.name || p.title;
      if (slug && name) out.push({ slug, name });
    }
  } catch (_) { /* missing is fine */ }

  // Also build from on-disk /projects/*.html slugs as a fallback for when
  // data.js is empty (current state — projects load from Airtable at runtime).
  try {
    const files = await fs.readdir(path.join(PROJECT_DIR, 'projects'));
    for (const f of files) {
      if (!f.endsWith('.html')) continue;
      const slug = f.replace(/\.html$/, '');
      // Synthesize a name from the slug: "bioma-costa-del-este" → "Bioma Costa Del Este"
      const synthesizedName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      out.push({ slug, name: synthesizedName });
    }
  } catch (_) { /* dir may not exist */ }

  // Dedup by slug, keep first occurrence (data.js > airtable > synthesized).
  const seen = new Set();
  const dedup = [];
  for (const e of out) {
    if (seen.has(e.slug)) continue;
    seen.add(e.slug);
    dedup.push(e);
  }
  return dedup;
}

function matchTitleToSlug(title, projects) {
  const folded = foldAccents(title);
  let best = null;
  let bestLen = 0;
  for (const p of projects) {
    const f = foldAccents(p.name);
    if (folded.includes(f) && f.length > bestLen) {
      best = p.slug;
      bestLen = f.length;
    }
  }
  return best;
}

// -----------------------------------------------------------------------------
// Article id + title list from data.js (PANAMA_DATA.articles). Used to connect
// topical/commentary Shorts ("Avenida Balboa — which building?", "Top 3 areas
// to buy") to the matching Journal article, the same way projects get matched.
// -----------------------------------------------------------------------------
async function loadArticleList() {
  const out = [];
  try {
    const src = await fs.readFile(DATA_JS, 'utf8');
    const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
    vm.createContext(sandbox);
    vm.runInContext(src, sandbox, { timeout: 5000 });
    for (const a of (sandbox.window.PANAMA_DATA?.articles || [])) {
      if (a?.id && a?.title) out.push({ slug: a.id, title: a.title });
    }
  } catch (e) {
    console.warn(`sync-youtube-videos: failed to read articles from data.js (${e.message})`);
  }
  return out;
}

// Conservative auto-matcher: only matches when an article's full title appears
// verbatim (accent-folded) inside the video title. Article titles are long
// sentences, so this rarely fires by accident — it has near-zero false
// positives. Topical Shorts whose area has no same-named article are connected
// by hand via a manual `articleSlug` in youtube-videos.json (preserved verbatim,
// exactly like `projectSlug`).
function matchTitleToArticle(title, articles) {
  const folded = foldAccents(title);
  let best = null;
  let bestLen = 0;
  for (const a of articles) {
    const f = foldAccents(a.title);
    if (f.length >= 12 && folded.includes(f) && f.length > bestLen) {
      best = a.slug;
      bestLen = f.length;
    }
  }
  return best;
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
async function main() {
  // Read existing JSON so we can preserve manual projectSlug edits + older
  // entries that have fallen off YouTube's 15-item feed window.
  let existing;
  try {
    existing = JSON.parse(await fs.readFile(VIDEOS_JSON, 'utf8'));
  } catch (_) {
    existing = { channelId: CHANNEL_ID, channelHandle: CHANNEL_HANDLE, videos: [] };
  }
  const existingByVid = new Map(
    (existing.videos || []).map(v => [v.videoId, v])
  );

  // Fetch RSS feed. If offline, exit cleanly without changing the file.
  let xml;
  try {
    const res = await fetch(RSS_URL, { headers: { 'User-Agent': 'panamarealestateguide-sync/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (e) {
    console.warn(`sync-youtube-videos: fetch failed (${e.message}) — keeping existing youtube-videos.json unchanged`);
    return;
  }

  const projects = await loadProjectNameToSlugMap();
  console.log(`sync-youtube-videos: loaded ${projects.length} project name → slug pairs`);
  const articles = await loadArticleList();
  console.log(`sync-youtube-videos: loaded ${articles.length} article id → title pairs`);

  const entries = extractAll(xml, 'entry');
  console.log(`sync-youtube-videos: feed has ${entries.length} entries`);

  let added = 0, updated = 0, unchanged = 0;
  for (const entry of entries) {
    const videoId = extractOne(entry, 'yt:videoId');
    if (!videoId) continue;
    const title = decodeXml(extractOne(entry, 'title') || '').trim();
    const description = decodeXml(extractOne(entry, 'media:description') || '').trim();
    const published = extractOne(entry, 'published');

    const prev = existingByVid.get(videoId);
    // Preserve any manual projectSlug/articleSlug override. Otherwise re-run the
    // matcher on the current title (in case the projects/articles list changed).
    const projectSlug = prev?.projectSlug ?? matchTitleToSlug(title, projects);
    const articleSlug = prev?.articleSlug ?? matchTitleToArticle(title, articles);

    const merged = {
      videoId,
      title: title || prev?.title || '',
      description: description.slice(0, 600) || prev?.description || '',
      publishDate: published || prev?.publishDate || new Date().toISOString(),
      duration: prev?.duration || DEFAULT_DURATION,
      thumbnailUrl: prev?.thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      projectSlug: projectSlug || null,
      articleSlug: articleSlug || null,
      lang: prev?.lang || 'es',
    };

    if (!prev) {
      added++;
    } else if (
      prev.title !== merged.title ||
      prev.description !== merged.description ||
      prev.projectSlug !== merged.projectSlug ||
      prev.articleSlug !== merged.articleSlug
    ) {
      updated++;
    } else {
      unchanged++;
    }
    existingByVid.set(videoId, merged);
  }

  const out = {
    channelId: CHANNEL_ID,
    channelHandle: CHANNEL_HANDLE,
    channelUrl: `https://www.youtube.com/@${CHANNEL_HANDLE}`,
    channelTitle: existing.channelTitle || 'Panama Real Estate Guide',
    lastSync: new Date().toISOString(),
    videos: [...existingByVid.values()].sort((a, b) =>
      (b.publishDate || '').localeCompare(a.publishDate || '')
    ),
  };

  // Idempotent write: only touch the file if something actually changed.
  // Compare ignoring lastSync (which always changes).
  const sameContent = (a, b) => {
    const sa = JSON.stringify({ ...a, lastSync: null });
    const sb = JSON.stringify({ ...b, lastSync: null });
    return sa === sb;
  };
  if (sameContent(existing, out)) {
    console.log(`sync-youtube-videos: no changes (${added} new, ${updated} updated, ${unchanged} unchanged)`);
    return;
  }

  await fs.writeFile(VIDEOS_JSON, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`sync-youtube-videos: wrote ${VIDEOS_JSON} · ${added} added, ${updated} updated, ${unchanged} unchanged · ${out.videos.length} total`);
}

main().catch((err) => { console.error('sync-youtube-videos failed:', err); process.exit(1); });
