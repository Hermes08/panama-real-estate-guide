#!/usr/bin/env node
// =============================================================================
// port-v1-areas.mjs — fold 4 "Real Estate by Location" v1 articles into areas
// =============================================================================
// boquete-panama-real-estate, costa-del-este-real-estate, playa-venao-panama
// already have a matching v2 area; bocas-del-toro-real-estate does not, and
// gets a new area row. Mechanical port: full body (markdown stripped to plain
// text, since suits/drawbacks are rendered as plain <p>, not through
// ReactMarkdown) goes into `suits`; pull-quote blocks (styled as cautionary
// "who this isn't for" notes in the source) go into `drawbacks`; faqs carry
// across unchanged. Real editorial restructuring is Wave 2 work, not today's.
//
// Idempotent: updates existing areas by slug; upserts the new one.
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

// Strip inline markdown (**bold**, [text](url), leading heading hashes) for
// plain-text fields that aren't run through a markdown renderer.
function toPlainText(blocks) {
  return blocks
    .filter((b) => typeof b === 'string' || b.h)
    .map((b) => (typeof b === 'string' ? b : b.h))
    .join('\n\n')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1');
}

function quotesToPlainText(blocks) {
  return blocks
    .filter((b) => b && b.quote)
    .map((b) => b.quote.replace(/\*\*(.+?)\*\*/g, '$1'))
    .join('\n\n');
}

const AREAS = [
  { articleSlug: 'boquete-panama-real-estate', areaSlug: 'boquete', create: false },
  { articleSlug: 'costa-del-este-real-estate', areaSlug: 'costa-del-este', create: false },
  { articleSlug: 'playa-venao-panama', areaSlug: 'playa-venao', create: false },
  { articleSlug: 'bocas-del-toro-real-estate', areaSlug: 'bocas-del-toro', create: true, name: 'Bocas del Toro', region: 'Caribbean' },
];

export async function main() {
  const env = loadEnv();
  const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const D = loadPanamaData();
  const byId = Object.fromEntries(D.articles.map((a) => [a.id, a]));

  const results = [];
  for (const target of AREAS) {
    const article = byId[target.articleSlug];
    const blocks = D.articleBodies[target.articleSlug];
    if (!article || !blocks) {
      console.error(`[skip] ${target.articleSlug}: missing article metadata or body`);
      continue;
    }

    const suits = toPlainText(blocks);
    const drawbacksFromQuotes = quotesToPlainText(blocks);
    const drawbacks = drawbacksFromQuotes || 'Drawbacks pending a dedicated editorial pass.';
    const faqs = (article.faqs || []).map((f) => ({ q: f.q, a: f.a }));

    if (target.create) {
      const { data: existing } = await db.from('areas').select('id').eq('slug', target.areaSlug).maybeSingle();
      const row = {
        slug: target.areaSlug,
        name: target.name,
        region: target.region,
        blurb: article.excerpt,
        suits,
        drawbacks,
        faqs,
      };
      const { error } = existing
        ? await db.from('areas').update(row).eq('id', existing.id)
        : await db.from('areas').insert(row);
      if (error) { console.error(`[error] ${target.areaSlug}:`, error.message); continue; }
      results.push({ area: target.areaSlug, action: existing ? 'updated' : 'created' });
    } else {
      const { data: existing, error: findErr } = await db.from('areas').select('id').eq('slug', target.areaSlug).maybeSingle();
      if (findErr || !existing) { console.error(`[error] area "${target.areaSlug}" not found`); continue; }
      const { error } = await db.from('areas').update({ suits, drawbacks, faqs }).eq('id', existing.id);
      if (error) { console.error(`[error] ${target.areaSlug}:`, error.message); continue; }
      results.push({ area: target.areaSlug, action: 'updated' });
    }
  }

  console.log('port-v1-areas:', results);
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
