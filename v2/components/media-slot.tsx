import Image from "next/image";

/* =============================================================================
   MediaSlot — the single place imagery enters the site.
   =============================================================================
   Renders the plat-grid panel when no photo exists, and a real optimized image
   when one does. Every card and hero goes through this, so when the Airtable
   project photos land, populating `src` is the only change needed — no
   template edits, no layout shift, no per-page conditionals.

   Rule: `alt` must describe the actual photograph. If a slot has no real photo
   of the place it labels, it stays a panel. We do not illustrate Boquete with
   a stock beach.
   ============================================================================= */

type MediaSlotProps = {
  src?: string | null;
  alt?: string;
  /** Overline above the title — region, status, developer. */
  eyebrow?: string;
  title: string;
  /** Small mono line under the title — elevation, climate, delivery date. */
  detail?: string;
  aspect?: string;
  className?: string;
  priority?: boolean;
};

export function MediaSlot({
  src,
  alt,
  eyebrow,
  title,
  detail,
  aspect = "aspect-[16/10]",
  className = "",
  priority = false,
}: MediaSlotProps) {
  return (
    <div
      className={`relative ${aspect} flex flex-col justify-end p-5 overflow-hidden ${
        src ? "bg-brand-900" : "hero-band"
      } ${className}`}
    >
      {src && (
        <>
          <Image
            src={src}
            alt={alt ?? ""}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1040px) 50vw, 33vw"
            className="object-cover"
            priority={priority}
          />
          {/* Scrim so the label stays legible over any photograph. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-brand-900/85 via-brand-900/25 to-transparent"
          />
        </>
      )}

      <div className="relative">
        {eyebrow && (
          <p className="font-mono text-[11px] uppercase tracking-[0.077em] text-white/60">
            {eyebrow}
          </p>
        )}
        <p className="font-display text-[27px] font-bold tracking-[-0.0204em] text-white leading-tight">
          {title}
        </p>
        {detail && (
          <p className="font-mono text-[11.5px] text-accent mt-0.5 tnum">
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}
