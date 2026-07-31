# v1 → v2 Migration Plan

**Status:** specification only, not executed. Written 31 July 2026 for a later session.
**Related:** T-03, T-19, T-20, T-21 in [11-technical-seo-backlog.csv](11-technical-seo-backlog.csv). URL-level actions in [03-url-pruning-inventory.csv](03-url-pruning-inventory.csv).

---

## 0. The distinction that matters

**Merging `v2-redesign` into `main` is safe today and does not change the live site.**

`netlify.toml` sets `publish = "project"`, which is the v1 static directory. `git diff main...v2-redesign` shows the branch modifies neither `netlify.toml` nor `project/`. Merging is a no-op for production.

**Cutting over is a separate act** and means changing the publish target and build command in `netlify.toml`. That is what the gate below governs. Do not conflate the two.

---

## 1. Current state — measured 31 Jul 2026

**v2 Supabase:** 1 article (`titled-vs-rights-of-possession`, published), 15 areas, 31 projects (13 published).
**v1:** 85 English articles, 33 news items, 13 projects at `/projects/`, 4 more at `/proyectos/`.

Coverage of the 30 v1 URLs that earn search traffic (clicks > 0 or impressions ≥ 100):

| | Count |
|---|---|
| Covered by a live v2 equivalent | **0** |
| Drafted in v2 but unpublished | 0 |
| No v2 equivalent at all | **30** |

Re-run with `node v2/scripts/_coverage-check.mjs` from `v2/`.

---

## 2. Cutover gate

Traffic alone does not justify the migration: those 30 URLs produce roughly **11 clicks a month**. What justifies it is **page-1 position on property-relevant queries**, which is a much smaller set.

**Gate: all 14 URLs in list A (§4) must exist as published v2 content with a 301 in place.**

Lists B and C are not blocking. B is being rewritten anyway. C can 410 without meaningful loss if you'd rather not carry it.

---

## 3. Port cost — why this is a script, not a writing project

v1 article bodies are **already structured data** in `project/data.js` under `PANAMA_DATA.articleBodies`, keyed by article id. All 84 articles have a body. The block taxonomy is small and closed:

| Block | Shape |
|---|---|
| Paragraph | plain `string` |
| Heading | `{h}` |
| Pull quote | `{quote}` |
| Table | `{table}` |
| Chart | `{chart, caption, alt}` |

`PANAMA_DATA.articles` carries `id, category, title, excerpt, metaDescription, author, date, read, cover, faqs, lang`. The `faqs` shape is `{q, a}`, which **matches the v2 `articles.faqs` jsonb column directly** — no transformation needed.

Estimated effort: about a day for the mapper, versus roughly 30 article-rewrites if done by hand.

### Category mapping (19 v1 categories → 4 v2 categories)

| v1 category | Count | → v2 |
|---|---|---|
| Lifestyle & Daily Living | 19 | `living` |
| Moving to Panama (by Origin) | 15 | `living` |
| Real Estate by Location | 11 | **fold into `/areas/{slug}`, not an article** |
| Buying & Investment | 9 | `buying` |
| Cost of Living & Money | 6 | `money` |
| Panama vs. Other Destinations | 6 | `living` |
| Visa, Residency & Legal | 5 | `residency` |
| Renting in Panama | 2 | `living` |
| Market Report, Investment | 2 | `buying` |
| Economics, Taxes | 2 | `money` |
| Residency, Residency · US | 2 | `residency` |
| Neighborhood | 1 | fold into `/areas/{slug}` |
| Investment · CO / BR / MX, Residency · ES | 4 | **do not port** — marked Consolidate |

**Two mapping decisions worth stating explicitly:**

1. **"Real Estate by Location" articles do not become v2 articles.** v2 already has 15 area records, and the pillar architecture assigns location intent to `/areas/{slug}`. Merge each location article's content into its area hub and 301 the article URL to the area URL. This is why `/articles/boquete-panama-real-estate.html` maps to `/areas/boquete/` rather than `/buying/boquete-panama-real-estate/`.

