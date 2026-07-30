import airtable from "@/data/airtable.json";

/* =============================================================================
   Content model — v2
   =============================================================================
   Two layers, deliberately separate:

   SYNCED    data/airtable.json — projects, photos, prices, unit models. Written
             by scripts/sync-airtable.mjs. Developer-supplied, never edited here.
   EDITORIAL the overlays below — title status, positioning, climate, and the
             guides. Authored by us, never synced, and null until researched.

   The split is the point. Synced facts come from the developer and are labelled
   as such; editorial claims carry our name. Merging them would make it
   impossible to say which is which, and this whole site is a bet on that
   distinction being visible.
   ============================================================================= */

export type TitleStatus = "titled" | "rop" | "mixed" | "unknown";

/* ── Editorial overlay ──────────────────────────────────────────────────────
   Every field here is null until a human researches it. Templates hide null
   fields rather than showing filler. Cards stay sparse on purpose — a sparse
   card built from real data beats a full one built from guesses.

   ⚠️ titleStatus is "unknown" for all 15 areas. Whether land in an area is
   titled or Rights of Possession is the central claim of this site, Airtable
   has no field for it, and nobody has checked. Do not set these from general
   knowledge — each one needs a real source. */
type AreaEditorial = {
  titleStatus: TitleStatus;
  titleNote: string | null;
  positioning: string | null;
  elevationM: number | null;
  climate: string | null;
  verifiedOn: string | null;
};

const BLANK: AreaEditorial = {
  titleStatus: "unknown",
  titleNote: null,
  positioning: null,
  elevationM: null,
  climate: null,
  verifiedOn: null,
};

const AREA_EDITORIAL: Record<string, AreaEditorial> = {
  "costa-del-este": { ...BLANK },
  "santa-maria": { ...BLANK },
  boquete: { ...BLANK },
  marbella: { ...BLANK },
  amador: { ...BLANK },
  "playa-venao": { ...BLANK },
  "punta-pacifica": { ...BLANK },
  sora: { ...BLANK },
  bijao: { ...BLANK },
  "playa-bonita": { ...BLANK },
  buenaventura: { ...BLANK },
  obarrio: { ...BLANK },
  "playa-caracol": { ...BLANK },
  "rio-hato": { ...BLANK },
  portobelo: { ...BLANK },
};

/* ── Synced shapes ──────────────────────────────────────────────────────────*/

export type UnitModel = {
  name: string | null;
  beds: number | null;
  baths: number | null;
  sizeM2: number | null;
  priceFromUsd: number | null;
};

export type Photo = { src: string; alt: string | null };

export type Project = {
  slug: string;
  name: string;
  areaSlug: string;
  published: boolean;
  status: "preselling" | "under-construction" | "delivered" | null;
  priceFromUsd: number | null;
  priceToUsd: number | null;
  bedsMin: number | null;
  bedsMax: number | null;
  sizeFromM2: number | null;
  descriptionEn: string | null;
  amenities: string[];
  websiteUrl: string | null;
  rawLocation: string | null;
  models: UnitModel[];
  photos: Photo[];
  dataSource: string;
};

export type Area = AreaEditorial & {
  slug: string;
  name: string;
  region: string;
  projectCount: number;
  priceFromUsd: number | null;
  priceToUsd: number | null;
  photo: string | null;
};

/* ── Merge ──────────────────────────────────────────────────────────────────*/

export const projects = airtable.projects as Project[];

export const areas: Area[] = airtable.areas.map((a) => {
  const inArea = projects.filter((p) => p.areaSlug === a.slug);
  const tops = inArea
    .map((p) => p.priceToUsd ?? p.priceFromUsd)
    .filter((n): n is number => typeof n === "number");

  return {
    ...(AREA_EDITORIAL[a.slug] ?? BLANK),
    slug: a.slug,
    name: a.name,
    region: a.region,
    projectCount: a.projectCount,
    priceFromUsd: a.priceFromUsd ?? null,
    priceToUsd: tops.length ? Math.max(...tops) : null,
    // Borrow the first project photo as the area's cover until we have
    // dedicated area photography.
    photo: inArea.find((p) => p.photos.length)?.photos[0]?.src ?? null,
  };
});

/* ── Editorial: people, categories, guides ──────────────────────────────────*/

export type Author = {
  slug: string;
  name: string;
  title: string;
  bio: string;
  credential: string | null;
  isReviewer: boolean;
};

export type Category = { slug: string; name: string; blurb: string };

export type Article = {
  slug: string;
  categorySlug: string;
  title: string;
  dek: string;
  authorSlug: string;
  reviewerSlug: string | null;
  updatedOn: string;
  readMinutes: number;
};

export const categories: Category[] = [
  { slug: "buying", name: "Buying", blurb: "Process, contracts, due diligence" },
  { slug: "residency", name: "Residency", blurb: "Visas, permits, citizenship" },
  { slug: "money", name: "Money", blurb: "Banking, taxes, financing" },
  { slug: "living", name: "Living", blurb: "Cost of living, healthcare, schools" },
];
// NB: "areas" is deliberately not a category. /areas/[slug] is its own route,
// and a category of the same name would collide with it under /[category]/[slug].

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
  },
];

/* The homepage `figures` strip is gone. It was four invented numbers rendered
   as a stat row under gold VERIFIED stamps — both the most generic shape on
   the page and the last thing on the site asserting something unsourced. If
   figures like transfer tax and Friendly Nations minimums come back, they need
   real sources first, and a form that isn't four tiles in a row. */

/* ── Lookups ────────────────────────────────────────────────────────────────*/

export const getArea = (slug: string) => areas.find((a) => a.slug === slug);

export const getProjectsForArea = (slug: string) =>
  projects.filter((p) => p.areaSlug === slug);

export const getAuthor = (slug: string) => authors.find((a) => a.slug === slug);

export const getArticle = (categorySlug: string, slug: string) =>
  articles.find((a) => a.categorySlug === categorySlug && a.slug === slug);

export const usd = (n: number | null) => {
  if (n == null) return "—";
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2).replace(/0$/, "")}M`
    : `$${Math.round(n / 1000)}k`;
};

/** Airtable stores areas as raw floats (157.11203). Round for display. */
export const m2 = (n: number | null) => (n == null ? "—" : `${Math.round(n)} m²`);

export const titleLabel: Record<TitleStatus, string> = {
  titled: "Titled",
  rop: "Rights of possession",
  mixed: "Mixed — verify",
  unknown: "Title not checked",
};

export const statusLabel = {
  preselling: "Preselling",
  "under-construction": "Under construction",
  delivered: "Delivered",
} as const;
