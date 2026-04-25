#!/usr/bin/env node
/**
 * Sync Airtable -> local JSON + image assets for the static site.
 *
 * Runs in the GitHub Pages deploy workflow. Reads AIRTABLE_TOKEN from env,
 * pulls the "Proyectos" (filtered by "Publicado en Web") and "Modelos de Unidades"
 * tables from the "Panama Real Estate — Proyectos" base, downloads every attached
 * image to project/airtable-assets/<recordId>/<n>.<ext>, and writes
 * project/airtable-projects.json with the mapped site schema.
 *
 * No network calls at runtime on the site — the JSON + images are served statically.
 */

import { mkdir, writeFile, rm } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import path from 'node:path';

const BASE_ID = 'appMZUnm7WwSWqqkQ';
const TOKEN = process.env.AIRTABLE_TOKEN;
const PROJECT_DIR = path.resolve(process.cwd(), 'project');
const ASSETS_DIR = path.join(PROJECT_DIR, 'airtable-assets');
const OUTPUT_JSON = path.join(PROJECT_DIR, 'airtable-projects.json');

if (!TOKEN) {
  console.error('AIRTABLE_TOKEN env var is required');
  process.exit(1);
}

const api = (path, params) => {
  const u = new URL('https://api.airtable.com/v0/' + BASE_ID + '/' + path);
  if (params) for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  return u.toString();
};

async function fetchAll(table, params = {}) {
  const out = [];
  let offset;
  do {
    const url = api(encodeURIComponent(table), { ...params, ...(offset ? { offset } : {}) });
    const r = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!r.ok) throw new Error(`Airtable ${r.status}: ${await r.text()}`);
    const data = await r.json();
    out.push(...data.records);
    offset = data.offset;
  } while (offset);
  return out;
}

