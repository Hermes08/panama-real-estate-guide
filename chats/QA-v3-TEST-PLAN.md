# QA v3 Test Plan — PanamaRealEstateGuide.com

**Audience:** AI testing agent (Claude in browser / Chrome MCP / WebFetch)
**Site:** https://panamarealestateguide.com
**Date:** 2026-05-23 (after PRs #67, #68, #69, #70, #71, #72)
**Goal:** Verify the 5 fixes that shipped and triage the 6 bugs still open

---

## 0 · How to run

You have two tools available:

| Method | Use for |
|---|---|
| `WebFetch` / `curl -sL` | Static HTML inspection, HTTP status codes, JS source verification |
| Chrome MCP / browser | JS-rendered content, click flows, console errors, cookie checks |

Most of these tests need a **real browser** because the site renders client-side React. `curl` alone returns the HTML shell — the article body, nav labels, language switcher, and Calendly widget are all painted by JS after page load.

**For every test:** record the URL, the action, the expected result, and the actual result. Mark ✅ PASS / 🔴 FAIL / 🟡 PARTIAL. Quote any console errors verbatim.

---

## 1 · Fixed bugs — verify the fix is live

### TEST 1 — BUG-002: 7 news articles return 200 (were 404)

| # | URL | Expected | Verify via |
|---|---|---|---|
| 1.1 | https://panamarealestateguide.com/news/tocumen-terminal-2-expansion.html | HTTP 200 + article renders | `curl -I` + browser |
| 1.2 | https://panamarealestateguide.com/news/santa-maria-este-launch.html | HTTP 200 + article renders | `curl -I` + browser |
| 1.3 | https://panamarealestateguide.com/news/boquete-coffee-fair-2026.html | HTTP 200 + article renders | `curl -I` + browser |
| 1.4 | https://panamarealestateguide.com/news/pedasi-cultural-center.html | HTTP 200 + article renders | `curl -I` + browser |
| 1.5 | https://panamarealestateguide.com/news/semiconductor-strategy-105m.html | HTTP 200 + article renders | `curl -I` + browser |
| 1.6 | https://panamarealestateguide.com/news/casco-viejo-colon-incentives.html | HTTP 200 + article renders | `curl -I` + browser |
| 1.7 | https://panamarealestateguide.com/news/canal-projects-2027-bid.html | HTTP 200 + article renders | `curl -I` + browser |

**Pass criteria:** all 7 return 200 AND the page paints the article body with the correct headline (compare headline to `data.js` entry).

---

### TEST 2 — BUG-001 + BUG-009: LangSwitcher actually routes & persists

Open https://panamarealestateguide.com/articles/panama-real-estate-market-2026.html in a browser.

| # | Action | Expected |
|---|---|---|
| 2.1 | Click globe dropdown → click **ES** | Page navigates to `/es/articles/panama-real-estate-market-2026.html`; URL bar shows /es/ prefix |
| 2.2 | After 2.1, inspect `document.cookie` in DevTools | Cookie `preg_lang=es` is set with `Max-Age=31536000` |
| 2.3 | On the /es/ page, h1 should be in Spanish (e.g. "Mercado inmobiliario de Panamá 2026") | If h1 is still English text, BUG-001 is only partially fixed |
| 2.4 | Click dropdown → **PT** | Page navigates to `/pt/articles/panama-real-estate-market-2026.html` |
| 2.5 | Click dropdown → **DE** | Page navigates to `/de/articles/panama-real-estate-market-2026.html` |
| 2.6 | Click dropdown → **EN** | Page navigates BACK to `/articles/panama-real-estate-market-2026.html` (no /en/ prefix) |
| 2.7 | After selecting ES on this page, navigate to Home `/` then check dropdown label | Label should show ES (cookie persisted) — if it resets to EN, persistence still broken |

**Pass criteria:** 2.1, 2.4, 2.5, 2.6 navigate correctly. 2.2 sets the cookie. 2.3 confirms the translated h1 from the chrome i18n layer.

---

### TEST 3 — BUG-004: previously blank /es/ /pt/ /de/ article pages now render

Open each of these in a browser; all should render the full article (not blank):

| # | URL | Expected |
|---|---|---|
| 3.1 | https://panamarealestateguide.com/es/articles/internet-providers-panama-expats.html | Full article body in Spanish, h1 in Spanish |
| 3.2 | https://panamarealestateguide.com/pt/articles/internet-providers-panama-expats.html | Full article body in Portuguese |
| 3.3 | https://panamarealestateguide.com/de/articles/internet-providers-panama-expats.html | Full article body in German |
| 3.4 | https://panamarealestateguide.com/es/articles/panama-retirement-communities.html | Renders (was the other pilot file with broken schema) |
| 3.5 | https://panamarealestateguide.com/de/articles/moving-to-panama-with-pets.html | Renders (regression check for new-format files) |

**Pass criteria:** all 5 render. Pre-fix, 3.1–3.4 were blank because the renderer crashed on the legacy `{title, description, body: markdown}` object schema.

**Console error check:** open DevTools Console on 3.1 — there should be NO `TypeError: body.filter is not a function`.

---

## 2 · Bugs still open — confirm they reproduce

### TEST 4 — BUG-003: /es/ /pt/ /de/ home pages have minimal navbar

| # | URL | Expected (current state — BUG) |
|---|---|---|
| 4.1 | https://panamarealestateguide.com/es/ | Page exists, but navbar shows only Logo + language switcher; full main nav (Projects, Regions, Journal, Videos, News, Residency, About, Reserve) is MISSING |
| 4.2 | https://panamarealestateguide.com/pt/ | Same — minimal navbar |
| 4.3 | https://panamarealestateguide.com/de/ | Same — minimal navbar |

**Notes:** the /es/, /pt/, /de/ "home" is currently one of 4 manually-built standalone landing pages (diversifica-fuera-del-euro, encuentro-privado-madrid, jubilarse-en-panama, madrid-vs-panama) — not a translated copy of the main `index.html`. Real fix requires producing localised home pages that load `components.js` + render the full `<Navbar/>`.

---

### TEST 5 — BUG-005: /proyectos/ pages have no navbar

| # | URL | Expected (BUG) |
|---|---|---|
| 5.1 | https://panamarealestateguide.com/proyectos/casa-korsi-casco-antiguo.html | Standalone landing page, no header/footer chrome, no language switcher |
| 5.2 | https://panamarealestateguide.com/proyectos/buenaventura-ritz-reserve.html | Same |
| 5.3 | https://panamarealestateguide.com/proyectos/euphoria-art-district.html | Same |
| 5.4 | https://panamarealestateguide.com/proyectos/sanctuary-residences.html | Same |

**Notes:** /proyectos/ is a Spanish-language project showcase folder with custom standalone HTML. Real fix requires wrapping these in the shared `<DetailNav/>` + `<DetailFooter/>` from `detail-chrome.js`.

---

### TEST 6 — BUG-006: Calendly widget empty on Home `#book` / `#reserve`

| # | URL | Expected (BUG) |
|---|---|---|
| 6.1 | Open https://panamarealestateguide.com/#book in browser | Scroll to the booking section. Calendly iframe loads as empty box (no form visible). |
| 6.2 | Open https://panamarealestateguide.com/#reserve | Same — widget empty/invisible |
| 6.3 | DevTools → Network panel → reload | Look for requests to `calendly.com` and inspect the response. If `4xx`/`403`, the embedded URL is misconfigured or the parent domain isn't whitelisted on Calendly's side. |
| 6.4 | DevTools → Console | Quote any errors mentioning `calendly`, `cross-origin`, or `iframe` |

**Diagnostic tip:** look in `data.js` for `CALENDLY_BOOKING_URL` / `calendly` references. Cross-reference with the `inject-tags.mjs` workflow step which reads `CALENDLY_BOOKING_URL` from secrets.

---

### TEST 7 — BUG-007: Footer EN/ES/PT/DE buttons inert

Scroll to footer of any English page (e.g. https://panamarealestateguide.com/).

| # | Action | Expected (BUG) |
|---|---|---|
| 7.1 | Click footer **ES** button | Nothing happens (no navigation, no state change) |
| 7.2 | Click footer **PT** | Same |
| 7.3 | Click footer **DE** | Same |
| 7.4 | DevTools → click → check Console | Look for any onclick handler firing |

**Notes:** the LangSwitcher routing fix in PR #71 only patched the top nav dropdown. The footer language buttons are a separate component that wasn't wired up. Real fix: apply the same `selectLang(code)` helper to the footer buttons.

---

### TEST 8 — BUG-010: RESERVE button in article navbar loses context

Open any article, e.g. https://panamarealestateguide.com/articles/panama-cost-of-living-2026.html.

| # | Action | Expected (BUG) |
|---|---|---|
| 8.1 | Click orange "Reserve a unit" button in top navbar | Page navigates AWAY from the article to Home `/#reserve` — user loses scroll position, reading context, and the specific article they were considering |

**Notes:** this is a UX call. Options:
- Open a modal in place
- Open Calendly inline below the button
- Deep-link to WhatsApp with article context preserved
- Keep current behavior but pass article slug as query param so the Calendly form pre-fills

---

### TEST 9 — BUG-011: Video titles in Spanish on EN /videos/

Open https://panamarealestateguide.com/videos/ in EN context (preg_lang=en, no /es/ prefix).

| # | Action | Expected (BUG) |
|---|---|---|
| 9.1 | Inspect titles of each video card | Some titles render in Spanish ("El mejor edificio de Panamá", "Marca Margaritaville. Frente al mar.") instead of English |
| 9.2 | Check `data.js` for the video metadata | Confirm `videos[]` array uses Spanish strings in the `title` field |

**Notes:** videos are scraped from YouTube channel @panamarealestateguidetv (Spanish-titled). Real fix: add a translated `title_en/pt/de` field per video, or run titles through translation on `sync-youtube-videos.mjs`.

---

## 3 · Regression checks — make sure fixes didn't break anything

### TEST 10 — EN pages still render normally

| # | URL | Expected |
|---|---|---|
| 10.1 | https://panamarealestateguide.com/ | Full home, hero, projects, regions, journal, footer all render |
| 10.2 | https://panamarealestateguide.com/articles/moving-to-panama-with-pets.html | Full English article with h1 "Moving to Panama with Pets…", category badge, related articles |
| 10.3 | https://panamarealestateguide.com/projects/altos-del-maria.html | Full project page renders |
| 10.4 | https://panamarealestateguide.com/videos/ | Video grid renders |
| 10.5 | https://panamarealestateguide.com/news/ | News index renders + each linked news article renders |
| 10.6 | https://panamarealestateguide.com/articles/?category=Residency | Article filter works |

**Pass criteria:** EN browsing flow unchanged. No console errors. No layout breakage.

---

### TEST 11 — Translated pages have correct chrome i18n

Open https://panamarealestateguide.com/es/articles/moving-to-panama-with-pets.html. Verify:

| # | UI element | Expected (Spanish) |
|---|---|---|
| 11.1 | `<title>` (browser tab) | "Mudarse a Panamá con mascotas…" |
| 11.2 | Back link above h1 | "Crónicas" (NOT "The Journal") |
| 11.3 | Category badge (coral pill) | "Estilo de Vida y Día a Día" (NOT "Lifestyle & Daily Living") |
| 11.4 | h1 below the badge | "Mudarse a Panamá con mascotas: guía 2026…" |
| 11.5 | Italic dek/excerpt below h1 | Translated description |
| 11.6 | "By <author>" line | "Por <author>" |
| 11.7 | Top nav links | "Proyectos", "Regiones", "Crónicas", "Videos", "Noticias", "Nosotros" |
| 11.8 | "Reserve a unit" CTA button | "Reservar unidad" |
| 11.9 | "The takeaway" pull quote header | "La conclusión" |
| 11.10 | "Keep reading" Related Articles label | "Sigue leyendo" |
| 11.11 | DetailCTA section eyebrow | "Reservas abiertas · Depósito reembolsable" |
| 11.12 | Footer links | "Proyectos / Crónicas / Videos / Noticias / Privacidad / Términos" |
| 11.13 | Cookie banner (if visible) | Spanish or LatAm-specific, per the geo-route edge function |

Repeat with `/pt/` (Portuguese) and `/de/` (German). Use `state/chrome-i18n.json` from the repo as the source of truth for expected strings.

---

### TEST 12 — Coverage spot-check across catalogue

Sample 5 translated articles in each language and confirm they render with full body + correct chrome:

| Lang | Slugs to test |
|---|---|
| ES | moving-to-panama-with-pets, panama-real-estate-market-2026, panama-cost-of-living-2026, retire-in-panama, panama-golden-visa-2026 |
| PT | moving-to-panama-with-pets, panama-real-estate-market-2026, panama-cost-of-living-2026, retire-in-panama, panama-golden-visa-2026 |
| DE | moving-to-panama-with-pets, panama-real-estate-market-2026, panama-cost-of-living-2026, retire-in-panama, panama-golden-visa-2026 |

URLs follow the pattern `https://panamarealestateguide.com/{lang}/articles/{slug}.html`.

**Pass criteria:** all 15 pages render. Body content visible. h1 translated. No JS errors. hreflang `<link>` tags present in `<head>` pointing to en/es/pt/de/x-default.

---

## 4 · Pre-existing QA carryovers (lower priority)

These were flagged in earlier QA passes and are tracked but not fixed yet. Confirm they still reproduce:

| Bug | Where | What |
|---|---|---|
| QA-A | Several PT/DE articles | Some translations have `$X a $Y` (bare dollar sign) instead of `USD $X a USD $Y` (canonical). Run regex scan: `grep -Pn '\b(?<!USD )\$[0-9]' project/{pt,de}/articles/bodies/*.js` |
| QA-B | `cost-of-living-panama-vs-us` ES | Translation agent silently changed "San Blas" → "San Francisco". Revert. |
| QA-C | `friendly-nations-2026` DE | Meta description = 202 chars (over 160 SEO snippet limit) |
| QA-D | `best-beaches-panama-expats` DE + `panama-vs-mexico-retirement` DE | Used `ae/oe/ue/ss` instead of proper `ä/ö/ü/ß` |
| QA-E | `apartments-for-rent ES`, `how-to-rent-apartment-panama PT/DE` | Preserved "Vivanuncios" reference (banned competitor) — should strip or rephrase |

---

## 5 · Output format

When you finish, post:

1. **Scorecard:** `X / 12 tests PASS`
2. **Per-test result table:** test #, URL, action, expected, actual, status
3. **Console errors block:** verbatim copy of any JS errors you encountered
4. **New bugs found:** anything not in the original 11
5. **Priority recommendation:** which open bug (BUG-003/005/006/007/010/011) should be fixed next, with reasoning

If a fix didn't actually deploy or only partially works, mark the bug as **REGRESSION** and quote the specific evidence (URL, screenshot or HTML excerpt, console error).

---

## 6 · Context for the testing AI

The site is a Panama real-estate editorial + project showcase built on:
- Static HTML shells per article/project/video/news item
- A shared React bundle (`components.js`, `detail-chrome.js`, `article-renderer.js`, `news-renderer.js`)
- `data.js` (~1.8MB) → split into `data-light.js` + per-slug body JS files at build time
- A chrome i18n layer (`state/chrome-i18n.json` → `i18n-data.js`) that translates nav/footer/CTA/category/author bios/back-links per language
- 207 article translations across ES/PT/DE (69 articles × 3 langs, plus a few one-language landing pages)
- Netlify deploy via GitHub Actions `Deploy to Netlify` workflow on push-to-main + daily cron

Recent merged PRs:
- **#67** chrome i18n + 132 translations
- **#68** 40 PT/DE translations
- **#69** 20 PT/DE translations
- **#70** 19 PT/DE translations (closes catalogue at 69/69/69)
- **#71** BUG-001 LangSwitcher routing + BUG-004 article-renderer legacy schema fallback
- **#72** BUG-002 7 missing news HTML shells

Six bugs still open: BUG-003, BUG-005, BUG-006, BUG-007, BUG-010, BUG-011 (described in §2 above).

---

**End of test plan.**
