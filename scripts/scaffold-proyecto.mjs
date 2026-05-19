#!/usr/bin/env node
// =============================================================================
// scaffold-proyecto.mjs — bootstrap a new /proyectos/<slug>.html landing
// =============================================================================
// Usage:
//   node scripts/scaffold-proyecto.mjs <slug> [--name "Display Name"] [--location "Punta Pacifica"]
//
// What it does:
//   1. Refuses to overwrite an existing /proyectos/<slug>.html (use --force to override).
//   2. Reads templates/proyecto-landing.template.html.
//   3. Fills in {{SLUG}}, {{NAME}}, {{LOCATION}}, and sensible defaults for the other
//      {{TOKENS}} so the file is syntactically clean.
//   4. Writes project/proyectos/<slug>.html.
//   5. Prints the list of remaining {{TOKENS}} for the editor to fill in.
//
// Why a script instead of "copy and search-replace":
//   • It catches slug-collision before you start writing copy.
//   • It guarantees the `lead-form-<slug>` ID + tracking content match the filename.
//   • It surfaces the remaining placeholders so nothing ships half-filled.
//
// See templates/README.md for the editorial checklist + copy guidance.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TEMPLATE = path.join(ROOT, 'templates', 'proyecto-landing.template.html');
const OUT_DIR = path.join(ROOT, 'project', 'proyectos');

