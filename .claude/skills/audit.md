---
name: audit
description: Run on-demand health audit on the user's live luxury Panama real estate guide pages using DataForSEO Lighthouse via MCP + WebFetch. Audits the homepage and 2-5 priority pages from context/audit-targets.txt for performance, technical health, schema validity, brand-guideline compliance, and the listing/guide-page checklist for luxury Panama real estate guide. Use when the user asks for a health check, audit, quality scan, "is my site/page healthy", or wants to triage live assets.
allowed-tools: Read, Write, Edit, Bash, WebFetch
---

# System 3 — Audit (luxury Panama real estate guide)

Run a health audit on the user's priority pages and produce an actionable report.

## When to invoke

User says any of:
- "audit" / "health check" / "system 3"
- "scan my pages"
- "is my page healthy"
- "check the luxury Panama real estate guide basics"
- "lighthouse audit" / "DataForSEO Lighthouse audit"

## Targets

The audit runs against URLs in `context/audit-targets.txt`, one per line. If the file is missing, ask the user for 2 to 5 priority targets (their most-important live pages: homepage, top-trafficked zone guide, top-trafficked project page, top-trafficked legal/visa article, top-converting lead page) and offer to write the file.

Do NOT silently expand the list. The user controls what gets audited.

## Workflow

### Step 1 — Read context

Read `context/site-config.md`, `context/services.md`, `context/brand-guidelines.md`. The audit must check compliance with brand rules in addition to technical health.

### Step 2 — Pull data

For each target, pull:
- DataForSEO Lighthouse run (mobile + desktop): LCP, FID/INP, CLS, TBT, TTI, PSI scores
- The page content itself (WebFetch the URL)
- Schema / structured-data extraction (RealEstateListing, Article, BreadcrumbList, FAQPage, Organization, LocalBusiness)
- Sitemap presence + canonical correctness
- hreflang if multi-language

Drive the Lighthouse pulls through `anthropic-skills:dataforseo`. If auth fails, fall back to: ask the user to paste a PageSpeed Insights screenshot/JSON.

### Step 3 — Score against the industry checklist

For luxury Panama real estate guide, check:

**Universal**
- Load speed (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- Mobile rendering / responsive layout
- Accessibility basics (alt text on hero + gallery images, contrast, headings hierarchy)
- Security headers (HSTS, CSP, X-Content-Type-Options, Referrer-Policy)
- Broken internal links
- Schema validity if present (run via schema.org validator)
- HTTPS + correct canonical (lowercase, per Netlify pretty_urls gotcha)

**Brand compliance** (from `brand-guidelines.md`)
- Banned words present?
- Banned competitor mentions present?
- Brand spellings correct (Panama Real Estate Guide, panamarealestateguide.com)?
- Regulated claims violated (legal/tax/residency guarantees without attorney-consult line)?
- Currency consistency (USD/PAB)

**Real estate / guide-page specific**
- For project / listing pages: RealEstateListing schema present? Photo count + sizes (>=8 photos, >=1200px wide)? Floor plan? Contact CTA above the fold? Price visible + currency labeled? Last-updated date visible?
- For area / zone guides: GeoCoordinates / Place schema? Embedded map? Top-projects internal links? Top-articles internal links?
- For legal / visa articles: Author byline + credentials? Last-updated date < 12 months? Attorney-consult disclaimer? Government source citations?
- For all pages: OG image present + correct size? Twitter card? hreflang en/es if applicable? Sitemap inclusion?
- YouTube embed (channel @panamarealestateguidetv) if relevant for the page topic, with lazy-load

### Step 4 — Severity classification

For each finding, assign:
- `critical` (breaks the customer flow, violates brand-guidelines, or violates Panama regulation around legal/tax/residency claims)
- `high` (measurably hurts conversion / discoverability: missing schema, LCP > 4s, broken main CTA)
- `medium` (worth fixing this quarter)
- `low` (nice-to-have)

Group findings by target, then by severity.

### Step 5 — Write outputs

1. `/Users/davidaguirre/Documents/Claude/Projects/Panama Real Estate Guide/.claude/worktrees/keen-swirles-69a651/state/onsite-audit.json` — structured findings, one record per (target, finding)
2. `/Users/davidaguirre/Documents/Claude/Projects/Panama Real Estate Guide/.claude/worktrees/keen-swirles-69a651/output/audits/<YYYY-MM-DD>-audit.md` — human-readable report with:
   - Executive summary (X critical, Y high, Z medium, W low)
   - Per-target breakdown
   - Top 5 highest-impact fixes the user should tackle this week
   - Methodology footnote (what data source, what was checked, what was skipped)
3. Re-render the LOCAL dashboard:
   ```bash
   cd "/Users/davidaguirre/Documents/Claude/Projects/Panama Real Estate Guide/.claude/worktrees/keen-swirles-69a651" && python3 scripts/render-dashboard.py
   ```
   To push to live: `bash scripts/publish-dashboard.sh` (intentional, ~2-3 min Netlify deploy).

### Step 6 — Hand off

Print to the user:
- One-line summary
- Path to the markdown report
- Path to the dashboard
- Top 3 critical findings inline so they don't have to open the report to know what's urgent

## Cost expectation

- DataForSEO Lighthouse: $0.05 to $0.20 per target, 2 to 5 minutes total for 5 targets
- Manual fallback: $0.05 Claude API, 5 to 10 minutes

## Hard rules

- Only audit targets in `context/audit-targets.txt`.
- Never invent scores or metrics. If Lighthouse returns null, write null.
- Recommendations must reference real findings (no generic "improve SEO" advice).
- Write to `state/onsite-audit.json` AND `output/audits/`.
- Never edit other state files.
- Never use em dashes.

---

Based on the Four Systems framework by @NicoSKOOL: https://github.com/NicoSKOOL/the-four-systems
