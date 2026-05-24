---
name: context-bootstrapper
description: Interviews the user about their luxury Panama real estate guide business and generates the 8 context files that Systems 1-4 read on every run (site-config, audience, tone-of-voice, experience-notes, services, brand-guidelines, competitors, author). Fetches the user's website (panamarealestateguide.com) first to pre-fill what it can see, then asks only what it cannot infer. Use when setting up the four systems for the first time, or when the user says "bootstrap my context folder", "set up the context files", "create my business context", or "I want to onboard a new luxury Panama real estate guide project".
allowed-tools: Read, Write, Edit, Bash, WebFetch
---

# Context Bootstrapper (System 0) — luxury Panama real estate guide

Generate the 8 context files that Systems 1 through 4 read on every run. Instead of making the user write 8 files from scratch, conduct a 15 to 20 minute structured interview, fetch their website (panamarealestateguide.com plus the deployed sister surfaces) to pre-fill what you can see, and write each file to disk as you go.

## Files you will produce

Save all of these to `/Users/davidaguirre/Documents/Claude/Projects/Panama Real Estate Guide/.claude/worktrees/keen-swirles-69a651/context/`. Create the directory if missing.

```
context/
├── site-config.md          ← identity, what the business is, in/out of scope topics
├── audience.md             ← who the customer is, what they already know, what they hate
├── tone-of-voice.md        ← voice rules, formatting rules, sample phrases
├── experience-notes.md     ← real wins, stories, opinions, customer situations
├── services.md             ← what the business sells, pricing, what's included
├── brand-guidelines.md     ← banned words, regulated claims, competitor exclusions
├── competitors.md          ← who else competes, gaps, moat
└── author.md               ← byline / signer / spokesperson identity for schema and attribution
```

## Workflow

### Phase 1 — Orient (1 minute)

Greet the user:

```
I'll set up your luxury Panama real estate guide context folder. The four operator systems read
these files on every run, so the quality of every guide page, every audit, and
every recommendation depends entirely on what we put here.

Plan: I'll fetch your website first (homepage + 2-3 representative pages),
then ask you about 8 sections. Total: 15-20 minutes. You can stop and resume
anytime, everything is saved to disk as we go.

Do you have a live website or public profile for this business? If yes, what's
the URL?
```

If no public web presence, skip Phase 2.

### Phase 2 — Website / public-presence analysis (3 minutes)

WebFetch the homepage. If a sitemap or obvious landing/portfolio page exists, fetch up to 3 more. Look for, and report back:

- What the business does (1-line value prop)
- Voice samples (sentence patterns, formality, sentence length, pet phrases)
- Visible audience signals (who the copy speaks to)
- Apparent competitors (mentioned in copy, in comparison pages, in reviews)
- Author / spokesperson bylines
- Service / offer pages and pricing if visible
- Existing proof (testimonials, numbers, case studies, awards)

Summarize in 6 to 10 bullets and ask: *"This is what I picked up. I'll use these as starting drafts; you confirm or correct each as we go."*

### Phase 3 — Structured interview (12 to 18 minutes)

Run these sections in order. After each, write the file. Show the user a 5-line preview and let them adjust.

**Hard rule for every generated file: no em dashes.** Use colons, commas, parentheses, or split sentences.

#### A. site-config.md

Confirm or capture:
- One-paragraph specific description of what the business is, who it serves, what makes it different. Push back on vague answers. "We help businesses with X" is rejected. Demand: dollars, percent, named tech, named customer types, named geography.
- 8-15 in-scope topics / verticals / offer types (zones, project types, legal/visa, financing, lifestyle)
- 5-10 out-of-scope topics (what NOT to chase)

Write `context/site-config.md`:

```markdown
# Business: <name>

## What it is
<one paragraph, specific to luxury Panama real estate guide>

## In scope
- <area 1>
- <area 2>

## Out of scope
- <area>
```

#### B. audience.md

Ask:
1. Who is your primary customer? (HNW expat, retiree, Friendly Nations applicant, regional investor, role, segment, location)
2. What do they already know, what can we skip explaining?
3. What problem brings them to you?
4. What have they tried that didn't work?
5. What do they HATE in luxury Panama real estate guide marketing/content/communication?

Write `context/audience.md` matching the structure used in the original framework.

