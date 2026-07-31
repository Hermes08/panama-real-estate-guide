# Transcript — Titled Land vs. Rights of Possession guide

Task: draft the guide "titled land vs Rights of Possession in Panama" following
`.claude/skills/panama-writer/SKILL.md`.

## Setup

1. Read `SKILL.md` in full — the four-phase workflow (SERP teardown, hook,
   UGC mining, source every figure), the sourcing table (DGI / Registro
   Público / ANATI / Migración / Gaceta Oficial), the "never write a verified
   claim we haven't verified" rule, and the output schema.
2. Read `references/voice.md` — Casey Foster + Investopedia blend: lead with
   a number, Key Takeaways with source+date inside the bullet, second person,
   name the drawback, no currency conversion, define Spanish terms once.
3. Read `references/page-types.md`, Guides section — section order: opening
   paragraph leading with a number → Key Takeaways (4–6, sourced) → body
   H2s with tables for 3+ comparable values → callouts (default/warn/legal)
   → "when the honest answer is don't" → Sources (numbered, full URLs,
   primary institutions only) → FAQ. Noted the reviewer requirement: content
   touching title/tax/residency law needs a named credentialed reviewer
   before publish, enforced by a DB constraint (`reviewer_id` without
   `reviewed_on` is rejected).
4. Checked the repo for existing structure to match: `v2/supabase/migrations/0001_init.sql`
   (the `articles` table — slug, category_id, body, faqs jsonb, sources
   jsonb `[{label,url}]`, reviewer_id/reviewed_on with the check constraint)
   and `v2/app/[category]/[slug]/page.tsx`. That page.tsx turned out to
   contain a **hardcoded placeholder article body on this exact topic**
   ("titled land vs rights of possession") used to exercise the template —
   useful for confirming section shape and callout styling (`callout-warn`,
   `callout-legal`, a `Stamp` component for check dates), but explicitly
   commented in the source as placeholder content whose sources "must be
   replaced with the exact source pages before publish." I did not treat
   any factual claim in that placeholder as verified; I re-sourced
   everything independently.

## Phase 1 — SERP teardown

Queries run (via WebSearch):
- `titled land vs Rights of Possession Panama real estate`
- `Rights of Possession Panama property buying guide`

Top-ranking pages: Casa Solution, Panama Advisory International Group,
bestplacesintheworldtoretire.com, Panama Elite Homes, Tropic Lands Real
Estate, RELO Firm, ExpatDen, Live and Invest Overseas, Angloinfo, Kraemer &
Kraemer (law firm), Puerto Armuelles, Bocas del Toro Panama Properties,
Chiriqui Coastal. Overwhelmingly brokers, relocation firms, and law firms —
consistent with the skill's description of who ranks on project pages, and
true here too.

**Table stakes across the SERP:** the titled/ROP definitional split, "ROP
isn't ownership," "can't mortgage ROP," "get a finca number," "hire an
independent attorney." Any guide omitting these looks careless.

**What none of them carry, cleanly:** an actual Gaceta Oficial citation for
the governing law (most say "Law 80" with no gazette number or link to the
statute); a first-person or expat-community-sourced account of what
specifically goes wrong (most drawbacks are generic "it's risky," not a
named failure mode); an explicit, disclosed accounting of what could and
couldn't be verified against the primary institutions.

## Phase 2 — Finding the hook

The hook: Rights of Possession isn't a workaround or a gray-market shortcut —
it is itself a codified legal category (Law 80 of 2009, building on a
1960s land-reform tradition) with a specific, low bar to establish: five
years of peaceful, uncontested occupation, no registration required. Most
competing pages describe ROP as "not real ownership" and move on; framing it
as "here is the actual five-year legal test, and here is exactly how a claim
that easy to establish creates the specific failure modes buyers hit" is the
more useful and more differentiated framing, and it's what the opening
paragraph and body lead with.

## Phase 3 — UGC mining

