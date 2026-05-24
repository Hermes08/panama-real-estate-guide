# Site copy + page audit: panamarealestateguide.com

Date: 2026-05-19
Auditor: David Aguirre / Claude via Four Systems
Method: Firecrawl scrapes of rendered React HTML on 5 representative pages (homepage, sample English project page, sample Spanish project page, sample article, articles index) + cross-check against `context/brand-guidelines.md`, `context/tone-of-voice.md`, `context/audience.md`, `context/services.md`.

## Top-level verdict

**The site is editorially strong in places (Pedasí Rising article, homepage hero) and structurally fragile in others (no `/projects/` index, no About page, two parallel project inventories under `/projects/` vs `/proyectos/`).** The voice when it shows up is the editorial market-analyst posture the brand wants. The damage is from placeholders that were never replaced, LLM scaffolding that leaked into production copy, and a Spanish-language site running parallel to the English site with different inventory.

Triage in three lanes:
1. **9 critical fixes** that hurt the brand on every pageview (must ship this week).
2. **8 brand-voice violations** that drift from the editorial positioning (fix in the next sprint).
3. **6 structural issues** around navigation and IA (require design + dev decisions, plan separately).

---

## Lane 1: Critical fixes (ship this week)

### 1. "The dek" placeholder visible on homepage hero
Right after the headline "Two oceans. _One country_ worth owning." the homepage literally renders the word "The dek" in the slot reserved for the subheadline (a journalism term meaning the subhead; it is editorial scaffolding, not customer copy). Replace with a real subheadline. Suggested: "A boutique advisory representing Panama's best developer-direct projects to international buyers since 2016."

### 2. LLM-prompt residue in editor's pick #5
The fifth editor's pick (`panama-real-estate-market-2026`) renders this excerpt:
> "specified above 6. 3 social hooks (one for X/Twitter, one for LinkedIn, one for Instagram caption) repurposed..."

That is LLM scaffolding that leaked into the live site. **PR #61 already fixes the data.js excerpt for this article.** Verify after merge that the homepage editor's pick card re-renders cleanly.

### 3. og:author tag is "Hermes Trismegistus" on every page
Confirmed on homepage AND on `/proyectos/euphoria-art-district.html`. Hermes Trismegistus is the alchemist / mythological figure; it appears to be leftover scaffolding from the original site template or a Calendly default that bled into og tags. Replace site-wide with "David Aguirre". The same name shows up as the **Calendly meeting host** ("30 Minute Meeting with Hermes Trismegistus"), which is a direct credibility killer when a USD $500k+ buyer lands on the booking widget. Update the Calendly account display name to "David Aguirre" or "Panama Real Estate Guide".

### 4. Euphoria Art District uses Cavarossa's hero image
`/proyectos/euphoria-art-district.html` renders `airtable-assets/cavarossa-amador/00.jpg` as its hero. Either the project page never got its own assets uploaded, or the Airtable mapping points to the wrong record. Fix the image source. Same likely true for the other `/proyectos/*` pages (Sanctuary Residences, Casa Korsi, Buenaventura Ritz-Carlton). Audit each.

### 5. Two different WhatsApp numbers on the site
- Homepage footer + header: **+507 6253-4802**
- Cavarossa project page + Pedasí article reservation strip: **+507 6761-0315**

Pick one canonical number (or label which is which: "general reservations" vs "project hotline"). Same number everywhere is the default.

### 6. `/proyectos/*` pages set `robots: noindex`
The Spanish parallel inventory (Euphoria, Sanctuary, Casa Korsi, Buenaventura Ritz, etc.) ships with `<meta name="robots" content="noindex">`. If these are paid landing pages where you control traffic, fine. If they are organic-search targets in Spanish, this is a self-inflicted SEO wound. Decide: paid-only (keep noindex) or organic-indexable (remove). The pages have rich, conversion-grade copy with specific yield numbers, so they would rank well if indexed.

### 7. `/projects/` returns 404
There is no project listing page at the canonical English URL. The homepage anchors `#projects` instead. That works for site visitors but breaks for: external links from articles or social posts that point to `panamarealestateguide.com/projects/`, sitemap crawlers, and anyone who manually types the URL. Add a real `/projects/index.html` that mirrors the homepage anchor section. Same for `/projects/` in Spanish if multilingual is the plan.

