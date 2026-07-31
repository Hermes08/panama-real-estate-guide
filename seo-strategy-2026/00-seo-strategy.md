# Panama Real Estate Guide — SEO Strategy

**Domain:** panamarealestateguide.com
**Prepared:** 31 July 2026
**Data window:** Google Search Console 1 Apr – 28 Jul 2026 (119 days); Semrush 30–31 Jul 2026 snapshot

### Data access — what was and wasn't available

| Source | Status | Effect on this document |
|---|---|---|
| Google Search Console | ✅ Full access (`https://panamarealestateguide.com/`) | All traffic, query, page, country and sitemap figures are measured |
| Semrush | ✅ Full access via browser | Keyword volumes, KD, CPC, backlink profile, SERP and competitor data are measured |
| Live site + repo | ✅ Full access | Technical findings are verified against real HTTP responses and source |
| **GA4** | ❌ **No property exists for this domain** | **No conversion, engagement, session or assisted-conversion data. Every "leads" figure below is unmeasured.** |
| **Backlink referring-page detail** | ⚠️ Semrush aggregate only | Disavow file requires a full export before action |
| **CRM / lead records** | ❌ Not provided | Lead quality and close rates are assumptions, flagged as such |
| **Server logs** | ❌ Not available (Netlify) | Crawl distribution inferred from index composition, not observed |

Throughout: **measured** = from GSC/Semrush/HTTP. **Assumption** = reasoning, labelled as such.

---

## 1. Executive summary

The site has 556 indexed URLs, publishes competently, has correct canonicals, hreflang and schema — and earns **32 clicks per 28 days**. Semrush reports organic traffic of **0** and Authority Score **2**.

Three findings explain almost all of that, and they are structural rather than editorial:

**1. The backlink profile is purchased and visibly so.** Semrush's anchor report contains the literal text *"fiverr helped {panamarealestateguide.com} rank #1 for over 50 targeted keywords effectively 📊"* and *"with fiverr's help, panamarealestateguide.com saw a sales increase of 200% in just two months 💰"*. 99% of the 103 referring domains sit at Authority Score 0–10; 78% are in Singapore; the 103 domains resolve to just 52 IPs across 48 subnets. Semrush's network graph flags the profile **Dangerous**. No amount of content will outrun this. It has to be disavowed first.

**2. Nearly three-quarters of the index is machine-translated duplicate content that competes with its own originals.** Of 556 sitemap URLs, **405 are `/es/`, `/de/` or `/pt/` copies**. They earned 30 clicks in 119 days between them, roughly a quarter of a click per day. Worse, they cannibalise: Semrush shows the *German* page ranking for the English query "retire in panama vs costa rica" at position 88, and the `/es/` and English versions of the same article both ranking for "internet panama" (positions 86 and 69). Meanwhile Spanish buying demand barely exists — the entire `comprar apartamento en panama` cluster in Semrush's Panama database is **32 keywords totalling 190 monthly searches**, against **695,710** for the English `panama real estate` universe.

**3. The pages rank 50–90 for keywords with difficulty scores of 0–15.** All 40 of the site's US keywords sit between positions 49 and 96. But "best places to retire in panama" is KD 3. "real estate coronado panama" is KD 1. "homes for sale in the republic of panama" is KD 0. "pros and cons of retiring in panama" is KD 5. The site is not losing to strong competitors — the top-10 for the head term "panama real estate" is held by domains at Authority Score 12, 18, 24, 28 and 35. It is losing because the pages are not good enough to beat weak pages.

**The opportunity is unusually good.** A 695K/month keyword universe at average KD 17%, contested by brokers with AS under 35, where the highest-CPC term found (`retirement homes in panama central america`, $2.15) has a difficulty of 2 and the site already ranks 55th for it. What is missing is trustworthy, first-hand, well-sourced content on a clean domain — which is exactly what a guide site can build and a listings broker cannot.

**One dependency dominates everything.** A v2 Next.js rebuild exists on the `v2-redesign` branch and it changes **every URL** (`/articles/*.html` → `/[category]/[slug]`), with **no redirect map, no sitemap, no robots.txt and essentially no structured data**. It also contains **1 article** against v1's 85. Launched as-is, it would discard the small foothold the site has.

Note the distinction, because it is easy to conflate: **merging the branch to `main` is safe and changes nothing in production** (`netlify.toml` publishes `project/`, the v1 static directory, and the branch does not touch it). **Cutting over** is the gated act. See [12-v2-migration-plan.md](12-v2-migration-plan.md) for the gate, which is 14 URLs holding page-1 positions rather than the full 30 that earn any traffic at all.

---

## 2. Baseline performance report

### 2.1 Search Console — measured

**Last 28 days (3–31 Jul 2026):** 32 clicks · 5,170 impressions · **0.62% CTR** · average position 16.1

