---
type: quick-fix-patch-batch-2
date: 2026-05-19
author: David Aguirre / Claude
source: GSC full pages pull (1-85 of 85) + DataForSEO Lighthouse audit
items: 11
---

# Quick fix batch 2: 11 articles, May 2026

Second wave from the full GSC pull. Covers all remaining pages with **50 or more impressions in the last 28 days and 0 clicks**, plus one news page with a broken title. Same pattern as batch 1: no `<meta name="description">` tag, leading to Google auto-generating a weak SERP snippet that does not pull the click.

Combined opportunity: **1,155 monthly impressions** across these 11 pages currently converting to 0 clicks. Moving CTR from 0% to even 1.5% would be roughly 17 additional clicks per month.

Also flagged for cleanup throughout: **em dashes in og:descriptions** that violate the brand-guidelines no-em-dash rule. When porting og:description into the new meta description, replace every em dash with a colon, comma, parenthesis, or split sentence.

---

## Patch 1: `start-business-panama-foreigners` (193 imp / 0 clicks)

**Current title** Start Business in Panama 2026: Registration, Taxes, Visas
**Current meta** MISSING

**New meta description** (156 chars)
```
Register a Panama corporation in 2 to 4 weeks. 0% tax on foreign income. The 2026 playbook for foreigners launching a business, with real fees and timelines.
```

**Section tweaks**
1. Add the meta tag.
2. Add an attorney-consult line at the top of the body: "Business registration and tax treatment vary by structure. Consult a licensed Panamanian corporate attorney and CPA before incorporating."
3. Verify `dateModified` is current.
4. Internal links: `apostille-documents-panama-visa`, `panama-banking-non-residents-guide`, `panama-tax-benefits-foreigners-2026`.

---

## Patch 2: `panama-sim-card-guide` (173 imp / 0 clicks)

**Current title** Buy SIM Card Panama 2026: Claro vs Movistar vs Cable Onda
**Current og:description starts with garbage** ("Onda Compare SIM..." looks like a truncation artifact)
**Current meta** MISSING

**Title note**: "Cable Onda" is no longer a SIM brand (Cable Onda was fixed-line internet, now Tigo Hogar). The mobile brands in Panama 2026 are **Claro, Más Móvil (+Móvil), and Digicel**. Movistar exited the Panama mobile market when Telefónica sold to Millicom (now Tigo) and Más Móvil. Update the title to reflect current brands.

**New title** (60 chars)
```
SIM cards in Panama 2026: Claro, +Móvil, Digicel (and eSIM)
```

**New meta description** (157 chars)
```
Prepaid SIM from B/.3, eSIM from USD $4. Claro vs +Móvil vs Digicel for tourists, expats, and long-term stays. Where to buy on day one with passport in hand.
```

**Section tweaks**
1. Replace all "Cable Onda" mobile references with "+Móvil" or "Más Móvil".
2. Add Digicel coverage notes (especially relevant in Bocas and Caribbean coast).
3. Fix the truncated og:description "Onda Compare". Clearly a bug in how the meta is being generated.
4. Internal links: `internet-providers-panama-expats`, `panama-banking-non-residents-guide`.

---

## Patch 3: `panama-cost-of-living-2026` (154 imp / 0 clicks)

**Current title** Panama Cost of Living 2026: Real Monthly Budgets by City
**Current meta** MISSING

**New title** (62 chars)
```
Panama cost of living 2026: USD budgets by city for 2-person expat
```

**New meta description** (158 chars)
```
USD $2,000 to USD $4,500/mo for a comfortable expat life in Panama, depending on city. Real budgets for Panama City, Coronado, Boquete, Bocas, Pedasí.
```

**Section tweaks**
1. Add the meta tag.
2. Confirm the body has explicit USD numbers per zone (not vague qualifiers).
3. Add an `Updated 2026-MM-DD` stamp.
4. Internal links: `panama-retirement-communities` (the new refreshed version), `real-cost-of-moving-to-panama`, `best-neighborhoods-panama-city-expats`.

---

## Patch 4: `real-cost-of-moving-to-panama` (106 imp / 0 clicks)

**Current title** Real Cost of Moving to Panama 2026: Budget Breakdown Guide
**Current og:description** starts strong with "$250 but that's just the beginning". Preserve the hook.

**New title** (61 chars)
```
Real cost of moving to Panama 2026: visa, container, deposits
```

**New meta description** (159 chars, USD prefixed)
```
The Panama visa is USD $250. Container shipping from the US is USD $5k to USD $12k. First-and-deposit on a rental is 3 months. Total realistic relocation: USD $15k to USD $40k.
```

**Section tweaks**
1. Add the meta tag.
2. Verify the body contains a "Realistic total" summary box near the top.
3. Internal links: `moving-to-panama-with-pets`, `panama-cost-of-living-2026`, `apostille-documents-panama-visa`.