### 8. No `/about/` page
Multiple "About" links (header nav, footer "Company" column) all route to `#regions` (the coasts section). There is no actual About page with David Aguirre's bio, Jesbelyn Gutierrez's bio, the "$10M+ transacted" credential, the buyer's-agency positioning, or the "since 2016" history beyond a one-line footer claim. This is the single biggest credibility gap: a USD $300k+ buyer doing diligence cannot answer "who am I about to wire money to" from this site.

Build a real `/about/` page. Include: founder bio with credentials, Jesbelyn's role, the buyer's-agency vs dual-agency distinction (this is your differentiator, lead with it), the Delaware C-Corp + Panama liaison structure, what "since 2016" looked like (key milestones), the language coverage, and a photo of David.

### 9. Cavarossa project page is thin
"About the project" body is one sentence ("Where Italian sea meets Panama's Pacific shore. Cavarossa is a sophisticated residential treasure on the Amador Causeway"). Amenities are listed in Spanish on an English page ("Vista Panorámica al Canal · Diseño Italiano · Amenidades de Resort · Ubicación Única"). For a featured project with reservations from $281k that is supposed to anchor the Pacific Coast collection, this needs real per-project depth: developer track record, delivery timeline, what the unit actually includes, what surrounds the building, how the Amador location specifically reads in 2026. Pedasí Rising shows what right looks like; Cavarossa is at 10% of that depth.

---

## Lane 2: Brand-voice violations (next sprint)

### 1. Em dashes throughout the homepage and project pages
Per `context/brand-guidelines.md`, em dashes are banned. The homepage rendered text contains roughly 10-15 em dashes in section connectors ("no individual owner resales, no back-door inventory — just new-construction", "Project milestones, infrastructure, regulatory updates and press mentions — short and timestamped", "Most-read, most-cited, most-actionable — hand-picked for buyers..."). Replace with colons, commas, parentheses, or split sentences. Same pattern on project page hero subtitles.

### 2. Title-tag em dashes
Every article and project page title ends with "— PanamaRealEstateGuide.com" using an em dash. Per brand-guidelines, use a colon, hyphen, or pipe ("`Cavarossa | PanamaRealEstateGuide.com`" or "`Cavarossa: PanamaRealEstateGuide.com`"). This is in the `inject-article-meta.mjs` template, so a one-line script change fixes it for all 81 articles + 13 projects at once.

### 3. Bare $ amounts without USD prefix on project cards
Every project card on the homepage shows "From $1,030,000", "From $245,000", "From $5,000". Per brand-guidelines (currency conventions), USD prefix is required on first reference because the multilingual audience disambiguates against CO$ MX$ ARS$. Update the project-card component to emit "USD $1,030,000".

### 4. Spanish copy on English pages
Cavarossa's amenities list is in Spanish on the English-language version of the page. Either the page is supposed to be Spanish (in which case the URL should be `/proyectos/cavarossa-amador.html`), or the amenities need English translations. The `/proyectos/*` parallel inventory complicates this. Decision needed: are Spanish-only project pages a feature (different inventory for Spanish-speaking LATAM buyers) or a bug?

### 5. Spelling: "PanamaRealEstateGuide.com" vs "panamarealestateguide.com" vs "Panama Real Estate Guide"
The brand-guidelines names all three as acceptable in different contexts but inconsistent within the site:
- Header uses `PanamaRealEstateGuide.com` (camel)
- Footer uses `PanamaRealEstateGuide.com` (camel)
- Several article disclosures use `panamarealestateguide.com` (lowercase, prose-friendly)
- Title tags use `PanamaRealEstateGuide.com`

Pick the convention per context (camel in display, lowercase in prose, three-words-capitalized when "Panama Real Estate Guide" reads as a brand name in a sentence), and lint for it.

### 6. "International Living" mentioned on homepage news
The news strip surfaces: "Panama ranked #2 retirement destination in Latin America (International Living)". Per brand-guidelines, "International Living" is on the never-mention competitor list. The press mention is technically the right context (you are citing them as a source of a ranking), so this is an edge case. Recommendation: keep the news item but rephrase as "Panama ranked #2 retirement destination in Latin America (major expat-publisher ranking)" if you want strict adherence to the rule, or accept the exception when crediting a third-party ranking we did not author.