A 0.62% CTR at average position 16 is the signature of ranking on page 2 for terms the page doesn't deserve. Impressions are volatile (8 to 685 per day), consistent with a site being repeatedly re-evaluated rather than holding stable positions.

**119-day totals by page section:**

| Section | URLs in sitemap | Share of index | Clicks (119d) |
|---|---|---|---|
| English `/articles/` | 84 | 15% | ~44 |
| English `/news/` | 33 | 6% | 3 |
| English `/projects/` | 13 | 2% | 0 |
| English `/videos/` | 16 | 3% | 1 |
| Hubs + home | 7 | 1% | 1 |
| **`/es/`, `/de/`, `/pt/`** | **405** | **73%** | **30** |
| **Total** | **556** | | **~79** |

**Top pages by impressions (119d):**

| Page | Clicks | Impressions | CTR | Avg pos |
|---|---|---|---|---|
| `/articles/internet-providers-panama-expats.html` | 3 | 3,534 | 0.08% | 8.2 |
| `/articles/moving-to-panama-with-pets.html` | 1 | 1,824 | 0.05% | 7.9 |
| `/articles/panama-retirement-communities.html` | 4 | 1,583 | 0.25% | 54.2 |
| `/articles/atm-cash-panama-guide.html` | 8 | 762 | 1.05% | 7.7 |
| `/articles/best-neighborhoods-panama-city-expats.html` | 0 | 729 | 0% | 37.7 |
| `/articles/panama-real-estate-market-2026.html` | 0 | 691 | 0% | 10.7 |
| `/articles/boquete-panama-real-estate.html` | 6 | 593 | 1.01% | 7.3 |

Two pages earn 5,358 impressions at average position 8 and convert 4 clicks between them. That is a **title and snippet failure**, not a ranking failure — and it is the cheapest fix available.

**By country (119d):** USA 21 clicks / 10,543 impr · Panama 15 / 1,479 · Brazil 6 / 507 · Germany 6 / 1,058 · Canada 4 / 808 · Colombia 3 · Spain 3 · Portugal 3.

Canada matters more than it looks: Semrush shows "panama real estate" at 1,000 monthly searches in Canada against 3,600 in the US — a 28% uplift most competitors ignore.

### 2.2 Semrush — measured

| Metric | Value |
|---|---|
| Authority Score | **2** ("lacks organic traffic") |
| Organic traffic | **0** |
| Organic keywords | 62 (−8.8%) |
| US keywords | 40 — **all ranked between position 49 and 96** |
| Referring domains | 103 (99% at AS 0–10) |
| Backlinks | 222 |
| ChatGPT cited pages | 139, but AI visibility 0 and mentions 0 |

The AI-search row is interesting: 139 pages are *cited* by ChatGPT while generating **zero** mentions or visibility. The content is being ingested but never surfaced as a recommendation — consistent with content that is topically present but not authoritative.

### 2.3 Content decay, cannibalisation, thin content, index bloat

- **Cannibalisation, cross-language (severe).** `/de/articles/panama-vs-costa-rica-retirement.html` ranks position 88 for the *English* query "retire in panama vs costa rica" (KD 4). `/es/articles/internet-providers-panama-expats.html` ranks 86 and the English original 69 for the same query "internet panama". Two of the site's own pages are splitting the same signal.
- **Cannibalisation, same-language.** `/articles/best-neighborhoods-panama-city-expats.html` ranks for nine overlapping "best places to live" variants while `/articles/10-best-places-to-live-in-panama-2026.html` targets the same intent. Four separate pages target Panama investment (`panama-real-estate-investments`, `panama-investment-opportunities`, `panama-real-estate-investment-lifestyle-2026`, `panama-real-estate-beachfront-retirement`).
- **Duplicate URL forms.** `/articles/` and `/articles/index.html` both draw impressions; same for `/news/`. A `/proyectos/` path duplicates `/projects/`.
- **Thin content.** All 13 project pages have zero clicks. `/articles/rental-yields.html` has 1 impression. 16 `/videos/` URLs are YouTube wrappers.
- **Index bloat.** 405 of 556 URLs (73%) should not exist. Note that at this scale the problem is **quality dilution and cannibalisation, not crawl budget** — crawl budget becomes a real constraint on sites orders of magnitude larger than this one, and Google crawls 556 URLs comfortably.
- **Nationality-slice pages** (`panama-para-argentinos`, `panama-para-peruanos`, `condos-panama-bajo-400k-colombianos`, etc.) draw 4–38 impressions each.

### 2.4 Topical authority — current state

Semrush places the site's ranking topics almost entirely in *lifestyle and practicalities* (SIM cards, food, internet, ATMs, pets, weather) rather than *property transactions*. The pages that do rank best — `atm-cash-panama-guide`, `internet-providers`, `moving-to-panama-with-pets` — are the ones furthest from a real estate lead. **The site has accidentally built expat-utility authority instead of property-buying authority.** That inversion is the central content problem.

