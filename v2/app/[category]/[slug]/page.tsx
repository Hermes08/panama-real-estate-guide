import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  articles,
  categories,
  getArticle,
  getAuthor,
} from "@/lib/content";
import { Button, Stamp } from "@/components/ui";

export function generateStaticParams() {
  return articles.map((a) => ({ category: a.categorySlug, slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) return {};
  return { title: article.title, description: article.dek };
}

/* Section headings drive both the in-page TOC and the sticky sidebar. In v2
   these come from the article body; hardcoded here to exercise the template. */
const sections = [
  { id: "what-the-difference-is", label: "What the difference is" },
  { id: "how-to-check", label: "How to check which you're offered" },
  { id: "what-it-costs", label: "What conversion costs" },
  { id: "when-to-walk", label: "When to walk away" },
];

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) notFound();

  const author = getAuthor(article.authorSlug);
  const reviewer = article.reviewerSlug ? getAuthor(article.reviewerSlug) : null;
  const cat = categories.find((c) => c.slug === article.categorySlug);
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      {/* ── Hero band ────────────────────────────────────────────────────── */}
      <section className="hero-band pb-24">
        <div className="wrap pt-[clamp(32px,4.5vw,52px)]">
          <nav className="font-mono text-[11.5px] uppercase tracking-[0.07em] text-white/70 mb-5">
            <Link href="/" className="text-white/70 underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/${article.categorySlug}`}
              className="text-white/70 underline"
            >
              {cat?.name ?? article.categorySlug}
            </Link>
          </nav>

          <h1 className="h1-article !text-white max-w-[22ch]">
            {article.title}
          </h1>
          <p className="dek !text-white/90 mt-5 max-w-[62ch]">{article.dek}</p>

          <hr className="border-0 h-px bg-accent/45 my-6" />

          {/* Byline — writer and reviewer, both named. */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/55">
                Written by
              </p>
              <p className="font-display text-[15px] font-bold text-white mt-0.5">
                {author?.name}
              </p>
            </div>
            {reviewer && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/55">
                  Reviewed by
                </p>
                <p className="font-display text-[15px] font-bold text-white mt-0.5">
                  {reviewer.name}
                </p>
              </div>
            )}
            <div className="min-[700px]:ml-auto flex items-center gap-5">
              <span className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#e8d269] px-3.5 py-1 font-display text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#f3e08a]">
                ✓ Reviewed for accuracy
              </span>
              <span className="font-mono text-[12.5px] text-white/70 tnum">
                {article.readMinutes} min
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body + sidebar ──────────────────────────────────────────────── */}
      <div className="wrap grid gap-[clamp(24px,3vw,36px)] min-[860px]:grid-cols-[minmax(0,1fr)_320px] pb-[clamp(48px,6vw,80px)]">
        {/* The signature LeyConsulta move: white card overlapping the hero. */}
        <article className="bg-white rounded-lg shadow-lg -mt-14 p-[clamp(20px,3vw,40px)]">
          <div className="prose">
            <p>
              If you take one thing from this guide, take this: in Panama,{" "}
              <strong>
                &ldquo;for sale&rdquo; does not mean &ldquo;titled.&rdquo;
              </strong>{" "}
              A significant share of land — especially on the islands and along
              parts of the coast — trades as Rights of Possession, which is not
              ownership. It is a recognized claim to occupy. Those are very
              different things when you try to sell, mortgage, or defend it.
            </p>

            <div className="callout callout-warn">
              <div>
                <p className="callout-title">The short version</p>
                <p className="mt-2.5">
                  If a seller cannot produce a Registro Público entry with a
                  finca number, you are not looking at titled land. Ask for that
                  number before you discuss price.
                </p>
              </div>
            </div>

            <h2 id="what-the-difference-is">What the difference is</h2>
            <p>
              Titled property is registered ownership. It sits in the Registro
              Público under a finca number, it can be mortgaged, insured, and
              sold to anyone, and the state recognizes your claim against third
              parties.
            </p>
            <p>
              Rights of Possession is a claim based on continuous, uncontested
              occupation. It can be bought and sold in practice, but what
              changes hands is the claim, not registered ownership.
            </p>

            <table>
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th>Titled</th>
                  <th>Rights of Possession</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Registered owner</td>
                  <td>Yes</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>Can be mortgaged</td>
                  <td>Yes</td>
                  <td>Generally no</td>
                </tr>
                <tr>
                  <td>Title insurance</td>
                  <td>Available</td>
                  <td>Rarely available</td>
                </tr>
                <tr>
                  <td>Resale market</td>
                  <td>Open</td>
                  <td>Much narrower</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-3.5">
              <Stamp on="2026-07" />
            </div>

            <h2 id="how-to-check">How to check which you&rsquo;re offered</h2>
            <p>
              Ask for the finca number, then have an attorney pull the entry
              directly. Do not accept a photocopy, and do not accept a
              screenshot. The register is the only thing that settles this.
            </p>

            <div className="callout callout-legal">
              <div>
                <p className="callout-title">Where this comes from</p>
                <p className="mt-2.5">
                  Rights of Possession and the titling process are governed
                  primarily through ANATI, Panama&rsquo;s national land
                  authority. Registered ownership is recorded at the Registro
                  Público. These are separate institutions with separate
                  records — confirming one tells you nothing about the other.
                </p>
              </div>
            </div>

            <h2 id="what-it-costs">What conversion costs</h2>
            <p>
              Rights of Possession land can sometimes be converted to title, and
              sellers will often present this as a formality. It is not. Timeline
              and cost vary widely with the parcel, and some claims cannot be
              converted at all.
            </p>

            <blockquote>
              Treat any promise that titling is &ldquo;already in
              process&rdquo; as unverified until you have seen the file number.
            </blockquote>

            <h2 id="when-to-walk">When to walk away</h2>
            <p>
              Walk when the seller will not produce a finca number, when the
              boundaries on the ground do not match the paperwork, or when there
              is any occupant whose claim has not been formally resolved.
            </p>

            {/* Sources — real outbound citations, LeyConsulta's strongest
                E-E-A-T move. These are institutional homepages, not deep links
                to specific pages, and must be replaced with the exact
                source pages before publish. */}
            <div className="max-w-[760px] mt-10 border-t border-line pt-6">
              <p className="font-display text-[14px] font-bold uppercase tracking-[0.08em] text-ink">
                Sources
              </p>
              <ul className="mt-3 text-[15px]">
                <li>Registro Público de Panamá — property registry</li>
                <li>ANATI — Autoridad Nacional de Administración de Tierras</li>
                <li>Dirección General de Ingresos — transfer tax</li>
              </ul>
            </div>
          </div>
        </article>

        {/* ── Sticky sidebar ─────────────────────────────────────────────── */}
        <aside className="hidden min-[860px]:grid sticky top-[110px] gap-6 content-start">
          <nav className="border-y border-line py-5">
            <p className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-ink">
              On this page
            </p>
            <ul className="mt-3.5 space-y-2.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-[14.5px] text-muted no-underline hover:text-brand"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Category token is interpolated — one component, per-vertical copy. */}
          <div className="rounded-md p-[22px] bg-brand-800 text-white">
            <h3 className="font-display text-[19px] font-bold leading-tight">
              Checking title on a specific property?
            </h3>
            <p className="mt-2.5 text-[14.5px] text-white/85 leading-relaxed">
              Send us the listing. We&rsquo;ll tell you what to ask for before
              you pay a deposit.
            </p>
            <Button href="/contact" className="mt-4 w-full">
              Get a check
            </Button>
          </div>
        </aside>
      </div>

      {/* ── Related ─────────────────────────────────────────────────────── */}
      <section className="bg-paper-warm border-y border-line py-[clamp(48px,7vw,88px)]">
        <div className="wrap">
          <h2 className="h2-section max-w-[24ch]">Keep reading</h2>
          <div className="mt-9 grid gap-[22px] min-[620px]:grid-cols-2 min-[1000px]:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/${r.categorySlug}/${r.slug}`}
                className="group rounded-md border border-line bg-white p-6 no-underline shadow-sm hover:shadow-md transition-all duration-200"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent-700">
                  {r.categorySlug}
                </p>
                <h3 className="mt-3 font-display text-[18px] font-semibold leading-snug text-ink group-hover:text-brand transition-colors">
                  {r.title}
                </h3>
                <p className="mt-4 font-mono text-[12px] text-faint tnum">
                  {r.readMinutes} min · {r.updatedOn}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
