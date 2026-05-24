# QA code review — i18n infrastructure (2026-05-19)

Scope: `scripts/translate-content.mjs`, `scripts/inject-hreflang.mjs`, `state/i18n-glossary.json`, `netlify-deploy.yml` (i18n additions only).

Severity legend: **blocker** = will fail or corrupt the build / ship broken UX; **major** = wrong behavior at scale, money risk, or SEO regression; **minor** = quality issue, harmless misbehavior; **nit** = style/clarity.

---

## Executive sign-off

**Revise before merge.** 3 blockers, 6 majors. The biggest issues are (1) wrong model id `claude-sonnet-4-6` (API will 404 every call), (2) translated `data-light.js` is never built so per-lang pages render EN titles/excerpts in chrome despite translated body, and (3) cache write is non-atomic — a mid-batch crash corrupts `i18n-cache.json` and forces a full $$$ re-translation. None are conceptually hard; all are local fixes.

---

## 1. `scripts/translate-content.mjs`

### Blockers

**B1. Model id is wrong / hallucinated.** Line 53: `'claude-sonnet-4-6'`. There is no such model id — Anthropic's id format is `claude-sonnet-4-5-20250929`, `claude-opus-4-5-...`, etc. Every API call will return `404 model_not_found` and the build will hard-fail (line 416, `process.exit(1)`). Default to a real id, e.g. `'claude-sonnet-4-5-20250929'`, or pin via env only and require it explicitly.

**B2. Per-language `data-light.js` is never generated.** Line 267 of the translated HTML shell loads `../../data-light.js` (the EN one). The per-lang body file (line 268) only writes `articleBodies[slug]`, not the `articles` array. Result: the chrome (article listing, related-articles widget, breadcrumbs, JSON-LD on the index, etc.) renders **EN titles and excerpts** on Spanish/Portuguese/German pages. The reader sees translated body + English everything else. Either (a) extend `build-data-split.mjs` (out of scope here) to produce `project/<lang>/data-light.js` from translated metadata, or (b) have `translate-content.mjs` itself emit `project/<lang>/data-light-<lang>.js` (the header comment at line 20 already promises this filename, but no code writes it) and update the HTML shell to load that.

**B3. Non-atomic cache write.** Line 405: `await fs.writeFile(CACHE_PATH, ...)`. If the process is killed (CI timeout, SIGTERM during deploy) while writing, `i18n-cache.json` is left truncated/invalid. Next run's `JSON.parse` at line 334 throws and is silently swallowed (the `try {} catch {}` resets `cache = {}`), which **invalidates the entire cache** and re-translates every article × every language at full cost. Also, the cache is only flushed once at the end — a partial run loses *all* incremental progress. Fix: (a) write cache after each successful task (or batch of N), (b) use atomic write-then-rename pattern: `fs.writeFile(CACHE_PATH + '.tmp', ...)` then `fs.rename(...)`.

### Majors

**M1. No retry on 429 / 5xx.** `callClaude` (lines 167–194) treats any non-200 as fatal. Anthropic 429s are routine under MAX_CONCURRENT=4 across 80+ articles × 3 langs = 240+ calls. One rate-limit blip aborts the whole batch *and exits 1* (line 416). Add exponential backoff with retry on 429 and 5xx (3–5 attempts, jittered, honor `retry-after` header).

**M2. Build fails when ANY translation fails.** Lines 413–417: any error in the `errors[]` array causes `process.exit(1)`, which kills the workflow and prevents the Netlify deploy of any *other* artifacts that step changes (sitemap, injected tags, etc.). One bad article = no deploy. Recommendation: log loudly, set a job-summary annotation, but `process.exit(0)` so the rest of the pipeline ships. Errors are recoverable on the next run via the SHA cache.

**M3. Glossary writes are racy / non-atomic.** Line 406: same as cache, plus mutated inside concurrent workers (`runOne` at line 384 writes to the shared `glossary` object with no lock). With MAX_CONCURRENT=4 you can lose suggestions when two workers race to add the same key. Move glossary merge to the serial post-batch step, or guard with a mutex/sequential flush.

**M4. `bodyToMarkdown` silently corrupts complex section shapes.** Line 304–317. The function handles `h2` and `h3` but for `h2` sections it calls `(b.text || JSON.stringify(b))` on each item — any item that's not a plain string or `{text}` (e.g. tables, lists, callouts, image refs commonly found in `articleBodies`) gets dumped to literal JSON inside the markdown. The translator then translates literal JSON keys, and the round-trip produces garbage. Either (a) audit the real shapes in `data.js` and handle each (list items, table rows, callout boxes) explicitly, or (b) translate the structured JSON itself and re-serialize, never flattening to markdown.