---

## 3. Competitor and content-gap analysis

Semrush returned **no organic competitors** for the domain — it is too small to be matched. Competitors below were derived from `casasolution.com`'s competitive set (the #1 result for "panama real estate") and from live SERP analysis.

### 3.1 The competitive set — measured

**Content/authority publishers (the real threat):**

| Domain | Keywords | Traffic | What they own |
|---|---|---|---|
| internationalliving.com | 50.8K | **182.9K** | The retire-overseas category outright |
| liveandinvestoverseas.com | 14.9K | 37.3K | Retirement + investment overlap |
| findawayabroad.com | 9.3K | 18.3K | Relocation logistics |
| escapeartist.com | 6.6K | 7.2K | Expat + property hybrid; ranks #6 for the head term |
| ideal-living.com | 11.3K | 3.6K | Retirement communities |

**Panama property specialists:**

| Domain | AS | Keywords | Traffic | Note |
|---|---|---|---|---|
| encuentra24.com | — | 45.1K | **55.9K** | Panama's classifieds giant; owns listing intent |
| viviun.com | — | 24.1K | 10.0K | International listings aggregator |
| **panamarelocationtours.com** | — | 2.5K | **10.4K** | **Highest traffic-per-keyword in the set — the closest model to this business** |
| panamasovereign.com | 18 | 3.0K | 9.9K | #2 for the head term at AS 18 |
| casasolution.com | 24 | 3.3K | 8.7K | **#1 for the head term at AS 24** |
| panamahomerealty.com | — | 1.7K | 6.7K | |
| panamaequity.com | 28 | 3.3K | 4.6K | #5 for the head term |
| choosepanama.com | — | 3.7K | 1.6K | |
| retireinpanamatours.com | — | 2.3K | 1.5K | Tour-to-lead model |
| bocasdeltoropanamaproperties.com | 12 | 603 | 2.2K | **Ranks #4 for the head term at AS 12** |

**The strategic read:** the head term "panama real estate" is held at positions 1, 2, 4, 5 by domains with Authority Score 24, 18, 12 and 28. This is a *weak* SERP. A clean domain with genuinely better content can enter it. Compare that to trying to beat internationalliving.com at "retire overseas" — which is not the fight to pick.

`panamarelocationtours.com` deserves study: 10.4K traffic from only 2.5K keywords means it ranks well for high-value terms and converts them into tours. That is the lead-gen shape this site should copy, substituting consultations for tours.

### 3.2 Content gaps competitors leave open — the differentiation thesis

Every Panama competitor is a broker with an incentive to sell. That creates specific, exploitable blind spots:

1. **Titled land vs Rights of Possession (ROP).** The single most expensive mistake foreign buyers make in Panama. Brokers explain it vaguely because it kills deals. *Nobody ranks a definitive guide.* This should be the site's flagship asset.
2. **Honest drawbacks.** "retiring in panama dangers" — 260 searches, KD 11, **CPC $0.92**. "pros and cons of retiring in panama" — KD 5. "retiring in panama pros and cons" — KD 12. Brokers cannot write these credibly. A guide site can, and it is the fastest route to trust.
3. **Real closing costs with sourced rates.** Competitors publish ranges. Nobody publishes a calculator with each rate cited to the Dirección General de Ingresos and dated.
4. **Actual transaction data.** No competitor publishes a Panama price index. This is the linkable asset the domain needs to replace its toxic backlinks with real ones.
5. **Disambiguated geography.** "real estate in panama central america" (590, KD 15) and "homes for sale in the republic of panama" (320, **KD 0**) exist *because* Google confuses Panama with Panama City, Florida — Zillow's Florida page ranks #7 for the head term. These are free.

---

## 4. Keyword universe

Full spreadsheet: **`04-keyword-universe.csv`** (125 keywords with intent, volume, KD, CPC, cluster, funnel stage, target URL and priority).

### Universe sizing — measured

| Seed | Keywords | Total volume | Avg KD |
|---|---|---|---|
| `panama real estate` | 55,157 | 695,710 | 17% |
| `retire in panama` | 54,437 | 714,450 | 23% |
| `comprar apartamento en panama` (Panama DB) | **32** | **190** | 12% |

The third row is the multilingual decision, made with data rather than opinion.

### Highest-value targets

**Free or near-free wins (KD 0–5, already ranking 55–90):**

