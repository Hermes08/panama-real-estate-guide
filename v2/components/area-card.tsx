import Link from "next/link";
import type { Area } from "@/lib/content";
import { usd } from "@/lib/content";
import { Stamp, TitleBadge } from "@/components/ui";
import { MediaSlot } from "@/components/media-slot";

export function AreaCard({ area }: { area: Area }) {
  return (
    <Link
      href={`/areas/${area.slug}`}
      className="group flex flex-col rounded-md border border-line bg-white overflow-hidden no-underline shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200"
    >
      {/* Photo when we have one, plat-grid panel until then. */}
      <MediaSlot
        src={area.photo}
        alt={area.photoAlt}
        eyebrow={area.region}
        title={area.name}
        detail={`${area.elevationM}m · ${area.climate}`}
      />

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-[19px] font-bold text-ink tnum">
            {usd(area.priceFromUsd)} – {usd(area.priceToUsd)}
          </p>
          <p className="font-mono text-[12px] text-muted tnum">
            {area.projectCount} projects
          </p>
        </div>

        <p className="mt-3 text-[15px] leading-relaxed text-muted flex-1">
          {area.positioning}
        </p>

        <div className="mt-4 pt-4 border-t border-line-soft">
          <TitleBadge status={area.titleStatus} />
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-body">
            {area.titleNote}
          </p>
          <div className="mt-3.5">
            <Stamp on={area.verifiedOn} />
          </div>
        </div>
      </div>
    </Link>
  );
}
