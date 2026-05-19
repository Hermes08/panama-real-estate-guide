#!/usr/bin/env node
// =============================================================================
// build-jsx.mjs — pre-compile every .jsx in project/ to .js so the site can
//                 drop Babel-standalone from the browser
// =============================================================================
// Before this script existed, every HTML shell loaded:
//   • @babel/standalone (~600 KB on CDN)
//   • components.jsx / sections.jsx / detail-chrome.jsx via <script type="text/babel">
//   • an inline <script type="text/babel"> page-renderer block (~5-20 KB each)
//
// Babel ran in the browser on every pageview, transpiling JSX → React.createElement
// calls. That added 600 KB of network + a TBT-killing CPU burst.
//
// This script uses esbuild (run via `npx --yes esbuild`) to transform each
// .jsx file in project/ to a side-by-side .js file:
//
//   project/components.jsx → project/components.js
//   project/sections.jsx → project/sections.js
//   project/detail-chrome.jsx → project/detail-chrome.js
//   project/articles/article-renderer.jsx → project/articles/article-renderer.js
//   project/projects/project-renderer.jsx → project/projects/project-renderer.js
//   project/videos/video-renderer.jsx → project/videos/video-renderer.js
//   project/videos/videos-index-renderer.jsx → project/videos/videos-index-renderer.js
//   project/news/news-renderer.jsx → project/news/news-renderer.js
//   project/index-renderer.jsx → project/index-renderer.js
//
// Outputs are gitignored — regenerated on every deploy. The .jsx sources stay
// in the repo as the source of truth.
//
// HTML shells reference the .js outputs and skip Babel entirely.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..', 'project');

async function findJsxFiles(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // skip generated directories
      if (entry.name === 'bodies') continue;
      out.push(...await findJsxFiles(p));
    } else if (entry.name.endsWith('.jsx')) {
      out.push(p);
    }
  }
  return out;
}

async function compile(jsxPath) {
  const jsPath = jsxPath.replace(/\.jsx$/, '.js');
  // esbuild infers JSX from extension; --target=es2018 keeps output compatible
  // with all modern browsers + IE11-ish (not strictly needed but cheap insurance);
  // no minify because the network savings from .min.js + gzip are small here.
  // No source map by default; if Lighthouse warns we can add --sourcemap=inline.
  const { stdout, stderr } = await exec('npx', [
    '--yes', 'esbuild',
    jsxPath,
    '--target=es2018',
    '--loader:.jsx=jsx',
    '--outfile=' + jsPath,
  ], { maxBuffer: 50 * 1024 * 1024 });
  if (stderr && !stderr.includes('Done in')) {
    // esbuild prints normal info to stderr, only complain on actual errors
    // (errors include "[ERROR]" tag).
    if (stderr.includes('[ERROR]')) throw new Error(stderr);
  }
  const inSize = (await fs.stat(jsxPath)).size;
  const outSize = (await fs.stat(jsPath)).size;
  return { in: jsxPath.replace(PROJECT_DIR + '/', ''), out: jsPath.replace(PROJECT_DIR + '/', ''), inSize, outSize };
}

async function main() {
  const files = await findJsxFiles(PROJECT_DIR);
  console.log(`build-jsx: found ${files.length} .jsx files`);

  const results = [];
  for (const f of files) {
    try {
      const r = await compile(f);
      results.push(r);
    } catch (e) {
      console.error(`build-jsx: FAILED on ${f}: ${e.message.slice(0, 200)}`);
      process.exit(1);
    }
  }

  for (const r of results) {
    console.log(`  ${r.in} (${(r.inSize/1024).toFixed(1)}KB) → ${r.out} (${(r.outSize/1024).toFixed(1)}KB)`);
  }
  const totalIn = results.reduce((s, r) => s + r.inSize, 0);
  const totalOut = results.reduce((s, r) => s + r.outSize, 0);
  console.log(`build-jsx: ${results.length} files compiled · ${(totalIn/1024).toFixed(1)}KB in → ${(totalOut/1024).toFixed(1)}KB out`);
}

main().catch(err => { console.error('build-jsx failed:', err); process.exit(1); });