| Keyword | Vol | KD | CPC | Current |
|---|---|---|---|---|
| retirement homes in panama central america | 50 | 2 | **$2.15** | pos 55 |
| best places to retire in panama | 170 | 3 | $0.31 | — |
| real estate coronado panama | 260 | **1** | $0.18 | — |
| coronado panama homes for sale | 210 | **0** | $0.18 | — |
| homes for sale in the republic of panama | 320 | **0** | $0.25 | — |
| pros and cons of retiring in panama | 110 | 5 | $0.39 | — |
| retire in panama vs costa rica | 70 | 4 | $0.45 | pos 88 (German page) |
| costa del este panama real estate | 110 | 2 | $0.38 | — |
| best place to live in panama for expats | 110 | 3 | $0.28 | pos 67 |
| living in panama pros and cons | 70 | 1 | $0.21 | — |

**Volume anchors (KD 12–31):** `panama real estate` 3,600/KD 31 · `living in panama` 1,300/KD 20 · `panama homes for sale` 1,300/KD 23 · `rent apartment in panama city` 1,300/KD 30 · `retiring in panama central america` 1,000/KD 20 · `retire in panama` 880/KD 24 · `panama retirement visa` 880/KD 26 · `retiring in panama` 720/KD 12.

**Note on CPC:** this vertical's CPCs are low ($0.18–$0.60) because advertisers bid on listings, not guides. **CPC is a poor proxy for value here** — a single Panama property lead is worth thousands in commission. Prioritise by intent and lead quality, not CPC. The exceptions worth noting are `retirement homes in panama central america` ($2.15), `international living panama` ($1.61) and `panama real estate agents` ($1.14).

### Language and geography

- **English is the strategy.** US primary; **Canada is a genuine secondary market** (1,000/mo for the head term vs 3,600 US) currently unserved.
- **Spanish: defer.** 190 total monthly volume in the buying cluster does not justify a locale tree. If Spanish is revived later, do it as a small hand-written set aimed at Colombian/Venezuelan investor demand — never a full mirror.
- **German and Portuguese: stop.** 270 URLs producing single-digit clicks while cannibalising English rankings.

---

## 5. Pillar-and-cluster architecture

Full page-level table: **`06-pillar-cluster-map.csv`** (37 pages with primary/secondary keywords, intent, funnel stage, parent, URL, format, internal links, conversion opportunity, E-E-A-T requirement, disposition and publish wave).

### Hierarchy

```
HOME — "Buying property in Panama, explained honestly"
│
├── PILLAR 1  /buying-property-in-panama/            [panama real estate — 3,600]
│   ├── /process/                                    the transaction, step by step
│   ├── /closing-costs/                              + calculator
│   ├── /foreign-ownership/                          can foreigners buy
│   ├── /titled-vs-rop/                          ★   THE differentiator asset
│   ├── /property-tax/                               rates, 20-year exoneration
│   └── /financing/                                  mortgages for foreigners
│
├── PILLAR 2  /retire-in-panama/                     [retire in panama — 880]
│   ├── /drawbacks/                              ★   "retiring in panama dangers" KD 11
│   ├── /best-places/                                KD 3
│   └── /retirement-communities/                     CPC $2.15, KD 2
│
├── PILLAR 3  /residency/                            [panama residency visa]
│   ├── /pensionado-visa/                            880/mo
│   └── /friendly-nations-visa/
│
├── PILLAR 4  /living-in-panama/                     [living in panama — 1,300]
│   ├── /best-places-to-live/                        KD 8, currently pos 78
│   ├── /expat-communities/                          KD 6, currently pos 69
│   ├── /healthcare/  /safety/  /banking/
│
├── PILLAR 5  /moving-to-panama/
│   └── /pets/                                       1,824 impressions already
│
├── /cost-of-living-in-panama/                       cross-pillar hub
│
├── AREA HUBS   /areas/{panama-city, coronado, boquete, costa-del-este,
│                      bocas-del-toro, pedasi, punta-pacifica, santa-maria}
│
├── PROJECTS    /projects/{slug}          ← primary lead surface (13 pages)
│
├── COMPARISONS /compare/{panama-vs-costa-rica, -mexico, -colombia, -belize, -portugal}
│
├── RESEARCH ★  /research/price-index/    ← the linkable asset
│               /research/rental-yields/
│
└── TOOLS       /tools/closing-cost-calculator/
                /tools/residency-quiz/
```

★ = differentiation assets competitors structurally cannot copy.

### How this prevents cannibalisation

- **One intent, one URL.** Every "best places to live / retire" variant resolves to exactly two pages — one under Living (lifestyle intent), one under Retirement (retiree intent) — with explicit cross-links declaring the difference.
- **Areas own location intent; pillars own topic intent.** `/areas/boquete/` targets "boquete panama real estate"; `/buying-property-in-panama/` never targets a place name.
- **Projects own brand intent only.** A project page targets the development's name, never a category term.
- **The four investment pages collapse into one**, linked from both the buying pillar and the research assets.

---

## 6. Internal-linking blueprint

