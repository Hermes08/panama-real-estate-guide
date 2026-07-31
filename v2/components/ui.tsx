import Link from "next/link";
import type { TitleStatus } from "@/lib/content";
import { titleLabel } from "@/lib/content";

/* ── The signature. Nothing carries a stamp unless it was actually checked. ── */

export function Stamp({
  on,
  onDark = false,
}: {
  on: string;
  onDark?: boolean;
}) {
  return (
    <span className={`stamp${onDark ? " stamp-on-dark" : ""}`}>
      Verified {on}
    </span>
  );
}

/* ── Provenance for synced data. ───────────────────────────────────────────
   Deliberately NOT the gold stamp. Figures that came from a developer's own
   listing are unchecked by us, and saying so plainly is what keeps the gold
   stamp meaning something where it does appear. */

export function SourceNote({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.077em] text-faint">
      <span aria-hidden className="w-3 h-px bg-line" />
      {children}
    </span>
  );
}

/* ── Title status. The one fact a foreign buyer must not get wrong. ───────── */

const titleTone: Record<TitleStatus, string> = {
  titled: "text-positive bg-positive-50 border-positive",
  rop: "text-negative bg-negative-50 border-negative",
  mixed: "text-accent-700 bg-accent-50 border-accent-700",
  // Unchecked reads as neutral and dashed — visibly an open question, not a
  // reassurance. Never style this like a pass.
  unknown: "text-muted bg-paper-warm border-line border-dashed",
};

export function TitleBadge({ status }: { status: TitleStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.077em] px-2 py-[3px] rounded-sm border-[1.5px] ${titleTone[status]}`}
    >
      {titleLabel[status]}
    </span>
  );
}

/* ── Buttons. Gold is the only fill on the site. ──────────────────────────── */

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "onDark";
  className?: string;
};

// EasyStreetCap's button metrics: 16px, 12px/24px padding, 4px radius.
const buttonBase =
  "inline-flex items-center justify-center gap-2 font-display text-[16px] font-bold tracking-[0] px-6 py-3 rounded-sm border-[1.5px] no-underline transition-colors duration-150";

const buttonVariants = {
  primary:
    "bg-accent text-brand-900 border-transparent hover:bg-accent-600 hover:text-white",
  secondary:
    "bg-transparent text-brand border-line hover:border-brand hover:bg-brand-50",
  onDark:
    "bg-transparent text-white border-white/40 hover:border-white hover:bg-white/10",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

/* ── Section heading with eyebrow. ────────────────────────────────────────── */

export function SectionHead({
  eyebrow,
  title,
  dek,
  className = "",
}: {
  eyebrow: string;
  title: string;
  dek?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="eyebrow mb-3.5">{eyebrow}</p>
      <h2 className="h2-section max-w-[24ch]">{title}</h2>
      {dek && <p className="dek mt-4 max-w-[62ch]">{dek}</p>}
    </div>
  );
}