async function download(url, dest) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${r.status} for ${url}`);
  await mkdir(path.dirname(dest), { recursive: true });
  await pipeline(Readable.fromWeb(r.body), createWriteStream(dest));
}

function extFromFilename(name) {
  const m = /\.([a-z0-9]+)$/i.exec(name || '');
  return m ? m[1].toLowerCase() : 'jpg';
}

function fmtUSD(n) {
  if (typeof n !== 'number') return null;
  return '$' + n.toLocaleString('en-US');
}

const ESTADO_MAP = {
  'En Preventa':          'Pre-construction',
  'En Construcción':      'Under Construction',
  'Entrega Inmediata':    'Move-in Ready',
  'Completado':           'Completed'
};

// Best-effort region derivation from "Ubicación" string
function regionFromLocation(loc) {
  if (!loc) return '';
  const l = loc.toLowerCase();
  if (/chiriqu|boquete|volcan|cerro punta/.test(l)) return 'Highlands';
  if (/bocas|col[oó]n|caribbean|porto|portobelo|isla gr/.test(l)) return 'Caribbean';
  if (/azuero|pedas[ií]|las tablas|chitr[eé]/.test(l))           return 'Azuero Peninsula';
  if (/panam[áa] city|costa del este|punta pacifica|costa|san francisco|avenida balboa|casco/.test(l)) return 'Panama City';
  if (/pac[ií]fico|playa|coronado|santa clara|gorgona|farall[oó]n|cocl[eé]|playa blanca|amador/.test(l)) return 'Pacific Coast';
  return '';
}

async function main() {
  console.log('Sync starting...');
  await rm(ASSETS_DIR, { recursive: true, force: true });
  await mkdir(ASSETS_DIR, { recursive: true });

  const proyectos = await fetchAll('Proyectos', { filterByFormula: '{Publicado en Web}' });
  const modelos   = await fetchAll('Modelos de Unidades');

  console.log(`Fetched ${proyectos.length} proyectos, ${modelos.length} modelos`);

  const modelosById = new Map(modelos.map(m => [m.id, m]));

  // Collect every download task across all projects + images, then run them
  // with bounded concurrency. Sequential was ~5s per project on a cold CDN.
  const downloadTasks = [];
  const projectImages = new Map(); // recordId -> string[] (relative paths, ordered)

  for (const rec of proyectos) {
    const f = rec.fields || {};
    const id = f.Slug || rec.id;
    const fotos = Array.isArray(f.Fotos) ? f.Fotos : [];
    const images = new Array(fotos.length);
    projectImages.set(rec.id, images);
    for (let i = 0; i < fotos.length; i++) {
      const att = fotos[i];
      const ext = extFromFilename(att.filename);
      const rel = path.posix.join('airtable-assets', id, `${String(i).padStart(2, '0')}.${ext}`);
      const abs = path.join(PROJECT_DIR, rel);
      images[i] = rel;
      downloadTasks.push({ id, i, url: att.url, dest: abs, rel });
    }
  }

  // Bounded concurrency
  const CONC = 8;
  let cursor = 0;
  let finished = 0;
  async function worker() {
    while (cursor < downloadTasks.length) {
      const t = downloadTasks[cursor++];
      try {
        await download(t.url, t.dest);
      } catch (e) {
        console.warn(`[warn] image ${t.id}/${t.i} failed: ${e.message}`);
        // Mark missing in the per-project array
        const arr = [...projectImages.entries()].find(([k, v]) => v.includes(t.rel))?.[1];
        if (arr) arr[t.i] = null;
      }
      finished++;
      if (finished % 10 === 0 || finished === downloadTasks.length) {
        console.log(`  images: ${finished}/${downloadTasks.length}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));

  const projects = [];
  for (const rec of proyectos) {
    const f = rec.fields || {};
    const id = f.Slug || rec.id;
    const images = (projectImages.get(rec.id) || []).filter(Boolean);

    // Unit models — dereference linked record IDs
    const unidadIds = Array.isArray(f['Modelos de Unidades']) ? f['Modelos de Unidades'] : [];
    const units = unidadIds.map(mid => {
      const u = modelosById.get(mid);
      if (!u) return null;
      const uf = u.fields || {};
      return {
        type: uf['Nombre del Modelo'] || '',
        beds: uf['Habitaciones'] || null,
        baths: uf['Baños'] || null,
        size: uf['Área (m²)'] ? `${uf['Área (m²)']} m²` : '',
        from: fmtUSD(uf['Precio desde (USD)']) || '',
        features: uf['Características'] || ''
      };
    }).filter(Boolean);

    const amenities = (f.Amenidades || '')
      .split(/[,\n]+/)
      .map(s => s.trim())
      .filter(Boolean);

    projects.push({
      id,
      name: f.Nombre || '',
      location: f['Ubicación'] || '',
      region: regionFromLocation(f['Ubicación']),
      about: f['Descripción EN'] || f['Descripción ES'] || '',
      aboutES: f['Descripción ES'] || '',
      priceFrom: typeof f['Precio Desde (USD)'] === 'number' ? f['Precio Desde (USD)'] : null,
      priceTo:   typeof f['Precio Hasta (USD)'] === 'number' ? f['Precio Hasta (USD)'] : null,
      fromLabel: fmtUSD(f['Precio Desde (USD)']) ? `From ${fmtUSD(f['Precio Desde (USD)'])}` : '',
      priceFromLabel: 'Reserve from $5,000',
      status: ESTADO_MAP[f['Estado']] || f['Estado'] || '',
      website: f['URL Sitio Web'] || '',
      cover: images[0] || '',
      images,
      units,
      amenities,
      // Placeholders for fields not in Airtable — site falls back to defaults
      delivery: '',
      tagline: '',
      highlight: '',
      size: 'regular'
    });
  }

  await writeFile(OUTPUT_JSON, JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: `airtable:${BASE_ID}`,
    count: projects.length,
    projects
  }, null, 2));

  console.log(`Wrote ${OUTPUT_JSON} with ${projects.length} projects`);
  console.log('Sync done.');
}

main().catch(e => { console.error(e); process.exit(1); });