**Rules:**

1. **Every pillar links down to all its cluster children**, from an in-body section — not just a sidebar.
2. **Every cluster page links up to its pillar** in the first 150 words, with the pillar's primary keyword as anchor.
3. **Cluster siblings link laterally** only where the intent genuinely continues (closing costs ↔ property tax; drawbacks ↔ safety).
4. **Area hubs are the crossroads.** Each links up to Buying, across to Retirement and Living, and down to every project in that area. Every project links back to its area hub.
5. **Research assets link into every pillar and area hub, and receive links from all of them.** This is what makes them rank and what makes earned links flow into the rest of the site.
6. **Tools are linked from the decision point**, not the nav — the closing-cost calculator belongs inside the closing-costs guide and every area hub.
7. **Maximum click depth 3** from the homepage for any Keep/Improve URL.
8. **Anchor text is descriptive and varied.** Never "click here"; never the exact same anchor site-wide.

**Sequencing safeguard:** build the new internal-link graph *before* removing the old links during consolidation (see T-15). Consolidating 57 URLs and deleting 405 will strip a large share of existing internal links; orphans created in that window are the main avoidable risk.

---

## 7. Content pruning plan

Full inventory: **`03-url-pruning-inventory.csv`** — all 556 URLs with action, evidence, reasoning, destination and priority.

| Action | URLs | Method | Rationale |
|---|---|---|---|
| **Remove** | 405 | `410 Gone` | Machine-translated duplicates |
| **Consolidate** | 57 | `301` | Confirmed cannibalisation and nationality-slice pages |
| **Improve** | 51 | rewrite in place | Ranking 49–96 for KD 0–31 keywords, the highest-return work |
| **Keep** | 26 | no change | Low signal but topically relevant; retained for authority and internal linking |
| **Noindex** | 17 | `noindex,follow` | Thin video wrappers that may return as real pages |

**No English page is deleted for lack of traffic alone**, per the brief. The 405 removals are all machine translations, and they are deleted on evidence rather than on traffic: Semrush's Top Pages report confirms **0 referring domains on every deep URL** (93 of the 103 referring domains point at the root), so there is no page-level link equity to preserve. The 30 clicks per 119 days they produce across 24 URLs is the entire cost.

**Why `410` and not `404` or `noindex`.** A 410 declares the removal deliberate and permanent, and Google drops those faster than 404s, which it retries for months assuming a mistake. `noindex` was the earlier recommendation on the theory that it preserves link flow; with zero page-level links that protects nothing, and it leaves 405 dead URLs to be crawled indefinitely. Source files stay in git, so the content is recoverable even though the URLs are not.

**Do not redirect the translations to their English equivalents.** The content genuinely differs, and mass redirects to loosely-related pages get treated as soft 404s, which is a worse outcome than a clean 410.

Consolidations 301 to a named destination, with unique passages merged into the destination first.

### Safeguards

- **Redirects:** every consolidation 301s to the destination named in the CSV. No chains beyond one hop. Old `.html` URLs are retained as redirect origins permanently.
- **Internal links:** rewrite links pointing at consolidated URLs to point at destinations *before* the redirects ship.
- **Sitemaps:** remove deleted, noindexed and redirected URLs. Never list a URL that returns anything other than a 200.
- **Canonicals:** every Keep/Improve URL self-canonicalises. Remove hreflang in the same deploy as the removal (T-16); leaving hreflang annotations pointing at 410'd URLs is a contradictory signal.
- **Traffic accepted as lost:** 24 translated URLs currently earn clicks, 30 in 119 days combined. These are removed with the rest. Keeping a handful of orphaned translations after deleting their 380 siblings leaves them with no hreflang cluster, no translated navigation and no sitemap siblings, which is messier than removing them cleanly.
- **Staging:** run the removal as its own change, roughly **two weeks clear of the v2 cutover and the disavow submission**. All three will move traffic; shipping them together makes it impossible to attribute the movement to any one of them. Order: translations → consolidations → video wrappers, a week apart, checking Search Console between each.

---

## 8. Editorial roadmap (6–12 months)

### Prioritisation score

`Priority = (Demand × Business value × Authority contribution) ÷ (Difficulty × Effort)`

| Factor | Scale | Weight |
|---|---|---|
| Demand | monthly volume, banded 1–5 | ×2 |
| Business value | distance to a property lead, 1–5 | ×3 |
| Authority contribution | does it anchor a pillar or earn links, 1–5 | ×2 |
| Difficulty | Semrush KD banded 1–5 | ÷2 |
| Effort | writing + field research days, 1–5 | ÷1 |

Business value is weighted highest deliberately. The site's current top pages (SIM cards, ATMs, internet) prove that optimising for traffic alone produces traffic that never becomes a lead.

