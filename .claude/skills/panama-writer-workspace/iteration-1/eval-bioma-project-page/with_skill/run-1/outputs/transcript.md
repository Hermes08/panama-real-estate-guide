# Transcript — Bioma Costa del Este project page

This documents the actual research steps taken, in order, following the
panama-writer skill's four-phase workflow (SERP teardown → find the hook →
UGC mining → source every figure). Written for grading, not the reader.

## 0. Setup

- Read `.claude/skills/panama-writer/SKILL.md` in full.
- Read `.claude/skills/panama-writer/references/voice.md` in full.
- Read `.claude/skills/panama-writer/references/page-types.md` in full (Project
  pages section specifically).
- Read `v2/data/airtable.json` (via `python3 -c` in Bash) to pull the raw
  Bioma Costa del Este record. Found: slug `bioma-costa-del-este`, area
  `costa-del-este`, published: true, status: preselling, priceFromUsd 342000,
  priceToUsd 695000, sizeFromM2 65, descriptionEn ("A revolutionary 58-story
  residential tower redefining smart urban living with three unique
  ecosystems" — this is v1-style copy, per the skill's warning, and was not
  reused), amenities list in Spanish/mixed, websiteUrl
  panamarealestatesale.com, 7 unit models with sizes/prices, dataSource
  "developer-listed".
- Also pulled the `costa-del-este` area record (region: Panama City,
  projectCount 6, priceFromUsd 280200) and skimmed
  `v2/supabase/migrations/0002_project_content.sql` to confirm the exact
  output schema and the publish-bar CHECK constraint (hook + drawbacks +
  3+ FAQs required).
- Note: the airtable record says "58-story" in its (unused) description field,
  which turned out to disagree with everything found later in research —
  flagged and reconciled below.

## 1. SERP teardown

Query: **"Bioma Costa del Este"**

Top results: Encuentra24 (listing), Panama Equity (building profile + a
pre-sale listing), Metro Realty Panama, The Panama Link, The Agency Panama,
livingbioma.com (developer's own microsite), panacrypto.com (crypto-payment
reseller). Confirms the skill's claim about who ranks: almost entirely broker
listing pages, not the developer's primary site, which barely ranks despite
existing.

Query: **"Bioma Costa del Este Panama price"**

Surfaced more brokers: Raggi Properties, RE/MAX (two mirror listings),
Business Panama Real Estate, another panacrypto reference, Wikipedia (Torre
Planetarium — unrelated, a search-engine miss), propertyportalpanama.com,
metrorealtypanama.com again.

Fetched and cross-read the following broker/developer pages for hard facts
(developer, architect, storeys, units, price, amenities, delivery, HOA):

- `livingbioma.com/costa-del-este` — developer's own microsite; thin on
  numbers, mostly copy. Confirmed developer name (The Velopers) and address.
- `livingbioma.com` (root) — same; confirmed unit sizes (65/97/130 m²) but no
  storey count, no price.
- `panamaequity.com/buildings-in-panama/bioma-panama/` — **47 storeys**,
  65–196 m², $315,000–$560,000, $4,500/m² average, sample unit prices, "Year
  Built: 2018" (clearly wrong/template artifact for a preselling project —
  discarded), pre-construction status confirmed.
- `thepanamalink.com/bioma/` — **failed, HTTP 429** (rate limited). Not
  retried; enough corroborating sources existed elsewhere.
- `theagencyrepanama.com/developments/bioma-at-costa-del-este/` — confirmed
  **architect: Mallol Arquitectos**, size range 65–156 m², price
  $431,200–$594,000, delivery estimate **2028–2029**, deposit structure
  ($1,000 reservation, 20%/30% down payment for residents/foreigners),
  location on Avenida Las Costas across from Town Center mall. This became
  the single most load-bearing source for the buying_note section.
- `metrorealtypanama.com/property/bioma-panama-costa-del-este-condo-project-for-sale/`
  — three specific "Model A/B/C Sur" units with prices ($480k/$489k/$434k),
  HOA "from $223," delivery year listed as 2028, pre-construction status.
- `businesspanamarealestate.com/en/property/bioma-costadeleste/` — three unit
  configs (65/97/130 m²), "Year Built: 2025" (again inconsistent — discarded
  as unreliable relative to the excavation timeline found later), amenity
  list.
