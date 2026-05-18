#!/usr/bin/env node
// =============================================================================
// build-video-sitemap.mjs — generate project/sitemap-videos.xml
// =============================================================================
// Reads project/youtube-videos.json and writes a video-aware sitemap with
// <video:video> tags per host page. Per Google's video sitemap docs
// (https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps)
// each <url> entry pairs a host page URL with one or more <video:video>
// children that describe the videos on that page.
//
// Host pages emitted:
//   • https://panamarealestateguide.com/projects/{slug}.html  (one per project
//     with at least one mapped video — embed lives in the project page itself)
//   • https://panamarealestateguide.com/videos/{videoId}.html (one per video,
//     used by Phase 3 when those dedicated pages exist)
//
// Submitted to GSC by referencing it from robots.txt + main sitemap.xml.
// Regenerated on every deploy alongside the YouTube RSS sync.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..', 'project');
const SITE_BASE = 'https://panamarealestateguide.com';
const VIDEOS_JSON = path.join(PROJECT_DIR, 'youtube-videos.json');
const OUT_PATH = path.join(PROJECT_DIR, 'sitemap-videos.xml');

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Strip the boilerplate hashtag block + disclaimer that YouTube descriptions
// always end with. Same shape as the helper in inject-video-meta.mjs.
// Order matters: kill the trailing warning/disclaimer first, then the
// hashtag block (which then becomes the new end-of-string), then collapse.
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

// ISO 8601 PT3S → 3 seconds. Falls back to 5s if unparseable so the sitemap
// still validates (Google rejects entries missing duration only for live
// videos; for VOD it's a strong recommendation).
function durationToSeconds(iso) {
  if (!iso || typeof iso !== 'string') return 5;
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 5;
  return (Number(m[1] || 0) * 3600) + (Number(m[2] || 0) * 60) + Number(m[3] || 0) || 5;
}

function buildVideoEntry(video, indent = '    ') {
  const lines = [
    `${indent}<video:video>`,
    `${indent}  <video:thumbnail_loc>${xmlEscape(video.thumbnailUrl || `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`)}</video:thumbnail_loc>`,
    `${indent}  <video:title>${xmlEscape(video.title)}</video:title>`,
    `${indent}  <video:description>${xmlEscape((cleanVideoDescription(video.description) || video.title).slice(0, 2048))}</video:description>`,
    `${indent}  <video:content_loc>https://www.youtube.com/watch?v=${video.videoId}</video:content_loc>`,
    `${indent}  <video:player_loc allow_embed="yes" autoplay="ap=1">https://www.youtube.com/embed/${video.videoId}</video:player_loc>`,
    `${indent}  <video:duration>${durationToSeconds(video.duration)}</video:duration>`,
    `${indent}  <video:publication_date>${xmlEscape(video.publishDate)}</video:publication_date>`,
    `${indent}  <video:family_friendly>yes</video:family_friendly>`,
    `${indent}  <video:requires_subscription>no</video:requires_subscription>`,
    `${indent}  <video:live>no</video:live>`,
    `${indent}  <video:platform relationship="allow">web mobile tv</video:platform>`,
    `${indent}  <video:uploader info="${SITE_BASE}/">Panama Real Estate Guide</video:uploader>`,
    `${indent}</video:video>`,
  ];
  return lines.join('\n');
}

async function main() {
  let data;
  try {
    data = JSON.parse(await fs.readFile(VIDEOS_JSON, 'utf8'));
  } catch (e) {
    console.warn(`build-video-sitemap: youtube-videos.json missing or unreadable (${e.code || e.message}) — writing empty sitemap`);
    data = { videos: [] };
  }
  const videos = Array.isArray(data.videos) ? data.videos : [];

  // Group by project slug — one <url> per project page that has videos.
  const byProject = {};
  for (const v of videos) {
    if (!v.videoId) continue;
    if (v.projectSlug) (byProject[v.projectSlug] ||= []).push(v);
  }

  const out = [];
  out.push('<?xml version="1.0" encoding="UTF-8"?>');
  out.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  out.push('        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">');

  // 1) Per-project entries (the embed lives on the project page).
  for (const slug of Object.keys(byProject).sort()) {
    out.push('  <url>');
    out.push(`    <loc>${SITE_BASE}/projects/${slug}.html</loc>`);
    for (const v of byProject[slug]) {
      out.push(buildVideoEntry(v, '    '));
    }
    out.push('  </url>');
  }

  // 2) Per-video entries (dedicated /videos/{videoId}.html pages from Phase 3).
  //    Only emit when those pages will actually exist (i.e., at least one
  //    video — Phase 3 generates a page per entry in youtube-videos.json).
  for (const v of videos) {
    if (!v.videoId) continue;
    out.push('  <url>');
    out.push(`    <loc>${SITE_BASE}/videos/${v.videoId}.html</loc>`);
    out.push(buildVideoEntry(v, '    '));
    out.push('  </url>');
  }

  // 3) Videos index page.
  if (videos.length > 0) {
    out.push('  <url>');
    out.push(`    <loc>${SITE_BASE}/videos/</loc>`);
    out.push('  </url>');
  }

  out.push('</urlset>');

  await fs.writeFile(OUT_PATH, out.join('\n') + '\n', 'utf8');
  console.log(`build-video-sitemap: wrote ${OUT_PATH} · ${Object.keys(byProject).length} project entries · ${videos.length} video entries`);
}

main().catch((err) => { console.error('build-video-sitemap failed:', err); process.exit(1); });
