/* =============================================================================
   Content model — v2
   =============================================================================
   These types are the spec for the Supabase schema. Each exported type maps to
   one table; the mock records below are placeholders so the templates render
   before the database exists.

   ⚠️  EVERY NUMERIC FIGURE AND DATE BELOW IS A PLACEHOLDER. Nothing here has
   been sourced or verified. The `verifiedOn` fields exist to exercise the
   stamp component's layout — they are not claims. Replace all of it with
   sourced data before anything ships.
   ============================================================================= */

export type TitleStatus = "titled" | "rop" | "mixed";

/** A checked figure. The stamp is only honest if `source` and `verifiedOn`
 *  are both real, so they are required rather than optional. */
export type Figure = {
  label: string;
  value: string;
  note: string;
  /** Slug of the guide that explains this number. Every figure links out. */
  explainedBy: string;
  source: string;
  verifiedOn: string;
};

export type Area = {
  slug: string;
  name: string;
  region: string;
  blurb: string;
  /** Why a foreign buyer ends up here specifically. One sentence, concrete. */
  positioning: string;
  elevationM: number;
  climate: string;
  priceFromUsd: number;
  priceToUsd: number;
  titleStatus: TitleStatus;
  titleNote: string;
  projectCount: number;
  verifiedOn: string;
};

export type Project = {
  slug: string;
  name: string;
  areaSlug: string;
  developer: string;
  status: "preselling" | "under-construction" | "delivered";
  priceFromUsd: number;
  bedsMin: number;
  bedsMax: number;
  sizeFromM2: number;
  deliveryQuarter: string;
  titleStatus: TitleStatus;
  amenities: string[];
  verifiedOn: string;
};

export type Author = {
  slug: string;
  name: string;
  title: string;
  bio: string;
  credential: string | null;
  isReviewer: boolean;
};

export type Category = {
  slug: string;
  name: string;
  blurb: string;
};

export type Article = {
  slug: string;
  categorySlug: string;
  title: string;
  dek: string;
  authorSlug: string;
  reviewerSlug: string | null;
  updatedOn: string;
  readMinutes: number;
  areaSlug: string | null;
};

/* ── Categories ─────────────────────────────────────────────────────────── */

export const categories: Category[] = [
  {
    slug: "buying",
    name: "Buying",
    blurb: "Process, contracts, due diligence",
  },
  {
    slug: "residency",
    name: "Residency",
    blurb: "Visas, permits, citizenship",
  },
  { slug: "money", name: "Money", blurb: "Banking, taxes, financing" },
  { slug: "living", name: "Living", blurb: "Cost of living, healthcare, schools" },
];
// NB: "areas" is deliberately not a category. /areas/[slug] is its own route,
// and a category of the same name would collide with it under /[category]/[slug].

/* ── Live figures — the homepage signature strip ────────────────────────── */

export const figures: Figure[] = [
  {
    label: "Property transfer tax",
    value: "2%",
    note: "of registered value, paid by seller",
    explainedBy: "buying/panama-property-transfer-tax",
    source: "Dirección General de Ingresos",
    verifiedOn: "2026-07",
  },
  {
    label: "Typical closing time",
    value: "6–10 wks",
    note: "titled property, cash purchase",
    explainedBy: "buying/panama-closing-process",
    source: "Registro Público de Panamá",
    verifiedOn: "2026-07",
  },
  {
    label: "Friendly Nations minimum",
    value: "$200k",
    note: "real-estate investment route",
    explainedBy: "residency/friendly-nations-visa",
    source: "Servicio Nacional de Migración",
    verifiedOn: "2026-07",
  },
  {
    label: "Currency risk",
    value: "None",
    note: "balboa pegged 1:1 to USD since 1904",
    explainedBy: "money/panama-dollarization",
    source: "Banco Nacional de Panamá",
    verifiedOn: "2026-07",
  },
];

/* ── Areas ──────────────────────────────────────────────────────────────── */

