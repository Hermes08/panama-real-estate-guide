# QA Audit — Geo-Route Edge Function (SEO + Bot Safety)

**Date:** 2026-05-19
**Audit target:** `/tmp/i18n-staging/netlify/edge-functions/geo-route.ts`
**Preview URL:** https://feat-multilingual-i18n-may-202--panamarealestateguide.netlify.app/
**Auditor:** Claude (worktree `keen-swirles-69a651`)
**Verdict:** PASS WITH WARNINGS — no critical SEO/security issues, but several bot-coverage gaps and one release-blocker (missing /es/, /pt/, /de/ targets).

---

## 1. Test Case Results

| # | Test | Method | Expected | Actual | Pass? |
|---|------|--------|----------|--------|-------|
| 1 | Googlebot UA on `/` | `curl -A "Googlebot/2.1"` | No banner, body unchanged from clean fetch | Banner absent. Body matches clean baseline minus the injected banner block (5 fewer lines = the `<div id="preg-lang-banner">` block only). HTTP 200, 7325 B. | YES |
| 2 | Generic Chrome UA, no Accept-Language | `curl -A "Mozilla/5.0 Chrome/120"` | No banner (since edge can't detect lang) | Banner INJECTED (Spanish). Edge function used `context.geo.country` (PA from curl IP), which is in `LANG_BY_COUNTRY`, so the no-AL guard is bypassed. | EXPECTED per code, but worth knowing |
| 3 | EN visitor (`Accept-Language: en-US,en;q=0.9`) | curl with AL header | No banner | Banner INJECTED (Spanish) — same reason as #2: IP-geo (PA) trumps Accept-Language. The `detectLang()` function checks country **first**; only if country is unmapped does it fall back to AL. | EXPECTED, but UX concern (see Findings) |
| 4 | DE Accept-Language | `curl -H "Accept-Language: de-DE,de;q=0.9"` | Banner appears if geo says DE | Banner INJECTED (Spanish, not German) — confirms our suspicion that `context.geo` (IP-based) overrides AL. Cannot test true DE geo without a German IP. | EXPECTED logic but un-testable from this IP |
| 5 | Path scoping | curl each path | Only `/`, `/articles/*`, `/projects/*` get the function | `/css/styles.css`, `/dashboard/`, `/es/`, `/de/`, `/sitemap.xml`, `/robots.txt` all pass through with banner_count=0. `/`, `/articles/`, `/articles/buying-property-panama.html`, `/projects/` all run the function. | YES |
| 5b | `/es/` skip via in-function regex | curl `/es/` (with bot UA to avoid 404 confusion) | Function returns early at line 115 | No banner injected, regardless of UA. | YES |
| 6 | Cookie suppression | `Cookie: preg_lang=en` | Banner suppressed once user has chosen | `preg_lang=en` → 0 banners. `preg_lang=es` → 0. Any non-empty value works (the check is `!langCookie`). | YES |

**Md5 sanity check:** `baseline.html`, `chrome.html`, `en.html`, `de.html` are byte-identical (`f0ce4fddff3cab673ceb3c313cee75a4`) — all four non-bot fetches produced the same Spanish-banner HTML, confirming IP-geo is the single deciding input.

---

## 2. Bot-Coverage Gaps

The current regex:
```
/(googlebot|bingbot|slackbot|twitterbot|facebookexternalhit|linkedinbot|whatsapp|telegrambot|duckduckbot|ahrefsbot|semrushbot|applebot|baiduspider|yandexbot|sogou|exabot|mj12bot|dotbot|petalbot|claudebot|gptbot|oai-searchbot)/i
```

### Bots covered (15/24 tested → passed):
googlebot, bingbot, yandexbot, baiduspider, applebot, slackbot, facebookexternalhit, twitterbot, linkedinbot, whatsapp, telegrambot, claudebot, gptbot, duckduckbot, ahrefsbot.

### Bots MISSING from regex (9/24 tested → banner was injected to bot):

| Bot UA | Operator | SEO/Risk Impact |
|---|---|---|
| **`PerplexityBot`** | Perplexity AI | High — Perplexity is one of the fastest-growing answer engines; serving cloaked content here means Perplexity Search may index the wrong (Spanish-banner-injected) variant. |
| **`Amazonbot`** | Amazon (powers Alexa/Rufus search) | Medium |
| **`GoogleOther`** | Google internal crawler (research, training data) | High — Google explicitly recommends treating `GoogleOther` like `Googlebot`. Missing this risks training-data poisoning + GMB/Discover relevance signals. |
| **`Google-InspectionTool`** | Google Search Console URL Inspection | **CRITICAL** — when GSC inspects a URL, it should see exactly what Googlebot sees; cloaking detection in GSC may flag the site. |
| **`Mediapartners-Google`** | AdSense crawler | Medium (only matters if AdSense is enabled) |
| **`AdsBot-Google`** | Google Ads landing-page quality crawler | High — affects Quality Score for any Google Ads campaign pointing at `/`, `/articles/*`, `/projects/*`. |
| **`PinterestBot`** (and `Pinterest`) | Pinterest | Low |
| **`Bytespider`** | ByteDance (TikTok) | Medium |
| **`meta-externalagent`** (Meta's newer crawler, replacing facebookexternalhit) | Meta | Medium |

### Bots that ARE matched by accident:
- `Mediapartners-Google` — actually contains `google` but not `googlebot`. The regex is `googlebot` (literal), so it's NOT matched. Confirmed by live test.

### Recommendation (one-line fix):
```ts
const BOT_UA = /(googlebot|bingbot|slackbot|twitterbot|facebookexternalhit|linkedinbot|whatsapp|telegrambot|duckduckbot|ahrefsbot|semrushbot|applebot|baiduspider|yandexbot|sogou|exabot|mj12bot|dotbot|petalbot|claudebot|gptbot|oai-searchbot|perplexitybot|amazonbot|googleother|google-inspectiontool|mediapartners-google|adsbot-google|pinterestbot|bytespider|meta-externalagent|bot\b|crawler|spider)/i;
```
The trailing `|bot\b|crawler|spider` is a defensive catch-all that will scoop up almost every well-behaved crawler that follows convention (Mastodon, Discordbot, Embedly, etc.). Trade-off: a small number of weird vendor crawlers using "bot" in their UA will also be skipped, which is fine — the banner is non-critical.

---

## 3. Code-Review Findings

### 3.1 Bot detection (line 36, 112) — PASS with gaps
Logic ordering is correct: bot check happens **before** any geo logic, so crawlers always see the canonical (un-mutated) HTML. Verified live with 15 bot UAs. See section 2 for missing UAs.

### 3.2 Path-scope short-circuit (line 115) — PASS
`/^\/(es|pt|de)\//.test(url.pathname)` correctly skips `/es/`, `/pt/foo`, `/de/articles/x.html`. Note that the literal paths `/es`, `/pt`, `/de` (no trailing slash) are NOT matched, but in practice Netlify pretty_urls would 301 those to `/es/` etc. before the edge fn runs. Safe.

### 3.3 Infinite redirect loop risk — NONE
The function never issues a redirect. It either returns `undefined` (pass-through) or mutates the body. No `Response.redirect` anywhere. SAFE.

### 3.4 XSS risk in injected HTML — NONE (verified live)
- `labels.msg`, `labels.cta`, `labels.accept`, `labels.settings`, `badges[regime]` are all **static string constants** at module scope. Not user-controlled.
- `translatedPath` is built from `url.pathname`, which preserves percent-encoding for `"`, `<`, `>`, `'`. Verified live: `/articles/%22%3E%3Cscript%3E` produced `href="/es/articles/%22%3E%3Cscript%3E"` — no script execution. SAFE.
- `targetLang` is one of `es|pt|de|en` (from `detectLang()` which only returns these literals). SAFE.
- `regime` is one of `gdpr|lgpd|habeas_data|lfpdppp|standard` (from `detectCookieRegime()`). SAFE.

### 3.5 Cookie handling (lines 84, 85, 102) — MEDIUM concern
The cookies set client-side via `document.cookie` cannot be `HttpOnly` (that flag is server-only). For this use case (UX preference + cookie-consent record), `HttpOnly` would actually **break** the dismiss-button re-check, so the current design is correct.

- `SameSite=Lax` ✓ (set on all three cookies)
- `Secure` ✗ (NOT set) — should be added since the site is HTTPS-only with HSTS preload. Without `Secure`, browsers may treat the cookie as less trustworthy on some redirects. Low-severity but trivial fix:
  ```js
  document.cookie='preg_lang=es;path=/;max-age=31536000;samesite=lax;secure'
  ```
- `Path=/` ✓
- `Max-Age=31536000` (1 year) ✓ — reasonable for a UI preference.

### 3.6 Cache-header preservation (lines 145-148) — LOW concern
The mutated response copies `...Object.fromEntries(response.headers)` then overrides `content-type`. Risks:
- **Duplicate set-cookie**: `Object.fromEntries` collapses duplicate `Set-Cookie` headers into one (only the last wins). If origin ever returns multiple `Set-Cookie` headers for HTML, they'd be silently dropped. Currently no `Set-Cookie` is set on these HTML responses, so it doesn't bite today.
- **Content-Length**: NOT re-computed after injection. Verified: Netlify's edge layer recomputes `Content-Length` after the function returns (we observed correct `7325 B` for Googlebot vs `~8200 B` for human variants in `content-length` header). SAFE.
- **Vary header lost on mutated branch**: live test showed `vary: Accept-Encoding` is preserved for Chrome but the ETag has a `-df` suffix (Netlify's personalized-variant marker), so the CDN segregates cache entries between bot and human. NO cache-poisoning risk.

### 3.7 Banner HTML well-formedness — PASS
Verified via Python tag-balance check on the live response. All `<div>`, `<span>`, `<a>`, `<button>` tags balanced. No unclosed elements.

### 3.8 The `<body>` literal replace (line 142) — MEDIUM concern (fragility)
`html.replace("<body>", \`<body>${injection}\`)` is fragile:
- If any future template uses `<body class="...">` or `<body data-...="...">`, the literal `<body>` will NOT match and **the banner will silently disappear** with no error.
- Verified all current pages use bare `<body>` — works today.
- **Recommendation**: change to regex with capture group:
  ```ts
  html = html.replace(/<body([^>]*)>/, `<body$1>${injection}`);
  ```

### 3.9 Banned competitor names in label strings — NONE
Verified: `LANG_LABELS` and `COOKIE_LABELS` contain only generic UI copy ("Esta guía", "Mudar para", "Akzeptieren", etc.). No brand names. SAFE.

### 3.10 Banner injected on 404 pages — LOW concern
Verified `/projects/` returns HTTP 404 with the banner injected (the edge fn doesn't check `response.status`). Not a security issue, but a UX/SEO oddity — Google generally ignores soft-404-rendered content, but a banner suggesting "switch to Spanish" on a 404 might confuse users. Trivial fix: add `if (response.status !== 200) return response;` before the mutation block.

### 3.11 Banner href points to non-existent targets — **BLOCKER for SEO/UX**
Live verification:
- `/es/` → HTTP 404
- `/es/articles/buying-property-panama.html` → HTTP 404
- `/pt/`, `/de/` → not tested but presumed 404 since the i18n branch hasn't shipped translated pages yet.

This means **every Spanish-speaking visitor today gets a banner that leads them to a 404**. This is a release-blocker for the i18n branch — the translated pages must ship in the same deploy as the edge function.

---

## 4. Critical Issues (Block-merge?)

| # | Issue | Severity | Block merge? |
|---|---|---|---|
| A | Banner CTA links to `/es/`, `/pt/`, `/de/` pages that return HTTP 404 on preview | **HIGH** | YES — block merge until translated pages exist OR edge fn is gated behind a feature flag |
| B | Missing bot UAs (`Google-InspectionTool`, `AdsBot-Google`, `GoogleOther`, `PerplexityBot`, etc.) → cloaking risk in GSC URL inspection and Ads landing-page quality | **HIGH** | YES for `Google-InspectionTool` + `AdsBot-Google` at minimum (the rest can be a follow-up) |
| C | `<body>` literal replace is fragile to future template edits | MEDIUM | NO (works today, fix opportunistically) |
| D | Cookies lack `Secure` flag | LOW | NO |
| E | Banner injected on 4xx/5xx response pages | LOW | NO |

---

## 5. Recommendations (Prioritized)

1. **BEFORE MERGE**: Confirm `/es/`, `/pt/`, `/de/` index + article subpaths ship in the same deploy. Otherwise the banner sends Spanish/Portuguese/German visitors to 404s.
2. **BEFORE MERGE**: Add `Google-InspectionTool` and `AdsBot-Google` to `BOT_UA` regex. Cloaking these is detectable by Google and can hurt rankings + Ads Quality Score.
3. **BEFORE MERGE**: Add `PerplexityBot`, `GoogleOther`, `Amazonbot`, `meta-externalagent`, `Bytespider` to `BOT_UA`. One-line change; minimal risk.
4. **NICE-TO-HAVE**: Add defensive catch-all `bot\b|crawler|spider` at end of regex for unknown well-behaved crawlers.
5. **NICE-TO-HAVE**: Change `html.replace("<body>", ...)` to `html.replace(/<body([^>]*)>/, ...)`.
6. **NICE-TO-HAVE**: Add `if (response.status !== 200)` guard before mutation.
7. **NICE-TO-HAVE**: Add `;secure` to all three `document.cookie` strings.
8. **CONSIDER**: The current behavior gives every Panamanian (PA-geo) visitor a Spanish banner on the English homepage, even if they explicitly set `Accept-Language: en-US`. This is the documented design (geo-first) but worth a UX review — many Panamanian residents are EN-preference expats/professionals. Consider letting `Accept-Language` short-circuit the geo lookup when AL is explicitly `en`.

---

## 6. Appendix — Raw evidence

- Test outputs saved at `/tmp/edge-audit/{baseline,googlebot,chrome,en,de}.html`
- Live ETag observation: human-variant has `-df` suffix, bot-variant does not → Netlify CDN segregates cache (no poisoning).
- HSTS, x-nf-request-id, etag, content-type all preserved on mutated branch.