### 7. "Browse 24 projects" but homepage shows 12 cards
The hero counter says "24 Developer Projects" and "Browse 24 projects" but the rendered homepage shows 12 project cards plus the hero project (Empire Residences). If the 24 includes the `/proyectos/*` parallel inventory, that should be explicit. Otherwise the count is inflated. Either show all 24 (paginate or expand-on-click) or change the counter to match what is visible.

### 8. Generic FAQ copy
"Why only developer projects, no resales?" answer reads well; the other three FAQ questions ("How does a reservation work?", "Can I reserve remotely?", "What languages do you work in?") render only the question, not the answer (likely a UI accordion issue that is collapsed by default and the scrape did not expand). Verify all four FAQ items have answer copy populated and the accordion expands cleanly.

---

## Lane 3: Structural issues (plan separately)

### 1. Anchor-based navigation hides depth
Nav links: Projects → `#projects`, Regions → `#regions`, About → `#regions`. These are all single-page anchors. For SEO and shareability, deep linkable pages would help (one URL per region with editorial, one URL per content collection). The homepage as the everything-canvas is a stylistic choice but limits indexable surface area.

### 2. Two parallel project inventories: `/projects/*` vs `/proyectos/*`
The homepage features 13 English projects under `/projects/`. The footer "Featured projects" surfaces 4 Spanish-only projects under `/proyectos/` (Euphoria Art District, Sanctuary Residences, Casa Korsi Casco Antiguo, Buenaventura Ritz-Carlton Reserve) that do not appear anywhere else and are not in the main inventory data. These pages have richer copy and stronger lead-gen forms than the English project pages. Decide: are they (a) Spanish-language localizations of the main inventory, (b) entirely separate inventory targeting Spanish-speaking LATAM buyers, or (c) legacy/test pages to be retired? Right now they exist in parallel with no clear relationship.

### 3. `/articles/` requires `/articles/index.html` (trailing-slash inconsistency)
The header link works (`/articles/`) but Firecrawl could not resolve it cleanly; "Browse all 81" goes to `/articles/index.html`. Verify the Netlify redirect rules emit a clean trailing-slash → index.html so both URLs work. This is part of the `pretty_urls` Netlify config (memory says this gotcha bites if mishandled).

### 4. Footer "Journal" categories use query strings
Footer links: `/articles/?category=Market+Report`, `?category=Residency`, `?category=Taxes`, `?category=Neighborhood`. Query-string-based category filtering works for site visitors but is harder for Google to index as distinct topic pages. For SEO, dedicated category pages (`/articles/market-reports/`, `/articles/residency/`, etc.) earn topical authority better.

### 5. No `/contact/` page
"Contact" link in the footer goes to `#reserve` (the reservation anchor). For users who want to email a question without committing to a reservation, there is no dedicated contact surface. Add `/contact/` with: email, WhatsApp, Calendly link, mailing address, and the Panama liaison office address. Also gives a clean URL for footer + email signatures.

