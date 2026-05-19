#!/usr/bin/env node
// =============================================================================
// extract-body-faqs.mjs — one-shot migration: scan each article's body for an
// FAQ section and write the Q/A pairs back into the article's metadata
// `faqs:` field in project/data.js. inject-article-meta.mjs v2 then emits
// FAQPage JSON-LD on every article that has a populated faqs array.
// =============================================================================
//
// Why one-shot, not deploy-time:
//   data.js is the hand-edited source of truth. Authors keep the prose FAQ
//   sections inline in body so the React render shows them visibly. We need
//   to mirror those Q/A pairs into the metadata once (this script), then
//   future article edits update both prose AND metadata by hand. Re-running
//   the script is safe (it skips articles that already have faqs).
//
// Handles four FAQ formats observed in the existing 81 article bodies:
//   A. {h: "FAQs"}, then each question is its own {h: "Question?"} followed
//      by an answer string.
//   B. {h: "FAQs"}, then alternating "**Q: ...**" / "A: ..." string blocks.
//   C. {h: "FAQs: ..."}, then single strings of the form
//      "**Q1: question** answer text".
//   D. {h: 'Frequently Asked Questions'}, then strings of the form
//      "**Q: question** A: answer text".
//
// Quality bar (matches inject-article-meta's buildFaqLd validator):
//   • Minimum 3 valid Q/A pairs to emit metadata.
//   • Q must be 10-300 chars after cleaning.
//   • A must be 30-2000 chars after cleaning.
//   • Cleans markdown (bold, inline links), collapses whitespace.
//   • Skips an article entirely if extracted pairs don't pass the bar.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..', 'project');
const DATA_JS = path.join(PROJECT_DIR, 'data.js');

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function cleanMd(s) {
  return String(s)
    .replace(/\*\*(.+?)\*\*/g, '$1')          // strip bold
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // strip markdown links
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function isFaqHeading(h) {
  if (!h || typeof h !== 'string') return false;
  return /^\s*(FAQs?\b|Frequently Asked Questions|Preguntas Frecuentes|FAQ:)/i.test(h);
}

function isMajorHeading(h) {
  if (!h || typeof h !== 'string') return false;
  // Major next-section markers that end the FAQ block
  return /^(Next Steps|Social|Conclusion|Wrap[- ]?up|Summary|Closing|Related|Further reading|Read next|One.line takeaway|One-liner)/i.test(h);
}

// -----------------------------------------------------------------------------
// Extract FAQ Q&A pairs from a body array.
//
// Strategy:
//   1. Walk forward until we hit a heading that looks like an FAQ header.
//   2. From that point, walk forward collecting Q/A pairs using the four
//      format patterns. Stop at the next major heading (Next Steps, Social,
//      etc.) or end of body.
// -----------------------------------------------------------------------------
function extractFaqsFromBody(body) {
  if (!Array.isArray(body)) return [];

  // Find the FAQ heading
  let startIdx = -1;
  for (let i = 0; i < body.length; i++) {
    const b = body[i];
    if (typeof b === 'object' && b?.h && isFaqHeading(b.h)) {
      startIdx = i + 1;
      break;
    }
  }
  if (startIdx < 0) return [];

  // Collect blocks until next major heading
  const faqBlocks = [];
  for (let i = startIdx; i < body.length; i++) {
    const b = body[i];
    if (typeof b === 'object' && b?.h && isMajorHeading(b.h)) break;
    faqBlocks.push(b);
  }
  if (faqBlocks.length === 0) return [];

  const pairs = [];

  // Pattern A: {h: "Question?"} + next string is answer
  for (let i = 0; i < faqBlocks.length - 1; i++) {
    const cur = faqBlocks[i];
    const nxt = faqBlocks[i + 1];
    if (typeof cur === 'object' && cur?.h && typeof nxt === 'string') {
      // Heading looks like a question (ends with ?, or is sentence-y)
      const q = String(cur.h).trim();
      if (/\?\s*$/.test(q) || /^(What|How|Is|Are|Can|Do|Does|Should|When|Where|Why|Who|Which)\b/i.test(q)) {
        const a = String(nxt).trim();
        // Avoid capturing the answer if it itself starts a new heading pair
        if (a.length >= 30) {
          pairs.push({ q, a });
        }
      }
    }
  }

  // Pattern B: alternating "**Q: ...**" / "A: ..." strings
  for (let i = 0; i < faqBlocks.length - 1; i++) {
    const cur = faqBlocks[i];
    const nxt = faqBlocks[i + 1];
    if (typeof cur !== 'string' || typeof nxt !== 'string') continue;
    const qMatch = cur.match(/^\*\*Q:\s*([\s\S]+?)\*\*\s*$/);
    const aMatch = nxt.match(/^A:\s*([\s\S]+)$/);
    if (qMatch && aMatch) {
      pairs.push({ q: qMatch[1].trim(), a: aMatch[1].trim() });
    }
  }

  // Pattern C: "**Q1: question** answer" single string
  // and Pattern D: "**Q: question** A: answer text"
  for (const b of faqBlocks) {
    if (typeof b !== 'string') continue;

    // D first (most specific): **Q: question** A: answer
    let m = b.match(/^\*\*Q[:\d.]*\s*([^*]+?)\*\*\s*A:\s*([\s\S]+)$/);
    if (m) {
      pairs.push({ q: m[1].trim(), a: m[2].trim() });
      continue;
    }

    // C: **Q1: question** answer (no explicit A: prefix)
    m = b.match(/^\*\*Q\d+[:.]?\s*([^*]+?)\*\*\s+([\s\S]+)$/);
    if (m) {
      pairs.push({ q: m[1].trim(), a: m[2].trim() });
      continue;
    }

    // Variant of C: **Q: question** answer (no A: prefix, no number)
    m = b.match(/^\*\*Q:\s*([^*]+?)\*\*\s+([A-Z][\s\S]+)$/);
    if (m) {
      pairs.push({ q: m[1].trim(), a: m[2].trim() });
      continue;
    }
  }

  // Dedupe (Pattern A and Pattern C might both fire on edge cases)
  const seen = new Set();
  const cleaned = [];
  for (const p of pairs) {
    const q = cleanMd(p.q);
    const a = cleanMd(p.a);
    if (q.length < 10 || q.length > 300) continue;
    if (a.length < 30 || a.length > 2000) continue;
    const k = q.toLowerCase().slice(0, 40);
    if (seen.has(k)) continue;
    seen.add(k);
    cleaned.push({ q, a });
  }

  return cleaned;
}

// -----------------------------------------------------------------------------
// Format the faqs array as JS source for splicing into data.js.
// -----------------------------------------------------------------------------
function formatFaqsForJs(faqs, indent = '      ') {
  const inner = indent + '  ';
  const lines = [indent + 'faqs: ['];
  for (const f of faqs) {
    // Use double quotes; escape any embedded double quotes; preserve curly
    // quotes / em dashes since data.js handles UTF-8 fine.
    const qStr = JSON.stringify(f.q);
    const aStr = JSON.stringify(f.a);
    lines.push(inner + '{');
    lines.push(inner + '  q: ' + qStr + ',');
    lines.push(inner + '  a: ' + aStr);
    lines.push(inner + '},');
  }
  // Remove trailing comma from last entry
  lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '');
  lines.push(indent + ']');
  return lines.join('\n');
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
async function main() {
  const src = await fs.readFile(DATA_JS, 'utf8');
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { timeout: 5000 });
  const D = sandbox.window.PANAMA_DATA;
  if (!D) throw new Error('PANAMA_DATA missing from data.js');

  const articles = D.articles || [];
  const bodies = D.articleBodies || {};

  let updatedSrc = src;
  const report = { extracted: 0, skipped_no_pairs: 0, skipped_already_has_faqs: 0, skipped_too_few: 0 };
  const successes = [];
  const skipped = [];

  for (const a of articles) {
    if (Array.isArray(a.faqs) && a.faqs.length >= 3) {
      report.skipped_already_has_faqs++;
      skipped.push(`${a.id}: already has ${a.faqs.length} faqs`);
      continue;
    }
    const body = bodies[a.id] || [];
    const pairs = extractFaqsFromBody(body);
    if (pairs.length === 0) {
      report.skipped_no_pairs++;
      continue;
    }
    if (pairs.length < 3) {
      report.skipped_too_few++;
      skipped.push(`${a.id}: only ${pairs.length} extractable pairs (need ≥3)`);
      continue;
    }

    // Splice faqs: [...] into the article entry in data.js source.
    // Find the article entry: `id: '<slug>'`, then locate the closing `}` of
    // that object, then insert before it.
    const idMarker = `id: '${a.id}',`;
    const idIdx = updatedSrc.indexOf(idMarker);
    if (idIdx < 0) {
      skipped.push(`${a.id}: id marker not found in data.js (was looking for "${idMarker}")`);
      continue;
    }

    // Find the closing `    },` (4-space indent + }) after the id marker.
    // Look forward only within the next 50 lines.
    const after = updatedSrc.slice(idIdx);
    const closeMatch = after.match(/\n(    })\s*,?\s*\n/);
    if (!closeMatch) {
      skipped.push(`${a.id}: closing } not found within reasonable range`);
      continue;
    }
    const closeIdxAbs = idIdx + closeMatch.index;

    // Build the insertion: detect whether the line before the close needs
    // a comma. The existing fields end without trailing comma on the last
    // field (just before the closing line). We need to add comma after the
    // last field, then our faqs block, then no trailing comma.
    const before = updatedSrc.slice(0, closeIdxAbs);
    const lastNl = before.lastIndexOf('\n');
    const lastLine = before.slice(lastNl + 1);
    const needsComma = !lastLine.trim().endsWith(',') && lastLine.trim().length > 0;

    const faqsBlock = (needsComma ? ',' : '') + '\n' + formatFaqsForJs(pairs);

    updatedSrc = updatedSrc.slice(0, closeIdxAbs) + faqsBlock + updatedSrc.slice(closeIdxAbs);

    report.extracted++;
    successes.push(`${a.id}: ${pairs.length} pairs`);
  }

  // Sanity-check the modified data.js still parses
  try {
    const testSandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
    vm.createContext(testSandbox);
    vm.runInContext(updatedSrc, testSandbox, { timeout: 5000 });
    if (!testSandbox.window.PANAMA_DATA) throw new Error('PANAMA_DATA not produced');
    const testD = testSandbox.window.PANAMA_DATA;
    const withFaqsAfter = testD.articles.filter(x => Array.isArray(x.faqs) && x.faqs.length >= 3).length;
    console.log(`articles with faqs after migration: ${withFaqsAfter}`);
  } catch (e) {
    console.error('FATAL: modified data.js does not parse:', e.message);
    process.exit(1);
  }

  await fs.writeFile(DATA_JS, updatedSrc, 'utf8');

  console.log('extract-body-faqs report:');
  console.log(`  ✓ extracted faqs into ${report.extracted} articles`);
  console.log(`  · skipped (already has faqs metadata): ${report.skipped_already_has_faqs}`);
  console.log(`  · skipped (no FAQ section in body): ${report.skipped_no_pairs}`);
  console.log(`  · skipped (only 1-2 extractable pairs): ${report.skipped_too_few}`);
  console.log();
  console.log('successes:');
  for (const s of successes.slice(0, 10)) console.log('  ' + s);
  if (successes.length > 10) console.log(`  ... and ${successes.length - 10} more`);
  if (skipped.length) {
    console.log();
    console.log('notable skips (first 5):');
    for (const s of skipped.slice(0, 5)) console.log('  ' + s);
  }
}

main().catch(err => { console.error('extract-body-faqs failed:', err); process.exit(1); });
