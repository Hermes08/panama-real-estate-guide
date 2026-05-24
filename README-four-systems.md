# luxury Panama real estate guide

Four Systems operator framework installed for **luxury Panama real estate guide**.

What this is: an AI-driven Discovery → Producer → Audit → Refresh loop that runs your content + listing pipeline against a shared `context/` folder, shared `state/` JSON, and a shared `output/` directory. Originally an SEO toolkit by [@NicoSKOOL](https://github.com/NicoSKOOL/the-four-systems), adapted here for the Panama Real Estate Guide site.

## Mapping for this project

| System | Role for this project | Data source |
|---|---|---|
| **S1 Discovery** | find new **guide topics** (zone keywords, project angles, lifestyle hooks, legal/visa queries) | DataForSEO via MCP (anthropic-skills:dataforseo) |
| **S2 Producer** | turn one queued topic into a finished **guide page** (zone guide, project page, legal/visa explainer, lifestyle article) | WebFetch + internal `Articles/` + `data.js` project metadata |
| **S3 Audit** | health-check live **pages** (Lighthouse, schema, brand-compliance, listing-page completeness) | DataForSEO Lighthouse via MCP + WebFetch |
| **S4 Refresh** | flag **decaying pages** (decay, stuck rank, stale legal/visa info, dropped queries) and route refreshes back to the producer | Google Search Console via Claude-in-Chrome MCP + anthropic-skills:gsc-live-review |

## How to invoke

The skills are auto-discovered from `.claude/skills/`. Trigger them in natural language:

| Skill | Sample phrases |
|---|---|
| `context-bootstrapper` | "bootstrap my context folder", "set up the context files", "create my business context" |
| `discovery` | "research Costa del Este", "find new guide topics", "fan out on Friendly Nations visa", "fill the production queue" |
| `producer` | "produce the next one", "draft a guide page about Yoo Panama", "ship the next queued item" |
| `audit` | "audit my site", "is the homepage healthy?", "Lighthouse audit on the top 5 pages" |
| `refresh` | "decay scan", "what's broken?", "vital signs", "GSC scan" |

## First-run sequence

```
1. bootstrap my context folder        ← run context-bootstrapper (15-20 min interview)
2. /discovery <seed>                  ← e.g. "Costa del Este apartments for sale"
3. /producer                          ← ship the top queued item
4. /audit                             ← once a few pages are live
5. /refresh                           ← once pages have 28+ days of GSC data
```

## How to change context

The 8 files in `context/` (site-config, audience, tone-of-voice, experience-notes, services, brand-guidelines, competitors, author) are what every skill reads on every run. Edit by hand at any time. To rebuild one file via interview, invoke `context-bootstrapper` and say `regenerate <filename>`.

## Live dashboard

Local: [output/dashboard.html](output/dashboard.html) — re-rendered automatically after every skill run.

Live (protected): **https://panamarealestateguide.com/dashboard/** — Basic Auth, credentials in Netlify env vars `DASHBOARD_USER` / `DASHBOARD_PASS`.

To publish the local dashboard to the live URL:

```bash
bash scripts/publish-dashboard.sh
```

This is intentional, not automatic, because each push triggers a Netlify build (~2-3 min). Run after a meaningful batch of SEO work, not after every individual skill invocation.

## How to schedule hands-off mode

The original repo documents launchd-based scheduling. For this project, prefer:
- macOS launchd plists in `~/Library/LaunchAgents/` invoking `claude code -p` with the skill name
- Or the `/loop` skill from this Claude Code install for ad-hoc recurring runs
- Or the `/schedule` skill for cron-style remote agents

See the original docs: https://github.com/NicoSKOOL/the-four-systems

## Cost expectation

Per full cycle (1 × discovery + 1 × producer + 1 × audit + 1 × refresh):
- Discovery: $0.30 to $1.00 (DataForSEO)
- Producer: $0.30 to $0.80 (Claude API + WebFetch)
- Audit: $0.25 to $1.00 (DataForSEO Lighthouse × 5 targets)
- Refresh: $0.05 (Claude classification, GSC pull is free via Chrome MCP)
- **Total: ~$0.90 to $2.85 per cycle**, ~45-90 minutes wall clock

## Directory layout

```
context/                  ← 8 source-of-truth files (created by context-bootstrapper)
.claude/skills/           ← 5 skill files (context-bootstrapper + 4 systems)
state/
  ├── keyword-bank.json         ← System 1's rolling dedup memory (canonical name)
  ├── content-queue.json        ← System 1 → System 2 hand-off
  ├── refresh-queue.json        ← System 4 → System 2 hand-off
  ├── onsite-audit.json         ← (created by System 3)
  └── refresh-candidates.json   ← (created by System 4)
output/
  ├── discovery/          ← per-run S1 CSVs
  ├── production/         ← finished S2 deliverables (markdown guide pages)
  ├── audits/             ← S3 reports
  ├── refreshes/          ← S4 reports
  └── dashboard.html      ← re-rendered after every run
scripts/render-dashboard.py     ← shared dashboard renderer
```

## Hard rules baked into every skill

- No em dashes anywhere (use colons, commas, parentheses, or split sentences)
- No fabricated stats, citations, or customer stories
- No legal/tax/residency advice without an attorney-consult line
- No banned competitor mentions
- Dedup against the bank before writing
- One seed / one page / one item per invocation

---

Based on the Four Systems framework by @NicoSKOOL: https://github.com/NicoSKOOL/the-four-systems
