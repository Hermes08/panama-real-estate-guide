#!/usr/bin/env node
// =============================================================================
// inject-notranslate.mjs — Prevent Chrome/Edge/Firefox auto-translate from
// hijacking our manually-translated /es/, /pt/, /de/ pages.
// =============================================================================
// When a browser's preferred language differs from the page's declared lang,
// Chrome (and others) offer an in-page translation that overwrites text nodes
// directly in the DOM. This hijacks our carefully translated Spanish nav, h1,
// excerpt etc. and replaces them with mediocre machine output ("Aufenthalt" →
// "Stay", "Crónicas" → unintended renderings).
//
// The fix per Google guidance: add <meta name="google" content="notranslate">.
// Also set translate="no" on the <html> element as a belt-and-braces signal
// for non-Chromium browsers.
//
// We apply this ONLY to translated pages under project/{es,pt,de}/. The EN
// pages stay translate-eligible because EN visitors may legitimately want
// Chrome's translate-to-mine for a foreign-language landing.
//
// Idempotent: skips files that already contain either signal.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROJECT_DIR = path.join(ROOT, 'project');

const LANGS = ['es', 'pt', 'de'];
const META_TAG = '<meta name="google" content="notranslate">';

async function walkHtml(dir) {
  const out = [];
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); }
  catch { return out; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...await walkHtml(full));
    } else if (e.isFile() && e.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

async function processFile(file) {
  let html = await fs.readFile(file, 'utf8');
  let changed = false;

  // 1) Inject the notranslate meta inside <head> (after charset/viewport)
  //    Skip if already present.
  if (!html.includes('name="google"') || !html.includes('content="notranslate"')) {
    // Insert directly after the <meta charset...> line if found, else right after <head>.
    const charsetMatch = html.match(/<meta\s+charset=["'][^"']+["']\s*\/?>/i);
    if (charsetMatch) {
      const idx = html.indexOf(charsetMatch[0]) + charsetMatch[0].length;
      html = html.slice(0, idx) + `\n  ${META_TAG}` + html.slice(idx);
      changed = true;
    } else {
      const headOpen = html.match(/<head[^>]*>/i);
      if (headOpen) {
        const idx = html.indexOf(headOpen[0]) + headOpen[0].length;
        html = html.slice(0, idx) + `\n  ${META_TAG}` + html.slice(idx);
        changed = true;
      }
    }
  }

  // 2) Add translate="no" to the <html> element (idempotent).
  if (!/<html[^>]*\btranslate=["']no["']/i.test(html)) {
    html = html.replace(/<html(\s[^>]*)?>/i, (m, attrs) => {
      // Append translate="no" before the closing >.
      return `<html${attrs || ''} translate="no">`;
    });
    changed = true;
  }

  if (changed) {
    await fs.writeFile(file, html);
  }
  return changed;
}

async function main() {
  let total = 0;
  let changed = 0;
  for (const lang of LANGS) {
    const dir = path.join(PROJECT_DIR, lang);
    const files = await walkHtml(dir);
    for (const f of files) {
      total++;
      if (await processFile(f)) changed++;
    }
  }
  console.log(`[notranslate] processed ${total} files across /${LANGS.join('/, /')}/, modified ${changed}`);
}

main().catch(e => { console.error(e); process.exit(1); });