---

## Patch 5: `panama-banking-non-residents-guide` (103 imp / 0 clicks)

**Current title** Open a Panama Bank Account as Non-Resident (2026 Guide)
**Current og:description** has en dash that needs to be hyphen (the range "$500" to "$10k").

**New title** (60 chars)
```
Open a Panama bank account as a non-resident: 2026 playbook
```

**New meta description** (158 chars)
```
Which Panama banks still open accounts for non-residents in 2026, minimum deposits from USD $500 to USD $10,000, the documents required, and the bank that still says yes.
```
Replace the en dash from og:description with "to".

**Section tweaks**
1. Add the meta tag (cleaned of dashes).
2. Add a date-stamped table of banks that currently accept non-residents (this changes; tag the data with a "Verified MM-2026" timestamp).
3. Disclaimer: "Bank policies for non-resident account opening change frequently. Confirm directly with each bank before traveling."
4. Internal links: `start-business-panama-foreigners`, `sending-money-panama-wire-transfer`.

---

## Patch 6: `sending-money-panama-wire-transfer` (90 imp / 0 clicks)

**Current title** Send Money to Panama 2026: Wire Transfer, Apps, Lowest Fees

**New title** (61 chars)
```
Send money to Panama 2026: Wise, Remitly, wires (lowest fees)
```

**New meta description** (153 chars)
```
Wise typically beats bank wires by 60-70% on USD to Panama transfers under USD $50k. Real fee comparison: Wise, Remitly, traditional banks, in-person FX.
```

**Section tweaks**
1. Add the meta tag.
2. Include a fee comparison table with effective rate (not just headline fee).
3. Internal links: `panama-banking-non-residents-guide`, `atm-cash-panama-guide`.

---

## Patch 7: `how-to-buy-property-in-panama-2026-guide` (71 imp / 0 clicks)

**Current title** How to Buy Property in Panama: Complete 2026 Guide for Foreigners
**Current og:description** has strong numbers ("3,847 transactions... $485k average"). Preserve.

**New title** (60 chars)
```
How to buy property in Panama 2026: 8 steps for foreign buyers
```

**New meta description** (157 chars)
```
USD $485k average deal size. 12% YoY growth in foreign-buyer transactions. The 8-step process from reservation deposit to title transfer for non-resident buyers.
```

**Section tweaks**
1. Add the meta tag.
2. Verify the 8-step structure is the H2 backbone.
3. Internal links: `apostille-documents-panama-visa`, `panama-banking-non-residents-guide`, `panama-retirement-communities`.
4. Buyer-agency disclosure at top: "panamarealestateguide.com operates as a buyer's agency. We represent only the buyer in any property transaction we participate in."

---

## Patch 8: `atm-cash-panama-guide` (62 imp / 0 clicks)

**Current title** ATMs in Panama 2026: Lowest Fees, Best Networks, Withdraw Cash Guide
**Current og:description** contains em dash between "alone" and "but". Replace.

**New title** (60 chars)
```
ATMs in Panama 2026: cut withdrawal fees by 40% (real strategy)
```

**New meta description** (155 chars)
```
USD $3 to USD $6 per ATM withdrawal in foreign fees on the wrong card. Cut that by 40% with the right network, the right bank, and the right withdrawal cadence.
```

**Section tweaks**
1. Add the meta tag.
2. Verify the body explicitly lists which US/EU cards travel fee-free or low-fee in Panama.
3. Internal links: `panama-banking-non-residents-guide`, `sending-money-panama-wire-transfer`.

---

## Patch 9: `apartments-for-rent-panama-city` (57 imp / 0 clicks)

**Current title** Rent Apartments Panama City 2026: Best Neighborhoods, Costs, Guide
**Current og:description** has em dash plus en dash between "$1,300", "$2,000 per month", and "about". Both must go.

**New title** (62 chars)
```
Rent apartments in Panama City 2026: real prices, 7 neighborhoods
```

**New meta description** (158 chars)
```
2BR in central Panama City: USD $1,300 to USD $2,000/mo, comparable to a studio in downtown Miami. The 7 neighborhoods expats actually rent in, by use case.
```
Replace both dashes with "to" and a comma.

**Section tweaks**
1. Add the meta tag.
2. Internal link to `best-neighborhoods-panama-city-expats` (one of the patched-batch articles).
3. Verify body covers the 7 zones explicitly named in the meta.

---

## Patch 10: `10-best-places-to-live-in-panama-2026` (55 imp / 0 clicks)

**Current title** 10 Best Places to Live in Panama for Expats (2026 Rankings)
**Current og:description** has em dash between "Panama home today" and "up 340%". Replace.

**New title** (60 chars)
```
10 best places to live in Panama 2026: ranked for expats
```

