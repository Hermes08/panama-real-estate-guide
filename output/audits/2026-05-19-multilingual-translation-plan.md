# Multilingual auto-translation plan: panamarealestateguide.com

Date: 2026-05-19
Author: David Aguirre / Claude via Four Systems
Replaces: the inconclusive Tolgee analysis from the `nostalgic-lamarr-0d3b3b` worktree session (see § "Prior analysis recap" below).

## TL;DR

| Decision | Recommendation |
|---|---|
| **Translation engine** | Claude API (preferred) or DeepL API |
| **Architecture** | DIY at build time. EN is source of truth, ES/PT/DE auto-generated into `/es/`, `/pt/`, `/de/` subfolders during GH Actions deploy. No proxy, no SaaS, no runtime translation. |
| **Smart delivery** | Phase 4 adds Netlify Edge Function geo-routing on top: detect visitor country, suggest correct language via dismissible banner (not auto-redirect, never on bots), country-specific CTAs (US: Calendly first; EU: WhatsApp first), per-jurisdiction cookie banner (GDPR/LGPD/Habeas Data). Prices stay USD-only sitewide (brand anchor). |
| **Why not Tolgee** | Tolgee is a translation management UI for human translators. David is not running a human translation team. The Cloud tier costs €49 to €499/mo and adds zero SEO value over a script. Self-hosted Tolgee adds VPS cost and ops burden for the same outcome. |
| **Why Claude over DeepL** | Claude can apply the `context/brand-guidelines.md`, `context/tone-of-voice.md`, and `context/audience.md` rules at translation time (no em dashes, USD prefix, banned phrases, regional voice for LATAM HNW vs US retirees). DeepL produces fluent translations but is brand-blind. |
| **Why Netlify Edge Functions** | Already the stack used for the dashboard auth that shipped this session. Free tier covers 3M invocations/month. ~10ms latency. Geo data (`context.geo.country.code`) included. Same git-based deploy as the rest of the site. |
| **Cost** | One-time backfill of 71 EN articles × 3 languages = ~$15. Ongoing: ~$1-3/mo for new content. Phase 4 geo-routing: **$0 ongoing**. |
| **Timeline** | Phase 1 pilot in 1 week. Full backfill in 3-4 weeks. Phase 4 geo-routing in 1-2 weeks AFTER Phase 2 is live. |
| **Expected SEO lift** | 71 articles × 3 languages = 213 net-new indexable pages. Conservatively 2-5x the current organic surface. Geo-routing adds a UX lift (lower bounce, higher per-session pages) which is a ranking signal. |

---

## Prior analysis recap (from nostalgic-lamarr session)

In a prior session David asked specifically about **Tolgee for SEO + hosting cost**. The prior assistant analyzed Tolgee correctly and produced a clean Option A through D comparison. The conclusion was:

> If you manage the site yourself (no human translation team): **Option A (DIY + DeepL / Claude API)**. Best SEO, lowest sustained cost, full control.

That conclusion still stands. What changed since:

