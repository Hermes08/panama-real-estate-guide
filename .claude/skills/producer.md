---
name: producer
description: Produce one guide page for the user's luxury Panama real estate guide business interactively, following the 5-step workflow (brief → research → outline → draft → review). Pulls the next item from the production queue, walks the user through each decision with approval checkpoints, drafts a context-aligned guide page (zone guide, project page, legal/visa explainer, lifestyle article), then marks the queue item done. Use when the user says "produce the next one", "make a guide page", "draft a guide page", "ship the next queued item", or asks for a guide page on any specific topic.
allowed-tools: Read, Write, Edit, Bash, WebFetch
---

# System 2 — Producer (luxury Panama real estate guide)

Produce ONE guide page for luxury Panama real estate guide, walking the user through a 5-step workflow with approval checkpoints.

## When to invoke

User says any of:
- "produce" / "make" / "draft" / "write" the next guide page
- "ship the next queued item"
- "system 2" / "producer"
- "produce a guide page about <topic>"

If the user says "produce 3 guide pages" or "ship the whole queue", politely refuse. One per invocation by design, every guide page needs human-in-the-loop on brief, sources, and outline. Offer to run again after this one ships.

## What you do (high level)

Five steps, interactive:

1. **Brief** — pick from the queue (or accept a user-named target), confirm the angle, ask about topic-specific experience
2. **Research** — pull 8 to 12 sources from WebFetch + internal Articles/ + data.js project metadata, present numbered, wait for approval / swap / reject
3. **Outline** — full structure with section headings, internal-link picks (other articles + project pages), experience callouts, fact callouts. Wait for approval.
4. **Draft** — write it. Do not ask permission to start drafting.
5. **Review** — self-checklist, fix failures, then show the user the report. Save to `output/production/`.

## Project root

All paths relative to `/Users/davidaguirre/Documents/Claude/Projects/Panama Real Estate Guide/.claude/worktrees/keen-swirles-69a651`.

## Read context first

Read all 8 files in `context/` before doing anything. If any are missing, stop and tell the user to run `context-bootstrapper` first.

Also load the project + article index from `data.js` (project metadata) and the `Articles/` folder (existing draft articles) so internal-link picks are real.

## Pick the next item

Read `state/content-queue.json`. Show the top 3 queued items:

```
Top 3 queued guide topics:
  1. <title>   (priority 1, fit 87, queued YYYY-MM-DD)
  2. <title>   (...)
  3. <title>   (...)

Which one? (1/2/3, or name a different topic)
```

If a refresh-queue item is also pending and higher priority than the top queue item, surface it instead. Refreshes from System 4 use the same producer.

## Step 1 — Brief

Confirm the angle in one sentence. Then ASK the user:

```
What's your topic-specific experience? Stories, customers, numbers, a strong opinion
on this particular angle (a deal you closed in this zone, a visa case for this profile,
a project you toured)? If you have nothing, say "research only" and I'll produce
a research-only guide page that doesn't fake first-person experience.
```

Wait for the answer. Capture it verbatim into the brief.

## Step 2 — Research

Pull 8 to 12 sources from `WebFetch + internal Articles/ + data.js project metadata`. For each source capture: URL, title, why-it-matters (1 line), what-we-take (1 line).

Mix of source types you should pull:
- Official Panama gov sources (MEF, ANATI, Migración) for legal/visa/tax claims
- Reputable expat / market sources (International Living, Live and Invest Overseas, Galindo Arias Lopez, Morgan & Morgan) for context
- Project-developer sources (developer site, master plan, official renderings) for project pages
- Your own `Articles/` folder for internal-link picks
- Your own `data.js` for project metadata (price band, zone, completion year)

Present them as a numbered list. Wait for the user to approve, reject, or swap. Don't proceed until they say yes.

## Step 3 — Outline

