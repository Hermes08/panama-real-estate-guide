#!/usr/bin/env node
/* =============================================================================
   data/airtable.json → Supabase
   =============================================================================
   Idempotent. Everything upserts on its natural key, so re-running after a
   fresh Airtable sync updates rather than duplicates.

   Usage:
     node scripts/import-to-supabase.mjs         # import
     node scripts/import-to-supabase.mjs --dry   # report, write nothing

   Requires SUPABASE_SERVICE_ROLE_KEY in .env.local. That key bypasses RLS
   entirely — add it yourself from the Supabase dashboard (Settings → API), and
   never let it reach a NEXT_PUBLIC_* var, a client bundle, or a chat.

   NOT imported, deliberately:
   · Descripción EN — v1 SEO spam. The schema has no column to hide it in.
   · title_status    — stays 'unknown'. The CHECK constraint would reject any
                       other value without a source, a date, and a checker,
                       and nobody has done that research yet.
   ============================================================================= */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");

async function loadEnv() {
  const raw = await fs
    .readFile(path.join(ROOT, ".env.local"), "utf8")
    .catch(() => "");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) process.env[m[1]] ??= m[2];
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  }
  // A dry run only reads the local JSON, so it should not demand a key.
  if (!DRY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY in .env.local.\n\n" +
        "Supabase dashboard → Project Settings → API → service_role key.\n" +
        "Add it to v2/.env.local yourself. It bypasses RLS — do not paste it\n" +
        "into a chat, and never prefix it with NEXT_PUBLIC_.",
    );
  }
}

const chunk = (arr, n) =>
  Array.from({ length: Math.ceil(arr.length / n) }, (_, i) =>
    arr.slice(i * n, i * n + n),
  );

async function main() {
  await loadEnv();

  const data = JSON.parse(
    await fs.readFile(path.join(ROOT, "data", "airtable.json"), "utf8"),
  );

  console.log(
    `Source: ${data.areas.length} areas, ${data.projects.length} projects, ` +
      `${data.projects.reduce((n, p) => n + p.models.length, 0)} unit models, ` +
      `${data.projects.reduce((n, p) => n + p.photos.length, 0)} photos`,
  );

  if (DRY) {
    console.log("\n--dry: nothing written.");
    return;
  }

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  // ── Areas ────────────────────────────────────────────────────────────────
  // Only the facts the inventory proves. projectCount and priceFrom are
  // derived by query, not stored — storing them would let them go stale.
  const { data: areaRows, error: areaErr } = await db
    .from("areas")
    .upsert(
      data.areas.map((a) => ({
        slug: a.slug,
        name: a.name,
        region: a.region,
      })),
      { onConflict: "slug" },
    )
    .select("id, slug");
  if (areaErr) throw new Error(`areas: ${areaErr.message}`);
  const areaId = new Map(areaRows.map((r) => [r.slug, r.id]));
  console.log(`  areas          ${areaRows.length}`);

  // ── Projects ─────────────────────────────────────────────────────────────
  const { data: projRows, error: projErr } = await db
    .from("projects")
    .upsert(
      data.projects.map((p) => ({
        slug: p.slug,
        name: p.name,
        area_id: areaId.get(p.areaSlug),
        published: p.published,
        status: p.status ? p.status.replace(/-/g, "_") : null,
        price_from_usd: p.priceFromUsd,
        price_to_usd: p.priceToUsd,
        amenities: p.amenities,
        website_url: p.websiteUrl,
        source: "developer_listed",
        source_synced_on: new Date().toISOString().slice(0, 10),
      })),
      { onConflict: "slug" },
    )
    .select("id, slug");
  if (projErr) throw new Error(`projects: ${projErr.message}`);
  const projId = new Map(projRows.map((r) => [r.slug, r.id]));
  console.log(`  projects       ${projRows.length}`);

  // ── Unit models ──────────────────────────────────────────────────────────
  // No natural key, so replace per project rather than upsert.
  const models = data.projects.flatMap((p) =>
    p.models.map((m, i) => ({
      project_id: projId.get(p.slug),
      name: m.name,
      beds: m.beds,
      baths: m.baths,
      size_m2: m.sizeM2,
      price_from_usd: m.priceFromUsd,
      position: i,
    })),
  );
  await db
    .from("unit_models")
    .delete()
    .in("project_id", [...projId.values()]);
  for (const batch of chunk(models, 500)) {
    const { error } = await db.from("unit_models").insert(batch);
    if (error) throw new Error(`unit_models: ${error.message}`);
  }
  console.log(`  unit_models    ${models.length}`);

  // ── Photos ───────────────────────────────────────────────────────────────
  // storage_path stays relative so it resolves through lib/media.ts whether
  // served from public/ or from R2.
  const photos = data.projects.flatMap((p) =>
    p.photos.map((ph, i) => ({
      project_id: projId.get(p.slug),
      storage_path: ph.src,
      alt: ph.alt,
      position: i,
    })),
  );
  await db
    .from("project_photos")
    .delete()
    .in("project_id", [...projId.values()]);
  for (const batch of chunk(photos, 500)) {
    const { error } = await db.from("project_photos").insert(batch);
    if (error) throw new Error(`project_photos: ${error.message}`);
  }
  console.log(`  project_photos ${photos.length}`);

  console.log("\nDone. title_status left 'unknown' everywhere — that research");
  console.log("has not happened, and the CHECK constraint would reject a claim");
  console.log("without a source, a date, and a named checker.");
}

main().catch((err) => {
  console.error("\nImport failed:", err.message);
  process.exit(1);
});