**M5. `description` length lint is too permissive vs prompt contract.** Prompt asks 155–160 chars (line 132), lint warns only at >200 (line 207). Anything 161–200 silently ships and truncates in SERPs. Tighten to >170 (small grace for accent chars) or trust the prompt and remove the lint.

**M6. `escapeHtml` misses the apostrophe.** Line 297: regex `[&<>"]` — does not include `'`. The review brief explicitly asks for "all 5 chars (& < > " ')". With a single-quoted attribute (none of the generated HTML uses single quotes for attrs, so practical risk is low *today*), this is a latent XSS surface. Add `'`: `[&<>"']` → `&#39;`. Cheap fix, do it.

### Minors

**m1. `altLangs` filter is dead code.** Line 217: `['en','es','pt','de'].filter(l => true)` — the filter always returns true. Delete the `.filter(l => true)`.

**m2. Hreflang block hard-coded in shell.** `renderHtmlShell` (lines 218–222) emits hreflang links for *all four* languages unconditionally on every per-lang page, even when those other-lang versions may not have been generated yet (partial first run, some langs failed). It also duplicates what `inject-hreflang.mjs` does for EN. Decide on one source of truth — either let `inject-hreflang.mjs` own all hreflang injection (and remove these lines from the shell), or detect actual existence here. Today's behavior produces hreflang links pointing to 404s during partial backfills.

**m3. JSON extraction is fragile.** Lines 189–192: `text.indexOf('{')` ... `text.lastIndexOf('}')`. If the body contains stray `{` in prose before the actual JSON (e.g. model says "Here's the JSON: {...}" — fine — but if the model emits any preamble containing `{`, the slice starts wrong). Prefer `JSON.parse` with a regex match for a fenced JSON block, and fall back to char scan only on failure.

**m4. Glossary suggestion key collisions.** Lines 382–387: slug-cased key from `sug.en` truncated to 40 chars. Two long EN phrases differing past char 40 collide and the second is silently dropped (`!glossary[key]` check). Either hash-suffix or use the full slug.

**m5. Cost calc uses unconditional $3/$15 rates.** Line 411: hardcoded Sonnet 4.5 rates. With the wrong model id (see B1), and given any model switch, this becomes misleading. Pull from a `MODEL_COST` map keyed by model id.

**m6. `data-light-<lang>.js` filename promised in header but never written.** Line 20–21 docs vs reality. Either implement (fixes B2) or correct the comment.

**m7. `console.log` of token counts/cost is fine, but `usage` could be undefined.** Line 379 prints `usage?.input_tokens` → `undefined` in logs on certain SDK responses. Fall back to `'?'` to keep logs clean.

**m8. SINGLE_SLUG match uses `a.id` but article ids may differ from slugs in some datasets.** Line 339: if `a.id !== a.slug` anywhere in `articles`, the env-var filter targets the wrong field. Confirm or accept both.

### Nits

**n1.** "PT" glossary entry `pensionado_visa` keeps "Visa Pensionado" which is Spanish word order; in PT it would naturally be "Visto Pensionado". Glossary entry — content matter, not code.

**n2.** `LANG_NAMES.es` says "Castilian + LATAM-neutral" — ambiguous direction for the model. Prefer "LATAM-neutral Spanish" since the audience is Panama-region.

**n3.** Comment on line 16 ("Subsequent runs = cents") is optimistic; with B2/B3 unfixed it's "Subsequent runs = re-translate everything = $$$".

---

## 2. `scripts/inject-hreflang.mjs`

### Majors

**M7. Hreflang is injected INSIDE the `BEGIN_ARTICLE_META`…`END_ARTICLE_META` block, but `inject-article-meta.mjs` REPLACES the entire block on next run.** `applyToHtml` in `scripts/inject-article-meta.mjs` (line 388–390) does `html.replace(re, headBlock)` against `BEGIN_ARTICLE_META[\s\S]*?END_ARTICLE_META`. Since `inject-hreflang.mjs` writes its sentinels *between* the two article-meta sentinels (`inject-hreflang.mjs` line 73–76 inserts before `END_ARTICLE_META`), the entire hreflang block is **deleted** the next time inject-article-meta runs. Within a single workflow execution this is fine (order: article-meta then hreflang), but: (a) any rerun of article-meta alone wipes hreflang silently, (b) the design is brittle. Fix: put the hreflang block *after* `END_ARTICLE_META` sentinel, not before it. One-line change: in `processFile`, replace `metaEndIdx` with `metaEndIdx + metaEnd.length`.

**M8. Re-run leaves orphan whitespace and progressively bloats the file.** Line 68–70: removes the old block but doesn't trim the surrounding `\n  ` indent that gets re-added on line 76. Each run accumulates leading whitespace. Trim both ends when stripping, or use a regex with the indent included.

### Minors

**m9. No `KIND === 'articles' && slug === 'index'` filter for projects.** Line 99 skips only `index` for both kinds — fine, but the `projects/index.html` skip means the projects landing page never gets hreflang. Probably intentional; add a one-line comment to confirm.

**m10. `getTranslationsForSlug` does 3 fs.access per file × 80+ files = 240+ syscalls.** Acceptable, but a single `fs.readdir(project/<lang>/<kind>)` cached up-front would be cleaner and ~80× fewer syscalls.

**m11. No exit code on partial failure.** If `processFile` throws on one file, `main` rejects and exits 1, aborting the whole step. Wrap per-file in try/catch and log; only fail if the count is "everything broken".

### Nits

**n4.** Header comment says "Wraps injected block in HTML comment sentinels for safe re-runs" — true within hreflang's own scope, but see M7. Update once fixed.

**n5.** `present_langs` is returned but never used for telemetry beyond the count. Could log per-file `present_langs` at `--verbose`.

---

## 3. `state/i18n-glossary.json`

### Minors

**m12. `panama_real_estate_guide` reads "Panama Real Estate Guide" in all four locales — that's correct for the brand name but the entry is then useless as a glossary item (no translation happens).** Either drop it or add a `_brand: true` marker so the prompt explains "do not translate" rather than presenting an identity mapping.

**m13. `pensionado_visa.pt` is "Visa Pensionado" (Spanish word order).** PT-BR convention: "Visto Pensionado". See n1.

**m14. `friendly_nations_visa.de` left as English ("Friendly Nations Visa"). Defensible (the program name is a legal term), but inconsistent with `pensionado_visa.de` which is translated ("Pensionado-Visum"). Pick one rule.**

### Nits

**n6.** No `version` field — when the glossary grows via auto-suggestions (M3), a monotonic version helps trace cache invalidations.

---

## 4. `netlify-deploy.yml`

### Majors

**M9. No graceful handling of translate-content failure.** Lines 78–85: `node scripts/translate-content.mjs` runs without `continue-on-error: true`. If translation fails (B1, M1, M2), the entire deploy is blocked — including the hreflang injection step that *would* still emit valid `hreflang="en"` self-references plus `x-default`. Add `continue-on-error: true` for the translate step, OR fix the script to exit 0 on partial failure (M2).

### Minors

**m15. Step ordering: translate runs AFTER `inject-article-meta`, which is correct (the article-meta sentinel is what hreflang anchors against). But translate also runs AFTER `inject-tags` is NOT — it runs *before*, good — but translated HTML shells generated by translate-content.mjs are written fresh and DO NOT receive the tracking-tag injection** that the EN shells get (lines 94–105). Confirm intent: today, ES/PT/DE pages will not have GA4, Meta Pixel, TikTok, Google Ads tags. If that's a bug, run `inject-tags.mjs` AFTER `translate-content.mjs` against the new lang dirs, or have translate-content render the tag includes itself. Likely a **major** if tracking parity is required.

**m16. Cron is 1×/day (06:00 UTC).** Each cron run hits the translate step; with B3 unfixed and any cache corruption, that's a daily full retranslation = real money. Consider a kill-switch env var (`SKIP_TRANSLATE_ON_CRON=1`) gated on `github.event_name == 'schedule'`.

### Nits

**n7.** Double blank line between hreflang step and tracking-tags step (lines 92–94). Cosmetic.

**n8.** No comment on the new steps explaining the SHA-incremental nature / cost expectation — devs will assume each run is expensive.

---

## Recommended fix order

1. **B1** (model id) — one-line fix, deploy blocker.
2. **B2** (per-lang data-light.js) — without this, translated pages are half-EN. Probably the biggest user-visible bug.
3. **B3** (atomic cache write + per-task flush) — protects the budget.
4. **M1 / M2** (retry + non-fatal exit) — makes the pipeline resilient.
5. **M7** (hreflang outside article-meta sentinels) — one-line fix, prevents silent SEO regression.
6. **M4** (bodyToMarkdown coverage) — needs an audit of `data.js` shapes; could be the largest scope item.
7. **M6** (escapeHtml apostrophe) — trivial.
8. **M9 / M15** (workflow continue-on-error + tracking-tag parity for translated shells).
9. Everything else.

## Sign-off

**Revise before merge.** Once B1–B3 + M1, M2, M4, M7 are addressed, this is **ship with follow-up** (the remaining majors are quality/cost concerns, not correctness on first deploy with empty cache).