export const areas: Area[] = [
  {
    slug: "boquete",
    name: "Boquete",
    region: "Chiriquí Highlands",
    blurb:
      "Mountain town at 1,200m with spring-like weather year round and the country's most established foreign retiree community.",
    positioning:
      "Buyers come here to escape the heat without leaving the tropics.",
    elevationM: 1200,
    climate: "18–24°C year round",
    priceFromUsd: 180000,
    priceToUsd: 850000,
    titleStatus: "mixed",
    titleNote:
      "Both titled and Rights of Possession land trade here. Verify before any deposit.",
    projectCount: 4,
    verifiedOn: "2026-07",
  },
  {
    slug: "coronado",
    name: "Coronado",
    region: "Pacific Coast",
    blurb:
      "The most developed beach corridor within 90 minutes of Panama City, with full services and a large weekend population.",
    positioning: "The default choice for buyers who want beach plus infrastructure.",
    elevationM: 5,
    climate: "26–32°C, dry season Dec–Apr",
    priceFromUsd: 145000,
    priceToUsd: 700000,
    titleStatus: "titled",
    titleNote: "Predominantly titled; the corridor was formally subdivided decades ago.",
    projectCount: 6,
    verifiedOn: "2026-07",
  },
  {
    slug: "casco-viejo",
    name: "Casco Viejo",
    region: "Panama City",
    blurb:
      "UNESCO-listed colonial quarter under long-running restoration, with the tightest supply and the strongest short-let demand in the country.",
    positioning: "Buyers here are buying scarcity and rental yield, not space.",
    elevationM: 8,
    climate: "26–32°C, humid",
    priceFromUsd: 260000,
    priceToUsd: 1800000,
    titleStatus: "titled",
    titleNote:
      "Titled, but heritage rules restrict what you may alter. Read the restrictions before bidding.",
    projectCount: 3,
    verifiedOn: "2026-07",
  },
  {
    slug: "costa-del-este",
    name: "Costa del Este",
    region: "Panama City",
    blurb:
      "Master-planned business district on reclaimed land, built for families who want international schools and a short commute.",
    positioning: "The city's most predictable address — planned, titled, and liquid.",
    elevationM: 3,
    climate: "26–32°C, humid",
    priceFromUsd: 290000,
    priceToUsd: 1400000,
    titleStatus: "titled",
    titleNote: "Fully titled and master-planned. The cleanest paperwork in Panama.",
    projectCount: 5,
    verifiedOn: "2026-07",
  },
  {
    slug: "bocas-del-toro",
    name: "Bocas del Toro",
    region: "Caribbean",
    blurb:
      "Caribbean archipelago with island living, the lowest entry prices in the guide, and by far the most title risk.",
    positioning: "Cheapest entry, highest diligence burden. Not a passive purchase.",
    elevationM: 2,
    climate: "24–30°C, rain year round",
    priceFromUsd: 95000,
    priceToUsd: 600000,
    titleStatus: "rop",
    titleNote:
      "Much of the island land is Rights of Possession, not titled. This is where foreign buyers most often lose money.",
    projectCount: 2,
    verifiedOn: "2026-07",
  },
];

/* ── Projects ───────────────────────────────────────────────────────────── */