Build the full outline:
- Title (60-70 chars, specific, not generic, US English)
- Sub-hook (1 sentence)
- Section headings (H2, optionally H3)
- For each section: 1-line summary of what it argues + which source(s) back it + whether it calls out user experience or a service / offer fact
- Internal-link picks (where this guide page should link to other live assets, by exact URL from sitemap / Articles index / data.js)
- Calls-to-action (where in the flow, what they offer: buyer consult, visa intro, project tour)

Present the outline. Wait for approval, edits, or rejection.

## Step 4 — Draft

Write the full guide page following the outline. Apply every rule in `context/tone-of-voice.md` and `context/brand-guidelines.md`. Inline-cite sources where claims came from outside the user's own experience.

**Do not** start a section the outline didn't approve. **Do not** invent stats (price per m2, rental yields, visa fees, tax rates). **Do not** name a competitor banned in `brand-guidelines.md`. **Do not** give legal, tax, or financial advice; phrase as "consult a licensed Panamanian attorney" where relevant.

Output format: Markdown with frontmatter (slug, title, description, zone, project, author, date, lang). The static site build pipeline expects lowercase slugs (see Netlify `pretty_urls=true` gotcha).

## Step 5 — Review

Run this self-checklist before showing the user:

- [ ] No em dashes anywhere
- [ ] No banned words / phrases from `brand-guidelines.md`
- [ ] No invented stats, every number traces to a source or to `experience-notes.md`
- [ ] No fabricated customer story
- [ ] No banned competitor mentions
- [ ] No regulated claim (legal, tax, residency guarantee) without an attorney-consult line
- [ ] Tone matches `tone-of-voice.md` (read 2 sample paragraphs against the file)
- [ ] Internal-link picks exist (verify against sitemap / Articles / data.js, no 404 promises)
- [ ] CTA present, on-brand
- [ ] Word count appropriate for guide page type (zone guide: 1500-2500, project page: 800-1400, legal/visa: 1800-3000)
- [ ] Title is specific, not generic
- [ ] Slug is lowercase (Netlify pretty_urls gotcha)
- [ ] Frontmatter complete

Fix any failures, then show the user the report.

## Step 6 — Save and hand off

1. Write the guide page to `output/production/<YYYY-MM-DD>-<slug>.md`
2. Update `state/content-queue.json`: mark item `status: "done"`, set `produced_at`, `output_path`
3. If `context/integrations.json` defines a CMS / static-site path, attempt publish (commit to a branch, NOT direct to main). Otherwise leave for manual upload.
4. Re-render the LOCAL dashboard:
   ```bash
   cd "/Users/davidaguirre/Documents/Claude/Projects/Panama Real Estate Guide/.claude/worktrees/keen-swirles-69a651" && python3 scripts/render-dashboard.py
   ```
5. Tell the user: "Run `bash scripts/publish-dashboard.sh` to push the live dashboard at https://panamarealestateguide.com/dashboard/." Do not auto-publish.
6. Print a one-paragraph summary with the file path.

## Empty queue handling

If the queue is empty and the user didn't name a topic, tell them:

```
The production queue is empty. Run /discovery to find new guide topics, then come back.
```

Offer to invoke `/discovery` if they confirm.

## Cost expectation

Typical run: 25 to 40 minutes wall-clock (most of it waiting for user approvals), $0.30 to $0.80 in Claude API + WebFetch calls.

## Hard rules

- Read all 8 context files on every invocation.
- One guide page per invocation.
- Never auto-publish before writing the local file in `output/production/`.
- Never fabricate a citation, customer story, stat, or business fact. If you can't back it up, drop it or flag `[TK: confirm]`.
- Never give legal, tax, or financial advice; defer to licensed professionals.
- Never edit `state/keyword-bank.json` (System 1 owns it).
- Update `state/content-queue.json` only by changing the status of the item you produced.
- Never use em dashes.

---

Based on the Four Systems framework by @NicoSKOOL: https://github.com/NicoSKOOL/the-four-systems
