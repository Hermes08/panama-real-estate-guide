#!/usr/bin/env node
// =============================================================================
// inject-project-meta.mjs v4 — per-project SEO meta + schema + merge + finally guard
// =============================================================================
// Reads project metadata from project/data.js (PANAMA_DATA.projects) and
// optionally project/airtable-projects.json, then for each /projects/*.html
// file (the legacy 19 detail-page shells, identical static HTML by default)
// injects:
//   • <title>Project Name — PanamaRealEstateGuide.com</title>
//   • <meta name="description" content="..."/>
//   • <meta property="og:title" content="..."/>
//   • <script type="application/ld+json">RealEstateListing</script>
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

// Build a basic RealEstateListing schema + meta block
function buildHeadInjection(project, slug) {
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
    HEAD_END
  ];
  return lines.join('\n  ');
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

  const files = await fs.readdir(PROJECTS_DIR);
  let modified = 0, withMeta = 0, generic = 0;
  for (const f of files) {
    if (!f.endsWith('.html')) continue;
    const slug = f.replace(/\.html$/, '');
    const proj = projects[slug];
    if (proj) withMeta++; else generic++;

    const filePath = path.join(PROJECTS_DIR, f);
    const original = await fs.readFile(filePath, 'utf8');
    const headBlock = buildHeadInjection(proj, slug);
    let next = applyToHtml(original, headBlock);
    next = stripLegacyHydrateBlock(next);
    next = patchTemplateMerge(next);
    next = patchTemplateFinally(next);
    if (next !== original) {
      await fs.writeFile(filePath, next, 'utf8');
      modified++;
    }
  }
  console.log(`inject-project-meta: ${modified}/${files.length} files updated · ${withMeta} with rich data, ${generic} with generic fallback`);
}

main().catch((err) => { console.error('inject-project-meta failed:', err); process.exit(1); });
