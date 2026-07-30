import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  areas,
  getArea,
  getProjectsForArea,
  usd,
  m2,
  statusLabel,
} from "@/lib/content";
import { Button, TitleBadge, SourceNote } from "@/components/ui";
import { MediaSlot } from "@/components/media-slot";

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
    title: `${area.name} property guide — prices, projects, title risk`,
    description: `${area.projectCount} development${area.projectCount === 1 ? "" : "s"} in ${area.name}, ${area.region}, from ${usd(area.priceFromUsd)}.`,
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const areaProjects = getProjectsForArea(slug);

  const specs = [
    { k: "Entry price", v: usd(area.priceFromUsd) },
    { k: "Upper range", v: usd(area.priceToUsd) },
    { k: "Projects", v: String(area.projectCount) },
    area.elevationM != null
      ? { k: "Elevation", v: `${area.elevationM}m` }
      : null,
    area.climate ? { k: "Climate", v: area.climate } : null,
  ].filter((s): s is { k: string; v: string } => s !== null);

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

          <p className="font-display text-[13px] font-bold uppercase tracking-[0.077em] text-accent mb-3">
            {area.region}
          </p>
          <h1 className="h1-article !text-white max-w-[18ch]">{area.name}</h1>
          {area.positioning && (
            <p className="dek !text-white/90 mt-5 max-w-[62ch]">
              {area.positioning}
            </p>
          )}

          <hr className="border-0 h-px bg-accent/45 my-7" />

          {/* Hard specs, realtor.com style — surfaced immediately. */}
          <dl className="flex flex-wrap gap-x-10 gap-y-5">
            {specs.map((s) => (
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
            <SourceNote>Prices as listed by developers</SourceNote>
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
                  : area.titleStatus === "titled"
                    ? "bg-positive-50 border-positive"
                    : "bg-paper-warm border-line"
            }`}
          >
            <p className="font-display text-[14px] font-bold uppercase tracking-[0.077em] text-ink">
              Before you shortlist anything here
            </p>
            <div className="mt-3">
              <TitleBadge status={area.titleStatus} />
            </div>
            <p className="mt-3.5 text-[16px] leading-relaxed text-body max-w-[62ch]">
              {area.titleNote ??
                `We have not yet checked whether land in ${area.name} is titled or held as Rights of Possession. Until we have, treat every listing here as unverified and ask the seller for a finca number before you pay anything.`}
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
            <h2 className="h2-section max-w-[24ch]">Projects in {area.name}</h2>
            <p className="font-mono text-[13px] text-muted tnum">
              {areaProjects.length} listed
            </p>
          </div>

          <div className="mt-9 grid gap-6 min-[720px]:grid-cols-2">
            {areaProjects.map((p) => {
              const specRow = [
                p.bedsMin != null
                  ? {
                      k: "Beds",
                      v:
                        p.bedsMin === p.bedsMax
                          ? String(p.bedsMin)
                          : `${p.bedsMin}–${p.bedsMax}`,
                    }
                  : null,
                p.sizeFromM2 != null ? { k: "From", v: m2(p.sizeFromM2) } : null,
                p.models.length
                  ? { k: "Unit types", v: String(p.models.length) }
                  : null,
              ].filter((s): s is { k: string; v: string } => s !== null);

              return (
                <article
                  key={p.slug}
                  className="rounded-md border border-line bg-white overflow-hidden shadow-sm flex flex-col"
                >
                  <MediaSlot
                    src={p.photos[0]?.src}
                    alt={`${p.name}, ${area.name}`}
                    eyebrow={p.status ? statusLabel[p.status] : undefined}
                    title={p.name}
                    aspect="aspect-[16/9]"
                  />

                  <div className="p-5 flex flex-col flex-1">
                    {/* Price and badge stack rather than share a row — the
                        badge label is too wide to sit beside a price without
                        forcing an ugly wrap. */}
                    <p className="font-display text-[22px] font-bold text-ink tnum">
                      from {usd(p.priceFromUsd)}
                      {p.priceToUsd && p.priceToUsd !== p.priceFromUsd && (
                        <span className="text-muted font-semibold text-[17px]">
                          {" "}
                          to {usd(p.priceToUsd)}
                        </span>
                      )}
                    </p>
                    <div className="mt-2.5">
                      <TitleBadge status="unknown" />
                    </div>

                    {specRow.length > 0 && (
                      <dl className="mt-4 grid grid-cols-3 gap-3 py-3.5 border-y border-line-soft">
                        {specRow.map((s) => (
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
                    )}

                    {p.amenities.length > 0 && (
                      <p className="mt-3.5 text-[13.5px] leading-relaxed text-body flex-1">
                        {p.amenities.slice(0, 4).join(" · ")}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <SourceNote>Developer listing</SourceNote>
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
              );
            })}
          </div>
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

      {/* ── Nearby ──────────────────────────────────────────────────────── */}
      <section className="border-t border-line py-[clamp(40px,5vw,64px)]">
        <div className="wrap">
          <p className="eyebrow mb-4">Also in {area.region}</p>
          <div className="flex flex-wrap gap-2.5">
            {areas
              .filter((a) => a.region === area.region && a.slug !== area.slug)
              .map((a) => (
                <Link
                  key={a.slug}
                  href={`/areas/${a.slug}`}
                  className="rounded-full border border-line px-4 py-1.5 font-display text-[13.5px] font-semibold text-body no-underline hover:border-brand hover:text-brand transition-colors"
                >
                  {a.name}{" "}
                  <span className="text-faint tnum">({a.projectCount})</span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
