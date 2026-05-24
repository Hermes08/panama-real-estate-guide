---
name: discovery
description: Run on-demand opportunity discovery for luxury Panama real estate guide. Generates 25-40 candidate guide topics (keywords, zones, project angles, lifestyle hooks, legal/visa queries) from a seed input via DataForSEO via MCP, scores intent and priority, dedupes against the rolling opportunity bank, and queues priority-1 items for the producer. Updates the HTML dashboard at the end. Use when the user asks to research guide topics, find new opportunities, fill the production queue, expand topical coverage, or generate ideas for luxury Panama real estate guide.
allowed-tools: Read, Write, Edit, Bash, WebFetch
---

# System 1 — Discovery (luxury Panama real estate guide)

Run discovery for luxury Panama real estate guide using DataForSEO via MCP, with strict deduplication against the rolling opportunity bank so the same guide topics are never researched twice.

## When to invoke

Use when the user asks to:
- Research / find new guide topics (keywords, zones, projects, legal/visa angles, lifestyle hooks)
- Expand the guide page pipeline
- Fan out from a seed (e.g. "Costa del Este", "Friendly Nations visa", "oceanfront condos")
- Fill the production queue
- "Should we work on X?" / "What would be a good guide page target?"

## How to interpret the request

1. **Explicit seed given** ("research X", "fan out Y") → use that seed verbatim.
2. **No seed given** → read `/Users/davidaguirre/Documents/Claude/Projects/Panama Real Estate Guide/.claude/worktrees/keen-swirles-69a651/state/keyword-bank.json -> seeds_researched`. Pick the seed whose `last_researched` is oldest (or never). If every known seed was researched in the last 30 days, tell the user and ask if they want to add a new seed or force a re-research.
3. **Force re-research requested** ("re-run on X", "ignore the bank") → proceed but warn the user how many duplicates that will produce.

## Workflow

### Project root

All paths are relative to `/Users/davidaguirre/Documents/Claude/Projects/Panama Real Estate Guide/.claude/worktrees/keen-swirles-69a651`. Use absolute paths to be safe.

### Read context first

Before any data calls, read the 8 context files:

```
context/site-config.md
context/audience.md
context/tone-of-voice.md
context/experience-notes.md
context/services.md
context/brand-guidelines.md
context/competitors.md
context/author.md
```

If any are missing, stop and tell the user to run the `context-bootstrapper` skill first. Do not run discovery against an empty context folder, it will produce noise.

### Dedup rules (this is the whole point)

Load the bank into memory before any external data call:

```python
import json, pathlib
bank_path = pathlib.Path("/Users/davidaguirre/Documents/Claude/Projects/Panama Real Estate Guide/.claude/worktrees/keen-swirles-69a651/state/keyword-bank.json")
bank = json.loads(bank_path.read_text())
existing = {k["keyword"].lower().strip() for k in bank["keywords"]}
seeds_done = {s["seed"].lower().strip(): s["last_researched"] for s in bank.get("seeds_researched", [])}
```

Then:

1. **Seed-level dedup.** If the seed was researched in the last 30 days, stop and confirm with the user before proceeding.
2. **Item-level dedup.** After fetching candidates from DataForSEO via MCP, filter out any whose `keyword` (case-insensitive) is in `existing`. Never write a duplicate.
3. **Queue-level dedup.** Before appending to `state/content-queue.json`, check `id` and `primary_keyword`. Skip on any match, including items already shipped (`status: "written"`).
4. **Coverage dedup.** Fetch the live sitemap at `https://panamarealestateguide.com/sitemap.xml` (and the per-page article index). Mark items already covered with `covered_by` so the producer skips them. The `Articles/` folder in the worktree also contains drafts to dedup against.

Report the dedup outcome at the end: `Researched N candidates, M new, K queued.`

### Discovery method

`DataForSEO via MCP`. Drive it through the `anthropic-skills:dataforseo` skill so authentication and tool selection are handled for you.

**API-driven**:
- For each seed, run keyword research (keyword ideas + related keywords + SERP analysis)
- Pull 25 to 40 candidates per seed across these intent buckets:
  - Zone queries (e.g. "Costa del Este apartments for sale", "Casco Viejo condos")
  - Project queries (e.g. "Ocean Reef Panama", "Yoo Panama")
  - Lifestyle / decision queries ("retire in Panama", "Panama vs Costa Rica")
  - Legal / visa queries ("Friendly Nations visa Panama", "Panama residency 2026")
  - Financing / tax queries ("Panama property tax", "mortgage for foreigners Panama")
- Score each on volume, intent, difficulty, fit
- Drop fabrications: if the API returns null, leave null

**Manual fallback**: if MCP auth fails, ask the user to paste keyword lists or zone names; produce candidates by reasoning over context.

### Scoring rubric

For each candidate, assign:
- `priority`: 1 (queue for producer now), 2 (hold), 3 (already covered or low fit)
- `fit_score`: 0-100, derived from context match (audience, services, in-scope topics)
- `effort_estimate`: S / M / L for how much work the producer needs

Priority-1 criteria for luxury Panama real estate guide:
- High fit_score (>= 70)
- Not already covered (sitemap check)
- Aligns with at least one in-scope topic from `site-config.md` (zone, project, legal/visa, financing, lifestyle)
- Doesn't violate any rule in `brand-guidelines.md` (no regulated claims, no banned competitor names)
- Search intent is informational or transactional (not navigational to another brand)

### When the run finishes

1. Append NEW (deduped) keywords to `state/keyword-bank.json -> keywords[]`. Each entry: `{keyword, intent, volume, kd, priority, fan_out_parent, covered_by, seed}`. Update `last_updated` and `seeds_researched`.
2. Append priority-1 items to `state/content-queue.json -> items[]` with `{id, status: "queued", queued_at: <today>, post_url: null, primary_keyword, suggested_title, intent, volume, kd, target_word_count, fan_out_cluster:[], internal_link_targets:[], external_authority_candidates:[], notes, suggested_slug}`.
3. Write the per-run CSV to `output/discovery/<YYYY-MM-DD>-<seed-slug>.csv`.
4. Re-render the LOCAL dashboard:
   ```bash
   cd "/Users/davidaguirre/Documents/Claude/Projects/Panama Real Estate Guide/.claude/worktrees/keen-swirles-69a651" && python3 scripts/render-dashboard.py
   ```
5. Print where the local dashboard is (`output/dashboard.html`) and offer to open it.
6. **Do not auto-publish.** Tell the user: "Run `bash scripts/publish-dashboard.sh` to push to https://panamarealestateguide.com/dashboard/ when you want the live view updated (each publish triggers a Netlify build ~2-3 min)."
7. One-paragraph summary: seed used, candidates evaluated, new added, queued, top 3 queued titles.

### Do not

- Do not commit to git. The user reviews first.
- Do not start a second seed in the same run.
- Do not fabricate metrics. Null is acceptable; lying is not.
- Do not edit `state/refresh-queue.json` (System 4's territory).

## Cost expectation

- DataForSEO-driven runs: typically $0.30 to $1.00 per run, 5 to 10 minutes
- Manual fallback runs: ~$0.10 of Claude API, 10 to 15 minutes

## Hard rules

- Read all 8 context files before any external call.
- Never use em dashes anywhere.
- Dedup against the bank before writing.
- One seed per invocation.
- Update only `state/keyword-bank.json` and `state/content-queue.json`. Never touch other state files.

---

Based on the Four Systems framework by @NicoSKOOL: https://github.com/NicoSKOOL/the-four-systems
