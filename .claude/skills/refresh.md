---
name: refresh
description: Pull live performance data from Google Search Console (via Claude-in-Chrome MCP + anthropic-skills:gsc-live-review) for the user's luxury Panama real estate guide business, flag decaying pages (assets that are decaying, stuck, or underperforming), classify each as refresh / quick_fix / retire / ignore, and route refresh-class items into the production queue for the producer. Use when the user asks for a decay scan, performance health check, "what's broken on my site", vital signs, refresh recommender, or wants to triage underperforming pages.
allowed-tools: Read, Write, Edit, Bash, WebFetch
---

# System 4 — Refresh (luxury Panama real estate guide)

Pull live performance data, flag decaying pages, classify each, and route refresh candidates back into the producer's queue. The point: the system tells the user what's broken before they go looking.

## When to invoke

User says any of:
- "refresh" / "system 4" / "vital signs"
- "decay scan" / "performance scan"
- "what's broken" / "what's decaying"
- "GSC scan" / "Search Console scan"
- "find decaying pages I should refresh"

## Workflow

Two phases.

### Phase 1 — Pull performance data

Drive the GSC pull through `anthropic-skills:gsc-live-review` (Claude-in-Chrome MCP, uses David's existing browser session, no OAuth setup). Pull a comparable two-window dataset:

- GSC: last 28 days vs previous 28 days, per page on `panamarealestateguide.com`
- Also pull per-query (top 50 queries for the site) to spot CTR-outlier opportunities
- If GA4 is configured in `context/integrations.json`, also pull GA4 landing-page sessions & conversions for the same windows

Compute deltas per page:
- `clicks_delta` (last 28d vs previous 28d)
- `impressions_delta`
- `position_delta` (average position)
- `ctr_delta`
- `last_updated` (when the page was last produced or edited, from frontmatter / git log / sitemap lastmod)

### Phase 2 — Flag

Apply luxury Panama real estate guide-appropriate flags:

- **decaying**: clicks_delta < -25% AND page is older than 6 months
- **stuck**: average position 5-15 with no movement for 90 days (typical for high-value guide queries)
- **dropped**: was top-10 last window, fell out of top 10 this window
- **ctr_outlier**: high impressions (>1000/28d) but CTR more than 2σ below site median (typical of weak titles or weak meta descriptions)
- **stale**: not updated in 12+ months AND has any traffic, especially relevant for legal/visa pages where regulation changes
- **zero_traffic**: deployed for 90+ days, never produced material results (re-target the angle, or retire)

Write all flagged items to `/Users/davidaguirre/Documents/Claude/Projects/Panama Real Estate Guide/.claude/worktrees/keen-swirles-69a651/state/refresh-candidates.json`.

### Phase 3 — Classify (interactive)

Read each flagged item and propose one of:

- `refresh` → route to producer (overhaul angle, sources, sections, fresh data: new price points, new visa rules, new market stats)
- `quick_fix` → a short list of one-line changes the user can do today (fix a title, replace a stat, add a new section, fix a broken link, add schema, swap a hero photo, refresh a YouTube embed)
- `retire` → kill it, redirect, or unpublish (especially for outdated visa programs, sold-out projects)
- `ignore` → seasonality / known-cause / not worth the effort

In interactive mode, show the user each top-priority flag and your proposed classification. Get yes/no per item. After a few approvals where the user agrees, you can batch the rest. Always show the final tally before writing.

### Phase 4 — Route and report

1. Items classified `refresh` → append to `state/refresh-queue.json` (the producer reads this in addition to its own production queue)
2. Items classified `quick_fix` → list them in the report so the user can do them today
3. Items classified `retire` → list with a recommended action (301 redirect, unpublish, archive)
4. Items classified `ignore` → log the reason
5. Write `output/refreshes/<YYYY-MM-DD>-refresh.md` with the full breakdown
6. Re-render the LOCAL dashboard:
   ```bash
   cd "/Users/davidaguirre/Documents/Claude/Projects/Panama Real Estate Guide/.claude/worktrees/keen-swirles-69a651" && python3 scripts/render-dashboard.py
   ```
   To push to live: `bash scripts/publish-dashboard.sh` (intentional, ~2-3 min Netlify deploy).
7. Print one-line summary: `Refresh scan complete. N refreshes queued, M quick fixes flagged, K retires recommended.`

Tell the user where to look:
- "Quick fixes for today: see `output/refreshes/<date>-refresh.md` -> Quick fixes table"
- "Refreshes queued for the producer: run /producer to ship the next one"

## Cost expectation

- GSC via Chrome MCP: free (uses David's existing session)
- GA4 (if configured): free with the free tier
- Classification pass: ~$0.05 of Claude API
- Wall clock: 3 to 5 minutes typical

## Hard rules

- Never invent flags. Only classify what's in `state/refresh-candidates.json`.
- Never modify `state/keyword-bank.json` or `state/content-queue.json`. Only `state/refresh-queue.json` is yours.
- If GSC auth (Chrome session) fails, stop and tell the user to log into Search Console in Chrome first.
- Use the user's existing classification preferences from past runs (read the most recent `output/refreshes/*.md` to learn what they tend to mark `ignore` and why).
- For legal/visa pages flagged `stale`, default to `refresh` not `ignore`, regulation drift carries real risk.
- Never use em dashes.

---

Based on the Four Systems framework by @NicoSKOOL: https://github.com/NicoSKOOL/the-four-systems
