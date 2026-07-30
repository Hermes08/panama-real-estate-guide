"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Area, Project } from "@/lib/content";
import { usd, m2, statusLabel } from "@/lib/content";
import { MediaSlot } from "@/components/media-slot";
import { TitleBadge, SourceNote } from "@/components/ui";

/* =============================================================================
   Project search — the portal pattern (realtor.com / Zillow / Redfin)
   =============================================================================
   Filter row above, result count + sort, then a card grid. The conventions are
   deliberate: buyers already know how to read this layout, and fighting that
   costs conversions for no gain.

   Two departures, both because these are developments rather than resale homes:
   · A project has many unit types, so the card shows a price FROM and a unit
     count instead of one price and one bed/bath figure.
   · Delivery quarter replaces days-on-market.

   Not built yet: the map pane. Airtable carries no coordinates, and placing
   pins at area centroids would imply a precision we do not have.
   ============================================================================= */

type SortKey = "price-asc" | "price-desc" | "units-desc" | "name";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "price-asc", label: "Price (low to high)" },
  { key: "price-desc", label: "Price (high to low)" },
  { key: "units-desc", label: "Most unit types" },
  { key: "name", label: "Name (A–Z)" },
];

const PRICE_BANDS = [
  { key: "any", label: "Any price", min: 0, max: Infinity },
  { key: "u200", label: "Under $200k", min: 0, max: 200_000 },
  { key: "200-400", label: "$200k – $400k", min: 200_000, max: 400_000 },
  { key: "400-700", label: "$400k – $700k", min: 400_000, max: 700_000 },
  { key: "700plus", label: "$700k+", min: 700_000, max: Infinity },
];

const control =
  "rounded-sm border border-line bg-white px-3 py-2 text-[14.5px] text-body focus:border-brand outline-none cursor-pointer";

export function ProjectSearch({
  projects,
  areas,
}: {
  projects: Project[];
  areas: Area[];
}) {
  const [area, setArea] = useState("all");
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState("all");
  const [band, setBand] = useState("any");
  const [sort, setSort] = useState<SortKey>("price-asc");

  const regions = useMemo(
    () => [...new Set(areas.map((a) => a.region))].sort(),
    [areas],
  );

  const visibleAreas = useMemo(
    () => (region === "all" ? areas : areas.filter((a) => a.region === region)),
    [areas, region],
  );

  const results = useMemo(() => {
    const price = PRICE_BANDS.find((b) => b.key === band)!;

    const filtered = projects.filter((p) => {
      if (area !== "all" && p.areaSlug !== area) return false;
      if (region !== "all") {
        const a = areas.find((x) => x.slug === p.areaSlug);
        if (a?.region !== region) return false;
      }
      if (status !== "all" && p.status !== status) return false;
      const from = p.priceFromUsd ?? 0;
      if (from < price.min || from > price.max) return false;
      return true;
    });

    const sorted = [...filtered];
    if (sort === "price-asc")
      sorted.sort((a, b) => (a.priceFromUsd ?? 0) - (b.priceFromUsd ?? 0));
    if (sort === "price-desc")
      sorted.sort((a, b) => (b.priceFromUsd ?? 0) - (a.priceFromUsd ?? 0));
    if (sort === "units-desc")
      sorted.sort((a, b) => b.models.length - a.models.length);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [projects, areas, area, region, status, band, sort]);

  const reset = () => {
    setArea("all");
    setRegion("all");
    setStatus("all");
    setBand("any");
  };

  const filtered =
    area !== "all" || region !== "all" || status !== "all" || band !== "any";

  return (
    <>
      {/* ── Filter row — one row above the results, portal convention ────── */}
      <div className="sticky top-[70px] z-40 bg-white/95 backdrop-blur-[10px] border-b border-line">
        <div className="wrap py-3.5 flex flex-wrap items-center gap-2.5">
          <select
            aria-label="Region"
            className={control}
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setArea("all");
            }}
          >
            <option value="all">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            aria-label="Area"
            className={control}
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            <option value="all">All areas</option>
            {visibleAreas.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Price"
            className={control}
            value={band}
            onChange={(e) => setBand(e.target.value)}
          >
            {PRICE_BANDS.map((b) => (
              <option key={b.key} value={b.key}>
                {b.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Build status"
            className={control}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Any status</option>
            <option value="preselling">Preselling</option>
            <option value="under-construction">Under construction</option>
            <option value="delivered">Delivered</option>
          </select>

          {filtered && (
            <button
              onClick={reset}
              className="font-display text-[14px] font-semibold text-brand underline underline-offset-2 cursor-pointer px-2"
            >
              Clear
            </button>
          )}

          <select
            aria-label="Sort by"
            className={`${control} ml-auto`}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      <div className="wrap py-[clamp(28px,4vw,44px)]">
        <p
          aria-live="polite"
          className="font-display text-[17px] font-bold text-ink"
        >
          {results.length} project{results.length === 1 ? "" : "s"}
          <span className="font-body font-normal text-muted">
            {" "}
            {area !== "all"
              ? `in ${areas.find((a) => a.slug === area)?.name}`
              : region !== "all"
                ? `in ${region}`
                : "across Panama"}
          </span>
        </p>

        {results.length === 0 ? (
          <div className="mt-8 rounded-md border border-dashed border-line bg-paper-warm p-8 max-w-[60ch]">
            <p className="font-display text-[19px] font-bold text-ink">
              Nothing matches those filters
            </p>
            <p className="mt-2.5 text-muted">
              We track {projects.length} projects in total. Widen the price band
              or clear the area filter.
            </p>
            <button
              onClick={reset}
              className="mt-4 font-display font-semibold text-brand underline underline-offset-2 cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="mt-7 grid gap-6 min-[680px]:grid-cols-2 min-[1080px]:grid-cols-3">
            {results.map((p) => {
              const a = areas.find((x) => x.slug === p.areaSlug);
              return (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="group flex flex-col rounded-md border border-line bg-white overflow-hidden no-underline shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200"
                >
                  <MediaSlot
                    src={p.photos[0]?.src}
                    alt={`${p.name}, ${a?.name ?? ""}`}
                    eyebrow={p.status ? statusLabel[p.status] : undefined}
                    title={p.name}
                    aspect="aspect-[4/3]"
                  />

                  <div className="flex flex-col flex-1 p-5">
                    <p className="font-display text-[23px] font-bold text-ink tnum leading-none">
                      from {usd(p.priceFromUsd)}
                    </p>

                    {/* Portal convention: hard specs immediately under price. */}
                    <p className="mt-2.5 text-[14.5px] text-body">
                      {[
                        p.bedsMin != null
                          ? `${p.bedsMin === p.bedsMax ? p.bedsMin : `${p.bedsMin}–${p.bedsMax}`} bed`
                          : null,
                        p.sizeFromM2 != null ? `from ${m2(p.sizeFromM2)}` : null,
                        p.models.length
                          ? `${p.models.length} unit type${p.models.length === 1 ? "" : "s"}`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>

                    <p className="mt-2 text-[14.5px] text-muted">
                      {a?.name}
                      {a?.region ? `, ${a.region}` : ""}
                    </p>

                    <div className="mt-3">
                      <TitleBadge status="unknown" />
                    </div>

                    {/* Brokerage attribution. Portals put the listing source on
                        every card and it is a habit worth keeping — but
                        Airtable has no Developer or Broker field yet, so this
                        stays generic rather than inventing a name. */}
                    <div className="mt-auto pt-4">
                      <SourceNote>Developer listing</SourceNote>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