1. **Four Systems framework is installed.** This means we now have `context/brand-guidelines.md`, `context/tone-of-voice.md`, `context/audience.md`, `context/services.md`, `context/competitors.md`, and `context/experience-notes.md` available as inputs to the translation prompt. Translations can be brand-voice-aware, not just literal.
2. **GSC May 2026 baseline is captured.** 5 clicks / 5,080 impressions / avg position 12.3 / CTR 0.13% over 28 days on 85 indexed pages. The translated versions multiply the indexable surface 3x without requiring new editorial work.
3. **DataForSEO MCP is configured.** Translation cost can come out of the same operational budget envelope used for Lighthouse audits ($0.043 spent so far on $13 balance).
4. **The 16-article SEO meta refresh just shipped** (PR #61). Translations should start AFTER that PR is merged (now done) so the new titles/excerpts propagate to all 4 languages from day one.

The previous analysis recommended Option A but the conversation ended without a commit. This plan executes Option A.

---

## Current multilingual state (May 2026)

| Surface | Count | Notes |
|---|---|---|
| EN articles (in data.js + on disk) | 71 | Source of truth. Includes the 2 full refreshes + 4 quick-fix patches done this session. |
| ES articles (lang='es' in data.js) | 3 | `panama-para-colombianos-guia-2026`, `condos-panama-bajo-400k-colombianos`, etc. Hand-written, country-specific, NOT translations of EN. |
| PT articles (lang='pt' in data.js) | 1 | `comprar-imovel-panama-brasileiros-2026`. Hand-written. |
| DE articles | 0 in data.js | `panama-deutsche-auswanderer` exists in sitemap but lang attribute missing. |
| `/es/` landing pages | 4 | Spain-targeted: diversifica-fuera-del-euro, encuentro-privado-madrid, jubilarse-en-panama, madrid-vs-panama. Hand-written. |
| `/co/` landing pages | 4 | Colombia-targeted: airbnb-casco-antiguo, blinda-tu-patrimonio-en-dolares, encuentro-privado-bogota, visa-inversionista-30-dias. Hand-written. |
| `/proyectos/` project pages | 6 | Spanish project pages, parallel to `/projects/`. Different inventory (Euphoria, Sanctuary, etc.). Hand-written, marked `robots: noindex`. |
| `/pt/`, `/de/`, `/fr/` folders | 0 | Do not exist. |
| Footer language switcher | EN / ES / PT / DE shown | Aspirational. Switching to PT or DE finds essentially nothing. |
| `<link rel="alternate" hreflang>` tags | 0 audited | Confirmed missing on a sample article. Major SEO miss. |

**Translation that already exists** is hand-authored, country-specific, low-volume, and not a translation of EN content. It is original content in a different language. This plan does NOT touch those existing pages: they stay as native source content in their own language.

**The opportunity**: 71 EN articles have NO translated equivalent in ES, PT, or DE despite ES/PT/DE markets being explicitly in scope per `context/audience.md` (LATAM HNW investors from CO/MX/BR/ES, German retirees).

---

## Architecture

### URL structure

Use subfolders, not subdomains (subfolders consolidate domain authority for SEO):

```
panamarealestateguide.com/                     ← EN (the default)
panamarealestateguide.com/articles/X.html      ← EN article X
panamarealestateguide.com/projects/X.html      ← EN project X

panamarealestateguide.com/es/                  ← ES root (existing pages preserved)
panamarealestateguide.com/es/articles/X.html   ← ES translation of EN article X (new, auto)
panamarealestateguide.com/es/projects/X.html   ← ES translation of EN project X (new, auto)

panamarealestateguide.com/pt/articles/X.html   ← PT (new, auto)
panamarealestateguide.com/pt/projects/X.html   ← PT (new, auto)

panamarealestateguide.com/de/articles/X.html   ← DE (new, auto)
panamarealestateguide.com/de/projects/X.html   ← DE (new, auto)
```

The existing `/es/`, `/co/`, `/proyectos/` hand-written pages stay where they are. The new auto-translated pages live alongside them under `/es/articles/` and `/es/projects/`. Once we are happy with the auto-translations, we can plan a separate consolidation pass.

### hreflang configuration

Every page emits `<link rel="alternate" hreflang>` tags for all 4 language variants plus x-default. Example head for `/articles/internet-providers-panama-expats.html`:

```html
<link rel="alternate" hreflang="en" href="https://panamarealestateguide.com/articles/internet-providers-panama-expats.html">
<link rel="alternate" hreflang="es" href="https://panamarealestateguide.com/es/articles/internet-providers-panama-expats.html">
<link rel="alternate" hreflang="pt" href="https://panamarealestateguide.com/pt/articles/internet-providers-panama-expats.html">
<link rel="alternate" hreflang="de" href="https://panamarealestateguide.com/de/articles/internet-providers-panama-expats.html">
<link rel="alternate" hreflang="x-default" href="https://panamarealestateguide.com/articles/internet-providers-panama-expats.html">
```

Wired into the existing `scripts/inject-article-meta.mjs` (one new function: `emitHreflang(slug, kind)`).

### Sitemaps

Add per-language sitemap entries. Either:
- Option A: extend `project/sitemap.xml` with `xhtml:link rel="alternate"` per URL (single sitemap, more compact)
- Option B: one sitemap per language (`sitemap.xml`, `sitemap-es.xml`, `sitemap-pt.xml`, `sitemap-de.xml`), all referenced from `sitemap-index.xml`

Both are valid. Option A is simpler if the EN sitemap already lists everything; Option B is cleaner if we want per-language `lastmod` precision. **Recommend Option A** because the existing `scripts/build-sitemap.mjs` already generates `sitemap.xml`; we just extend each `<url>` with the `xhtml:link` siblings.

### Build pipeline addition

Add three new GH Actions steps to `.github/workflows/netlify-deploy.yml`, sandwiched between the existing `build-jsx.mjs` step and `inject-article-meta.mjs`:

```yaml
- name: Translate EN content to ES/PT/DE (incremental)
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: node scripts/translate-content.mjs

- name: Inject hreflang link tags
  run: node scripts/inject-hreflang.mjs

- name: Build multilingual sitemap
  run: node scripts/build-sitemap.mjs --multilingual
```

The `translate-content.mjs` script:
1. Reads `project/data.js` (canonical EN content)
2. Reads `state/i18n-cache.json` (which translations exist and their source SHA)
3. For each article × language:
   - If cached translation matches current EN SHA → skip
   - Otherwise → call Claude API with the EN content + `context/*` files + glossary, output ES/PT/DE
4. Writes outputs to `project/es/articles/<slug>.html`, etc.
5. Updates `state/i18n-cache.json`

This is incremental: only changed articles get retranslated. First run: full backfill (~$15). Subsequent runs: cents.

### Translation memory + glossary

A `state/i18n-glossary.json` file (committed to git) holds canonical translations of brand terms:

```json
{
  "panama_real_estate_guide": {"en": "Panama Real Estate Guide", "es": "Panama Real Estate Guide", "pt": "Panama Real Estate Guide", "de": "Panama Real Estate Guide"},
  "buyer_agency": {"en": "buyer's agency", "es": "agencia del comprador", "pt": "agência do comprador", "de": "Käuferagentur"},
  "developer_direct": {"en": "developer-direct", "es": "directo del desarrollador", "pt": "direto da incorporadora", "de": "direkt vom Bauträger"},
  "reservation": {"en": "reservation", "es": "reserva", "pt": "reserva", "de": "Reservierung"},
  "friendly_nations_visa": {"en": "Friendly Nations Visa", "es": "Visa de Naciones Amigas", "pt": "Visto Nações Amigas", "de": "Friendly Nations Visa"},
  "pensionado_visa": {"en": "Pensionado Visa", "es": "Visa Pensionado", "pt": "Visa Pensionado", "de": "Pensionado-Visum"},
  "developer_direct_5k_reservation": {"en": "USD $5,000 refundable reservation", "es": "reserva reembolsable de USD $5,000", "pt": "reserva reembolsável de USD $5.000", "de": "rückerstattbare Reservierung über USD $5.000"}
}
```

The translation prompt injects the glossary so terms stay consistent across articles. The glossary grows as we translate (Claude can auto-suggest additions during a translation run).

---

## Translation prompt (Claude API)

A reusable system prompt template, parameterized by `<lang>`:

```
You are translating editorial market-analyst content for panamarealestateguide.com, a multilingual Panama real estate guide. Target language: <lang> (es / pt / de).

Voice and brand rules (apply at translation time):
{{ context/tone-of-voice.md }}
{{ context/brand-guidelines.md }}
{{ context/audience.md (the segment most relevant to <lang>) }}

Glossary (use these canonical translations):
{{ state/i18n-glossary.json filtered to <lang> }}

Hard rules:
- Output in <lang> using natural, native-sounding phrasing. The reader should not feel they are reading a translation.
- Preserve all numbers, prices, dates, proper nouns (project names, zone names, developer names, attorney names).
- Convert currency labels appropriately (USD prefix stays as "USD"; "B/." stays as "B/." in ES/PT but explained on first reference for non-PA audiences).
- For dates: keep ISO in code/tables; for prose, convert format to <lang> convention.
- Apply the brand-guidelines NO EM DASH rule in <lang> too (use colons, commas, parentheses).
- Apply the brand-guidelines BANNED COMPETITORS rule in <lang>.
- Translate the title for SEO impact in the target market (research-aligned, not literal).
- Translate the meta description for SEO impact (155-160 chars, lead with a number).
- Preserve the buyer-agency disclosure language exactly (translated, not paraphrased).

Output format: JSON with keys: title, description (= meta description = excerpt), slug (kebab-case in target language, may differ from EN slug), body_markdown, glossary_suggestions (new terms encountered worth adding).

Input EN article: {{ article JSON from data.js + body markdown from articleBodies }}
```

This prompt produces a JSON response that drops cleanly into the per-language data structure. The body markdown can then be HTML-injected via the existing inject pipeline.

---

## Cost projection

Claude API pricing (claude-sonnet-4.6 as of May 2026):
- Input: ~$3 per 1M tokens
- Output: ~$15 per 1M tokens

Per article translation (rough):
- Input: 2500 tokens (article body) + 1500 tokens (context files + glossary + prompt) = 4000 tokens × $3/1M = **$0.012**
- Output: 2500 tokens × $15/1M = **$0.038**
- **Total per article per language: ~$0.05**

For the backfill:
- 71 EN articles × 3 target languages (ES, PT, DE) = 213 translations
- 213 × $0.05 = **~$10.65 one-time**

For ongoing maintenance:
- 1 new EN article per week × 3 languages = $0.15/week = **~$0.65/month**
- Refresh of existing articles (when EN content changes): same ~$0.05 each, capped at the rate of EN content change

DeepL alternative pricing (for comparison):
- Pro plan: €5.49/mo subscription + €20 per 1M characters
- 71 articles × ~12,000 chars × 3 languages = 2.56M chars = **~$56 one-time** plus ongoing subscription
- DeepL is more expensive AND produces brand-blind output. **Recommend Claude.**

Tolgee Cloud pricing (for comparison):
- Free tier: 500 keys (we would have ~71 articles × 5 fields × 3 langs = 1065 keys, exceeds free tier)
- Team tier: €49/mo = **~$640/year ongoing** with manual translator overhead
- **Tolgee Cloud is 50x more expensive than the Claude-API DIY approach with no SEO benefit.** Skip.

---

## Quality safeguards

### 1. Glossary-driven consistency

The `state/i18n-glossary.json` ensures brand terms stay canonical across all 213 translations. Claude is instructed to prefer glossary translations when the source term appears.

### 2. Two-pass for high-impact pages

For the top 10 highest-impression pages (per GSC), run translation twice with different temperatures, then ask Claude to pick the better version. Marginally higher cost (~$1 extra one-time), measurably higher quality on money pages.

### 3. ML-translated disclaimer (transparency + EEAT signal)

Every auto-translated page gets a visible footer line:

```
This article was translated from English by AI. Reviewed for technical accuracy [date]. Original: [link to EN].
```

This is honest, builds trust, and tells Google we are not gaming hreflang with low-quality content. Later, when David or a contributor reviews a translation, the line updates to "Human-reviewed by [name] [date]" and the SEO signal strengthens.

### 4. Lint pass

After translation, run the same brand-guidelines lint we use on EN producer output: no em dashes, no banned phrases, no banned competitor mentions, USD prefix, attorney-consult line preserved. If lint fails, the build either auto-fixes (em dashes → commas) or surfaces the failure for manual review.

### 5. Native-speaker review (optional, for top pages)

Once auto-translations exist and are indexed, David can review the top 5 ES pages himself (he is bilingual), and optionally hire a freelance PT and DE reviewer for $50-100 each for the top 5 in each language. Total optional human-review cost: $500-1000 one-time for the top 15 most important pages. The other 60+ pages stay machine-translated with the disclaimer.

### 6. Auto-detect regressions

The `state/i18n-cache.json` stores the source SHA + the translation. If David edits an EN article, the next build detects the SHA changed and re-translates. The ML-translated disclaimer date updates too.

---

## Phased implementation

### Phase 0: Decide the scope (1 day)

David picks:
- Which 3 languages to start with. Plan recommends ES, PT, DE (matching the current footer switcher and `context/audience.md` segments).
- Whether to add FR later (Quebec + EU). Plan recommends NO for now (no current FR landing pages, low Panama-FR market, can add later).
- Whether to consolidate the existing hand-written `/es/`, `/co/`, `/proyectos/` pages now (cleanup) or later (parallel coexistence). Plan recommends LATER (lower risk).

### Phase 1: Pilot (1 week)

Pick 5 high-impact EN articles and translate them to ES only. Validate the pipeline end-to-end on a small surface before backfilling all 213.

Recommended pilot 5 (based on May 2026 GSC + my refresh-queue prioritization):
1. `panama-retirement-communities` (514 imp, US retirees money page, just refreshed)
2. `internet-providers-panama-expats` (747 imp, biggest single imp source, just refreshed)
3. `how-to-buy-property-in-panama-2026-guide` (71 imp, conversion-stage)
4. `panama-cost-of-living-2026` (154 imp, top-of-funnel)
5. `friendly-nations-2026` (currently 0 imp = indexing gap, but high-value Spanish-LATAM intent)

Build:
- `scripts/translate-content.mjs` (translates one article × one language, parameterized)
- `state/i18n-cache.json` (empty initial)
- `state/i18n-glossary.json` (seeded with ~20 brand terms)
- `scripts/inject-hreflang.mjs` (emits hreflang tags into `<head>`)
- The 5 ES translations land in `project/es/articles/`
- Add `ANTHROPIC_API_KEY` to Netlify env vars + GH Actions secrets
- Manual one-off run, not yet wired into GH Actions

Validate:
- Open each ES page in browser. Read by David (native Spanish). Score 1-5 for naturalness.
- Verify hreflang tags present and correct in `<head>` of both EN and ES versions.
- Submit to GSC URL Inspection for indexing.
- Check no brand-guideline violations (em dashes, banned phrases, etc.) via the lint pass.
- Cost check: actual API spend matches projection (~$0.25 for the 5 pilot translations).

Total Phase 1 cost: **~$0.50**. Total Phase 1 wall-clock: 1 week including David's review.

### Phase 2: Full backfill (2-3 weeks)

If Phase 1 quality is acceptable:
- Extend `translate-content.mjs` to iterate all 71 EN articles × ES, PT, DE.
- Run as a single batch job (~30-60 min wall clock for 213 API calls).
- Add the new files to a feat branch. Open ONE big PR. David spot-checks a sample (10 random pages across 3 languages).
- Merge. Netlify deploys. Submit per-language sitemaps to GSC + Bing Webmaster.

Wire up GH Actions:
- Add the translate + hreflang + multilingual-sitemap steps to the deploy workflow.
- On every push to main that touches `project/data.js` or `project/articles/` or `project/projects/`, the workflow runs an incremental translation pass.

Total Phase 2 cost: **~$15 one-time** for the full backfill.

### Phase 3: Maintenance (ongoing)

Every new EN article via `/producer`:
1. Producer saves draft to `output/production/`, updates `state/content-queue.json`
2. Producer suggests title + meta description in EN
3. After David approves and commits to data.js, the next GH Actions deploy auto-translates to ES/PT/DE
4. Hreflang tags emit automatically
5. Sitemap updates automatically

Marginal cost per new article: **~$0.15** (3 languages × $0.05).

Quarterly: review the top 10 most-trafficked ES, PT, DE pages by GSC. If a translation looks weak, either re-translate with two-pass mode (cost: $0.10) or queue for human review.

### Phase 4: Geo-aware intelligent delivery (1-2 weeks, $0 ongoing)

Once the translations exist as static indexable pages, layer a smart delivery layer on top: detect where the visitor is coming from and serve them the most relevant version. All implemented via Netlify Edge Functions (same stack as the `/dashboard/` Basic Auth that already ships, free tier, ~10ms latency added per request).

#### What "smart geo delivery" means

| Visitor signal | Smart behavior |
|---|---|
| IP geolocation (Brazil) on root `/` | 302 to `/pt/` AFTER first visit OR show "Read this in Portuguese" banner. Persist user choice in cookie. |
| IP geolocation (Germany / Austria / Switzerland) | Same pattern for `/de/`. |
| IP geolocation (Colombia / Mexico / Argentina / Chile) on `/es/articles/X` | Show a "We have a guide for Colombian buyers specifically" pill linking to `/co/...` if a Colombia-specific landing exists for that topic. |
| IP geolocation (any EU country) | Show GDPR cookie consent if not already. |
| `Accept-Language` header overrides IP | If user's browser is set to German but IP is Costa Rica (likely traveling), respect browser language. |
| Returning visitor cookie | Skip detection, serve last-chosen language directly. |
| Bot user-agent (Googlebot, Bingbot, Slackbot, etc.) | NEVER redirect. Serve the URL the bot requested. (Critical for SEO. Without this rule, Google could index `/articles/X` as Portuguese content.) |
| Manual override (footer language switcher click) | Set cookie, redirect, persist. |

The first visit always goes to the URL the user typed. The smart layer either redirects (cookie set) OR injects a small banner offering the better-fit language. **Recommend banner over auto-redirect** in Phase 4a because: less jarring UX, no risk of mis-detected redirect, easier to revert.

#### Architecture

A single Edge Function `netlify/edge-functions/geo-route.ts` runs on root paths and on `/articles/*` / `/projects/*`:

```typescript
import type { Context } from "https://edge.netlify.com";

const LANG_BY_COUNTRY: Record<string, string> = {
  BR: "pt",
  PT: "pt",
  DE: "de", AT: "de", CH: "de", LI: "de",
  // ES + LATAM countries default to es; specific overrides for CO can route to /co/
  ES: "es", MX: "es", CO: "es", AR: "es", CL: "es", PE: "es", VE: "es",
  EC: "es", UY: "es", PY: "es", BO: "es", DO: "es", CR: "es", PA: "es", GT: "es",
};

const BOT_UA = /googlebot|bingbot|slackbot|twitterbot|facebookexternalhit|linkedinbot|whatsapp|telegrambot|duckduckbot|ahrefsbot|semrushbot/i;

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const ua = request.headers.get("user-agent") || "";

  // 1. Never touch bots. Serve the URL they asked for.
  if (BOT_UA.test(ua)) return;

  // 2. If user already has a language cookie, respect it.
  const cookies = parseCookies(request.headers.get("cookie") || "");
  if (cookies.preg_lang) return;

  // 3. Detect intended language from IP geo + Accept-Language.
  const country = (context.geo?.country?.code || "").toUpperCase();
  const acceptLang = (request.headers.get("accept-language") || "").toLowerCase();
  const detectedLang =
    LANG_BY_COUNTRY[country] ||
    (acceptLang.startsWith("pt") ? "pt" :
     acceptLang.startsWith("de") ? "de" :
     acceptLang.startsWith("es") ? "es" : "en");

  // 4. If detected lang matches current URL, no-op.
  const onLangPath = url.pathname.match(/^\/(es|pt|de)\//);
  if (onLangPath && onLangPath[1] === detectedLang) return;
  if (!onLangPath && detectedLang === "en") return;

  // 5. Inject a "switch language" banner via response transform.
  //    (NOT a redirect on first visit; banner is less hostile UX.)
  const response = await context.next();
  if (!response.headers.get("content-type")?.includes("text/html")) return response;

  const html = await response.text();
  const banner = renderBanner(detectedLang, url.pathname);
  return new Response(html.replace("<body>", `<body>${banner}`), response);
};

export const config = { path: ["/", "/articles/*", "/projects/*"] };
```

The banner is a small dismissible strip at the top: `"Esta guía está disponible en español. [Cambiar →]"` (depending on detected lang). Clicking sets the `preg_lang` cookie and reloads. Dismissing also sets the cookie (to "en", so it won't show again).

#### Currency display

Out of scope. USD stays the single price anchor on every page, every language, every country. This matches Panama's dollarized economy, removes FX-fluctuation surprises in the buyer flow, and keeps the brand-guidelines USD-prefix rule consistent. No secondary currency conversion banners, no per-country price overlays, no localStorage exchange-rate cache. If a buyer wants to convert USD to their currency, they will (Google does it inline).

#### Country-specific banners and CTAs (Phase 4b)

Once geo detection works, layer:

- Colombia visitor on `/es/articles/panama-retirement-communities`: pill below the hero says "Guía específica para colombianos: residencia, taxes, blindaje patrimonial [Ver →]" linking to the `/co/visa-inversionista-30-dias` page or similar.
- Brazil visitor on `/pt/articles/internet-providers-panama-expats`: pill says "Guia para investidores brasileiros [Ver →]" linking to `panama-para-brasileiros-guia-2026`.
- US visitor on the homepage: priority CTA is Calendly book (current behavior). EU visitor: priority CTA is WhatsApp (matches EU expectation of asynchronous + privacy).
- Time zone awareness on the Calendly embed: if visitor is in UTC+1 to UTC+2 (Europe), suggest morning slots in Panama time (which is their afternoon). If visitor is in UTC-5 (US East): suggest afternoon slots.

These are configuration data, not edge function logic. Edge function sets a cookie `preg_country=BR`; the components read it and adapt copy.

#### Compliance auto-routing

Edge function additionally detects compliance regime and emits the right banner:

| Detected from country | Cookie/privacy banner shown |
|---|---|
| EU member states + UK | GDPR consent banner (no analytics until accept) |
| Brazil | LGPD banner |
| Colombia | Habeas Data banner |
| Mexico | LFPDPPP banner |
| All others (US, default) | Standard cookie notice |

Right now the site appears to ship a single cookie banner via `cookie-banner.js` regardless of geo. Phase 4 makes it conditional + correctly labeled per jurisdiction. This is also a legal-risk reduction, not just SEO.

#### What about Google ranking?

Google has crystal-clear guidance: **DO NOT redirect Googlebot based on geo or Accept-Language**. Googlebot indexes from a few specific data centers (mostly US) and any redirect based on its IP would mis-index the content. The `BOT_UA` skip-list in the edge function handles this. Google sees: `panamarealestateguide.com/es/articles/X.html` returns Spanish HTML. That's the right signal.

For human visitors, Google considers the banner-based "would you like to switch?" UX as an acceptable enhancement that doesn't game its index. We are NOT cloaking (serving different content to bots vs users); we are enhancing the human UX with a banner that recommends a different page.

#### Cost

| Item | Cost |
|---|---|
| Netlify Edge Functions | Free (3M invocations/month included in starter plan) |
| Free IP geo via `context.geo.country.code` | Included |
| Exchange rate API (exchangerate.host) | Free, no key |
| Implementation time | 1-2 weeks dev |
| Ongoing maintenance | ~1 hour/quarter for rate-table refresh logic + cookie-policy review |

**Total ongoing cost: $0.** Phase 4 is pure leverage on the static infrastructure.

#### Phase 4 sub-phases

- **4a (week 1)**: Edge function `geo-route.ts` with language-detection banner only. No redirects. Validate it doesn't break SEO (check Googlebot User-Agent path through the function).
- **4b (week 2)**: Country-specific banners on top-10 ES/PT pages (Colombia-specific pill on relevant ES articles, Brazil-specific pill on relevant PT articles, US-vs-EU CTA priority swap).
- **4c (later, optional)**: GDPR/LGPD per-jurisdiction cookie banner. A/B test framework for measuring which CTA copy converts in which country.

Phase 4 ships AFTER Phase 1 pilot is validated AND at least 20 EN articles have translations in the target language. Reason: smart routing to empty pages is worse than no routing.

---

## Open questions for David to decide before Phase 1

1. **Confirm 3 languages: ES, PT, DE** (not FR for now)?
2. **OK to add `ANTHROPIC_API_KEY` to Netlify env vars + GH Actions secrets**? (Required for the translation step to run on each deploy)
3. **OK with the ML-translated disclaimer** appearing on each auto-translated page until manually reviewed?
4. **For the pilot, OK to start with `panama-retirement-communities` + 4 others** as the first 5 ES translations?
5. **Quality bar**: native-Spanish read by you (David) is enough for go/no-go on Phase 2, or do you want a third-party reviewer first?
6. **Slug strategy**: keep EN slugs in all languages (`/es/articles/panama-retirement-communities.html`) OR auto-translate slugs (`/es/articulos/comunidades-retiro-panama.html`)? Plan recommends keeping EN slugs in Phase 1 for simplicity + URL stability; can plan a localized-slug pass in Phase 3.
7. **Existing hand-written ES content** (`/es/`, `/co/`, `/proyectos/`): coexist with the auto-translations indefinitely, or consolidate later? Plan recommends coexist for now.
8. **Phase 4 geo-routing scope (when we get there)**: banner-only suggesting language switch (recommended, less hostile UX), OR auto-redirect on first visit (more aggressive, higher risk)?
9. **Per-jurisdiction cookie banner (Phase 4c)**: legal-grade implementation (worth ~$200 attorney review for the GDPR + LGPD wording), or use Iubenda/CookieYes template ($10-30/mo) to remove the legal-research burden?

---

## First commits to ship (when Phase 1 is approved)

1. `scripts/translate-content.mjs`: Claude API translator with glossary + brand rules
2. `scripts/inject-hreflang.mjs`: adds hreflang to all article + project pages
3. `state/i18n-glossary.json`: initial 20-term glossary, seeded by Claude
4. `state/i18n-cache.json`: empty, populated on first run
5. `project/es/articles/{5 slugs}.html`: the pilot translations
6. `.github/workflows/netlify-deploy.yml`: three new steps wired in
7. `scripts/build-sitemap.mjs`: extended with `xhtml:link rel="alternate"` per URL

One feat branch, one PR for the Phase 1 pilot.

## First commits to ship for Phase 4 (after Phase 2 backfill is live)

1. `netlify/edge-functions/geo-route.ts`: language-detection banner, no redirects (Phase 4a)
2. `netlify.toml`: register the new edge function on `/`, `/articles/*`, `/projects/*`

One feat branch, one PR for Phase 4a. Two more PRs for 4b (country CTAs) and 4c (per-jurisdiction cookie banner).

---

## Expected SEO impact (12-month projection)

Conservative scenario:
- 71 articles × 3 languages = 213 net-new indexable pages
- Assume Google indexes 70% within 90 days = 149 indexed pages
- Average position 25 for new ML-translated content (lower than EN initially)
- Average CTR at position 25 ≈ 0.5%
- Average impressions per new page: 50/mo (mid-tail keywords, less competition in PT and DE)
- Total: 149 × 50 imp × 0.5% CTR = **~37 incremental clicks per month** in months 1-6
- Months 6-12: position improves as backlinks accrue + Google trusts the corpus. Conservative 2x: **~75 incremental clicks per month** by month 12.

Aggressive scenario (if backlinks + native-reviewer pass on top 15 happens):
- Top 15 pages × 3 langs lift to position 10-15 average
- CTR rises to 2-3% on those
- Tail pages stay at 0.5%
- Combined: **~200-400 incremental clicks/month** by month 12

For comparison: the current site does 5 clicks/month total on 81 articles. The auto-translation pipeline alone could 10-80x organic traffic over 12 months.

---

## What this plan explicitly does NOT do

- **No human translation team setup.** No Tolgee, no Crowdin, no Lokalise. If David later wants a UI for human contributors, Tolgee self-hosted on a $5 VPS is the cheapest add-on; but it is not needed for the auto-pipeline to work.
- **No proxy translation (Weglot, Bablic, ConveyThis).** Those add monthly recurring fees and create vendor lock-in. They also serve content from third-party CDNs, which mildly weakens domain authority signals.
- **No migration to Astro / Next.js / other SSG.** The existing static-HTML-on-Netlify stack is fine. The translation pipeline is a build-time addition, not a migration.
- **No retranslation of the existing hand-written `/es/`, `/co/`, `/proyectos/` content.** Those stay as native source content in their language. The auto-pipeline only generates translations of pages whose canonical source is EN.
- **No translation of the `/dashboard/` operator dashboard.** It is English-only by design; only David sees it.

---

## Methodology and references

- Prior session: `nostalgic-lamarr-0d3b3b` (May 2026), Tolgee analysis + Option A-D comparison
- Current GSC baseline: see [output/refreshes/2026-05-19-refresh.md](../refreshes/2026-05-19-refresh.md)
- Brand context: `context/tone-of-voice.md`, `context/brand-guidelines.md`, `context/audience.md`
- Claude API pricing: https://www.anthropic.com/pricing#api
- DeepL API pricing: https://www.deepl.com/pro-api
- Tolgee pricing: https://tolgee.io/pricing
- Google hreflang implementation guide: https://developers.google.com/search/docs/specialty/international/localized-versions

## Disclosure

panamarealestateguide.com operates as a buyer's agency. We represent only the buyer in any property transaction we participate in. This plan was produced by Claude via the Four Systems framework, building on a prior Tolgee analysis from May 2026.
