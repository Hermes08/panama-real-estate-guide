#!/usr/bin/env node
/* =============================================================================
   Airtable → v2 content sync
   =============================================================================
   Writes a plain JSON artifact that the content layer reads. Airtable is not
   assumed to be permanent: when this moves to Supabase, only this file is
   rewritten — the JSON shape and every template stay as they are.

   Usage:
     node scripts/sync-airtable.mjs              # sync, skip existing photos
     node scripts/sync-airtable.mjs --force      # re-download every photo
     node scripts/sync-airtable.mjs --photos=8   # photos per project (default 5)
     node scripts/sync-airtable.mjs --dry        # fetch + report, write nothing

   Reads AIRTABLE_TOKEN and AIRTABLE_BASE_ID from .env.local.

   A NOTE ON HONESTY: this sync never sets a verification date. Everything it
   writes is developer-supplied and is labelled as such. The gold VERIFIED
   stamp means a person checked a figure against a primary source — a sync
   timestamp is not that, and conflating them would make the stamp worthless.
   ============================================================================= */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PHOTO_DIR = path.join(ROOT, "public", "projects");
const OUT_FILE = path.join(ROOT, "data", "airtable.json");

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const DRY = args.includes("--dry");
const PHOTOS_PER_PROJECT = Number(
  args.find((a) => a.startsWith("--photos="))?.split("=")[1] ?? 5,
);

/* ── Location normalisation ────────────────────────────────────────────────
   Explicit, not inferred. The Ubicación field is free text and contains real
   typos (Panana, Panmá, Cale Uruguay, BIjao, Playa Venado). Mapping them by
   hand is the only way to be sure two spellings of one place collapse into
   one area — and an unmapped value is an error, never a silent default.
   The fix belongs in Airtable; this map is the safety net until then. */
const LOCATION_MAP = {
  // Panama City
  "Costa del Este, Ciudad de Panamá": "costa-del-este",
  "Costa del este, Ciudad de Panana": "costa-del-este",
  "Costa del este, Ciudad de Panmá": "costa-del-este",
  "Santa María, Ciudad de Panamá": "santa-maria",
  "Punta Pacifica": "punta-pacifica",
  "Punta Pacífica, Ciudad de Panamá": "punta-pacifica",
  "Marbella, Ciudad de Panamá": "marbella",
  "Cale Uruguay, Marbella": "marbella",
  "Calle 47, y Calle Uruguay": "marbella",
  "Obarrio, Ciudad de Panamá": "obarrio",
  Amador: "amador",
  "Calzada de Amador, Ciudad de Panamá": "amador",

  // Pacific coast
  Buenaventura: "buenaventura",
  "Rio Hato, Coclé": "rio-hato",
  BIjao: "bijao",
  "Chame, Playa Caracol": "playa-caracol",
  "Playa Bonita, Panamá": "playa-bonita",
  "Playa Venado": "playa-venao",
  "Playa Venao, Pedasí": "playa-venao",

  // Highlands
  Boquete: "boquete",
  "Boquete, Chiriquí": "boquete",
  "Sora, Panamá": "sora",

  // Caribbean
  "Costa Caribe, Portobelo": "portobelo",
};

const AREAS = {
  "costa-del-este": { name: "Costa del Este", region: "Panama City" },
  "santa-maria": { name: "Santa María", region: "Panama City" },
  "punta-pacifica": { name: "Punta Pacífica", region: "Panama City" },
  marbella: { name: "Marbella", region: "Panama City" },
  obarrio: { name: "Obarrio", region: "Panama City" },
  amador: { name: "Amador", region: "Panama City" },
  buenaventura: { name: "Buenaventura", region: "Pacific Coast" },
  "rio-hato": { name: "Río Hato", region: "Pacific Coast" },
  bijao: { name: "Bijao", region: "Pacific Coast" },
  "playa-caracol": { name: "Playa Caracol", region: "Pacific Coast" },
  "playa-bonita": { name: "Playa Bonita", region: "Pacific Coast" },
  "playa-venao": { name: "Playa Venao", region: "Pacific Coast" },
  boquete: { name: "Boquete", region: "Chiriquí Highlands" },
  // Sora is in Panamá Oeste, not Chiriquí — different province entirely.
  sora: { name: "Sora", region: "Panamá Oeste Highlands" },
  portobelo: { name: "Portobelo", region: "Caribbean" },
};

const STATUS_MAP = {
  "En Preventa": "preselling",
  "En Construcción": "under-construction",
  "Entrega Inmediata": "delivered",
};

/* ── Env ──────────────────────────────────────────────────────────────────── */

async function loadEnv() {
  if (process.env.AIRTABLE_TOKEN && process.env.AIRTABLE_BASE_ID) return;
  const raw = await fs
    .readFile(path.join(ROOT, ".env.local"), "utf8")
    .catch(() => null);
  if (!raw) {
    throw new Error(
      "No AIRTABLE_TOKEN in the environment and no .env.local to read it from.",
    );
  }
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] ??= m[2];
  }
}

/* ── Fetch ────────────────────────────────────────────────────────────────── */

async function fetchTable(table) {
  const base = process.env.AIRTABLE_BASE_ID;
  const records = [];
  let offset;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}`,
    );
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` },
    });
    if (!res.ok) {
      throw new Error(`Airtable ${table} responded ${res.status}: ${await res.text()}`);
    }
    const json = await res.json();
    records.push(...json.records);
    offset = json.offset;
  } while (offset);

  return records;
}

/* ── Photos ───────────────────────────────────────────────────────────────── */