2. **The nationality-slice articles are not ported.** `panama-para-*`, `comprar-imovel-*`, `condos-panama-bajo-400k-colombianos`, `espanoles-panama-*`, `panama-inversion-mexicanos-*`, `vivir-en-panama-venezolanos` are all marked Consolidate. Their distinct content (visa reciprocity, tax treaty specifics) merges into the residency pillar as sections.

---

## 4. List A — port as-is, 301, do not rewrite (BLOCKING)

These hold page-1 or near-page-1 positions that are worth inheriting through a redirect. Port the existing body verbatim. Improve them later, on the Wave 1/2 schedule, but not before cutover.

| v1 URL | Clicks | Impr | Avg pos | Pruning action |
|---|---|---|---|---|
| `/news/new-tax-incentive.html` | 0 | 154 | 6.1 | Keep |
| `/articles/bocas-del-toro-real-estate.html` | 0 | 100 | 6.3 | Improve |
| `/articles/start-business-panama-foreigners.html` | 0 | 240 | 7.1 | Improve |
| `/articles/boquete-panama-real-estate.html` | 6 | 593 | 7.3 | Improve |
| `/articles/real-cost-of-moving-to-panama.html` | 0 | 154 | 7.3 | Improve |
| `/articles/why-expats-leave-panama-2-years.html` | 1 | 33 | 7.4 | Improve |
| `/articles/apostille-documents-panama-visa.html` | 2 | 396 | 7.5 | Improve |
| `/articles/panama-cost-of-living-2026.html` | 0 | 212 | 7.9 | Improve |
| `/articles/panama-vs-belize-retirement.html` | 3 | 141 | 9.0 | Improve |
| `/articles/how-to-buy-property-in-panama-2026-guide.html` | 0 | 158 | 9.3 | Consolidate |
| `/articles/panama-property-buying-process-guide.html` | 3 | 324 | 9.3 | Improve |
| `/articles/sending-money-panama-wire-transfer.html` | 0 | 427 | 10.4 | Improve |
| `/articles/panama-real-estate-market-2026.html` | 0 | 691 | 10.7 | Improve |
| `/articles/apartments-for-rent-panama-city.html` | 1 | 239 | 12.8 | Improve |

Note two of these are Consolidate rather than standalone ports: `how-to-buy-property-in-panama-2026-guide` merges into `panama-property-buying-process-guide`, and both currently rank 9.3. Merge first, then 301 the loser.

`/articles/boquete-panama-real-estate.html` and `/articles/bocas-del-toro-real-estate.html` are the two "Real Estate by Location" entries here, so they fold into `/areas/boquete/` and `/areas/bocas-del-toro/` per §3.

---

## 5. List B — rewrite, do not port (NOT blocking)

Position 20 to 54. There is no ranking worth preserving, so porting the existing body just carries a bad page across. These are already on the Wave 1 rewrite list.

| v1 URL | Clicks | Impr | Avg pos | Pruning action |
|---|---|---|---|---|
| `/articles/panama-banking-non-residents-guide.html` | 3 | 436 | 20.1 | Improve |
| `/articles/10-best-places-to-live-in-panama-2026.html` | 1 | 94 | 22.6 | Consolidate |
| `/articles/panama-vs-costa-rica-retirement.html` | 0 | 110 | 25.8 | Improve |
| `/articles/best-neighborhoods-panama-city-expats.html` | 0 | 729 | 37.7 | Improve |
| `/articles/panama-investment-opportunities.html` | 0 | 159 | 50.3 | Consolidate |
| `/articles/panama-retirement-communities.html` | 4 | 1,583 | 54.2 | Improve |

`panama-retirement-communities` is the highest-value entry in this document: it targets `retirement homes in panama central america` at **CPC $2.15, KD 2**, and currently sits at position 54. Rewriting it is worth more than everything in List C combined.

