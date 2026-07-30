import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  areas,
  getArea,
  getProjectsForArea,
  usd,
  titleLabel,
} from "@/lib/content";
import { Button, Stamp, TitleBadge } from "@/components/ui";

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) return {};
  return {
    title: `${area.name} property guide — prices, title risk, projects`,
    description: area.blurb,
  };
}

const statusLabel = {
  preselling: "Preselling",
  "under-construction": "Under construction",
  delivered: "Delivered",
} as const;

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const areaProjects = getProjectsForArea(slug);

  return (
    <>
      {/* ── Hero band ────────────────────────────────────────────────────── */}
      <section className="hero-band">
        <div className="wrap py-[clamp(40px,6vw,68px)]">
          <nav className="font-mono text-[11.5px] uppercase tracking-[0.077em] text-white/70 mb-5">
            <Link href="/" className="text-white/70 underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/areas" className="text-white/70 underline">
              Areas
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{area.name}</span>
          </nav>

          <p className="font-display text-[12px] font-bold uppercase tracking-[0.077em] text-accent mb-3">
            {area.region}
          </p>
          <h1 className="h1-article !text-white max-w-[18ch]">{area.name}</h1>
          <p className="dek !text-white/90 mt-5 max-w-[62ch]">{area.blurb}</p>

          <hr className="border-0 h-px bg-accent/45 my-7" />

          {/* Hard specs, realtor.com style — surfaced immediately. */}
          <dl className="flex flex-wrap gap-x-10 gap-y-5">
            {[
              { k: "Entry price", v: usd(area.priceFromUsd) },
              { k: "Upper range", v: usd(area.priceToUsd) },
              { k: "Elevation", v: `${area.elevationM}m` },
              { k: "Climate", v: area.climate },
              { k: "Title status", v: titleLabel[area.titleStatus] },
            ].map((s) => (
              <div key={s.k}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.077em] text-white/55">
                  {s.k}
                </dt>
                <dd className="font-display text-[21px] font-bold text-white tnum mt-1">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            <Stamp on={area.verifiedOn} onDark />
          </div>
        </div>
      </section>

      {/* ── Title risk — the first thing, every time ─────────────────────── */}
      <section className="py-[clamp(40px,5vw,64px)]">
        <div className="wrap">
          <div
            className={`rounded-md border-l-4 p-6 max-w-[76ch] ${
              area.titleStatus === "rop"
                ? "bg-negative-50 border-negative"
                : area.titleStatus === "mixed"
                  ? "bg-accent-50 border-star"
                  : "bg-positive-50 border-positive"
            }`}
          >
            <p className="font-display text-[14px] font-bold uppercase tracking-[0.077em] text-ink">
              Before you shortlist anything here
            </p>
            <div className="mt-3">
              <TitleBadge status={area.titleStatus} />
            </div>
            <p className="mt-3.5 text-[16px] leading-relaxed text-body max-w-[62ch]">
              {area.titleNote}
            </p>
            <Link
              href="/buying/titled-vs-rights-of-possession"
              className="inline-block mt-4 font-semibold text-link no-underline hover:underline"
            >
              How to check which one you&rsquo;re being offered →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Projects — realtor.com listing mechanics ─────────────────────── */}
      <section className="bg-paper-warm border-y border-line py-[clamp(52px,7vw,80px)]">
        <div className="wrap">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="h2-section max-w-[24ch]">
              Projects in {area.name}
            </h2>
            <p className="font-mono text-[13px] text-muted tnum">
              {areaProjects.length} listed
            </p>
          </div>

          {areaProjects.length === 0 ? (
            <p className="mt-8 text-muted max-w-[60ch]">
              No projects listed here yet. Tell us what you&rsquo;re looking for
              and we&rsquo;ll send what&rsquo;s available off-listing.
            </p>
          ) : (
            <div className="mt-9 grid gap-6 min-[720px]:grid-cols-2">
              {areaProjects.map((p) => (
                <article
                  key={p.slug}
                  className="rounded-md border border-line bg-white overflow-hidden shadow-sm"
                >
                  <div className="hero-band aspect-[16/9] flex items-end p-5">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.077em] text-accent">
                        {statusLabel[p.status]}
                      </p>
                      <p className="font-display text-[24px] font-bold tracking-[-0.0204em] text-white leading-tight">
                        {p.name}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-display text-[22px] font-bold text-ink tnum">
                        from {usd(p.priceFromUsd)}
                      </p>
                      <TitleBadge status={p.titleStatus} />
                    </div>

                    {/* Hard specs row — the realtor.com convention buyers
                        already know how to read. */}
                    <dl className="mt-4 grid grid-cols-3 gap-3 py-3.5 border-y border-line-soft">
                      {[
                        { k: "Beds", v: `${p.bedsMin}–${p.bedsMax}` },
                        { k: "From", v: `${p.sizeFromM2} m²` },
                        { k: "Delivery", v: p.deliveryQuarter },
                      ].map((s) => (
                        <div key={s.k}>
                          <dt className="font-mono text-[10.5px] uppercase tracking-[0.077em] text-faint">
                            {s.k}
                          </dt>
                          <dd className="font-display text-[15.5px] font-bold text-ink tnum mt-0.5">
                            {s.v}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <p className="mt-3.5 text-[14px] text-muted">
                      {p.developer}
                    </p>
                    <p className="mt-2 text-[13.5px] text-body">
                      {p.amenities.join(" · ")}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <Stamp on={p.verifiedOn} />
                      <Button
                        href="/contact"
                        variant="secondary"
                        className="!px-4 !py-2 !text-[14px]"
                      >
                        Ask about this
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Lead capture ────────────────────────────────────────────────── */}
      <section className="py-[clamp(52px,7vw,80px)]">
        <div className="wrap">
          <div className="hero-band rounded-lg p-[clamp(26px,4vw,44px)] flex flex-wrap items-center justify-between gap-7">
            <div>
              <h2 className="font-display text-[clamp(22px,2.8vw,30px)] font-bold tracking-[-0.019em] text-white max-w-[24ch] leading-tight">
                Want the {area.name} shortlist with title status attached?
              </h2>
              <p className="mt-3 text-white/85 max-w-[54ch]">
                A broker will follow up. You&rsquo;ll get the paperwork status
                first.
              </p>
            </div>
            <Button href="/contact">Get the shortlist</Button>
          </div>
        </div>
      </section>
    </>
  );
}
