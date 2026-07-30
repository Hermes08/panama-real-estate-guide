import Link from "next/link";
import { categories } from "@/lib/content";
import { Button } from "@/components/ui";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-[70px] bg-white/92 backdrop-blur-[10px] border-b border-line">
      <div className="wrap h-full flex items-center gap-8">
        <Link
          href="/"
          className="font-display font-bold text-[17px] tracking-[-0.0204em] text-ink no-underline shrink-0"
        >
          Panama<span className="text-brand">RealEstate</span>Guide
        </Link>

        <nav className="hidden min-[1000px]:flex items-center gap-7 ml-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="font-display text-[14.5px] font-semibold text-body no-underline hover:text-brand transition-colors"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/areas"
            className="font-display text-[14.5px] font-semibold text-body no-underline hover:text-brand transition-colors"
          >
            Areas
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/about"
            className="hidden min-[1000px]:block font-display text-[14.5px] font-semibold text-muted no-underline hover:text-brand transition-colors"
          >
            How we work
          </Link>
          <Button href="/contact" className="!px-5 !py-2.5 !text-[15px]">
            Talk to us
          </Button>
        </div>
      </div>
    </header>
  );
}