Reddit was **not accessible**: WebFetch returned "Claude Code is unable to
fetch from www.reddit.com" for both `r/panama` search URLs I tried, and
WebSearch rejected `allowed_domains: ["reddit.com"]` outright ("domains are
not accessible to our user agent"). Unrestricted WebSearch queries
referencing Reddit/r/Panama did not surface usable Reddit thread content
either — results redirected to third-party aggregator/blog content instead.
I'm flagging this explicitly rather than fabricating Reddit quotes: **no
Reddit content was actually read for this guide**, despite the brief asking
me to mine it. I substituted expat-community publications that serve the
same UGC role (first-person accounts, forum-adjacent Q&A sites) since they
were reachable:

Queries run:
- `reddit r/Panama rights of possession land buying scam`
- `reddit ROP Panama land title finca warning experience`
- `site:reddit.com Panama rights of possession property`
- `Panama rights of possession land title Reddit` (allowed_domains reddit — errored)
- `Panama ROP land finca number scam expat forum` (allowed_domains reddit — errored)
- `"rights of possession" Panama forum "we bought" OR "my lawyer" experience regret`
- `expat exchange Panama forum rights of possession land title thread`
- `Panama ROP land "can't get a mortgage" OR "couldn't sell" possession`

Sources actually fetched and used:
- **livinginpanama.com — "How We Were Scammed In Panama Property Purchase."**
  First-person account: a couple paid over two years for land in Corazón de
  Jesús before discovering the seller had concealed other heirs (his late
  father's siblings) who also held a legal claim. Direct quote used in the
  guide: "Don't assume that everyone is telling the truth. Have your lawyer
  look at a property's history." This is the strongest, most concrete UGC
  find and became the basis for the "undisclosed co-owners" drawback and part
  of the "when the honest answer is don't" section.
- **livinginbocasdeltoro.com — "Panama ROP 101 (Rights of Possession), Part 1."**
  Expat-community explainer describing the absence/abandonment risk in plain
  terms: use a property for a few years, leave it unattended for an extended
  stretch, and someone else's competing occupation can eventually displace
  the claim. Also the source for boundary-dispute framing (inconsistent
  historical surveying, no clearly defined boundaries).
- **livinginpanama.com — "Can You Safely Buy ROP Property In Panama?"**
  Due-diligence checklist (verify ownership history, get co-owner waivers,
  interview neighbors, check for outstanding utility debt, address
  occupancy) and the claim that ROP is common enough to be "most property in
  Panama" — I did **not** use that specific prevalence claim in the output
  because it's a single blog's unsourced assertion, not something I could
  verify against a primary count.

**Judgment call:** because real Reddit content was unreachable, the
"drawbacks sourced from UGC" bar in the skill is met at one remove — through
expat-community blogs and a first-person account rather than raw forum
threads. I disclosed this rather than presenting it as literal Reddit
mining.

## Phase 4 — Sourcing every figure

Per the skill's table, this topic maps to **ANATI** (Rights of Possession,
titling) and **Registro Público** (title, finca numbers, liens), with
**Gaceta Oficial** for the laws as enacted.

Queries run:
- `ANATI derecho posesorio titulación de tierras Panama proceso`
- `Ley 80 de 2009 Panama zonas costeras insulares titulación derecho posesorio`
- `Ley 59 de 2010 Panama crea ANATI`
- `Registro Público de Panamá finca número consulta propiedad titulada`
- `percentage of land Panama untitled rights of possession statistic`
- `"90 percent" OR "90%" Panama land untitled State Department investment climate statement`

**Direct fetch attempts against the primary institutions, and what happened:**

| URL | Result |
|---|---|
| `anati.gob.pa/index.php/normativas` | HTTP 403 |
| `anati.gob.pa/Normativa/Ley_80_de_2009_Titulacion_de_Tierras.pdf` | HTTP 403 |
| `anati.gob.pa/index.php/quienes-somos/marco-legal` | HTTP 403 |
| `anati.gob.pa/` (homepage) | HTTP 403 |
| `registro-publico.gob.pa/images/InstructivoconsultasWeb.pdf` | Fetched but returned unparseable raw/binary content — the fetch tool could not extract readable text |
| `rp.gob.pa` (the actual query portal) | Returned a client-side "connection lost" error page, no content |
| `registro-publico.gob.pa/` (homepage) | Loaded, but only as a news portal with links out to `rp.gob.pa` for the actual consulta tools — no fee or process detail on the page itself |

**I could not directly verify a single figure against ANATI's or the
Registro Público's own primary page.** This is disclosed explicitly in the
output (a "Sourcing note" callout right after Key Takeaways, and a line
under the Sources list) rather than silently footnoted or, worse, presented
as if I'd pulled it from ANATI directly.

What I used instead, all disclosed inline in the output as secondary:
- **ecolex.org** — a legal-instrument database — for the Gaceta Oficial
  citation on Law 80 (Nº 26,438, December 31, 2009). This is a specific,
  checkable citation even though it came from an aggregator rather than
  ANATI's own gazette mirror.
- **abogados.pa**, **RELO Firm**, **Casa Solution**, **Kraemer & Kraemer**
  for process descriptions, the five-year possession threshold, ANATI's
  creation by Law 59/2010, and reported conversion timelines.
- Multiple Panama conveyancing/how-to pages, cross-checked against each
  other, for the Registro Público certificate fee (B/. 25, 30-day validity)
  and the free informative online lookup — again disclosed as
  secondary-sourced since the primary PDF wouldn't render.

**The U.S. Department of State Investment Climate Statement for Panama.**
I attempted to fetch this directly three times — the current 2025 report
page, the report's own PDF, and an archived 2020 HTML version at
`2021-2025.state.gov`. All three returned garbled/unrenderable content from
the fetch tool ("technical difficulties," base64 artifacts), not a clean
403 but not usable text either. I only have this source through WebSearch's
own synthesized summary, which quotes language along the lines of "much of
Panama's land, especially outside Panama City, lacks formal titles" and
notes titling delays "sometimes waiting decades," attributed consistently
across the 2016–2025 editions per that search summary.

**Judgment call on the "90%" figure.** A commonly repeated claim — that
roughly 90% of land outside Panama City is untitled — traces back to this
State Department report per multiple secondary write-ups and the WebSearch
synthesis. I did **not** put that specific number in the output. I could
not independently confirm the digit against the primary document's actual
text (every direct fetch attempt failed), so per the skill's rule to "drop
the number" rather than launder an unverified figure, the guide uses the
qualitative claim only ("much of Panama's land outside Panama City lacks
formal titles") with the State Dept citation, and does not assert "90%."

**Judgment call on conversion cost.** RELO Firm's page gives a detailed cost
breakdown (their own legal fees plus a government cost of roughly $1–$5+
per square meter). I did not present the $1–$5/m² figure as a government
fee schedule in the output — it reads in the source as one firm's
case-specific breakdown, not a published bracket — and I didn't include
their legal-fee number at all, since quoting one firm's private pricing
as if it were a market rate would be exactly the kind of unsourced-figure
problem the skill warns against. The output only keeps the
independently-corroborated timeframe (6 months–1 year vs. 3–5 years),
attributed to two firms by name, not stated as an ANATI figure.

**Judgment call on DGI/tax figures.** The skill's sourcing table assigns
transfer tax, capital gains, and ITBMS to DGI, which is a separate guide's
job, not this one's. One competitor page (Casa Solution) claimed specific
tax percentages for titled vs. ROP land, but that's a broker page quoting a
figure, which the skill explicitly says is "a claim about a source," not a
source. I did not verify it against DGI and left tax figures out of this
guide entirely rather than repeat an unsourced broker number.

## What I could not verify, summarized

- ANATI's and the Registro Público's own web properties, for any figure —
  every direct attempt failed (403 / connection error / unrenderable PDF).
- The specific "90%" untitled-land statistic — qualitative claim kept,
  number dropped.
- Real Reddit/r/Panama UGC — inaccessible to both WebFetch and WebSearch's
  domain filter; substituted expat-community blog UGC instead, disclosed.
- Any current government per-square-meter adjudication fee schedule — only
  one firm's case-specific number was found, and it wasn't used.
- No named, credentialed reviewer signed off on this draft. Per the skill
  and the DB constraint it describes, this content touches title and land
  law and needs that review before it can carry a "Reviewed for accuracy"
  badge or go live. The output file says so explicitly at the bottom.

## Section-by-section mapping to page-types.md's Guides structure

Opening paragraph (leads with the five-year statutory number) → Key
Takeaways (6 bullets, each sourced, with the verification-limits note
folded in as its own callout) → body H2s (`What titled land actually is`,
`What Rights of Possession actually is`, a comparison table, `How to check
which one you're being offered`, `Converting Rights of Possession to
title`, `What buyers actually run into`) → callouts (one `legal`, one
`warn`, marked inline) → `When the honest answer is don't` → `Sources`
(numbered, full URLs, with an explicit primary-institution caveat) → `FAQ`
(7 questions, drawn from what the SERP and UGC sources actually kept
asking/answering: legality, convertibility, mortgages, how to check,
timeline, abandonment risk, and price).
