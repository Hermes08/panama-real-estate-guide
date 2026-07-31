#!/usr/bin/env node
// =============================================================================
// port-v1-articles.mjs — one-time mechanical port of v1 article bodies into v2
// =============================================================================
// Reads project/data.js (v1's PANAMA_DATA), converts the block-array article
// bodies into markdown (v2's articles.body column is markdown text, not a
// block array), maps the 19 v1 categories onto v2's 4, and upserts into
// Supabase. Verbatim port — no rewriting. Improve/rewrite happens later on
// the Wave 1/2/3 schedule; this just gets real content live at cutover.
//
// A handful of "Real Estate by Location" articles fold into existing v2
// AREA pages instead of becoming articles (boquete, bocas-del-toro,
// costa-del-este, playa-venao all have a matching area) — those are ported
// by a separate script (port-v1-areas.mjs). This script's TARGETS list
// excludes them.
//
// Idempotent: upserts on (category_id, slug).
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

function loadEnv() {
  const raw = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    const i = line.indexOf('=');
    if (i < 0) continue;
    env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return env;
}

function loadPanamaData() {
  const src = fs.readFileSync(path.join(ROOT, 'project', 'data.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  return sandbox.window.PANAMA_DATA;
}

// v1 category string -> v2 category slug. "Real Estate by Location" and
// "Neighborhood" default to buying (property-buying-decision content) EXCEPT
// the 4 slugs in AREA_FOLD_SLUGS, which are excluded from TARGETS entirely.
const CATEGORY_MAP = {
  'Lifestyle & Daily Living': 'living',
  'Moving to Panama (by Origin)': 'living',
  'Panama vs. Other Destinations': 'living',
  'Renting in Panama': 'living',
  'Buying & Investment': 'buying',
  'Market Report': 'buying',
  'Real Estate by Location': 'buying',
  'Neighborhood': 'buying',
  'Cost of Living & Money': 'money',
  'Economics': 'money',
  'Taxes': 'money',
  'Visa, Residency & Legal': 'residency',
  'Residency': 'residency',
  'Residency · US': 'residency',
};

export const AREA_FOLD_SLUGS = new Set([
  'boquete-panama-real-estate',
  'bocas-del-toro-real-estate',
  'costa-del-este-real-estate',
  'playa-venao-panama',
]);

// The 54 Keep/Improve article slugs from the pruning inventory, minus the 4
// that fold into areas (leaves 50) plus the 1 news-derived exception is
// handled by a separate script (port-news-exception.mjs).
export const TARGETS = [
  'apartments-for-rent-panama-city', 'apostille-documents-panama-visa', 'atm-cash-panama-guide',
  'avenida-balboa-panama-real-estate', 'best-beaches-panama-expats', 'best-neighborhoods-panama-city-expats',
  'colon-panama-real-estate', 'condos-for-sale-panama-buyers-guide', 'coronado-real-estate-guide',
  'expat-depression-panama-unfiltered', 'friendly-nations-2026', 'getting-around-panama-city-guide',
  'how-to-rent-apartment-panama', 'internet-providers-panama-expats', 'moving-to-panama-from-canada',
  'moving-to-panama-from-florida', 'moving-to-panama-from-texas', 'moving-to-panama-from-uk',
  'moving-to-panama-with-pets', 'panama-banking-non-residents-guide', 'panama-cost-of-living-2026',
  'panama-drivers-license-foreigners', 'panama-food-guide-expats', 'panama-for-digital-nomads-2026',
  'panama-for-families-with-children', 'panama-golden-visa-2026', 'panama-healthcare-costs-2026',
  'panama-property-buying-process-guide', 'panama-real-estate-investment-lifestyle-2026',
  'panama-real-estate-market-2026', 'panama-retirement-communities', 'panama-sim-card-guide',
  'panama-tax-benefits-foreigners-2026', 'panama-visa-rejected-what-to-do', 'panama-vs-belize-retirement',
  'panama-vs-colombia-retirement', 'panama-vs-costa-rica-retirement', 'panama-vs-mexico-retirement',
  'panama-vs-portugal-retirement', 'panama-vs-spain-retirement', 'panama-weather-rainy-season-guide',
  'pedasi-rising', 'real-cost-of-moving-to-panama', 'retire-in-panama',
  'safety-in-panama-2026-real-data-rumors', 'santa-catalina-panama', 'sending-money-panama-wire-transfer',
  'start-business-panama-foreigners', 'supermarkets-shopping-panama-expats', 'things-to-do-in-panama',
  'what-to-pack-moving-to-panama', 'why-expats-leave-panama-2-years',
];

export function blocksToMarkdown(blocks) {
  return blocks.map((b) => {
    if (typeof b === 'string') return b;
    if (b.h) return `## ${b.h}`;
    if (b.quote) return `> ${b.quote}`;
    if (b.table) return b.table;
    if (b.chart) return `*${b.caption || ''}${b.alt ? ` (${b.alt})` : ''}*`;
    throw new Error(`Unknown block shape: ${JSON.stringify(b)}`);
  }).join('\n\n');
}

// "June 28, 2026" -> "2026-06-28". Falls back to null on parse failure.
function isoDate(s) {
  if (!s) return null;
  const d = new Date(s + ' UTC');
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

export async function main() {
  const env = loadEnv();
  const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const D = loadPanamaData();

  const { data: categories, error: catErr } = await db.from('categories').select('id,slug');
  if (catErr) throw catErr;
  const catIdBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const { data: authors, error: authErr } = await db.from('authors').select('id,slug');
  if (authErr) throw authErr;
  const davidId = authors.find((a) => a.slug === 'david-aguirre')?.id;
  if (!davidId) throw new Error('david-aguirre author not found — run seed-authors-categories.mjs first');

  const byId = Object.fromEntries(D.articles.map((a) => [a.id, a]));
  let created = 0, updated = 0, skipped = 0;
  const results = [];

  for (const slug of TARGETS) {
    const article = byId[slug];
    const blocks = D.articleBodies[slug];
    if (!article || !blocks) {
      console.error(`[skip] ${slug}: missing article metadata or body`);
      skipped++;
      continue;
    }
    if (AREA_FOLD_SLUGS.has(slug)) {
      console.error(`[skip] ${slug}: in AREA_FOLD_SLUGS, should not be in TARGETS`);
      skipped++;
      continue;
    }

    const v2Category = CATEGORY_MAP[article.category];
    if (!v2Category) {
      console.error(`[skip] ${slug}: no category mapping for "${article.category}"`);
      skipped++;
      continue;
    }
    const categoryId = catIdBySlug[v2Category];

    const body = blocksToMarkdown(blocks);
    const faqs = (article.faqs || []).map((f) => ({ q: f.q, a: f.a }));

    const { data: existing } = await db
      .from('articles')
      .select('id')
      .eq('category_id', categoryId)
      .eq('slug', slug)
      .maybeSingle();

    const row = {
      slug,
      category_id: categoryId,
      title: article.title,
      dek: article.excerpt,
      body,
      status: 'published',
      author_id: davidId,
      read_minutes: parseInt(article.read, 10) || null,
      faqs,
      published_at: isoDate(article.date) ? `${isoDate(article.date)}T00:00:00.000Z` : new Date(0).toISOString(),
      updated_on: isoDate(article.date),
    };

    const { error } = existing
      ? await db.from('articles').update(row).eq('id', existing.id)
      : await db.from('articles').insert(row);

    if (error) {
      console.error(`[error] ${slug}:`, error.message);
      skipped++;
      continue;
    }
    existing ? updated++ : created++;
    results.push({ slug, category: v2Category, action: existing ? 'updated' : 'created' });
  }

  console.log(`\nport-v1-articles: ${created} created, ${updated} updated, ${skipped} skipped (of ${TARGETS.length} targets)`);
  const byCat = {};
  for (const r of results) byCat[r.category] = (byCat[r.category] || 0) + 1;
  console.log('by category:', byCat);
  return { created, updated, skipped, total: TARGETS.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
