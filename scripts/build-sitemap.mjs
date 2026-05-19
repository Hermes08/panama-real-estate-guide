#!/usr/bin/env node
// =============================================================================
// build-sitemap.mjs — regenerate project/sitemap.xml from data.js on every deploy
// =============================================================================
// The previous setup committed sitemap.xml by hand, so <lastmod> was frozen at
// the date of the last manual regen (2026-04-29). Google does not re-crawl
// aggressively when lastmod is stale, so content changes (FAQ schema injection,
// internal-link updates, title retreats, etc.) propagate slowly through SERPs.
//
// This script reads:
//   • project/data.js → PANAMA_DATA.articles (81 entries) + .news (18 entries)
//   • project/airtable-projects.json (if present) for project lastUpdate dates
//   • project/projects/*.html for the canonical project slug list
//   • project/youtube-videos.json (only for the /videos/ index entry — per-video
//     URLs live in sitemap-videos.xml which is built separately)
//
// And writes project/sitemap.xml with:
//   • Homepage (priority 1.0, lastmod=today, daily)
//   • /articles/ index (priority 0.7, lastmod=today, daily)
//   • /projects/ index pages + Spanish /proyectos/ alias (0.7, today)
//   • /news/ index (0.7, today)
//   • /videos/ index (0.7, today)
//   • Each article (0.8, lastmod=article.date, monthly)
//   • Each project (0.9, lastmod=today since deploy injects fresh schema, monthly)
//   • Each news item (0.7, lastmod=news.date, monthly)
//
// Output is gitignored — regenerated on every deploy alongside data-light.js
// and the JSX compile outputs.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..', 'project');
const SITE_BASE = 'https://panamarealestateguide.com';
const OUT = path.join(PROJECT_DIR, 'sitemap.xml');

const TODAY = new Date().toISOString().slice(0, 10);

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// "March 17, 2026" or "March 9, 2026" → "2026-03-17"
// Fallback to TODAY on any parse error.
function isoDate(s) {
  if (!s) return TODAY;
  const d = new Date(s + ' UTC');
  if (Number.isNaN(d.getTime())) return TODAY;
  return d.toISOString().slice(0, 10);
}

function url(loc, lastmod, changefreq, priority) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    '  </url>',
  ].filter(Boolean).join('\n');
}

async function main() {
  // 1. Load data.js
  const dataJsSrc = await fs.readFile(path.join(PROJECT_DIR, 'data.js'), 'utf8');
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(sandbox);
  vm.runInContext(dataJsSrc, sandbox, { timeout: 5000 });
  const D = sandbox.window.PANAMA_DATA;
  if (!D) throw new Error('PANAMA_DATA missing from data.js');

  const articles = D.articles || [];
  const news = D.news || [];

  // 2. Project slugs come from the actual /projects/*.html inventory (most
  //    reliable; airtable-projects.json may not be populated at build time).
  const projectFiles = await fs.readdir(path.join(PROJECT_DIR, 'projects')).catch(() => []);
  const projectSlugs = projectFiles.filter(f => f.endsWith('.html')).map(f => f.replace(/\.html$/, ''));

  // 3. Build URL list.
  const urls = [];

  // Aggregator / hub pages — lastmod=today since their listing recomputes
  urls.push(url(`${SITE_BASE}/`, TODAY, 'daily', '1.0'));
  urls.push(url(`${SITE_BASE}/articles/`, TODAY, 'daily', '0.7'));
  urls.push(url(`${SITE_BASE}/news/`, TODAY, 'daily', '0.7'));
  urls.push(url(`${SITE_BASE}/proyectos/`, TODAY, 'daily', '0.7'));
  urls.push(url(`${SITE_BASE}/videos/`, TODAY, 'daily', '0.7'));

  // Articles
  for (const a of articles) {
    if (!a?.id) continue;
    urls.push(url(`${SITE_BASE}/articles/${a.id}.html`, isoDate(a.date), 'monthly', '0.8'));
  }

  // Projects
  for (const slug of projectSlugs) {
    // Project schema is regenerated on every deploy (inject-project-meta runs;
    // VideoObject schema may attach if a YouTube video maps to this slug), so
    // lastmod = today is honest.
    urls.push(url(`${SITE_BASE}/projects/${slug}.html`, TODAY, 'monthly', '0.9'));
  }

  // News
  for (const n of news) {
    if (!n?.slug) continue;
    urls.push(url(`${SITE_BASE}/news/${n.slug}.html`, isoDate(n.iso || n.date), 'monthly', '0.7'));
  }

  // 4. Compose final XML
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');

  await fs.writeFile(OUT, xml, 'utf8');
  const bytes = (await fs.stat(OUT)).size;
  console.log(
    `build-sitemap: wrote ${OUT} · ${urls.length} URLs · ${(bytes/1024).toFixed(1)} KB · ` +
    `${articles.length} articles + ${projectSlugs.length} projects + ${news.length} news + 5 aggregator pages`
  );
}

main().catch(err => { console.error('build-sitemap failed:', err); process.exit(1); });
