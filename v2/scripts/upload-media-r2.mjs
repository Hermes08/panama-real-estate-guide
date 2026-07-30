#!/usr/bin/env node
/* =============================================================================
   Upload synced media to Cloudflare R2
   =============================================================================
   Mirrors v2/public/projects/** into the R2 bucket under the same key layout,
   so a stored path ("/projects/<slug>/01.webp") resolves identically whether
   it is served from public/ locally or from the CDN in production. Nothing in
   the database or the JSON artifact knows the hostname — see lib/media.ts.

   Usage:
     node scripts/upload-media-r2.mjs            # upload what is missing
     node scripts/upload-media-r2.mjs --force    # re-upload everything
     node scripts/upload-media-r2.mjs --dry      # list what would upload

   Required in .env.local (add them yourself — never paste keys into chat):
     R2_ACCOUNT_ID
     R2_BUCKET
     R2_ACCESS_KEY_ID
     R2_SECRET_ACCESS_KEY
   ============================================================================= */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "public", "projects");

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const DRY = args.includes("--dry");

const CONTENT_TYPES = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
};

async function loadEnv() {
  const raw = await fs
    .readFile(path.join(ROOT, ".env.local"), "utf8")
    .catch(() => "");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) process.env[m[1]] ??= m[2];
  }

  const missing = [
    "R2_ACCOUNT_ID",
    "R2_BUCKET",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
  ].filter((k) => !process.env[k]);

  if (missing.length) {
    console.error(
      `Missing in .env.local: ${missing.join(", ")}\n\n` +
        "Create an R2 API token (Cloudflare dashboard → R2 → Manage API Tokens)\n" +
        "with Object Read & Write on this bucket, then add the values to\n" +
        "v2/.env.local yourself. Do not paste them into a chat transcript.",
    );
    process.exit(1);
  }
}

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function main() {
  await loadEnv();

  const exists = await fs
    .access(SOURCE)
    .then(() => true)
    .catch(() => false);
  if (!exists) {
    console.error(
      `No media at ${path.relative(ROOT, SOURCE)}. Run scripts/sync-airtable.mjs first.`,
    );
    process.exit(1);
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  const Bucket = process.env.R2_BUCKET;

  let uploaded = 0;
  let skipped = 0;
  let bytes = 0;

  for await (const file of walk(SOURCE)) {
    // Key mirrors the public path exactly, minus the leading slash.
    const Key = path
      .relative(path.join(ROOT, "public"), file)
      .split(path.sep)
      .join("/");

    if (!FORCE) {
      const already = await client
        .send(new HeadObjectCommand({ Bucket, Key }))
        .then(() => true)
        .catch(() => false);
      if (already) {
        skipped++;
        continue;
      }
    }

    if (DRY) {
      console.log(`would upload  ${Key}`);
      uploaded++;
      continue;
    }

    const Body = await fs.readFile(file);
    await client.send(
      new PutObjectCommand({
        Bucket,
        Key,
        Body,
        ContentType:
          CONTENT_TYPES[path.extname(file).toLowerCase()] ??
          "application/octet-stream",
        // Content-addressed by path and never edited in place, so it is safe
        // to cache hard. A changed photo gets a new key from the sync.
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    uploaded++;
    bytes += Body.length;
    process.stdout.write(`  ${Key}\n`);
  }

  console.log(
    `\n${DRY ? "[dry] " : ""}${uploaded} uploaded, ${skipped} already present` +
      (bytes ? ` — ${(bytes / 1024 / 1024).toFixed(1)}MB` : ""),
  );

  if (uploaded && !DRY) {
    console.log(
      "\nSet NEXT_PUBLIC_MEDIA_BASE_URL in .env.local to serve from R2.",
    );
  }
}

main().catch((err) => {
  console.error("\nUpload failed:", err.message);
  process.exit(1);
});