#### C. tone-of-voice.md

Use voice samples from Phase 2 if any. Ask:
1. Direct/punchy, conversational, academic, irreverent, formal?
2. Short sentences, medium, long?
3. First person, second person, impersonal?
4. Phrases that should appear often?
5. Phrases or habits to ban? (emojis, exclamation marks, listicles, bold sentences, all-caps)

Include the line `Never use em dashes. Use colons, commas, parentheses, or separate sentences.` by default.

#### D. experience-notes.md

This is the file that lifts every output above generic AI slop. Be patient.

Ask:
1. Your top 3 customer wins with real numbers (closed sales, leads converted, visa cases helped)
2. The origin story you tell new customers
3. A strong opinion you hold about luxury Panama real estate guide that not everyone agrees with
4. A recurring customer situation the producer should know about
5. Any proof points worth citing (rankings, sales numbers, awards, retention, NPS)

**Do not fabricate.** If the user has nothing, write `None to date.` The producer will engage research-only mode for outputs where no relevant story exists.

#### E. services.md

Ask:
1. What you sell (buyer representation, listings, visa intro, financing intro, advisory, ads, content)
2. Pricing tiers and what's in each
3. Edge cases the producer should know (e.g. "we don't serve EU buyers", "min property value $500k", "only Panama + Colombia coverage")
4. 5 customer questions you answer all the time, with your standard answer

#### F. brand-guidelines.md

Ask:
1. Banned words and phrases
2. Competitor names that must never appear
3. Brand spellings and capitalization (Panama Real Estate Guide, panamarealestateguide.com)
4. Regulated claims you cannot make (legal advice, tax advice, financial advice, residency guarantees)
5. Formatting rules (units, currency USD vs PAB, locale, no all-caps headings, US English)

#### G. competitors.md

Ask:
1. Top 3 direct competitors (same offer space: PA luxury brokers, content guides)
2. Top 3 indirect competitors (different offer, same audience: International Living, Live and Invest Overseas, Vivanuncios, Encuentra24)
3. Topics/angles they've covered well that you should not duplicate
4. Topics/angles NOT well covered by anyone

#### H. author.md

Ask:
1. Byline / spokesperson name and title
2. Public email
3. Avatar URL
4. 3 to 5 verifiable credentials
5. Social profile URLs for `sameAs` (Instagram, YouTube @panamarealestateguidetv, LinkedIn, Facebook, TikTok)
6. Two to three sentence bio in third person

### Phase 4 — Optional integrations (1 minute)

Ask whether the business has any of the following the four systems should auto-publish to or pull from:

- A CMS the producer can push to (Astro, WordPress, Webflow, Shopify, Ghost, Notion, Airtable, or in this case: static site deployed via GH Actions to Netlify with `pretty_urls=true`)
- An analytics or performance source the audit/refresh should read (GSC, GA4, Klaviyo, HubSpot, Mixpanel, Shopify Analytics, Stripe)

If yes, capture the path / URL / credentials reference (not the secret itself) into `context/integrations.json`.

### Phase 5 — Summary (30 seconds)

Print a final checklist:

```
Done. Your luxury Panama real estate guide context folder:

context/site-config.md
context/audience.md
context/tone-of-voice.md
context/experience-notes.md
context/services.md
context/brand-guidelines.md
context/competitors.md
context/author.md
context/integrations.json (if any)

Edit any file by hand at any time. To regenerate ONE file, invoke this skill
and say "regenerate <filename>".

Next step:
    /discovery   to find the first batch of guide topics
```

## Re-run mode

If the user invokes with "regenerate <file>", skip phases 1, 2, 4, 5 and jump to the matching section in Phase 3. Read the existing file first so you preserve what was right and only update what changed.

## Hard rules

- **No em dashes** anywhere.
- **No fabrication.** Use `None to date.` or `TK: <what they need to add>`.
- **No emojis** unless the user's tone explicitly says emojis are part of the voice.
- **Read before write.** If a file exists, merge intelligently rather than overwriting.
- **One file at a time.** Save after each section.
- **Be specific.** Push back on vague answers. Vague context produces vague guide pages.

---

Based on the Four Systems framework by @NicoSKOOL: https://github.com/NicoSKOOL/the-four-systems