export const projects: Project[] = [
  {
    slug: "altos-del-valle",
    name: "Altos del Valle",
    areaSlug: "boquete",
    developer: "Chiriquí Development Group",
    status: "under-construction",
    priceFromUsd: 245000,
    bedsMin: 2,
    bedsMax: 3,
    sizeFromM2: 118,
    deliveryQuarter: "Q3 2027",
    titleStatus: "titled",
    amenities: ["Gated", "River frontage", "Backup water", "Fiber"],
    verifiedOn: "2026-07",
  },
  {
    slug: "playa-serena",
    name: "Playa Serena",
    areaSlug: "coronado",
    developer: "Pacífico Real",
    status: "preselling",
    priceFromUsd: 168000,
    bedsMin: 1,
    bedsMax: 3,
    sizeFromM2: 72,
    deliveryQuarter: "Q1 2028",
    titleStatus: "titled",
    amenities: ["Beachfront", "Pool", "Gym", "24h security"],
    verifiedOn: "2026-07",
  },
  {
    slug: "casa-mercado",
    name: "Casa Mercado",
    areaSlug: "casco-viejo",
    developer: "Conservatorio",
    status: "delivered",
    priceFromUsd: 385000,
    bedsMin: 1,
    bedsMax: 2,
    sizeFromM2: 64,
    deliveryQuarter: "Delivered 2025",
    titleStatus: "titled",
    amenities: ["Restored shell", "Rooftop", "Heritage listed", "Elevator"],
    verifiedOn: "2026-07",
  },
  {
    slug: "torre-este",
    name: "Torre Este",
    areaSlug: "costa-del-este",
    developer: "Grupo Meridiano",
    status: "under-construction",
    priceFromUsd: 312000,
    bedsMin: 2,
    bedsMax: 4,
    sizeFromM2: 132,
    deliveryQuarter: "Q4 2027",
    titleStatus: "titled",
    amenities: ["Concierge", "Pool", "Coworking", "Parking ×2"],
    verifiedOn: "2026-07",
  },
];

/* ── People ─────────────────────────────────────────────────────────────── */

export const authors: Author[] = [
  {
    slug: "editorial-team",
    name: "Editorial Team",
    title: "Panama Real Estate Guide",
    bio: "We research and write every guide on this site, and we do not accept payment for coverage.",
    credential: null,
    isReviewer: false,
  },
  {
    slug: "legal-reviewer",
    name: "Legal Reviewer",
    title: "Panamanian attorney",
    bio: "Reviews every guide that touches title, tax, or residency law before it publishes.",
    credential: "Placeholder — needs a named, licensed reviewer before launch",
    isReviewer: true,
  },
];

/* ── Articles ───────────────────────────────────────────────────────────── */

export const articles: Article[] = [
  {
    slug: "titled-vs-rights-of-possession",
    categorySlug: "buying",
    title: "Titled land vs. Rights of Possession in Panama",
    dek: "The single distinction that separates a clean purchase from an unsellable one — and how to check which you are being offered.",
    authorSlug: "editorial-team",
    reviewerSlug: "legal-reviewer",
    updatedOn: "July 2026",
    readMinutes: 9,
    areaSlug: null,
  },
  {
    slug: "panama-closing-process",
    categorySlug: "buying",
    title: "How closing actually works in Panama",
    dek: "Every step from promise-to-buy through Registro Público, with who pays what and where the delays come from.",
    authorSlug: "editorial-team",
    reviewerSlug: "legal-reviewer",
    updatedOn: "July 2026",
    readMinutes: 11,
    areaSlug: null,
  },
  {
    slug: "friendly-nations-visa",
    categorySlug: "residency",
    title: "The Friendly Nations visa, honestly assessed",
    dek: "Who qualifies, what the property route actually requires, and the cases where it is the wrong choice.",
    authorSlug: "editorial-team",
    reviewerSlug: "legal-reviewer",
    updatedOn: "July 2026",
    readMinutes: 8,
    areaSlug: null,
  },
];

/* ── Lookups ────────────────────────────────────────────────────────────── */

export const getArea = (slug: string) => areas.find((a) => a.slug === slug);

export const getProjectsForArea = (slug: string) =>
  projects.filter((p) => p.areaSlug === slug);

export const getAuthor = (slug: string) => authors.find((a) => a.slug === slug);

export const getArticle = (categorySlug: string, slug: string) =>
  articles.find((a) => a.categorySlug === categorySlug && a.slug === slug);

export const usd = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : `$${Math.round(n / 1000)}k`;

export const titleLabel: Record<TitleStatus, string> = {
  titled: "Titled",
  rop: "Rights of possession",
  mixed: "Mixed — verify",
};