### Wave 1 — Months 1–3: fix the foundation, win the free keywords

*Prerequisites: disavow submitted (T-01), translations removed (T-02), redirect map built (T-03).*

**Improve (existing pages, ranking 49–96 for KD 0–15):**
1. `/retire-in-panama/` — currently position 96
2. `/living-in-panama/best-places-to-live/` — position 78 for a KD 8 term
3. `/retire-in-panama/retirement-communities/` — position 55 for the $2.15 CPC term
4. `/areas/coronado/` — KD 0–6 across the whole cluster
5. `/areas/boquete/` — best page on the site (pos 7.3); deepen it
6. `/cost-of-living-in-panama/`
7. **Title/meta rewrite sprint** on `internet-providers` and `moving-to-panama-with-pets` — 5,358 impressions at position 8 converting 4 clicks

**Create:**
8. `/buying-property-in-panama/` — the pillar
9. `/buying-property-in-panama/titled-vs-rop/` ★
10. `/retire-in-panama/drawbacks/` ★
11. `/buying-property-in-panama/closing-costs/`
12. `/buying-property-in-panama/foreign-ownership/`
13. `/residency/` + `/residency/pensionado-visa/`
14. `/areas/panama-city/`, `/areas/costa-del-este/`

**Consolidate:** the four investment pages → one; the two "best places" pages → one; Boquete ×2 → one.

### Wave 2 — Months 4–6: depth and the linkable asset

15. **`/research/price-index/`** ★ — the quarterly Panama price index. This is the link-earning asset that replaces the disavowed profile.
16. `/tools/closing-cost-calculator/`
17. All 13 project pages rebuilt to template with verified pricing and site visits
18. `/buying-property-in-panama/property-tax/` and `/financing/`
19. `/living-in-panama/` pillar + `/healthcare/`, `/safety/`, `/banking/`
20. `/residency/friendly-nations-visa/`
21. `/moving-to-panama/` pillar
22. `/areas/bocas-del-toro/` — lead with the ROP warning

### Wave 3 — Months 7–12: coverage and compounding

23. `/research/rental-yields/` with named buildings and real net figures
24. `/tools/residency-quiz/`
25. Comparison series (Costa Rica, Mexico, Colombia, Belize, Portugal)
26. Remaining area hubs (Pedasí, Punta Pacífica, Santa María, Rio Hato)
27. `/living-in-panama/expat-communities/`
28. Quarterly refresh cycle begins on price index, cost of living, tax and visa pages

### What competitors cannot easily reproduce

| Asset | Why it's defensible |
|---|---|
| Quarterly Panama price index | Requires sustained data collection; no competitor has one |
| Titled vs ROP guide with two real title searches shown | Brokers won't publish it — it kills deals |
| Honest drawbacks / "why expats leave" | Structurally impossible for a seller to write credibly |
| Closing-cost calculator with every rate cited to DGI and dated | Requires primary-source discipline |
| Named-building rental yields with real cost assumptions | Requires actual transaction access |
| First-hand photography of every area and project | Requires being in Panama |
| Interviews with licensed Panamanian attorneys and brokers | Requires relationships |

---

## 9. E-E-A-T plan

The site's current author byline (`David Aguirre` in Article schema, linked only to the homepage) is not sufficient for a topic where Google applies Your-Money-or-Your-Life scrutiny. Property, tax, immigration and financial advice all fall inside YMYL.

**Experience (first-hand)**
- Every area hub and project page carries **original photography**, dated and geo-described. No stock.
- Publish an explicit "How we research" note: which areas the team has visited, when, and what was seen.
- The drawbacks and "why expats leave" content should quote named, real expats with permission.

**Expertise**
- **Author pages** at `/authors/{slug}` with: full name, photo, Panama residency status, years in-market, transaction experience, professional licences, and links to every article. Mark up with `Person` schema and reference from each article's `author`.
- **Named reviewers** for regulated topics: a Panamanian attorney for legal/residency, a CPA for tax, a licensed broker for valuation. Display "Legally reviewed by [Name], [Licence no.], [Date]".

**Authoritativeness**
- Replace the purchased backlink profile with earned links from the research assets. Target: Panamanian press, expat communities, relocation publications.
- `Organization` schema on the root with a real Panama address, phone, and registration details.
- Publish the ACOBIR / professional-body memberships if held.

**Trustworthiness**
- **Cite every legal, tax, immigration and market claim** to a primary institution — ANATI, Public Registry, Dirección General de Ingresos, Servicio Nacional de Migración, Superintendencia de Bancos, MINSA — with the **retrieval date** shown inline.
- **Visible publication and update dates** on every page, plus a changelog on figures-heavy pages.
- **Disclaimers**: "This is general information, not legal or tax advice" on regulated pages; a disclosure of any commercial relationship with developers whose projects are featured.
- **Editorial policy page** covering sourcing standards, correction process, review workflow, and how the site makes money.
- **Contact and company identity**: physical Panama address, WhatsApp, registered entity name.
- **Lead forms**: state exactly who receives the data, what happens next, and link the privacy policy adjacent to the submit button.