### 6. The Calendly meeting host is "Hermes Trismegistus"
(Cross-cut with critical fix #3.) The Calendly embed shows "30 Minute Meeting with Hermes Trismegistus" as the meeting title visible to bookers. Update the Calendly account profile name immediately.

---

## What is working really well (preserve)

### The Pedasí Rising article is editorial gold standard
This piece (`/articles/pedasi-rising.html`) is exactly the voice and depth the brand-guidelines describe:
- Lead with the specific surprising fact: "five hours from Panama City... in 2026 that drive is under four hours"
- First-person reporting: "We spent four days in Pedasí in March, walking the coast"
- Specific named entities: "Tourism Minister Iván Eskildsen", "Copa Airlines formalized a year-round seasonal route"
- Numbers everywhere: "fishing town of 3,000... two direct weekly flights... four resort-grade projects"
- One defensible opinion: "It feels, to our reporter's eye, like Costa Rica's Nosara did in 2004. It is a moment that will not last"
- Embedded data viz (the price-per-m² chart)
- Author bylined with credentials: "Jesbelyn Gutierrez, Senior market analyst, PanamaRealEstateGuide.com. Bilingual legal research on Panamanian residency and tax."

Every new article (and every refresh in the producer queue) should be benchmarked against this piece. **Use it as the producer's gold-standard exemplar.** If the producer cannot match its specificity and reporting depth, the draft is not ready.

### Homepage hero positioning
The first viewport is editorially strong: "Two oceans. One country worth owning. The definitive registry of developer-direct new construction... No resales. No mystery owners. Refundable reservations from $5,000." That copy plus the "Vol. VII · 2026 / 8°58′N · 79°32′W / The Isthmus Quarterly" editorial framing builds the journal positioning credibly within the first second of viewing.

### Reservation positioning
"Reserve from $5,000... Walk it on week two... A refundable reservation deposit holds a specific unit for 30 days. Funds go to the developer's escrow, never to us." This is exactly the kind of trust-building specificity the brand-guidelines call for. "Funds go to the developer's escrow, never to us" is the buyer-agency moat made concrete. Preserve and lean into this language across all entry points.

### Corporate disclosure
"© 2026 PanamaRealEstateGuide.com · Operated by Top Deals Investments Inc. (Delaware C-Corp), Wilmington DE · Liaison office Panama City, Oceania Business Plaza T-2000" is solid trust copy. Most Panama-real-estate sites have no corporate footing visible. Keep.

### Multilingual switcher is present
EN ES PT DE labels visible in the footer. Whether all four actually resolve to full translations is a separate test (memory notes the canonical lowercase Netlify gotcha), but the framing is correct for the audience.

---

## Top 10 highest-impact fixes (ranked by ROI)

| Rank | Fix | Why high impact | Effort |
|---|---|---|---|
| 1 | Replace "The dek" with real subheadline on homepage | Homepage hero embarrassment, ~5K monthly views | 5 min |
| 2 | Change Calendly host name from "Hermes Trismegistus" to "David Aguirre" | Every consultation booking sees this; kills credibility | 2 min |
| 3 | Fix og:author site-wide ("Hermes Trismegistus" → "David Aguirre") | Schema, social shares, every page | 10 min (template edit) |
| 4 | Build a real `/about/` page | Single biggest trust gap; USD $300k+ buyers do due diligence | 1-2 days |
| 5 | Build a real `/projects/` index page | 404 today; breaks external links + sitemap | 2-4 hours |
| 6 | Replace Cavarossa hero image on Euphoria Art District (and audit all `/proyectos/*` for asset mapping) | Looks broken on a USD $285k landing page | 1 hour |
| 7 | Consolidate two WhatsApp numbers into one canonical | Trust + reachability | 5 min decision + propagate |
| 8 | Update title-tag template: replace " — PanamaRealEstateGuide.com" with " | PanamaRealEstateGuide.com" | Brand-guideline compliance across 81+13 pages | 1 line in inject script |
| 9 | Decide: keep `/proyectos/*` noindex or open to organic search | Either reclaim ~thousands of monthly Spanish SEO impressions, or formalize as paid-landing-only | 1 hour decision + execution |
| 10 | Backfill Cavarossa-style project copy for all 13 main `/projects/*` | Currently thin; weakens the developer-direct positioning | 1-2 weeks (1 day per project) |

## Methodology and limits

- 5 pages sampled out of ~117 in sitemap: homepage, project page (Cavarossa), Spanish project (Euphoria), article (Pedasí Rising), articles index (failed; needed `/index.html`).
- All scrapes via Firecrawl with `waitFor: 5000` to let React render.
- Source-of-truth checks against the 8 files in `context/` plus the May 2026 GSC + Lighthouse data already collected in `state/`.
- Did NOT audit: per-language (`/es/`, `/pt/`, `/de/`), video pages (`/videos/*`), news individual items (only news index visible from homepage), Spanish article variants (`/articles/condos-panama-bajo-400k-colombianos.html` etc.).
- A full per-page audit of all 81 articles + 13 main projects + ~4 Spanish proyectos would take a separate dedicated cycle. The 9 critical fixes above are visible to every visitor; the lane 2 + lane 3 items require deeper page-by-page sampling.

## Disclosure

panamarealestateguide.com operates as a buyer's agency. We represent only the buyer in any property transaction we participate in. This audit was produced by Claude via the Four Systems framework, using GSC live data, DataForSEO Lighthouse audits, and Firecrawl scrapes of rendered HTML; all observations are based on what was publicly visible on the site as of 2026-05-19.