// Convert "foo-bar-baz" → "Foo Bar Baz"
function titleize(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function parseArgs(argv) {
  const args = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { args.flags[key] = next; i++; }
      else { args.flags[key] = true; }
    } else {
      args._.push(a);
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const slug = args._[0];

  if (!slug) {
    console.error('Usage: node scripts/scaffold-proyecto.mjs <slug> [--name "Display Name"] [--location "Punta Pacifica"] [--force]');
    process.exit(2);
  }

  if (!/^[a-z0-9][a-z0-9-]{1,80}$/.test(slug)) {
    console.error(`Bad slug "${slug}". Use lowercase letters, digits, hyphens. Max 80 chars.`);
    process.exit(2);
  }

  const outPath = path.join(OUT_DIR, `${slug}.html`);
  const existing = await fs.stat(outPath).catch(() => null);
  if (existing && !args.flags.force) {
    console.error(`Refusing to overwrite ${outPath} (already exists). Re-run with --force to override.`);
    process.exit(1);
  }

  const tpl = await fs.readFile(TEMPLATE, 'utf8');

  const name = args.flags.name || titleize(slug);
  const location = args.flags.location || 'Panamá';
  const heroImage = args.flags['hero-image'] || `/airtable-assets/${slug}/00.jpg`;

  // Sensible defaults — these still need an editorial pass, but they parse cleanly
  // and don't ship literal "{{TOKEN}}" to production if someone forgets.
  const defaults = {
    SLUG: slug,
    NAME: name,
    LOCATION: location,
    HERO_IMAGE: heroImage,
    HOOK_TITLE: 'Pre-venta · Panamá',
    HOOK_DESCRIPTION: `Pre-venta en ${location}. Renta tradicional 5-6% USD anual. Inversión calificable para Visa de Inversionista.`,
    PRICE_LOW: '250000',
    PRICE_HIGH: '500000',
    HERO_EYEBROW: 'Pre-venta · 24 meses obra',
    HERO_TITLE_PART1: name.split(' ').slice(0, -1).join(' ') || name,
    HERO_TITLE_PART2: name.split(' ').slice(-1).join(' '),
    HERO_SUBHEAD: `Pre-venta en ${location}. Renta tradicional 5-6% USD anual.`,
    CONTEXT_LEAD: 'Desde USD $XXX,000',
    CONTEXT_PARAGRAPH_1: 'PARA LLENAR — descripción del proyecto en 80-120 palabras.',
    CONTEXT_PARAGRAPH_2: 'PARA LLENAR — amenidades + ratio parking + servicios.',
    CONTEXT_PARAGRAPH_3: 'PARA LLENAR — calendario obra + yield + perfil comprador.',
    REASON_1_TITLE: 'Ubicación premium',
    REASON_1_BODY: 'PARA LLENAR — por qué la zona apreció USD en 5 años.',
    REASON_2_TITLE: 'Renta ejecutiva',
    REASON_2_BODY: 'PARA LLENAR — perfil de renta + contratos típicos.',
    REASON_3_TITLE: 'Vista / amenidad clave',
    REASON_3_BODY: 'PARA LLENAR — diferenciador permanente vs comparables.',
    REASON_4_TITLE: 'Calidad de obra',
    REASON_4_BODY: 'PARA LLENAR — desarrollador + entregables previos.',
    UNITS_HEADLINE: 'Tres opciones que encajan con este perfil',
    UNIT_1_TITLE: '1BR City View',
    UNIT_1_BODY: '1BR · XXm² · USD $XXX K · disponibles X/Y',
    UNIT_2_TITLE: '2BR Ocean View (flagship)',
    UNIT_2_BODY: '2BR · XXm² · USD $XXX K · disponibles X/Y',
    UNIT_3_TITLE: '3BR Corner Penthouse',
    UNIT_3_BODY: '3BR · XXm² · USD $XXX K · disponibles X/Y',
    INTEREST_CATEGORY: 'Compra inversión Airbnb',
    FAQ_1_Q: `¿Cómo funciona el fideicomiso de ${name}?`,
    FAQ_1_A: 'PARA LLENAR — banco custodio + estructura de pagos + protección al comprador.',
    FAQ_2_Q: 'Calendario de pagos pre-construcción',
    FAQ_2_A: 'PARA LLENAR — % reserva, % obra, % escrituración, opciones de hipoteca.',
    FAQ_3_Q: 'Plusvalía esperada y exit strategy',
    FAQ_3_A: 'PARA LLENAR — apreciación pre-entrega + post-entrega + horizonte 7 años.',
  };

  // Apply overrides from CLI flags (so --name and --location stick consistently).
  for (const [k, v] of Object.entries(args.flags)) {
    const key = k.toUpperCase().replace(/-/g, '_');
    if (key in defaults) defaults[key] = v;
  }

  // Replace tokens. Use a global regex per token; tokens are {{UPPER_SNAKE}}.
  let out = tpl;
  for (const [k, v] of Object.entries(defaults)) {
    out = out.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
  }

  // Find any remaining tokens so the operator knows what to fill in.
  const remaining = [...new Set([...out.matchAll(/{{([A-Z0-9_]+)}}/g)].map(m => m[1]))];

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(outPath, out, 'utf8');
  const bytes = (await fs.stat(outPath)).size;

  console.log(`scaffold-proyecto: wrote ${outPath}  (${(bytes/1024).toFixed(1)} KB)`);
  console.log(`  slug      = ${slug}`);
  console.log(`  name      = ${name}`);
  console.log(`  location  = ${location}`);
  console.log(`  hero img  = ${heroImage}`);
  if (remaining.length) {
    console.log(`\n  ${remaining.length} token(s) unresolved (will print as literal "{{...}}" in the page):`);
    remaining.forEach(t => console.log(`    - {{${t}}}`));
    process.exitCode = 0; // not fatal, just informative
  }
  console.log('\nNext:');
  console.log(`  1. Open project/proyectos/${slug}.html and replace every "PARA LLENAR" + any literal {{TOKEN}}.`);
  console.log(`  2. Add the slug to the Footer featured list in project/sections.jsx if you want it surfaced site-wide.`);
  console.log(`  3. Run: node scripts/build-jsx.mjs && node scripts/build-sitemap.mjs`);
  console.log(`  4. Verify on Netlify preview: https://<preview>/proyectos/${slug}.html`);
}

main().catch(err => { console.error('scaffold-proyecto failed:', err); process.exit(1); });
