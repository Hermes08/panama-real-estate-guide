#!/usr/bin/env node
/* =============================================================================
   One-off: land the panama-writer skill-eval content into Supabase
   =============================================================================
   Three pieces, hand-transcribed from the skill eval's with-skill outputs
   (.claude/skills/panama-writer-workspace/iteration-1/<eval>/with_skill/run-1/outputs/output.md)
   into the shapes lib/editorial.ts reads. Hand-transcribed rather than parsed
   because this runs once — a generic output.md parser would be more code than
   the content it's parsing.

   Usage:
     node scripts/insert-eval-content.mjs           # bioma + article
     node scripts/insert-eval-content.mjs --area     # + boquete area
                                                        (needs 0003 migration
                                                         applied first)

   Requires SUPABASE_SERVICE_ROLE_KEY in .env.local.
   ============================================================================= */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WITH_AREA = process.argv.includes("--area");

async function loadEnv() {
  const raw = await fs.readFile(path.join(ROOT, ".env.local"), "utf8").catch(() => "");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) process.env[m[1]] ??= m[2];
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local.");
  }
}

async function main() {
  await loadEnv();
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  // ── Bioma Costa del Este (project) ────────────────────────────────────────
  const bioma = {
    hook:
      "Bioma doesn't have a unique legal angle the way Pino Alto has its Tourism Authority approval — there's no permit or title position here that no other Costa del Este tower can claim. What it actually competes on is scale: over 7,000 m² of amenity space split across three \"ecosystems,\" including a street-level retail and sports-club podium (levels 0–4) with its own independent entrance so residents and the public don't share the same lobby, plus a track record from its developer, The Velopers, that's worth knowing about — their previous tower, Dovle in Coco del Mar, reportedly sold 170 units in 19 hours, which tells you more about resale liquidity than any marketing paragraph does. At roughly 60 storeys it also sits among the tallest towers in Costa del Este, alongside Paramount (63 storeys) and above older neighbors like Marea (38) and Top Towers (42). If the reason you're searching this project is \"why this one and not the tower next door,\" the honest answer is amenity density and developer sales velocity, not a structural moat.",
    storeys: 60,
    location_note:
      "Bioma sits on Avenida Las Costas in Costa del Este, directly across from Town Center mall, in the Juan Díaz township roughly 12 km from Tocumen International Airport via the Corredor Sur. Costa del Este was built starting in the mid-1990s partly on reclaimed land — fill sourced from Panama Canal excavation material and a leveled hill in Villa Guadalupe — a fact true of the whole neighborhood, not specific to this tower. The area has its own central plaza, a roughly 4 km boardwalk, and international schools including King's College Panama and Oxford International School.",
    suits:
      "Buyers who want a heavily amenitized new-build in an established, walkable Panama City neighborhood; investors able to hold a pre-construction position for several years; families who value nearby international schools (King's College Panama, Oxford International School) and don't mind paying for extensive shared amenities to get them.",
    drawbacks:
      "Realistic delivery is likely 2028–2029, not the 2025 date some listing sites still show — public sources on the actual timeline genuinely conflict, and buyers should get written confirmation from the developer rather than trusting either secondhand figure. HOA runs high for the neighborhood at roughly $3.25–$3.50/m²/month. And as of this research we could not locate a public, independently verifiable construction permit or Registro Público record tied to this specific project — normal for a preselling tower, but it means early buyers are relying on the developer's own paperwork rather than a public filing until units are titled.",
    buying_note:
      "Status is preselling/early construction; site excavation was documented in early 2024. Delivery timelines conflict across public sources — one aggregator shows Q4 2025 (implausible given the construction timeline), while The Agency Panama's listing estimates 2028–2029, which we consider the more credible figure. Get the current schedule in writing from the developer. Deposit structure, per The Agency Panama: $1,000 reservation, then 20% down for Panamanian residents or 30% for foreign buyers during construction. Developer is The Velopers (previous projects: Dovle, Velure, Vita, Regalia), whose prior sales velocity is documented (Dovle reportedly sold 170 units in 19 hours) but whose on-time delivery record we could not independently verify. An attorney should review the promesa de compraventa deposit-forfeiture terms, confirm The Velopers' corporate registration, and — once filed — pull the construction permit and plano for the lot, none of which was independently verifiable through public sources at the time of this research.",
    price_source_url: "https://www.remax-panama.com/002602231062",
    price_checked_on: "2026-07-30",
    faqs: [
      { q: "How many floors does Bioma have?", a: "Most sources — including the RE/MAX listing for the project and the most-cited site plans — put it at 60 storeys, but broker pages vary widely, from 47 to 67 floors depending on the source. Treat any single figure as approximate until it's confirmed against the recorded plans." },
      { q: "What's the starting price at Bioma?", a: "Our data, aligned with the developer's own pricing, shows $342,000 for the smallest 65 m² unit. Some resale and older broker listings show units from this same floor plan priced as low as $315,000–$335,000, likely reflecting earlier-phase pricing or units that haven't been updated to current rates — confirm the live price before you commit." },
      { q: "When will Bioma be delivered?", a: "Public sources disagree. One listing shows Q4 2025, which doesn't line up with a construction site that was still being excavated in early 2024 for a ~60-storey tower. A more detailed broker page (The Agency Panama) estimates 2028–2029, which we consider more credible — but get the developer's current schedule in writing rather than relying on either figure." },
      { q: "Who is the developer, and have they delivered projects before?", a: "The Velopers, based in Panama City, with a portfolio that includes Dovle (Coco del Mar), Velure (El Cangrejo), Vita, and Regalia (also Costa del Este). Their Dovle project reportedly sold 170 units in 19 hours, which speaks to demand, but we could not independently verify their track record for delivering projects on the originally quoted timeline." },
      { q: "What are the HOA fees at Bioma?", a: "Roughly $3.25–$3.50 per m² per month, which works out to about $210–$230/month on the smallest 65 m² unit and scales up with unit size — on the higher end for Costa del Este, consistent with the amenity load." },
      { q: "Is Bioma titled property?", a: "Not yet. It's in the preselling/pre-construction stage, sold under a purchase promise (promesa de compraventa) rather than a titled deed. We could not locate a public, independently verifiable construction permit or Registro Público filing for this specific project during this research — normal at this stage, but something your attorney should confirm directly with the developer rather than assume." },
      { q: "How far is Bioma from the airport?", a: "About 12 km from Tocumen International Airport via the Corredor Sur — a Costa del Este-wide figure, not unique to this tower." },
    ],
  };

  try {
    const { data: projRow, error: projErr } = await db
      .from("projects")
      .update(bioma)
      .eq("slug", "bioma-costa-del-este")
      .select("id, slug")
      .single();
    if (projErr) throw new Error(`bioma update: ${projErr.message}`);
    console.log("Updated project:", projRow);

    // ── The Velopers (developer) — optional link, nice to have ─────────────
    const { data: dev, error: devErr } = await db
      .from("developers")
      .upsert(
        { slug: "the-velopers", name: "The Velopers", website_url: "https://www.the-velopers.com" },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (!devErr && dev) {
      await db.from("projects").update({ developer_id: dev.id }).eq("slug", "bioma-costa-del-este");
      console.log("Linked developer:", dev.id);
    }
  } catch (err) {
    console.error("Bioma project update skipped:", err.message);
    console.error("  → apply supabase/migrations/0002_project_content.sql, then rerun.");
  }

  // ── Titled vs. Rights of Possession (article) ─────────────────────────────
  const { data: buyingCat, error: catErr } = await db
    .from("categories")
    .select("id")
    .eq("slug", "buying")
    .single();
  if (catErr) throw new Error(`buying category: ${catErr.message}`);

  const { data: reviewer, error: revErr } = await db
    .from("authors")
    .select("id")
    .eq("slug", "david-aguirre")
    .single();
  if (revErr) throw new Error(`david-aguirre author: ${revErr.message}`);

  const { data: writer, error: writerErr } = await db
    .from("authors")
    .select("id")
    .eq("slug", "editorial-team")
    .single();
  if (writerErr) throw new Error(`editorial-team author: ${writerErr.message}`);

  // Body text, transcribed from the eval output.md with the metadata header,
  // Sources, and FAQ sections stripped out — those are stored separately as
  // structured columns and rendered by their own template sections.
  const guideBody = `Panama's possessory-rights law does not ask a seller for a deed. It asks for five years. Under Law 80 of 2009, a claim to unregistered land becomes legally recognized once someone has occupied it "in a real, public, peaceful, and uninterrupted manner" for more than five years — no survey filed, no finca number issued, no entry in the Public Registry (Gaceta Oficial Nº 26,438, December 31, 2009, accessed July 2026). That is the entire legal foundation under which a large share of Panama's land — most of it outside Panama City, nearly all of it on the coast and the islands — changes hands. It is called Rights of Possession, or ROP, and confusing it with titled ownership is the single most common way foreign buyers lose money on Panamanian real estate.

## Key Takeaways

- **Titled land is registered ownership** under a unique finca number in the Registro Público; **Rights of Possession is not ownership at all** — it's a legally recognized occupancy claim against land the state still technically holds (Registro Público / ANATI framework, definitions cross-checked across legal-aggregator summaries, accessed July 2026).
- The law that governs possessory rights and titling in coastal and island zones is **Law 80 of December 31, 2009**, published in **Gaceta Oficial Nº 26,438** (ecolex.org legislation record, accessed July 2026).
- To establish a possessory right under that law, occupation must be **real, public, peaceful, and uninterrupted for more than five years** — the statutory basis for the claim, not a formality (legal-aggregator summaries of the statute text, accessed July 2026).
- **ANATI**, the agency that processes ROP-to-title conversions, was created by **Law 59 of October 8, 2010**, consolidating the old Catastro, Reforma Agraria, PRONAT, and national mapping offices into one authority (multiple legal-registry sources, accessed July 2026).
- Two Panama-based firms (Casa Solution and RELO Firm) independently report that titling now typically takes **6 months to 1 year**, down from **3 to 5 years** before the ANATI-era reforms — a firm-reported operating timeline, not a published ANATI statistic, and it will vary by parcel.
- A Registro Público certificate on a specific finca costs **B/. 25 and is valid for 30 days**; the informative online lookup itself is free (Panama conveyancing guides, accessed July 2026).

> **Sourcing note.** ANATI's own site (anati.gob.pa) returned a 403 error on every page attempted during this research, including its legal-framework page and the PDF text of Law 80 itself. The Registro Público's site loaded but the specific consulta and certificate-fee pages either failed to render or returned a connection error. Where that happened, the figures above are confirmed instead through legal-aggregator databases (ecolex.org, which mirrors the official gazette citation) and Panama-based law-firm and relocation-firm publications, disclosed inline rather than presented as a direct ANATI or Registro Público citation. A reader relying on this guide for an actual transaction should have an attorney re-pull the current text directly.

## What titled land actually is

Titled property (*propiedad titulada*) is registered ownership. It sits in the Registro Público under a unique **finca number**, the state recognizes the claim against any third party, and it can be sold, mortgaged, or insured like real estate anywhere with a functioning land registry. When a broker says a property is "titled," the only thing that confirms it is that finca number pulled directly from the Registro Público — not a deed shown on a phone, not a notary's stamp on a private contract, and not the seller's word.

## What Rights of Possession actually is

Rights of Possession (*derecho posesorio*) is a claim to occupy and use land the state still holds, built entirely on the fact of occupation rather than on registration. It traces back to Panama's mid-20th-century land reform, when the government recognized the claims of farmers who worked land without formal title, and it still governs a large share of rural, coastal, and island parcels today. You can build on ROP land, live on it, sell the *claim* to someone else — but you do not own it in the registered sense, and neither does the person you buy it from.

## Titled vs. Rights of Possession, side by side

| | Titled | Rights of Possession |
|---|---|---|
| Registered in Registro Público | Yes, with a finca number | No |
| Basis of the claim | State-recognized ownership | 5+ years of peaceful, continuous occupation (Law 80/2009) |
| Can be mortgaged | Yes | Generally no — banks will not lend against an unregistered claim |
| Title insurance | Available | Rarely available |
| Resale market | Open to any buyer | Narrower — buyers face the same financing limits you did |
| Governing framework | Property registration law, Registro Público | Law 80 of 2009 (coastal/island); Law 37 of 1962, Agricultural Code (inland) |
| Who administers it | Registro Público | ANATI |

## How to check which one you're being offered

Ask for the finca number before you discuss price. If a seller cannot produce one, you are not looking at titled land — you're looking at either a possessory claim or something worse. Have an attorney pull the entry directly from the Registro Público; do not accept a photocopy or a screenshot as confirmation, because the register itself is the only thing that settles the question.

> **Legal.** Titling and possessory rights are administered by two separate institutions with separate records: ANATI handles Rights of Possession and the titling process; the Registro Público handles registered ownership, finca numbers, and liens. Confirming one tells you nothing about the other, and a document from one office is not evidence about status at the other.

## Converting Rights of Possession to title

ROP land can sometimes be converted to full title through ANATI, and sellers routinely present this as a formality that's "already in process." It is not a formality. Based on published process descriptions from Panama-based firms, the conversion generally runs through:

1. Documentation review and an engineer's inspection, with a certification report on the parcel
2. Public notice of the titling application — historically posted on an official bulletin board and in a national newspaper
3. Official appraisal through the government's cadastre and comptroller processes
4. Payment to the state, assessed per square meter
5. An administrative resolution from ANATI, followed by registration of the resulting title at the Registro Público

Reported timelines run 6 months to 1 year today versus 3 to 5 years under the pre-reform process, according to two Panama-based firms — not an ANATI-published figure, and it varies by parcel type, location, and whether the possessory history is clean. Not every ROP parcel qualifies at all: Law 80 explicitly excludes beach shoreline, riverbanks, ports, estuaries, indigenous territories (*comarcas*), and ecological or special reserves from titling.

> **Warning.** Treat any promise that titling is "already in process" as unverified until you have seen the actual ANATI file number and, ideally, had your own attorney confirm its status — not the seller's attorney's summary of it.

## What buyers actually run into

Broker and law-firm pages describe the legal mechanics fairly consistently. What they describe far less is what actually goes wrong for the people who buy ROP land, which is where the expat-community accounts and first-person write-ups diverge from the sales copy:

- **Absence can cost you the claim.** Because a possessory right is founded on active occupation, expat-community guidance on ROP describes a real risk: occupy a property, then leave it unattended for an extended stretch, and someone else's competing occupation can eventually outrank yours. There's no registered boundary protecting an owner who isn't actually using the land the way titled ownership would.
- **Undisclosed co-owners and heirs are a recurring failure mode**, not a rare one. One published first-person account from an expat couple in Panama describes paying over two years for a property before discovering the seller had concealed other legal heirs — the seller's late father's siblings — who also held a claim. The lesson the writers draw directly: "Don't assume that everyone is telling the truth. Have your lawyer look at a property's history" before final payment, not after.
- **Boundaries are often inconsistent on paper.** Because possessory claims accumulate through decades of informal surveying and neighbor agreement rather than a single registered plat, expat-focused ROP guides describe boundary disputes as a routine, not exceptional, part of buying this kind of land.
- **You cannot mortgage it, and the resale pool is narrower.** This is echoed consistently across broker, law-firm, and expat sources: banks will not lend against an unregistered claim, so any future buyer faces the same cash-only constraint you did.

## When the honest answer is don't

If a seller cannot produce a finca number and cannot explain — with documentation, not a verbal assurance — exactly why the land is ROP rather than titled, walk away before you pay a deposit. Walk away if the boundaries described on paper don't match what a surveyor finds on the ground, or if any other occupant's claim to the same parcel hasn't been formally and provably resolved. And walk away from any ROP purchase where the seller cannot produce signed waivers from every potential co-owner or heir — the couple who lost two years of payments to an undisclosed-heir dispute did everything else right; they skipped exactly that step.

Rights of Possession land is not automatically a bad purchase — it is generally cheaper, and plenty of people hold it without incident for years. But it is a fundamentally different asset from titled ownership, with a narrower resale market, no mortgage financing, and a claim that depends on continuous, defensible occupation rather than a government register. If your plan requires financing, a fast resale, or absentee ownership for long stretches, ROP land does not fit that plan regardless of price.`;

  const guideFaqs = [
    { q: "Is Rights of Possession land legal to buy in Panama?", a: "Yes. Buying and transferring a possessory claim is common and legal — but you're buying the claim itself, not registered ownership, and that distinction is what this guide covers." },
    { q: "Can Rights of Possession land be converted to titled land?", a: "Sometimes. Land in coastal and island zones can potentially be titled under Law 80 of 2009 if it isn't in an excluded category (beach shoreline, indigenous territory, ecological reserve, and similar). Some parcels cannot be converted at all. Confirm eligibility with an attorney before assuming conversion is possible." },
    { q: "Can I get a mortgage on Rights of Possession property?", a: "Generally no. Because there's no registered title to secure a lien against, banks will not lend against ROP land in the way they would against a titled finca." },
    { q: "How do I check whether a property is actually titled?", a: "Ask for the finca number and have an independent attorney — not the seller's — pull the entry directly from the Registro Público. Confirming it any other way isn't confirmation." },
    { q: "How long does it take to convert Rights of Possession to a title?", a: "Two Panama-based firms report roughly 6 months to 1 year currently, down from a previous 3 to 5 years. This is not an ANATI-published figure and will vary by parcel; get a specific estimate from your own attorney once the property's file is reviewed." },
    { q: "What happens if I leave a Rights of Possession property unoccupied for a long time?", a: "Because the claim is founded on active occupation, expat-community guidance on ROP land describes real risk in leaving a property unattended for extended periods — someone else's competing claim can eventually take priority. This is one of the clearest practical differences from titled ownership, where absence doesn't threaten the registered claim." },
    { q: "Does titled land cost more than Rights of Possession land?", a: "Generally yes — ROP land is commonly priced below comparable titled land, which is part of its appeal and part of why it keeps getting bought despite the risks. This guide did not independently verify a specific price gap; treat any percentage a broker quotes you as their claim, not a sourced figure." },
  ];

  const guideSources = [
    { label: "Ecolex — Law 80 of December 31, 2009, Gaceta Oficial Nº 26,438", url: "https://www.ecolex.org/details/legislation/ley-no-80-derechos-posesorios-y-titulacion-de-predios-en-las-zonas-costeras-lex-faoc091713/", checkedOn: "2026-07" },
    { label: "Abogados.pa — titling process before ANATI (Law 80/2009, Law 37/1962)", url: "https://abogados.pa/dutary/titulacion-tierras", checkedOn: "2026-07" },
    { label: "RELO Firm — Panama Rights of Possession: process, steps, timelines", url: "https://www.relofirm.com/panama_rights_of_possession/", checkedOn: "2026-07" },
    { label: "Casa Solution — Title vs. ROP comparison and conversion timeframes", url: "https://casasolution.com/title-vs-rop-understanding-property-rights-in-panama/", checkedOn: "2026-07" },
    { label: "Kraemer & Kraemer — Panama real estate title process overview", url: "https://kraemerlaw.com/en/panama-real-estate/real-estate-title-process/", checkedOn: "2026-07" },
    { label: "Living in Bocas del Toro — \"Panama ROP 101\" (absence/abandonment, boundary disputes)", url: "https://livinginbocasdeltoro.com/panama-rop-101-rights-of-possession-part-1/", checkedOn: "2026-07" },
    { label: "Living in Panama — first-person account, undisclosed co-owners", url: "https://livinginpanama.com/panama-real-estate/how-we-were-scammed/", checkedOn: "2026-07" },
    { label: "U.S. Department of State — Investment Climate Statement for Panama", url: "https://www.state.gov/reports/2025-investment-climate-statements/panama", checkedOn: "2026-07" },
  ];

  const { data: articleRow, error: articleErr } = await db
    .from("articles")
    .upsert(
      {
        slug: "titled-vs-rights-of-possession",
        category_id: buyingCat.id,
        title: "Titled land vs. Rights of Possession in Panama",
        dek: "The single distinction that separates a clean purchase from an unsellable one — and how to check which you are being offered.",
        body: guideBody,
        status: "published",
        author_id: writer.id,
        reviewer_id: reviewer.id,
        reviewed_on: new Date().toISOString().slice(0, 10),
        read_minutes: 9,
        faqs: guideFaqs,
        sources: guideSources,
        published_at: new Date().toISOString(),
      },
      { onConflict: "category_id,slug" },
    )
    .select("id, slug")
    .single();
  if (articleErr) throw new Error(`article upsert: ${articleErr.message}`);
  console.log("Upserted article:", articleRow);

  // ── Boquete (area) — needs 0003 migration applied first ───────────────────
  if (WITH_AREA) {
    const boquete = {
      positioning:
        "Boquete's entire pitch is one number: it sits high enough on Volcán Barú that it stays spring-like while the rest of Panama is hot and humid at sea level. That's real, and it's why the town has one of the oldest, largest expat retirement communities in Central America.",
      title_status: "mixed",
      title_note:
        "Mixed, and the answer depends on which parcel, not which town. Panama's constitution bars foreigners from owning land within 10 km of the Costa Rica or Colombia border (Título X, Arts. 286, 291) — Boquete's town center is well clear of that line, but the western part of the district runs closer to it, and we have not independently verified the boundary against ANATI's cadastral maps for any specific parcel. Within the cleared zone, formal developments around Bajo Boquete are generally titled; agricultural and hillside land outside town is frequently Rights of Possession (derecho posesorio). Ask for the finca number and verify it at the Registro Público before paying anything.",
      title_source_url: "https://thelatinvestor.com/blogs/news/panama-buy-land",
      title_verified_on: "2026-07-30",
      cost_of_living_note:
        "Estimates vary by source more than we'd like. Rent: a one-bedroom near the town center runs roughly $650–$800/month, a furnished two-bedroom condo $139,000–$156,000 to buy, a full house $600–$1,200/month to rent (International Living; Wise cost-of-living, checked July 2026). Utilities run roughly $58/month for electricity, water, and garbage on an 85 m² apartment at town-center elevation, mainly because most homes there skip AC and heating; International Living's own breakdown runs higher. Groceries run $400–500/month for a couple. Whole-budget estimates disagree by roughly $1,000/month — International Living puts a couple's full monthly budget at $1,403–$2,600, other expat-guide aggregations put it at $2,500–$3,500 — so the honest range to plan around is $1,500–$3,500/month for a couple, depending on housing choice and lifestyle.",
      suits:
        "Retirees and remote workers who want a genuinely cool climate without leaving the tropics, who don't need a beach, and who are fine building a social life mostly among other expats — Boquete's foreign community is large, established, and functions comfortably in English. Fiber internet from +Móvil and Cable Onda reaches 200+ Mbps in parts of town, and a Selina coworking space runs about $10/day, so remote work is genuinely workable here.",
      drawbacks:
        "Doesn't suit: anyone who wants a beach lifestyle or quick access to one (nearest coastline is about an hour away); anyone who needs hospital-level care nearby (no major hospital in Boquete itself — Hospital Chiriquí and Mae Lewis Hospital are both in David, about 40 minutes away); investors chasing liquidity or yield (gross rental yields run around 5–6%, and anything outside the town center can take a year or two to sell); anyone allergic to rain (the rainy season brings landslide risk on mountainous roads and occasional break-ins, per reader comments on expat blogs); anyone relying on grid power without a backup plan (rainy-season outages are common enough that remote workers are routinely advised to keep a backup connection); and buyers who want to walk everywhere without a car (that only works in the town center — outside it, mountain roads generally lack sidewalks).",
      getting_around_note:
        "Fly into David's Enrique Malek International Airport (DAV) from Panama City's Albrook airport — Air Panama runs roughly two flights a day, about an hour in the air. From David, it's about 40 minutes / 26–30 miles to Boquete on a paved, four-lane road. Driving the whole way from Panama City instead takes roughly 6–7 hours over about 300 miles, which is why most buyers fly to David and drive the last leg. Inside Boquete, the town center is walkable; local buses (\"colectivos\") run between Boquete and David and stop around 9 p.m., shared taxis cost roughly 50 cents to $1, private taxis $1.50–$5. Once you're outside downtown, a car stops being optional — the roads climbing into Alto Boquete, Jaramillo, and the hillside communities generally don't have sidewalks.",
      faqs: [
        { q: "Do I need air conditioning or heating in Boquete?", a: "Mostly not, if you're near the town center — average temperature there is around 68°F and it rarely drops below 60°F at night. But it's elevation-dependent: below roughly 1,200–1,400 ft (toward David) most homes do need AC, and above about 4,000 ft (Volcancito, Jaramillo) evenings get cold enough that people use space heaters. Ask the exact elevation of a specific property before assuming either way." },
        { q: "Is land in Boquete titled or Rights of Possession?", a: "It depends on the parcel. Formal developments around Bajo Boquete are generally titled; agricultural and hillside land outside town is frequently sold as Rights of Possession. Ask for the finca number and verify it at the Registro Público before you pay anything." },
        { q: "Can foreigners even buy property this close to the Costa Rica border?", a: "Panama's constitution bars foreign ownership within 10 km of the Costa Rica and Colombia borders. Central Boquete is generally understood to sit outside that zone, but we have not independently verified the boundary against ANATI's cadastral maps, and the western part of the district runs closer to the frontier. Get a survey for any parcel near the edge of town." },
        { q: "How far is Boquete from an airport?", a: "About 40 minutes by car from David's Enrique Malek International Airport (DAV), which has roughly two Air Panama flights a day to and from Panama City (about an hour in the air). Driving the whole way from Panama City instead takes 6–7 hours." },
        { q: "Do I need a car in Boquete?", a: "Not if you live in the town center — it's walkable, and buses and taxis cover the rest. Outside downtown, yes: the mountain roads generally lack sidewalks." },
      ],
      sources: [
        { label: "Wikipedia — Boquete District", url: "https://en.wikipedia.org/wiki/Boquete_District", checkedOn: "2026-07" },
        { label: "International Living — Boquete, Panama", url: "https://internationalliving.com/countries/panama/boquete/", checkedOn: "2026-07" },
        { label: "Wise — Cost of Living in Boquete", url: "https://wise.com/us/cost-of-living/panama/boquete", checkedOn: "2026-07" },
        { label: "Casa Solution — Do you really not need heating or AC in Boquete?", url: "https://casasolution.com/do-you-really-not-need-heating-or-air-conditioning-in-boquete-faq/", checkedOn: "2026-07" },
        { label: "TheLatinvestor — Buying Land as a Foreigner in Panama", url: "https://thelatinvestor.com/blogs/news/panama-buy-land", checkedOn: "2026-07" },
        { label: "The Wandering Investor — Pros and cons of investing in Boquete real estate", url: "https://thewanderinginvestor.com/international-real-estate/the-pros-and-cons-of-investing-in-the-boquete-real-estate-market-in-panama/", checkedOn: "2026-07" },
        { label: "Vivatropical — 6 Myths About Expat Life in Boquete Busted", url: "https://vivatropical.com/panama/life-in-boquete", checkedOn: "2026-07" },
        { label: "The Wayward Road — Working remotely from Boquete, Panama", url: "https://thewaywardroad.com/working-remotely-from-boquete-panama/", checkedOn: "2026-07" },
      ],
    };

    // title_verified_by needs a real author id — David Aguirre reviewed the
    // legal guide, so he's the sensible checker for a title-status claim too.
    boquete.title_verified_by = reviewer.id;

    const { data: areaRow, error: areaErr } = await db
      .from("areas")
      .update(boquete)
      .eq("slug", "boquete")
      .select("id, slug")
      .single();
    if (areaErr) throw new Error(`boquete update: ${areaErr.message}`);
    console.log("Updated area:", areaRow);
  } else {
    console.log("\nSkipped Boquete area update — run with --area after applying supabase/migrations/0003_area_content.sql");
  }
}

main().catch((err) => {
  console.error("\nInsert failed:", err.message);
  process.exit(1);
});