**Review workflow:** draft → fact-check pass (every figure traced to a source with a date) → professional review where regulated → publish with reviewer credit → scheduled re-review (quarterly for tax/visa/pricing, annually otherwise).

---

## 10. Technical SEO backlog

Full backlog with evidence, impact, effort, risk and validation: **`11-technical-seo-backlog.csv`** (17 items).

**P0 — blocking:**

| ID | Item |
|---|---|
| T-01 | Disavow the purchased backlink profile |
| T-02 | Remove (410) the 405 translated URLs |
| T-03 | **Build the v2 redirect map before launch** |
| T-04 | Add `app/sitemap.ts` and `app/robots.ts` to v2 (both missing) |
| T-12 | Create a GA4 property (none exists) |
| T-16 | Remove hreflang in the same deploy as T-02 |

**Notes on things not to do generically:**

- **v1 is already fast** — static HTML on Netlify with edge caching and etags. Do not prescribe caching or CDN work against it. The Core Web Vitals risk is the *v2 React rebuild regressing* a currently-fast site (T-14). Measure before and after cutover; don't optimise blind.
- **Schema is present and mostly correct on v1** — Article, BreadcrumbList, FAQPage, VideoObject. The problems are specific: a mismatched 3-second Spanish video marked up on an English article (T-07), and FAQPage that is valid Schema.org but **not eligible for Google rich results** since August 2023 (T-06). v2, by contrast, has almost none (T-05).
- **Only mark up what is visibly on the page.** For project pages, use `Residence` or `Product`/`Offer` only where price and availability are genuinely displayed. Inventing schema risks a structured-data manual action.

---

## 11. Lead generation

**No GA4 property exists, so there is currently no conversion measurement at all.** That is the first fix (T-12).

**CTAs mapped to funnel stage:**

| Stage | Content | CTA | Why |
|---|---|---|---|
| TOF | Living, retiring, cost of living, drawbacks | Newsletter / "Panama buyer's checklist" download | Asking for a call here kills trust, especially on the drawbacks page |
| MOF | Buying pillar, process, closing costs, area hubs | Closing-cost calculator → soft consultation offer | The calculator qualifies the lead by revealing budget |
| BOF | Project pages, retirement communities, residency quiz | Direct inquiry form + WhatsApp | Highest intent; shortest form |

