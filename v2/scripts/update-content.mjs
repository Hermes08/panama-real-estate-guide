#!/usr/bin/env node
/* =============================================================================
   Generic editorial content writer
   =============================================================================
   Upserts panama-writer output into Supabase by slug. Table-agnostic — works
   for projects, areas, or articles, whatever columns the JSON file supplies.

   Usage:
     node scripts/update-content.mjs projects allure-punta-pacifica content.json
     node scripts/update-content.mjs areas punta-pacifica content.json

   Requires SUPABASE_SERVICE_ROLE_KEY in .env.local — this bypasses RLS to
   write, same as import-to-supabase.mjs.
   ============================================================================= */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadEnv() {
  const raw = await fs.readFile(path.join(ROOT, ".env.local"), "utf8").catch(() => "");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) process.env[m[1]] ??= m[2];
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local.");
  }
}

async function main() {
  const [table, slug, jsonPath] = process.argv.slice(2);
  if (!table || !slug || !jsonPath) {
    console.error("Usage: node scripts/update-content.mjs <table> <slug> <content.json>");
    process.exit(1);
  }

  await loadEnv();
  const fields = JSON.parse(await fs.readFile(jsonPath, "utf8"));

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  const { data, error } = await db
    .from(table)
    .update(fields)
    .eq("slug", slug)
    .select("id, slug")
    .single();

  if (error) throw new Error(`${table}.${slug}: ${error.message}`);
  console.log(`Updated ${table}.${slug} (${data.id})`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