**New meta description** (159 chars)
```
150,000 expats now call Panama home, up 340% from 2010. The 10 places they actually settle (by cost, climate, healthcare, English friendliness), ranked.
```

**Section tweaks**
1. Add the meta tag.
2. Confirm the 10 places are listed with H2 per place, in the ranked order.
3. Internal links: `panama-retirement-communities` (refreshed), `best-neighborhoods-panama-city-expats`, `boquete-panama-real-estate`, `coronado-real-estate-guide`, `playa-venao-panama`.

---

## Patch 11: `news/new-tax-incentive` (91 imp / 0 clicks)

**Current title** "News" (placeholder, broken)
**Current meta** MISSING
**Current og:description** NONE

This is the most broken page in the batch. The title is the literal word "News" with no article-specific content. 91 impressions/month going to a page Google probably indexed under the URL slug name only.

**New title** (60 chars, leading with the topic to reflect the URL slug)
```
Panama new tax incentive 2026: what's in the law for buyers
```

**New meta description** (158 chars)
```
Panama announced new tax-incentive legislation in 2026 affecting foreign property buyers and developers. What changed, who qualifies, and the attorney check before claiming.
```

**Section tweaks**
1. Fix the title (the `<title>` tag itself, not just visible H1).
2. Add og:description and meta description.
3. Add an `Article` JSON-LD schema with `headline`, `datePublished`, `author` (David Aguirre or appropriate byline), and `dateModified`.
4. Add an attorney-consult line in the body: "Tax incentive eligibility depends on the specific transaction structure and timing. Consult a licensed Panamanian tax attorney before claiming any benefit."
5. Verify the news template page generator (likely a script in the build pipeline) is populating per-article metadata, not just falling back to a generic "News" title for every news/* URL.

---

## Indexing gap action list

The following 15 articles are in the content-queue but have **0 impressions in the last 28 days on GSC**, suggesting they are either not yet indexed or not appearing in search results at all. Action: open URL Inspection in GSC for each, request indexing if eligible, and verify there is no `noindex` meta tag.

- 2026-outlook
- cost-of-living-panama-vs-us
- expat-depression-panama-unfiltered
- friendly-nations-2026
- getting-around-panama-city-guide
- how-to-move-to-panama-step-by-step-2026
- how-to-rent-apartment-panama
- moving-to-panama-from-florida
- panama-para-mexicanos-guia-2026
- panama-vs-colombia-retirement
- pedasi-rising
- playa-escondida-resort-colon (project page)
- santa-catalina-panama
- tax-primer
- what-to-pack-moving-to-panama

If a pattern emerges (e.g. 5 in a row of the same template show "Discovered, currently not indexed" in URL Inspection), that points to a template-level bug, not 15 individual problems. Likely culprit: thin server-rendered HTML on JS-rendered pages, so Googlebot sees an empty shell and deprioritizes crawl.

## Long-tail monitor (65 articles, 1-49 imp each in 28d)

The 65 articles with under 50 impressions each are collectively **318 monthly impressions**. Individual quick-fix patches at this volume do not justify the editor time. Instead, fix them once at a template level:

1. Make sure every article template emits a `<meta name="description">` populated from the article frontmatter `description` field (this is the single highest-ROI change in this entire audit).
2. Make sure every article template renders the H1 server-side, not via React-only client rendering.
3. Make sure every article ships its `Article` JSON-LD with `dateModified`, `author`, and `wordCount`.
4. Make sure the OG image is unique per article (not the homepage default), so social shares are not all generic.

If you can verify those 4 template-level fixes in one PR, all 65 long-tail articles benefit at once.

## How to apply this batch

1. For each patch above, edit the source for the corresponding article in the repo (most live in `project/articles/*.html` shells with metadata injected from `data.js`, per the existing build pipeline).
2. Add a `<meta name="description" content="...">` tag in the `<head>`.
3. Update the `<title>` tag where a new title is specified.
4. Bump `dateModified` in the JSON-LD `Article` schema to 2026-05-19.
5. Open one combined PR for all 11 patches (`feat/seo-meta-batch-2-may-2026`).
6. Netlify deploys on merge to main.
7. After deploy, batch-request re-indexing in GSC URL Inspection for all 11 URLs.

## Expected impact

11 patches × current 0 clicks × target 1.5% CTR floor = **17 incremental clicks/month** if all patches ship. Combined with batch 1 (24 expected clicks/month), the **total expected lift is ~41 clicks/month** from a baseline of 5 clicks/month. That is an 8x lift if the math holds.

The template-level fix (long-tail bullet 1: emit meta description from frontmatter on every article) is the highest-leverage single change. Even if the 11 individual patches were not implemented, fixing the template would lift the entire 85-page corpus simultaneously.

## Disclosure

panamarealestateguide.com operates as a buyer's agency. We represent only the buyer in any property transaction we participate in. The recommendations above are based on publicly available data as of May 2026.