**Form design:** three fields maximum at first contact (name, email, what you're looking for). Capture budget band, timeline and target area *after* first response, not before — long forms on a low-trust domain suppress volume without improving quality.

**Trust elements adjacent to every form:** reviewer credentials, a real Panama address and phone, the privacy statement, and an explicit "what happens next" line.

**Deliberately avoided:** interstitials, exit-intent overlays and scroll-triggered modals. They damage mobile usability, harm CLS, and on YMYL content actively undermine the trust the strategy depends on. Inline CTAs only.

**GA4 key events to define:** `consultation_submit`, `project_inquiry`, `checklist_download`, `newsletter_signup`, `whatsapp_click`, `calculator_complete`.

---

## 12. Measurement framework

**Monthly KPIs — lead quality first:**

| KPI | Source | Baseline (measured) | 6-month target |
|---|---|---|---|
| **Qualified organic leads** | GA4 + CRM | **unmeasured — no GA4** | Establish baseline M1, then grow |
| Lead-to-consultation rate | CRM | unmeasured | — |
| Organic clicks | GSC | 32 / 28d | 400 / 28d |
| Impressions | GSC | 5,170 / 28d | 25,000 / 28d |
| CTR | GSC | 0.62% | 2.5%+ |
| Average position | GSC | 16.1 | <10 |
| Keywords in top 10 | Semrush | **0** | 25 |
| US organic keywords | Semrush | 40 | 400 |
| Authority Score | Semrush | 2 | 15+ |
| Referring domains (genuine) | Semrush | ~5 of 103 | 40 |
| Indexed pages | GSC | 556 | ~134 |

The indexed-pages target going **down** is intentional and should be communicated to stakeholders before the pruning ships.

**Regression prevention:** monthly crawl comparing status codes and canonical tags against the previous month; Search Console alerts on indexing drops; quarterly backlink re-audit; a redirect-integrity test in the deploy pipeline.

---

## 13. 30 / 60 / 90-day plan

### Days 1–30 — stop the bleeding, start measuring
1. Export the full backlink list; classify; **submit the disavow file** (T-01)
2. **Create the GA4 property**, define key events, link Search Console (T-12)
3. Ship `410 Gone` on all 405 translated URLs + remove hreflang, one deploy (T-02, T-16). Run this at least two weeks clear of the disavow and the v2 cutover so the effect is attributable.
4. Update `sitemap.xml`; 301 the `index.html` and `/proyectos/` duplicates (T-08, T-10)
5. **Build and review the complete v1→v2 redirect map** (T-03) — blocks the rebuild
6. Title/meta rewrite on the two high-impression / zero-click pages
7. Publish author pages, editorial policy and disclaimers

### Days 31–60 — consolidate and publish the differentiators
8. Execute the 57 consolidations with redirects, after rewriting internal links (T-15)
9. Publish `/buying-property-in-panama/` pillar
10. Publish `/buying-property-in-panama/titled-vs-rop/` ★
11. Publish `/retire-in-panama/drawbacks/` ★
12. Rewrite `/retire-in-panama/` and `/living-in-panama/best-places-to-live/`
13. Rebuild `/areas/coronado/` and `/areas/boquete/`
14. Add `sitemap.ts`, `robots.ts`, canonicals and structured data to v2 (T-04, T-05, T-11)

### Days 61–90 — scale and launch safely
15. Publish `/residency/` + `/residency/pensionado-visa/`, `/closing-costs/`, `/foreign-ownership/`
16. Build `/areas/panama-city/` and `/areas/costa-del-este/`
17. Ship the closing-cost calculator with GA4 event tracking
18. **v2 cutover** — only if List A of the [migration plan](12-v2-migration-plan.md) is complete and the redirect map passes a full crawl test; capture v1 Core Web Vitals first (T-14). Merging the branch to `main` can happen at any time and is a no-op for production; cutting over is the gated act.
19. Begin price-index data collection
20. First backlink re-audit; begin outreach on the research assets

---

## 14. Ten highest-impact actions

1. **Disavow the purchased backlink profile.** Nothing else works until this does.
2. **Delete the 405 translated URLs (410).** Removes 73% index bloat and the cross-language cannibalisation. Verified safe: zero referring domains on every deep page.
3. **Build the v1→v2 redirect map before launch.** Prevents losing the entire foothold.
4. **Create a GA4 property.** Currently there is no way to know whether any of this produces leads.
5. **Rewrite the six pages ranking 49–96 for KD 0–15 keywords.** Highest return per hour on the site.
6. **Publish the titled-land vs ROP guide.** The differentiator no broker will write.
7. **Publish the honest drawbacks page.** KD 11, CPC $0.92, and the fastest trust-builder available.
8. **Build the buying pillar and area hubs.** Redirects topical authority from expat-utility to property.
9. **Launch the quarterly price index.** The only realistic path to replacing toxic links with earned ones.
10. **Put named, credentialled authors and reviewers on every YMYL page.**

## Quick wins (< 1 week each)

- Title and meta rewrite on `internet-providers` and `moving-to-panama-with-pets` — 5,358 impressions at position 8 currently converting 4 clicks
- 301 the `index.html` and `/proyectos/` duplicates
- Target `homes for sale in the republic of panama` (320 vol, **KD 0**) and `real estate in panama central america` (590, KD 15) — the geographic-disambiguation terms
- Add publication and update dates site-wide
- Remove the mismatched 3-second VideoObject schema
- Fix the Coronado cluster — KD 0–6 across the board

## Dependencies and risks

| Risk | Severity | Mitigation |
|---|---|---|
| v2 launches without redirects | **Critical** | Treat the redirect map as a hard launch gate |
| Over-disavowing removes genuine links | High | Two-person review of the keep/disavow list |
| Deleting translations loses the 30 clicks/119d they produce, irreversibly | Low | Accepted deliberately; source files retained in git so content is recoverable |
| Consolidation orphans pages | Medium | Rebuild internal links before removing old ones |
| v2 React build regresses Core Web Vitals vs fast static v1 | Medium | Capture v1 baseline; Lighthouse gate before cutover |
| Disavow recovery is slow (3–6 months) | Medium | Set expectations; content work proceeds in parallel |
| Lead quality unverifiable | High | Stand up GA4 + CRM tracking in month 1 |

## Who is needed

| Role | Work |
|---|---|
| **SEO specialist** | Disavow classification, pruning execution, redirect QA, GA4 setup, monitoring |
| **Developer** | 410 rollout, redirects, v2 sitemap/robots/canonicals/schema, calculator, CWV |
| **Writer(s)** | ~30 new pages and ~50 rewrites across three waves |
| **Panama-based expert** | Field visits, photography, ROP research, transaction data, expat interviews |
| **Panamanian attorney** | Review of residency, ownership, titled-vs-ROP and closing content |
| **CPA / tax advisor** | Review of tax, exoneration and capital-gains content |
| **Designer** | Author pages, price-index data visualisation, calculator UI |