async function syncPhotos(slug, attachments) {
  const dir = path.join(PHOTO_DIR, slug);
  await fs.mkdir(dir, { recursive: true });

  const wanted = attachments.slice(0, PHOTOS_PER_PROJECT);
  const out = [];
  let downloaded = 0;

  for (const [i, att] of wanted.entries()) {
    const name = `${String(i + 1).padStart(2, "0")}.webp`;
    const dest = path.join(dir, name);
    const publicPath = `/projects/${slug}/${name}`;

    if (!FORCE) {
      const exists = await fs
        .access(dest)
        .then(() => true)
        .catch(() => false);
      if (exists) {
        out.push({ src: publicPath, alt: null });
        continue;
      }
    }

    const res = await fetch(att.url);
    if (!res.ok) {
      console.warn(`  ! ${slug} photo ${i + 1}: HTTP ${res.status}, skipped`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());

    await sharp(buf)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(dest);

    out.push({ src: publicPath, alt: null });
    downloaded++;
  }

  return { photos: out, downloaded };
}

/* ── Main ─────────────────────────────────────────────────────────────────── */

async function main() {
  await loadEnv();

  console.log("Fetching Airtable…");
  const [proyectos, modelos] = await Promise.all([
    fetchTable("Proyectos"),
    fetchTable("Modelos de Unidades"),
  ]);
  console.log(`  ${proyectos.length} projects, ${modelos.length} unit models`);

  // Unmapped locations are a hard failure. v1 silently defaulted and shipped
  // 13 project pages with placeholder metadata for months.
  const unmapped = new Set();
  for (const r of proyectos) {
    const loc = (r.fields["Ubicación"] ?? "").trim();
    if (!LOCATION_MAP[loc]) unmapped.add(loc || "(empty)");
  }
  if (unmapped.size) {
    console.error("\nUnmapped Ubicación values — add them to LOCATION_MAP:");
    for (const u of unmapped) console.error(`  · ${u}`);
    process.exit(1);
  }

  // Index unit models by their parent project record id.
  const modelsByProject = new Map();
  for (const m of modelos) {
    for (const pid of m.fields["Proyecto"] ?? []) {
      if (!modelsByProject.has(pid)) modelsByProject.set(pid, []);
      modelsByProject.get(pid).push({
        name: m.fields["Nombre del Modelo"] ?? null,
        beds: m.fields["Habitaciones"] ?? null,
        baths: m.fields["Baños"] ?? null,
        sizeM2: m.fields["Área (m²)"] ?? null,
        priceFromUsd: m.fields["Precio desde (USD)"] ?? null,
      });
    }
  }

  const projects = [];
  let totalDownloaded = 0;

  for (const r of proyectos) {
    const f = r.fields;
    const slug = f["Slug"];
    const areaSlug = LOCATION_MAP[(f["Ubicación"] ?? "").trim()];
    const models = modelsByProject.get(r.id) ?? [];

    let photos = [];
    if (!DRY) {
      const result = await syncPhotos(slug, f["Fotos"] ?? []);
      photos = result.photos;
      totalDownloaded += result.downloaded;
      process.stdout.write(
        `  ${slug.padEnd(36)} ${String(photos.length).padStart(2)} photos\n`,
      );
    }

    const beds = models.map((m) => m.beds).filter((n) => typeof n === "number");
    const sizes = models
      .map((m) => m.sizeM2)
      .filter((n) => typeof n === "number");

    projects.push({
      slug,
      name: f["Nombre"] ?? slug,
      areaSlug,
      published: Boolean(f["Publicado en Web"]),
      status: STATUS_MAP[f["Estado"]] ?? null,
      priceFromUsd: f["Precio Desde (USD)"] ?? null,
      priceToUsd: f["Precio Hasta (USD)"] ?? null,
      bedsMin: beds.length ? Math.min(...beds) : null,
      bedsMax: beds.length ? Math.max(...beds) : null,
      sizeFromM2: sizes.length ? Math.min(...sizes) : null,
      descriptionEn: f["Descripción EN"] ?? null,
      amenities: (f["Amenidades"] ?? "")
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean),
      websiteUrl: f["URL Sitio Web"] ?? null,
      rawLocation: f["Ubicación"] ?? null,
      models,
      photos,
      // Developer-supplied, not checked by us. The UI must label it that way.
      dataSource: "developer-listed",
    });
  }

  // Areas carry only what the inventory proves. Editorial fields — title
  // status, positioning, elevation — are authored, never synced, and live
  // alongside this file rather than in it.
  const areaCounts = new Map();
  for (const p of projects) {
    areaCounts.set(p.areaSlug, (areaCounts.get(p.areaSlug) ?? 0) + 1);
  }
  const areas = [...areaCounts.entries()]
    .map(([slug, projectCount]) => ({
      slug,
      name: AREAS[slug].name,
      region: AREAS[slug].region,
      projectCount,
      priceFromUsd: Math.min(
        ...projects
          .filter((p) => p.areaSlug === slug && p.priceFromUsd)
          .map((p) => p.priceFromUsd),
      ),
    }))
    .sort((a, b) => b.projectCount - a.projectCount);

  if (DRY) {
    console.log("\n--dry: nothing written.\n");
    console.table(areas);
    return;
  }

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  // No timestamp in the payload: re-running with no upstream changes should
  // produce a byte-identical file, so a diff always means real movement.
  await fs.writeFile(
    OUT_FILE,
    JSON.stringify({ areas, projects }, null, 2) + "\n",
  );

  console.log(
    `\nWrote ${path.relative(ROOT, OUT_FILE)} — ${projects.length} projects across ${areas.length} areas`,
  );
  console.log(`Downloaded ${totalDownloaded} new photos (cap ${PHOTOS_PER_PROJECT}/project)`);
}

main().catch((err) => {
  console.error("\nSync failed:", err.message);
  process.exit(1);
});