- `panacrypto.com/buildings/bioma/` — **failed, HTTP 403**. Not retried.
- `the-velopers.com/bioma` — developer's actual project page. Confirmed unit
  types/sizes and amenity groupings ("Hábitat Parque," "Hábitat Terrarium")
  but, frustratingly, no storey count, no price, no delivery date in the
  fetched content — likely rendered client-side (JS) and not present in the
  static HTML WebFetch retrieved.
- `remax-panama.com/002602231062` — confirmed **60 storeys**, 10 elevators,
  full electrical plant + water reserve tank, 65–156 m², $342,000 starting
  price (matches our Airtable figure exactly), three "ecosystems"
  (Residential/Club/Urban).
- `encuentra24.com/.../apartments-in-bioma-costa-del-este/31195130` — a live
  listing: 65 m², $335,000, 1 bed/1 bath, HOA $227.50/month. Confirms the
  HOA-per-m² math from Panama Equity (~$3.25–3.50/m²) and shows a lower
  starting price than the Airtable/RE/MAX figure — reconciled below.
- `ivasipanama.com/properties/bioma-en-costa-del-este/` — broker listing
  (Iván Sierra Inversiones — note this is a brokerage, NOT the developer;
  an earlier auto-summary conflated the two, corrected here). Confirmed
  price floor around $325,000, size range 65–163 m².

**Storey-count discrepancy across sources:** 47 (Panama Equity), ~58
(Airtable's stale description field), 60 (RE/MAX, and the plurality of other
mentions found via search), 61 (one aggregate search summary), 67 (a
SkyscraperCity thread title, "BIOMA | COSTA DEL ESTE | 67P"), 77 (mentioned
in a search-engine summary as visible "on one render"). **Judgment call:**
went with 60 as the reported figure in the output, since it's the number
independently repeated by the most sources (RE/MAX listing directly, plus
multiple secondary mentions), while explicitly telling the reader in both
the hook and the FAQ that broker pages disagree and to treat any single
number as approximate. Did not silently pick one and present it as settled
fact.

**Price discrepancy:** Airtable/RE/MAX show $342,000 for the smallest 65 m²
unit; Encuentra24, IVASI, and an earlier Panama Equity listing show
$315,000–$335,000 for what appears to be the same floor plan; Business
Panama's "Sur"-facing units run $434,000–$489,000 for mid-size units, well
above the Airtable equivalents. This is the exact kind of contradiction the
skill's Pino Alto example warns about. **Judgment call:** rather than picking
one number and hiding the conflict, the output states the Airtable/developer
figure as the baseline table and explicitly calls out the lower resale/older
listings and the higher orientation-based ("Sur") pricing as likely
explanations, and tells the reader to get a live quote. This is a genuine,
disclosed reconciliation, not a fabricated resolution.

