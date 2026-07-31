import Link from "next/link";
import { areas, articles, projects } from "@/lib/content";
import { Button, SectionHead } from "@/components/ui";
import { ProjectCard } from "@/components/project-card";
import { EntryPriceChart } from "@/components/entry-price-chart";
import { HeroPriceCollage } from "@/components/hero-price-collage";

// Cheapest first, and one per area so the grid shows the spread of the
// catalogue rather than six towers from whichever area has the most.
const featured = (() => {
  const seen = new Set<string>();
  return [...projects]
    .sort((a, b) => (a.priceFromUsd ?? 0) - (b.priceFromUsd ?? 0))
    .filter((p) => !seen.has(p.areaSlug) && seen.add(p.areaSlug))
    .slice(0, 6);
})();

export default function HomePage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────
          White, two columns — EasyStreetCap's structure. But where they
          publish live rates, we publish the verification ledger: the checked
          figures that decide whether you can buy at all. */}
      <section className="border-b border-line">
        <div className="wrap grid gap-14 py-[clamp(48px,7vw,84px)] min-[980px]:grid-cols-[1.05fr_0.95fr] min-[980px]:items-center">
          <div>
            <p className="eyebrow mb-4">Independent research · Panama</p>
            <h1 className="h1-home max-w-[20ch]">
              Know what you&rsquo;re buying before you wire money.
            </h1>
            <p className="dek mt-6 max-w-[54ch]">
              Most of what foreign buyers lose in Panama is lost before closing
              — on land that was never titled, on a figure nobody checked. We
              publish the checks, with the date we made them.
            </p>

            <div className="mt-9 flex flex-wrap gap-3.5">
              <Button href="/areas">Compare areas</Button>
              <Button
                href="/buying/titled-vs-rights-of-possession"
                variant="secondary"
              >
                Start with title risk
              </Button>
            </div>

            <p className="mt-8 text-[14.5px] text-muted max-w-[46ch]">
              We don&rsquo;t accept payment for coverage. When the honest answer
              is &ldquo;don&rsquo;t buy this,&rdquo; that&rsquo;s what the guide
              says.
            </p>
          </div>

          {/* EasyStreetCap's hero shape: text left, one real photograph right.
              The photo now carries real per-neighborhood asking prices,
              sourced and dated same as everywhere else on the site. */}
          <div className="relative">
            <HeroPriceCollage />
          </div>
        </div>
      </section>

      {/* Real inventory, charted. Replaces a four-tile stat row of invented
          figures — the shape every generated dashboard defaults to, and the
          last place on the site claiming something unsourced. */}
      <EntryPriceChart />

      {/* ── How we work — trust early, above the content ─────────────────── */}
      <section className="bg-white border-b border-line py-[clamp(40px,5vw,60px)]">
        <div className="wrap grid gap-8 min-[880px]:grid-cols-[1fr_auto] min-[880px]:items-center">
          <div>
            <p className="eyebrow mb-3">How we work</p>
            <p className="font-display text-[clamp(19px,2.2vw,24px)] font-semibold leading-snug text-ink max-w-[52ch]">
              Every figure carries a source and the month we checked it. Every
              guide that touches title, tax, or residency law is reviewed before
              it publishes.
            </p>
          </div>
          <Link
            href="/about"
            className="font-display font-semibold text-brand no-underline hover:underline shrink-0"
          >
            Read our method →
          </Link>
        </div>
      </section>

      {/* ── Developments ────────────────────────────────────────────────────
          The homepage previously showed areas twice — once as the chart, once
          as cards — and projects not at all. On a site whose conversion unit
          is the project, that was backwards. The chart above already covers
          areas and links every one of them, so this slot shows real inventory
          instead. */}
      <section className="py-[clamp(56px,7vw,88px)]">
        <div className="wrap">
          <SectionHead
            eyebrow="What's for sale"
            title={`${projects.length} developments, ${areas.filter((a) => a.projectCount > 0).length} areas`}
            dek="Every one listed by its developer, with the unit mix and price range as published. What we have not checked, we say so."
          />

          <div className="mt-11 grid gap-6 min-[640px]:grid-cols-2 min-[1040px]:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard
                key={p.slug}
                project={p}
                area={areas.find((a) => a.slug === p.areaSlug)}
              />
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Button href="/projects" variant="secondary">
              See all {projects.length} developments
            </Button>
            <Link
              href="/contact"
              className="font-display text-[15px] font-semibold text-brand no-underline hover:underline"
            >
              Or tell us what you&rsquo;re after and we&rsquo;ll shortlist →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Guides ──────────────────────────────────────────────────────── */}
      <section className="bg-paper-warm border-y border-line py-[clamp(56px,7vw,88px)]">
        <div className="wrap">
          <SectionHead
            eyebrow="Start here"
            title="The three things that decide whether a purchase goes wrong"
          />

          <div className="mt-11 grid gap-6 min-[720px]:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/${a.categorySlug}/${a.slug}`}
                className="group rounded-md border border-line bg-white p-6 no-underline shadow-sm hover:shadow-md transition-all duration-200"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.077em] text-accent-700">
                  {a.categorySlug}
                </p>
                <h3 className="mt-3 font-display text-[19px] font-semibold leading-snug tracking-[-0.014em] text-ink group-hover:text-brand transition-colors">
                  {a.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  {a.dek}
                </p>
                <p className="mt-5 font-mono text-[12px] text-faint tnum">
                  {a.readMinutes} min · Updated {a.updatedOn}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lead capture ────────────────────────────────────────────────── */}
      <section className="py-[clamp(56px,7vw,88px)]">
        <div className="wrap">
          <div className="hero-band rounded-lg p-[clamp(28px,5vw,56px)] grid gap-9 min-[880px]:grid-cols-[1.1fr_0.9fr] min-[880px]:items-center">
            <div>
              <p className="font-display text-[12px] font-bold uppercase tracking-[0.077em] text-accent mb-3.5">
                Talk to someone
              </p>
              <h2 className="h2-section !text-white max-w-[20ch]">
                A broker will call you. We&rsquo;ll tell you what to ask them.
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-white/85 max-w-[52ch]">
                Send your budget, timeline, and what you want out of the move.
                You&rsquo;ll get a shortlist and the title status of everything
                on it — before anyone tries to sell you something.
              </p>
            </div>
            <div className="flex flex-col gap-3.5 min-[880px]:items-end">
              <Button href="/contact" className="w-full min-[880px]:w-auto">
                Get your shortlist
              </Button>
              <Button
                href="/about"
                variant="onDark"
                className="w-full min-[880px]:w-auto"
              >
                How we make money
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
