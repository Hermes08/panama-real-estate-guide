#!/usr/bin/env node
// =============================================================================
// port-news-exception.mjs — port the one news item that isn't just 410'd
// =============================================================================
// /news/new-tax-incentive.html held a page-1-adjacent position (154 impr,
// avg pos 6.1) and was on the original blocking List A — an exception to the
// blanket "410 all /news/" decision, since it carries real established value
// the rest of /news/ doesn't. Ported as a v2 article under `money`.
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

export const SLUG = 'panama-property-tax-exemption-extended';

export async function main() {
  const env = loadEnv();
  const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const D = loadPanamaData();
  const item = D.newsBodies['new-tax-incentive'];
  if (!item) throw new Error('newsBodies["new-tax-incentive"] not found');

  const { data: categories, error: catErr } = await db.from('categories').select('id,slug');
  if (catErr) throw catErr;
  const moneyId = categories.find((c) => c.slug === 'money')?.id;
  if (!moneyId) throw new Error('money category not found');

  const { data: authors, error: authErr } = await db.from('authors').select('id,slug');
  if (authErr) throw authErr;
  const davidId = authors.find((a) => a.slug === 'david-aguirre')?.id;

  const body = item.body.join('\n\n');
  const d = new Date(item.date + ' UTC');
  const iso = Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);

  const { data: existing } = await db.from('articles').select('id').eq('category_id', moneyId).eq('slug', SLUG).maybeSingle();
  const row = {
    slug: SLUG,
    category_id: moneyId,
    title: item.title,
    dek: 'The National Assembly extended the 20-year property tax exemption for new construction through 2028 — what it means for buyers.',
    body,
    status: 'published',
    author_id: davidId,
    faqs: [],
    published_at: iso ? `${iso}T00:00:00.000Z` : new Date(0).toISOString(),
    updated_on: iso,
  };
  const { error } = existing
    ? await db.from('articles').update(row).eq('id', existing.id)
    : await db.from('articles').insert(row);
  if (error) throw error;

  console.log(`port-news-exception: ${existing ? 'updated' : 'created'} /money/${SLUG}`);
  return { slug: SLUG, action: existing ? 'updated' : 'created' };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
