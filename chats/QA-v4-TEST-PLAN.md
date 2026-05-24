# QA-v4 Test Plan — panamarealestateguide.com multilingual (EN/ES/PT/DE)

> **For another QA AI to execute on the live production site.**
> Target: https://panamarealestateguide.com
> Scope: chrome i18n (nav, hero, sections, CTAs, footer), per-article translations, link integrity, image loading, language switcher flow.
> Time estimate: 30–45 min with browser automation, 60–90 min purely manual.

---

## 0. Context — what's been built

The site has 4 language versions:
- `/` — English (root, no notranslate meta — intentional)
- `/es/` — Spanish
- `/pt/` — Portuguese
- `/de/` — German

Translated content layer:
- **Chrome i18n** (nav, hero, sections, footer, CTAs, categories, project status, news titles) is bundled in `/i18n-data.js` as `window.PANAMA_DATA.chromeI18n[<lang>]`.
- **Article meta** (h1, excerpt, category) is in `window.PANAMA_DATA.articleMeta[<lang>][<slug>]`.
- **Per-language article pages** exist only at `/es|pt|de/articles/<slug>.html`. Project, news, video, and index pages have NO per-language version — links to those should resolve to `/projects/...`, `/news/...`, `/articles/`, `/news/` (EN canonical).
- **Anti-translate**: non-EN pages should have `<html translate="no">` + `<meta name="google" content="notranslate">` so Chrome doesn't auto-translate them.