---

## 6. List C — port mechanically, then invest nothing (NOT blocking)

Expat-utility content. **9 URLs producing 7,119 impressions and 21 clicks, more impressions than all 20 property URLs combined and close to zero lead value.** This is the topical inversion described in §2.4 of the strategy: the site's best-ranking pages are its least commercial.

| v1 URL | Clicks | Impr | Avg pos | Pruning action |
|---|---|---|---|---|
| `/articles/internet-providers-panama-expats.html` | 3 | 3,534 | 8.2 | Improve |
| `/articles/moving-to-panama-with-pets.html` | 1 | 1,824 | 7.9 | Improve |
| `/articles/atm-cash-panama-guide.html` | 8 | 762 | 7.7 | Improve |
| `/articles/panama-sim-card-guide.html` | 0 | 432 | 14.0 | Improve |
| `/articles/panama-weather-rainy-season-guide.html` | 1 | 288 | 6.2 | Improve |
| `/articles/best-beaches-panama-expats.html` | 3 | 199 | 15.0 | Improve |
| `/news/tocumen-terminal-2-expansion.html` | 3 | 41 | 7.7 | Keep |
| `/articles/panama-drivers-license-foreigners.html` | 1 | 36 | 11.2 | Improve |
| `/videos/1fc4mqwkapc.html` | 1 | 3 | 46.0 | Noindex |

**Decision:** port them, file under the `living` category (pets under Moving), give them no further human attention. Keeping them costs nothing, they are legitimate children of Pillar 4, and deleting them would not make the property pages rank better. Do not commission field research, photography or rewrites for this list.

The one genuine drop is `/videos/1fc4mqwkapc.html`, already in the noindex bucket.

**Exception worth taking:** `internet-providers` and `moving-to-panama-with-pets` carry 5,358 impressions at average position 8 and convert 4 clicks between them. A title and meta rewrite on those two is the cheapest win on the whole site and should happen on v1 now, independent of this migration.

---

## 7. Execution order

1. **Merge `v2-redesign` → `main`.** Safe now; no production effect. Confirm `netlify.toml` still reads `publish = "project"` after the merge.
2. **Resolve T-20 first.** The repo's `project/` is not byte-identical to production (live pages carry hreflang and 4 JSON-LD blocks the repo copies lack, and no build command is declared). Find where that injection happens before trusting any content deploy.
3. **Write the port script** (T-21): `project/data.js` → Supabase `articles`. Handle the 5 block types, map the 19 categories, carry `faqs` across unchanged.
4. **Port List A**, folding the two location articles into their area hubs.
5. **Port List C** mechanically.
6. **Build the redirect map** for all 151 English URLs (T-03), one hop maximum, old `.html` URLs retained as origins permanently.
7. **Re-run the coverage check.** Require zero gaps across List A.
8. **Capture v1 Core Web Vitals** as a baseline before cutover (T-14).
9. **Cut over**: change `publish` and add the build command in `netlify.toml`.
10. **Crawl the full old-URL list** and assert every URL returns a single 301 to a 200.
11. **Rewrite List B** on the Wave 1 schedule, after cutover.

**Sequencing constraint:** keep the cutover at least two weeks clear of the 410 rollout (T-02) and the disavow submission (T-01). All three move traffic, and shipping them together makes attribution impossible.

---

## 8. What is NOT part of this migration

- **The 405 locale URLs** (`/es/`, `/de/`, `/pt/`). Already handled by the 410 rules in `netlify.toml`. They ship against v1 and are independent of the rebuild.
- **`/proyectos/`.** Holds 4 distinct developments with zero slug overlap against `/projects/`. Do not wildcard-redirect it. See the corrected T-10.
- **The geo-route language banner** (T-18). Must be disabled in the same deploy as the 410 rules, not at cutover.
