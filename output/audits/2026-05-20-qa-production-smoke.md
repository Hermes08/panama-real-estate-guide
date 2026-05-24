# Production Smoke Test — PR #64 (i18n) Post-Merge

**Date:** 2026-05-20 ~20:42 UTC
**Site:** https://panamarealestateguide.com/
**PR:** [#64 feat(i18n): multilingual ES/PT/DE pipeline + geo-aware delivery + 6 pilot translations](https://github.com/Hermes08/panama-real-estate-guide/pull/64)
**PR merged at:** 2026-05-20T18:36:55Z (commit `9c2332d`)
**Deploy workflow run:** [26182418763](https://github.com/Hermes08/panama-real-estate-guide/actions/runs/26182418763) — **FAILED at 18:40:52Z**

---

## TL;DR — Merge-blocker found

**NOTHING from PR #64 reached production.** The `Deploy to Netlify` workflow run triggered by the merge failed at step 13 (translate articles), which caused steps 14-18 (including the actual Netlify deploy) to be `skipped`. The currently live site is still the artifact from the *previous* successful production deploy at 02:45 UTC (commit `7954116`).

Result: 0/5 user-facing checks pass on production. The pilot translations, hreflang reciprocity, geo-route edge function, and 15-real-news fix are all dark.

---

## Root cause

`.github/workflows/netlify-deploy.yml` step 13 calls `node scripts/translate-content.mjs` with `ANTHROPIC_API_KEY` set. The account ran out of credit, so EVERY article × {es,pt,de} call returned HTTP 400 `invalid_request_error: "Your credit balance is too low"`. The script exited with code 1. Because the step has no `continue-on-error: true`, the job failed and the downstream steps `Inject hreflang link tags`, `Install Netlify CLI`, `Sync function env vars`, and `Deploy project/ to Netlify (production)` were all skipped (verified via `gh api runs/26182418763.jobs[].steps[].conclusion`).

**Fix (recommended):** Add `continue-on-error: true` to the translate step (and ideally to the inject-hreflang step), OR have `translate-content.mjs` swallow non-zero exit codes when individual files fail and only exit non-zero on catastrophic failure (no API key, no input data). The translate step is supposed to be incremental + idempotent — one budget hiccup should never block a deploy of unrelated content.

---

## A. Pilot multilingual pages render — **0 / 6 PASS**

| URL | HTTP | Result |
|---|---|---|
| /es/articles/internet-providers-panama-expats.html | **404** | FAIL — Netlify "Page not found" |
| /es/articles/panama-retirement-communities.html | **404** | FAIL — Netlify "Page not found" |
| /pt/articles/internet-providers-panama-expats.html | **404** | FAIL |
| /pt/articles/panama-retirement-communities.html | **404** | FAIL |
| /de/articles/internet-providers-panama-expats.html | **404** | FAIL |
| /de/articles/panama-retirement-communities.html | **404** | FAIL |

Cannot verify `<html lang>`, `<title>`, `article-renderer.js` path, or hreflang block because the files simply do not exist on the live origin. All 6 return the Netlify branded 404 page with `<html lang="en">` and `<title>Page not found</title>`.

**Status:** FAIL — not a renderer bug, a deployment-never-happened issue.

---

## B. EN article hreflang reciprocity — **FAIL**

URL: https://panamarealestateguide.com/articles/internet-providers-panama-expats.html → HTTP 200, 7,685 bytes.

`grep -E '<link rel="alternate"' /tmp/en-internet.html` returns **0 lines**. No hreflang block present. Expected: 4 alternate links (en, es, pt, de) + x-default.

**Why:** The `Inject hreflang link tags` step (#14) was *skipped* in the failed run. The current production HTML is whatever shipped at 02:45 UTC — before the i18n PR.

**Fix:** Same as root cause above. Once the translate step is non-blocking, hreflang injection will run.

---

## C. Geo-route edge function — **PARTIAL / inconclusive**

| Test | Result | Status |
|---|---|---|
| Googlebot UA on `/` | `preg-lang-banner` count = **0** | PASS (no banner for bots) |
| Browser UA on `/` | `preg-lang-banner` count = **0** | INCONCLUSIVE (could be a Panama-IP miss OR function not deployed) |
| `/styles.css` static asset | HTTP **200**, content-type text/css | PASS (asset passes through) |
| `/.netlify/edge-functions/geo-route` direct | HTTP **404** | Expected (edge functions don't expose direct routes) |

The edge function code from PR #64 was never deployed (step 17 "Sync function env vars" and step 18 "Deploy" both skipped). So whatever geo-routing exists today is either:

1. The previous-deploy edge function (if any) — which would explain bot=0,browser=0 (no banner ever for US-IP test client), OR
2. No edge function at all — also yields 0 for both.

Either way, the bot-exclusion and asset-passthrough guarantees from PR #64 are not in production yet. The CSS asset HTTP 200 is reassuring but doesn't prove the new edge function is responsible.

**Status:** Cannot verify the new edge function until a successful deploy lands.

---

## D. News ticker on homepage — **FAIL**

Fetched https://panamarealestateguide.com/data-light.js (156 KB), parsed the `"news":[…]` array.

**18 items found** (matches the OLD fake demo set, not the 15 commit-D items):

```
Palma Blanca Phase II breaks ground...         (FAKE)
Panama ranked #2 retirement... (International Living)   (FAKE)
Aqua Lodge Bocas delivers first 12 overwater...  (FAKE)
Palma Blanca Phase I records final sale...       (FAKE)
... + 14 others
```

Term counts:
- `Palma Blanca`: **7** occurrences (expected 0)
- `Aqua Lodge`: **4** occurrences (expected 0)
- `International Living`: **2** occurrences (expected 0)

Real terms also show up because they're in `regions[]`, NOT news[]: `Tocumen`=7, `Boquete`=many, `Pedasí`=19 — but these are existing region/article copy, not the new news items.

**Status:** FAIL — production still serves the 18 fake demo news items. The 15-real-news fix from commit D is in `main` but undeployed.

---

## E. Translation backfill (2026-outlook ES) — **FAIL as expected**

`curl https://panamarealestateguide.com/es/articles/2026-outlook.html` → HTTP **404**.

Expected fail per the brief (the translate-backfill workflow ran out of Anthropic credit). However, this is *also* a symptom of the bigger problem in §A: even the 6 pilots that *were* committed to git are 404 because the deploy never published anything from PR #64.

**Status:** Matches expectation, but in this case the entire `/es/`, `/pt/`, `/de/` subtree is missing — not just the un-translated articles.

---

## Score: 1 / 5 checks pass (and that one is inconclusive)

| Check | Status |
|---|---|
| A. Pilot pages render | FAIL (6/6 are 404) |
| B. EN hreflang | FAIL (0 alternate links) |
| C. Geo-route edge function | INCONCLUSIVE / likely undeployed |
| D. News ticker is real | FAIL (18 fake items still live) |
| E. Backfill 2026-outlook ES | FAIL as expected (404) |

---

## Recommended next steps (in order)

1. **Unblock the deploy pipeline.** Edit `.github/workflows/netlify-deploy.yml` step 13: add `continue-on-error: true`. Optionally also harden `scripts/translate-content.mjs` to early-exit cleanly when Anthropic returns a credit error (so it doesn't even mark the step failed).

2. **Re-run the deploy.** Push the workflow fix to `main`, OR manually re-run run `26182418763` from the GitHub Actions UI once the workflow yaml is patched, OR push an empty commit to `main`. The 6 pilot translations + hreflang injection + geo-route + 15 real news items will then ship together.

3. **Decide on the Anthropic credit situation** before re-running the full backfill. Until credits are topped up, the translate step should be a no-op (which it already is when ANTHROPIC_API_KEY is missing — so an even safer fix is to unset that secret until you're ready to spend on translations, and the workflow already handles missing-key gracefully per its own step comment).

4. **Verify post-deploy.** Re-run this exact smoke test once the next `Deploy to Netlify` workflow succeeds. Expect A/B/C/D to flip to PASS; E remains 404 until backfill credits land.

---

## Evidence files

- Run logs: `gh run view 26182418763 --log-failed`
- HTTP captures: `/tmp/{es,pt,de}-{internet,retirement}.html` (each 3,449 bytes = standard Netlify 404 body)
- News parse: `/tmp/data-light.js` (156 KB), news[] array contains 18 items, all from the pre-commit-D demo set