PRs merged today (#77–#86) covering: data-light merge fix, notranslate meta, Reserve CTA i18n, hero i18n, BUG-010 article-context query string, BUG-011 video ES badge, DetailNav Residency parity, absolute paths, home_sections i18n, 404 hotfix (link to EN canonical), news_titles + project_status + From label i18n, merge conflict marker cleanup in 19 article shells.

---

## 1. Smoke test — does every key URL return 200?

Run from terminal:

```bash
for url in \
  / /es/ /pt/ /de/ \
  /articles/ /news/ /videos/ \
  /articles/panama-cost-of-living-2026.html \
  /es/articles/panama-cost-of-living-2026.html \
  /pt/articles/panama-cost-of-living-2026.html \
  /de/articles/panama-cost-of-living-2026.html \
  /es/articles/moving-to-panama-with-pets.html \
  /de/articles/moving-to-panama-with-pets.html \
  /projects/pino-alto-boquete.html \
  /news/tocumen-terminal-2-expansion.html \
  /proyectos/casa-korsi-casco-antiguo.html \
  /i18n-data.js /data-light.js /components.js /detail-chrome.js
do
  code=$(curl -sI "https://panamarealestateguide.com${url}" | head -1 | awk '{print $2}')
  echo "  $code  $url"
done
```

**Pass criteria:** every line is `200`.

---

## 2. Critical regression — no git merge conflict markers in HTML

```bash
for slug in panama-cost-of-living-2026 moving-to-panama-with-pets apostille-documents-panama-visa panama-golden-visa-2026 how-to-buy-property-in-panama-2026-guide best-neighborhoods-panama-city-expats; do
  for lang in es pt de; do
    url="https://panamarealestateguide.com/${lang}/articles/${slug}.html"
    if curl -s "$url" | grep -qE '^<<<<<<<|^=======$|^>>>>>>>'; then
      echo "❌ CONFLICT MARKER FOUND: $url"
    else
      echo "✅ clean: $url"
    fi
  done
done
```

**Pass criteria:** all `✅ clean`. Any `❌ CONFLICT MARKER FOUND` is a P0 bug.

---

## 3. Per-language home page — chrome + content

Open in browser. For each of the 4 languages, verify:

### 3a. EN — `/`
- `<html lang="en">` (no `translate="no"` attribute, no notranslate meta — these are intentional for EN)
- Page title: `PanamaRealEstateGuide.com — Developer projects · Journal · Reservations`
- Hero h1: `Two oceans. One country worth owning.`
- Hero eyebrow: `Developer-direct · 24 projects · Reservations open`
- Nav (8 visible items): `Projects · Regions · Journal · Videos · News · Residency · About · Reserve a unit`
- Projects section h2: `Twenty-four projects. Five distinct coasts. Zero resales.`
- Regions section h2: `Two oceans. Five coasts. One visa.`
- Journal section h2: `The five we'd start with.`
- News section h2: `The week in Panama real estate.`
- First project card status badge: `Pre-construction` / `Move-in Ready` / `Under Construction`
- First project card price: `From $XXX,XXX`
- 14 images render, **0 broken**
- Lang dropdown shows `EN`

### 3b. ES — `/es/`
- `<html lang="es" translate="no">`
- `<meta name="google" content="notranslate">` present
- Page title: `PanamaRealEstateGuide.com — Proyectos developer-direct · Crónicas · Reservas`
- Hero h1: `Dos océanos. Un país para hacer propio.`
- Hero eyebrow: `Trato directo con desarrollador · 24 proyectos · Reservas abiertas`
- Hero "From the editor" → `Del editor`
- Hero CTA `Browse 24 projects` → `Ver los 24 proyectos`
- Nav: `Proyectos · Regiones · Crónicas · Videos · Noticias · Residencia · Nosotros · Reservar unidad`
- Projects h2: `Veinticuatro proyectos. Cinco costas distintas. Cero reventas.`
- Regions h2: `Dos océanos. Cinco costas. Una visa.`
- Journal h2: `Las cinco con las que empezaríamos.`
- News h2: `La semana en bienes raíces de Panamá.`
- News card titles in Spanish (e.g. `Tocumen confirma ampliación de USD $340 millones...`)
- Project card status badge: `Pre-venta` / `Listo para entrega` / `En construcción`
- Project card price: `Desde $XXX,XXX`
- Journal article cards: h3 + excerpt in Spanish (e.g. `Costo de vida en Panamá 2026: presupuestos mensuales reales por ciudad`)
- Category badge on article card: `INFORME DE MERCADO` (not `MARKET REPORT`)
- 14 images render, **0 broken**
- Lang dropdown shows `ES`

### 3c. PT — `/pt/`
- `<html lang="pt" translate="no">`, notranslate meta present
- Title: `PanamaRealEstateGuide.com — Projetos developer-direct · Crônicas · Reservas`
- Hero h1: `Dois oceanos. Um país que vale ser seu.`
- Nav: `Projetos · Regiões · Crônicas · Vídeos · Notícias · Residência · Sobre · Reservar unidade`
- Projects h2: `Vinte e quatro projetos. Cinco costas distintas. Zero revendas.`
- News card title: `Tocumen confirma ampliação de USD $340 milhões do Terminal 2...`
- Project status: `Pré-venda` / `Pronto para morar` / `Em construção`
- Project price: `A partir de $XXX,XXX`
- 14 images render, 0 broken

### 3d. DE — `/de/`
- `<html lang="de" translate="no">`, notranslate meta present
- Title: `PanamaRealEstateGuide.com — Developer-Direct-Projekte · Journal · Reservierungen`
- Hero h1: `Zwei Ozeane. Ein Land, das sich lohnt.`
- Nav: `Projekte · Regionen · Journal · Videos · Nachrichten · Aufenthalt · Über uns · Einheit reservieren`
- Projects h2: `Vierundzwanzig Projekte. Fünf verschiedene Küsten. Null Wiederverkäufe.`
- News card title: `Tocumen bestätigt Erweiterung von Terminal 2 für USD 340 Millionen...`
- Project status: `Vorverkauf` / `Bezugsfertig` / `Im Bau`
- Project price: `Ab $XXX,XXX`
- 14 images render, 0 broken

---

## 4. Per-article translated page — chrome + content

For each of these articles, on each non-EN language, verify the article renders fully:

```
/es/articles/panama-cost-of-living-2026.html        → h1: Costo de vida en Panamá 2026: presupuestos mensuales reales por ciudad
/es/articles/moving-to-panama-with-pets.html        → h1: Mudarse a Panamá con mascotas: guía 2026 de papelería, costos y tiempos
/es/articles/panama-golden-visa-2026.html           → h1 in Spanish
/es/articles/apostille-documents-panama-visa.html   → h1 in Spanish
/es/articles/how-to-buy-property-in-panama-2026-guide.html → h1 in Spanish

/pt/articles/panama-cost-of-living-2026.html        → h1 in Portuguese
/pt/articles/moving-to-panama-with-pets.html        → h1: Mudar para o Panamá com pets: guia 2026 de documentos, custos e prazos
/pt/articles/panama-real-estate-market-2026.html    → h1 in Portuguese

/de/articles/panama-cost-of-living-2026.html        → h1 in German
/de/articles/moving-to-panama-with-pets.html        → h1: Mit Haustieren nach Panama umziehen: Leitfaden 2026 zu Papieren, Kosten und Fristen
/de/articles/panama-real-estate-market-2026.html    → h1 in German
```

For EACH article above, verify:
- ✅ Page renders (not blank, no React error)
- ✅ `<html lang>` matches URL prefix
- ✅ `<meta name="google" content="notranslate">` present
- ✅ h1 in target language (NOT English)
- ✅ Page title in target language
- ✅ Category badge in target language (e.g. `RESIDENCIA` not `RESIDENCY`)
- ✅ Excerpt/dek paragraph in target language
- ✅ Article body content in target language
- ✅ "By [Author]" / "Por [Autor]" / "Von [Autor]" in target language
- ✅ Back link in target language: `Crónicas` (es), `Crônicas` (pt), `Journal` (de)
- ✅ Reserve CTA section ("Reservations open · Refundable deposit") in target language
- ✅ "Start a reservation" button in target language (`Iniciar una reserva` / `Iniciar uma reserva` / `Reservierung starten`)
- ✅ Navbar in target language with 7 main links INCLUDING Residencia/Residência/Aufenthalt
- ✅ No console errors
- ✅ No literal `<<<<<<<`, `=======`, `>>>>>>>` text visible in DOM
- ✅ Click "Start a reservation" → URL contains `?from=<slug>&type=article#reserve`
- ✅ Click WhatsApp button → opens with prefilled message `Hi, I'm interested in: <article title>...`

---

## 5. Language switcher flow

Test the bidirectional flow:

1. Load `/` (EN home)
2. Click lang switcher → select ES
   - URL should become `/es/`
   - Cookie `preg_lang=es` should be set
   - Page should reload in Spanish
3. From `/es/`, click lang switcher → select DE
   - URL should become `/de/`
   - Page should reload in German
4. From `/de/`, click ES → URL `/es/`
5. From `/es/`, click EN → URL `/`

Then test the article-level switcher:
1. Load `/es/articles/panama-cost-of-living-2026.html`
2. Click lang switcher → select DE
   - **Expected:** URL becomes `/de/articles/panama-cost-of-living-2026.html` (the same translated article in German)
   - **NOT:** redirect to `/de/` home (which would lose context)

---

## 6. Navbar parity — same UI structure everywhere

The 7-link nav (Projects · Regions · Journal · Videos · News · Residency · About) MUST appear on:

| Page type | URL example | Expected nav count | Notes |
|---|---|---|---|
| Home EN | `/` | 7 main + 2 brand/CTA | |
| Home ES | `/es/` | 7 main + 2 brand/CTA | Spanish labels |
| Home PT | `/pt/` | 7 main + 2 brand/CTA | Portuguese labels |
| Home DE | `/de/` | 7 main + 2 brand/CTA | German labels |
| EN article | `/articles/2026-outlook.html` | 7 main + 2 brand/CTA | DetailNav |
| ES article | `/es/articles/panama-cost-of-living-2026.html` | 7 main + 2 brand/CTA | DetailNav Spanish |
| PT article | `/pt/articles/moving-to-panama-with-pets.html` | 7 main + 2 brand/CTA | DetailNav Portuguese |
| DE article | `/de/articles/moving-to-panama-with-pets.html` | 7 main + 2 brand/CTA | DetailNav German |
| News index | `/news/` | 7 main + 2 brand/CTA | |
| News article | `/news/coronado-sold-out.html` | 7 main + 2 brand/CTA | DetailNav |
| Project page | `/projects/pino-alto-boquete.html` | 7 main + 2 brand/CTA | DetailNav |
| Banesco proyecto | `/proyectos/casa-korsi-casco-antiguo.html` | 7 main + 2 brand/CTA | grafted chrome from PR #74 |
| Videos index | `/videos/` | 7 main + 2 brand/CTA | |
| Video page | `/videos/<id>.html` | 7 main + 2 brand/CTA | DetailNav |

**Pass criteria:** all rows have **9 visible nav anchors** (brand wordmark + 7 main + Reserve CTA), no extra, no missing.

---

## 7. Click-through integrity (no 404s)

Starting from `/es/`, click sequentially and verify each URL resolves to 200 with content:

1. `/es/` (start)
2. Click first project card → should land at `/projects/<slug>.html` (EN canonical, since /es/projects/ pages don't exist). h1 should be project name. **No 404.**
3. Click browser back to `/es/`
4. Click first article card (Journal section) → should land at `/es/articles/<slug>.html` (Spanish article). h1 in Spanish.
5. Click "Crónicas" back link → should land at `/articles/` (EN index, since /es/articles/ index doesn't exist).
6. Click browser back to `/es/`
7. Click first news card → should land at `/news/<slug>.html` (EN canonical). h1 in English.
8. Click "Ver toda la redacción" CTA → should land at `/news/` (EN).
9. Click any region card → should land at `/#projects` (home anchor). Smooth scroll.
10. Click WhatsApp floating button → opens WhatsApp web with prefilled greeting.

---

## 8. Image loading

For each page tested in section 3, run this in DevTools console:

```js
JSON.stringify({
  total: document.querySelectorAll('img').length,
  broken: Array.from(document.querySelectorAll('img'))
    .filter(i => i.complete && i.naturalWidth === 0)
    .map(i => i.src)
})
```

**Pass criteria:** `broken: []` on every page. Particularly verify:
- `/assets/jaguar-static.webp` (hero news panel jaguar)
- `/airtable-assets/<project-slug>/00.jpg` (project covers)
- `https://images.pexels.com/...` (article placeholders — should also load)

---

## 9. Chrome auto-translate is suppressed

In Chrome:
1. Set browser preferred languages to **English only** (no Spanish/German)
2. Load `/de/`
3. **Expected:** Chrome does NOT show the "Translate this page?" prompt
4. The page content stays in German (nav says "Projekte", not Chrome's machine-translated "Projects")
5. In DevTools, run: `document.documentElement.lang` → should return `"de"` (NOT silently rewritten to `"en"` by Chrome translator)

Same test for `/es/` and `/pt/`.

---

## 10. Console health

For every page tested, open DevTools Console. Verify:

```
0 errors
0 unhandled promise rejections
0 "Failed to load" warnings for images/scripts
0 React warnings like "Cannot read properties of undefined"
```

The ONLY console message that's acceptable: `[projects] using data.js fallback — ...` IF the airtable fetch fails (defensive log, not an error).

---

## 11. Mobile burger menu (mobile viewport)

Resize browser to 390×844 (iPhone 14) OR use DevTools device emulation.

1. Load `/es/`
2. Burger icon should be visible top-right (hamburger lines, not "Reserve" CTA)
3. Tap burger → mobile menu slides in
4. Mobile menu should contain ALL 7 nav links in target language (Proyectos, Regiones, Crónicas, Videos, Noticias, Residencia, Nosotros)
5. Mobile menu should have lang switcher + "Reservar unidad" CTA at the bottom
6. Tap any nav link → menu closes + scrolls to anchor
7. Repeat on `/de/` — burger menu in German

---

## 12. Reservation context propagation (BUG-010 fix)

1. Navigate to `/articles/2026-outlook.html`
2. Scroll to the orange "Reserve from $5,000" CTA section
3. Inspect the "Start a reservation" button href
4. **Expected:** `/?from=2026-outlook&type=article#reserve`
5. Click it → lands on home page with that query string, scrolls to `#reserve` section
6. Inspect WhatsApp button href
7. **Expected:** `https://wa.me/50767610315?text=Hi%2C%20I'm%20interested%20in%3A%20Panama%202026%20property%20outlook...`
8. Click → opens WhatsApp web with prefilled message

Same test on `/es/articles/<slug>.html` — query string should still include the slug, WhatsApp message should reference the Spanish title.

---

## 13. Video index BUG-011 fix

Load `/videos/`.
- Page intro paragraph mentions "Spanish-narrated" and "English subtitles available on YouTube"
- Each of the 10 video cards has an "ES" pill badge before the title (small dark mono-font pill)

---

## 14. Footer parity

Footer should render on every page. For each language verify:
- Footer copyright: `© 2026 PanamaRealEstateGuide.com`
- Footer links translated: `Privacy` / `Privacidad` / `Privacidade` / `Datenschutz`; `Terms` / `Términos` / `Termos` / `AGB`
- Footer language pill row at the bottom shows EN · ES · PT · DE — click any → navigates to that language version

---

## 15. Report format

For each issue found, report:

```
### [P0|P1|P2] <short title>
- **URL:** <url where bug observed>
- **Expected:** <what should happen>
- **Actual:** <what happens>
- **Repro:** <numbered steps>
- **Console:** <any error messages>
- **Screenshot:** <attach>
```

Severity:
- **P0** — page broken/blank, merge conflict markers visible, broken images, lang attribute wrong, 404 on a link from home
- **P1** — text in wrong language, missing translation, layout glitch, missing nav item
- **P2** — copy nuance, hreflang minor, mobile padding

---

## Reference: helper diagnostic snippet

Paste into DevTools console on any page to dump a one-line QA snapshot:

```js
copy(JSON.stringify({
  url: location.pathname,
  lang: document.documentElement.lang,
  translate: document.documentElement.getAttribute('translate'),
  notranslateMeta: !!document.querySelector('meta[name="google"][content="notranslate"]'),
  title: document.title,
  h1: document.querySelector('h1')?.textContent,
  navTexts: Array.from(document.querySelectorAll('header nav a, header a')).slice(0,10).map(a => a.textContent.trim()).filter(Boolean),
  brokenImgs: Array.from(document.querySelectorAll('img')).filter(i => i.complete && i.naturalWidth === 0).map(i => i.src),
  chromeI18nLangs: Object.keys(window.PANAMA_DATA?.chromeI18n || {}),
  articleMetaLangs: Object.keys(window.PANAMA_DATA?.articleMeta || {}),
  projectsCount: window.PANAMA_DATA?.projects?.length || 0,
  preg_lang: window.PREG_LANG || null,
  hasMergeMarkers: /[<>=]{7}/.test(document.body.innerHTML)
}, null, 2))
```

The result will be copied to clipboard. Paste into the report next to each bug.

---

## Done

When all 15 sections pass with no P0/P1 issues, the multilingual rollout is shippable.