**Delivery date discrepancy — the most consequential one found.** One search
result (surfaced via a broad "Bioma Costa del Este construction progress
2026" query, sourced from an aggregator listing) stated delivery in **Q4
2025** — which, given today's date (July 30, 2026), would already be in the
past. That is inconsistent with (a) the project's `status: preselling` field
in our own Airtable data, and (b) a SkyscraperCity search summary describing
only excavation/earth-moving work as of March 2024 for a 60+ storey tower.
The Agency Panama's page instead gives **2028–2029**. **Judgment call:**
treated 2028–2029 as materially more credible and said so explicitly in the
output, rather than averaging the two or picking the more optimistic one
because it looks better. This is flagged prominently in both the drawbacks
field and a dedicated FAQ, because it's a real finding that matters more to
a buyer than almost anything else on the page.

## 2. Find the hook

Searched specifically for what makes The Velopers/Bioma distinctive:

Query: **`"The Velopers" Panama developer proyectos anteriores track record`**
— surfaced La Prensa Panamá coverage of Dovle (Coco del Mar), a Velopers
project, reportedly selling 170 apartments in 19 hours. Also surfaced the
developer's other projects (Velure, Vita, Regalia). This became the closest
thing to a genuine differentiator: not a legal/permit moat (no equivalent of
Pino Alto's Tourism Authority approval was found for Bioma), but demonstrated
sales velocity from the same developer, which matters for an investor
weighing resale liquidity.

Also confirmed via the-velopers.com and businesspanamarealestate.com that the
project's real structural distinctiveness is the amenity scale (7,000+ m²,
three "ecosystems," a public-facing retail/sports podium on levels 0–4 with
independent access from the residential tower) — genuinely unusual amenity
programming relative to a typical single-lobby residential tower, even if
not unique among ultra-luxury Panama City towers generally.

**Honest conclusion, stated in the hook field:** Bioma does not have a
unique legal or title angle. It competes on amenity density and developer
sales-velocity reputation. This was written explicitly rather than inventing
a stronger claim, per the skill's instruction that "if you genuinely cannot
find one, say the project is unremarkable and explain what it competes on
instead."

## 3. UGC mining

Ran the following queries looking for Reddit/forum discussion specific to
this project or its developer:

- `Bioma Costa del Este reddit r/Panama opinion`
- `site:reddit.com Bioma Panama Costa del Este`
- `site:reddit.com r/Panama preselling condo Velopers OR Bioma buyer experience`
- `reddit r/Panama "pre-construction" condo Panama City risk developer`
- `reddit r/Panama Costa del Este living review traffic`
- `"Bioma" Panama preventa reventa OR estafa OR retraso OR queja`
- `"The Velopers" Dovle OR Velure OR Vita entrega retraso 2024 2025`

**Result: no Reddit or expat-forum discussion specific to Bioma or The
Velopers surfaced in any of these queries.** This is reported honestly in
the output rather than papered over — the drawbacks and FAQs are NOT sourced
from verbatim UGC quotes for this project, because none were found despite
seven different query angles. This is a real, disclosed gap, not a silent
skip.

What the UGC-adjacent searches did turn up, and how it was used:

- A `choosepanama.com` blog post on pre-construction risk in Panama —
  fetched directly, and turned out to be promotional rather than substantive
  (no concrete risk data, no numbers). Not used as a source in the final
  output because it didn't actually contain verifiable risk information —
  its title looked useful but the content wasn't.
- A general market query (`Costa del Este Panama sobreoferta oversupply
  apartments rental yield 2025`) returned a search-engine AI summary citing
  specific oversupply statistics ("352 unsold units," "80% of luxury
  inventory") attributed to thelatinvestor.com. **This claim was checked by
  directly fetching the source article**
  (thelatinvestor.com/blogs/news/panama-city-real-estate-forecasts), and the
  specific numbers **did not actually appear in the article** — the search
  summary had fabricated or misattributed them. This was caught and the
  claim was dropped entirely from the output rather than used. Flagging this
  explicitly: it's a concrete example of why the skill's "follow it back or
  drop the number" rule matters — a secondhand AI summary of a source is not
  the source.
- A Wikipedia fetch on Costa del Este surfaced the reclaimed-land fact
  (fill from Panama Canal excavation material and a leveled hill in Villa
  Guadalupe), which is real, verifiable, neighborhood-wide context — used in
  the location_note and buying_note as context, explicitly framed as
  neighborhood-wide rather than Bioma-specific, and not as an alarmist claim.

No drawback in the output is invented. The two drawbacks that made it in
(the delivery-date conflict, and the absence of a verifiable public permit
record) are both things actually found during research, not manufactured
"balanced-sounding" negatives.

## 4. Source every figure

Attempted to source structural/legal facts against primary institutions per
the skill's table:

- Searched `Bioma Costa del Este ITBMS OR "Registro Público" OR finca OR
  permiso construcción` — surfaced a Panamanian open-data PDF of construction
  permits (datosabiertos.gob.pa, July–Dec 2024). **Fetched it directly** to
  search for a Bioma/Costa del Este/Avenida Las Costas entry. The PDF's text
  layer was not extractable in a useful way by the fetch tool (reported as
  "heavily compressed/encoded"), and no confirmed entry for this project was
  found. **This is reported as an unverified gap in the output** — the page
  explicitly says no public construction permit or Registro Público record
  could be independently located for this project, rather than inventing a
  finca number or claiming "believed to be titled."
- No DGI, ANATI, or Migración figures were needed for this page — a project
  page's buying_note is about deposit structure, permits, and developer
  record per page-types.md, not tax/residency figures (those belong to
  guides), so none were fabricated to pad the sources list.
- Delivery date, deposit structure, and architect were sourced to The Agency
  Panama's listing, which was the single most detailed and internally
  consistent broker page found.
- Storey count, HOA rate, and starting price were cross-checked across
  3+ independent broker pages plus the Airtable base data before being
  stated with the explicit caveat that sources disagree.

## Files produced

1. `output.md` — structured fields per the skill's Output section.
2. `transcript.md` — this file.
3. `metrics.json` — tool-call counts and summary stats.
