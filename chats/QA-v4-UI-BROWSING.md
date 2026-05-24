# QA-v4 UI Browsing Test Plan — panamarealestateguide.com

> **For a human or AI executing QA by clicking through the live site in a real browser.**
> No bash, no curl, no DevTools required (one optional console snippet at the end).
> Target: https://panamarealestateguide.com
> Time: ~45 min for thorough run, ~15 min for sanity check.
> What you need: Chrome (or Firefox/Safari), a notepad, a screenshot tool.

---

## How to use this doc

For each test, do the **Steps** in order, then mark the **Pass criteria** as ✅ or ❌. Take a screenshot of anything that fails. At the end, fill out the **Report** section.

If something is unclear, note it as ⚠️ "needs clarification" rather than blocking.

---

## SECTION 1 — Home pages (4 languages × 1 min each)

### 1.1 — EN home (`/`)

**Steps:**
1. Open https://panamarealestateguide.com in a clean browser window
2. Wait for hero to fully render

**Pass criteria:**
- [ ] Hero headline reads **"Two oceans. One country worth owning."**
- [ ] Eyebrow text above headline: **"Developer-direct · 24 projects · Reservations open"**
- [ ] Navbar top right shows orange **"Reserve a unit"** button
- [ ] Navbar links visible: Projects · Regions · Journal · Videos · News · Residency · About
- [ ] Language dropdown shows **EN**
- [ ] Projects section title: **"Twenty-four projects. Five distinct coasts. Zero resales."**
- [ ] Journal section title: **"The five we'd start with."**
- [ ] News section title: **"The week in Panama real estate."**
- [ ] All project cards show images (no gray broken-image placeholders)
- [ ] Jaguar illustration visible in the right-side hero news panel
- [ ] At the bottom, footer copyright: **"© 2026 PanamaRealEstateGuide.com"**
- [ ] Footer language pills show: **EN · ES · PT · DE**

### 1.2 — ES home (`/es/`)

**Steps:**
1. From the navbar language dropdown, click **ES** OR navigate directly to `/es/`
2. Wait for page to reload

**Pass criteria:**
- [ ] Browser tab title contains **"Proyectos developer-direct · Crónicas · Reservas"**
- [ ] Hero headline: **"Dos océanos. Un país para hacer propio."**
- [ ] Eyebrow: **"Trato directo con desarrollador · 24 proyectos · Reservas abiertas"**
- [ ] Navbar links in Spanish: **Proyectos · Regiones · Crónicas · Videos · Noticias · Residencia · Nosotros**
- [ ] Top-right CTA button says **"Reservar unidad"** (not "Reserve a unit")
- [ ] Language dropdown shows **ES**
- [ ] Projects section title: **"Veinticuatro proyectos. Cinco costas distintas. Cero reventas."**
- [ ] Regions section title: **"Dos océanos. Cinco costas. Una visa."**
- [ ] Journal section title: **"Las cinco con las que empezaríamos."**
- [ ] News section title: **"La semana en bienes raíces de Panamá."**
- [ ] First news headline starts with **"Tocumen confirma ampliación de USD $340 millones..."** (NOT "Tocumen confirms USD $340 million...")
- [ ] First project card price says **"Desde $XXX,XXX"** (NOT "From $XXX,XXX")
- [ ] At least one project card status badge says **"Pre-venta"**, **"Listo para entrega"**, or **"En construcción"** (NOT "Pre-construction", "Move-in Ready", or "Under Construction")
- [ ] First article card title is in Spanish (e.g. **"Costo de vida en Panamá 2026..."**)
- [ ] Category badge on article cards in Spanish (e.g. **"INFORME DE MERCADO"**, NOT "MARKET REPORT")
- [ ] All images load (jaguar, project covers)
- [ ] Chrome does **NOT** show the "Translate this page?" prompt at the top

### 1.3 — PT home (`/pt/`)

**Steps:**
1. Click **PT** in language dropdown OR navigate to `/pt/`

**Pass criteria:**
- [ ] Tab title: **"Projetos developer-direct · Crônicas · Reservas"**
- [ ] Hero: **"Dois oceanos. Um país que vale ser seu."**
- [ ] Navbar: **Projetos · Regiões · Crônicas · Vídeos · Notícias · Residência · Sobre**
- [ ] CTA button: **"Reservar unidade"**
- [ ] Projects h2: **"Vinte e quatro projetos. Cinco costas distintas. Zero revendas."**
- [ ] News h2: **"A semana no mercado imobiliário do Panamá."**
- [ ] First news headline: **"Tocumen confirma ampliação de USD $340 milhões do Terminal 2..."**
- [ ] Project price: **"A partir de $XXX,XXX"**
- [ ] Project status: **"Pré-venda"** / **"Pronto para morar"** / **"Em construção"**

### 1.4 — DE home (`/de/`)

**Steps:**
1. Click **DE** in dropdown OR navigate to `/de/`

**Pass criteria:**
- [ ] Tab title: **"Developer-Direct-Projekte · Journal · Reservierungen"**
- [ ] Hero: **"Zwei Ozeane. Ein Land, das sich lohnt."**
- [ ] Navbar: **Projekte · Regionen · Journal · Videos · Nachrichten · Aufenthalt · Über uns**
- [ ] CTA button: **"Einheit reservieren"**
- [ ] Projects h2: **"Vierundzwanzig Projekte. Fünf verschiedene Küsten. Null Wiederverkäufe."**
- [ ] News h2: **"Die Woche in Panamas Immobilien."**
- [ ] First news headline: **"Tocumen bestätigt Erweiterung von Terminal 2 für USD 340 Millionen..."**
- [ ] Project price: **"Ab $XXX,XXX"**
- [ ] Project status: **"Vorverkauf"** / **"Bezugsfertig"** / **"Im Bau"**

---

## SECTION 2 — Article detail pages (8 articles × 1.5 min each)

For EACH of these 12 articles, do the steps below:

| URL | Expected h1 starts with |
|---|---|
| `/es/articles/panama-cost-of-living-2026.html` | "Costo de vida en Panamá 2026..." |
| `/es/articles/moving-to-panama-with-pets.html` | "Mudarse a Panamá con mascotas..." |
| `/es/articles/panama-golden-visa-2026.html` | (Spanish title) |
| `/es/articles/apostille-documents-panama-visa.html` | (Spanish title) |
| `/pt/articles/panama-cost-of-living-2026.html` | (Portuguese title) |
| `/pt/articles/moving-to-panama-with-pets.html` | "Mudar para o Panamá com pets..." |
| `/pt/articles/panama-real-estate-market-2026.html` | (Portuguese title) |
| `/de/articles/panama-cost-of-living-2026.html` | "Lebenshaltungskosten in Panama 2026..." |
| `/de/articles/moving-to-panama-with-pets.html` | "Mit Haustieren nach Panama umziehen..." |
| `/de/articles/panama-real-estate-market-2026.html` | (German title) |
| `/de/articles/how-to-buy-property-in-panama-2026-guide.html` | (German title) |
| `/de/articles/best-neighborhoods-panama-city-expats.html` | (German title) |

**Per-article steps:**
1. Navigate to the URL
2. Wait for page to fully render
3. Scroll to bottom (verify the orange "Reserve from $5,000" CTA renders)
4. Scroll back to top

**Per-article pass criteria:**
- [ ] **NO literal text** `<<<<<<<`, `=======`, or `>>>>>>>` visible anywhere on the page (THIS IS P0 — was a critical bug; if you see this, STOP and report)
- [ ] h1 starts with the expected translated text (NOT in English on /es/ /pt/ /de/)
- [ ] Browser tab title is in the page language
- [ ] Navbar 7 links in the page language (matching the home page nav from Section 1)
- [ ] Top-right CTA button says **"Reservar unidad"** (es) / **"Reservar unidade"** (pt) / **"Einheit reservieren"** (de) — NOT "Reserve a unit"
- [ ] Language dropdown shows the matching letter code (ES/PT/DE)
- [ ] Above the h1, you see a back-link arrow and the word **"Crónicas"** (es), **"Crônicas"** (pt), or **"Journal"** (de)
- [ ] Below the h1, the excerpt paragraph is in the page language (not English)
- [ ] At least one category badge (small mono-font pill) is in the page language: e.g. **"COSTO DE VIDA Y DINERO"** instead of "COST OF LIVING & MONEY"
- [ ] The article body paragraphs are in the page language
- [ ] At the bottom, the orange "Reserve from $5,000" CTA section renders with translated copy
- [ ] The big black button on that CTA says **"Iniciar una reserva"** (es) / **"Iniciar uma reserva"** (pt) / **"Reservierung starten"** (de)
- [ ] The "WhatsApp +507 6761-0315" button is present
- [ ] Chrome does **NOT** show the "Translate this page?" prompt
- [ ] No image broken (gray placeholder)

**Sample of just one article ESs to do thoroughly** (the others can be quick visual scans):
**Required deep test:** `/es/articles/panama-cost-of-living-2026.html` (this was the critical regression case)

---

## SECTION 3 — Language switcher click-flow (5 min)

**Steps:**
1. Navigate to `/` (EN home)
2. Click the language dropdown in the navbar
3. Select **ES**
   - [ ] URL becomes `/es/`
   - [ ] Page reloads in Spanish
4. Click the language dropdown again
5. Select **DE**
   - [ ] URL becomes `/de/`
   - [ ] Page reloads in German
6. Select **PT** from dropdown
   - [ ] URL becomes `/pt/`
   - [ ] Page reloads in Portuguese
7. Select **EN**
   - [ ] URL becomes `/`
   - [ ] Page reloads in English

**Article-level switcher test:**
1. Navigate to `/es/articles/panama-cost-of-living-2026.html`
2. Click language dropdown → select **DE**
   - [ ] URL becomes `/de/articles/panama-cost-of-living-2026.html` (SAME article, German)
   - [ ] **NOT** redirected to `/de/` home
   - [ ] h1 changes to German title
3. From the German article, click **EN**
   - [ ] URL becomes `/articles/panama-cost-of-living-2026.html`
   - [ ] h1 changes to English

---

## SECTION 4 — Click-through integrity (5 min)

This test makes sure no link from the home page leads to a 404.

**Steps (from `/es/`):**
1. Load `/es/`
2. Scroll to Projects section
3. Click the first project card (large featured card)
   - [ ] URL becomes `/projects/<slug>.html` (e.g. `/projects/pino-alto-boquete.html`)
   - [ ] Page loads, shows project name as h1
   - [ ] No 404
4. Click browser BACK → returns to `/es/`
5. Scroll to Journal (Crónicas) section
6. Click the first article card (the large one with the cover image)
   - [ ] URL becomes `/es/articles/<slug>.html` (Spanish article)
   - [ ] h1 in Spanish
   - [ ] No 404
7. Click the back-link arrow at the top ("Crónicas")
   - [ ] URL becomes `/articles/` (EN article index — expected behavior)
   - [ ] No 404
8. Browser BACK to `/es/`
9. Scroll to News (Noticias) section
10. Click the first news headline
    - [ ] URL becomes `/news/<slug>.html` (EN news article — expected)
    - [ ] No 404
11. Click the **"Ver toda la redacción →"** button in News section
    - [ ] URL becomes `/news/` (EN news index)
    - [ ] No 404
12. Browser BACK to `/es/`
13. Scroll to Regions section
14. Click any region card
    - [ ] URL becomes `/#projects` (scrolls to projects on home)
    - [ ] No 404
15. Click the green WhatsApp floating button (bottom-right)
    - [ ] Opens https://wa.me/50762534802 (new tab)

---

## SECTION 5 — Navbar parity across page types (5 min)

The 7-link navbar must look identical on every page type (just translated). Visit each URL below and verify the navbar has the same 7 links + language dropdown + Reserve CTA.

**Steps:**
1. Open each URL in a new tab
2. Look at the navbar
3. Count visible nav anchors

**Expected: 9 visible anchors per page** (brand wordmark + 7 main links + Reserve CTA).

| URL | Lang of nav labels | Pass? |
|---|---|---|
| `/` | EN | [ ] |
| `/es/` | ES | [ ] |
| `/pt/` | PT | [ ] |
| `/de/` | DE | [ ] |
| `/articles/` | EN | [ ] |
| `/articles/2026-outlook.html` | EN | [ ] |
| `/es/articles/panama-cost-of-living-2026.html` | ES | [ ] |
| `/de/articles/moving-to-panama-with-pets.html` | DE | [ ] |
| `/news/` | EN | [ ] |
| `/news/coronado-sold-out.html` | EN | [ ] |
| `/projects/pino-alto-boquete.html` | EN | [ ] |
| `/proyectos/casa-korsi-casco-antiguo.html` | ES | [ ] |
| `/videos/` | EN | [ ] |

**Watch out for:** Missing **"Residency"** / **"Residencia"** / **"Aufenthalt"** link on detail pages (this was a parity bug — should now be fixed).

---

## SECTION 6 — Reservation context preservation (3 min)

This verifies that clicking "Start a reservation" from an article preserves the article identity (BUG-010 fix).

**Steps:**
1. Navigate to `/articles/2026-outlook.html`
2. Scroll to the orange "Reserve from $5,000" section near the bottom
3. **Right-click** the big black "Start a reservation" button → "Copy link address"
4. Paste the link somewhere visible

**Pass criteria:**
- [ ] The link URL contains **`?from=2026-outlook&type=article#reserve`**
- [ ] NOT a plain `/#reserve` without the slug

5. Right-click the "WhatsApp +507 6761-0315" button → "Copy link address"
6. Paste somewhere visible
- [ ] The link contains **`text=Hi%2C%20I'm%20interested%20in%3A%20Panama%202026%20property%20outlook...`** (URL-encoded prefilled message)

7. Now navigate to `/es/articles/panama-cost-of-living-2026.html`
8. Right-click the "Iniciar una reserva" button
- [ ] Link contains **`?from=panama-cost-of-living-2026&type=article#reserve`**

---

## SECTION 7 — Videos page (2 min)

**Steps:**
1. Navigate to `/videos/`
2. Wait for cards to render

**Pass criteria:**
- [ ] Page intro paragraph mentions **"Spanish-narrated"** and **"English subtitles available on YouTube"**
- [ ] Each of the 10 video cards has a small dark **"ES"** pill badge to the left of the title
- [ ] Video thumbnails load (no broken images)
- [ ] Tab title: **"Panama Real Estate Videos — Project Tours"**

---

## SECTION 8 — Banesco /proyectos/ pages (2 min)

These are the Banesco bank-inventory property pages (separate from /projects/).

**Steps:**
1. Navigate to `/proyectos/casa-korsi-casco-antiguo.html`

**Pass criteria:**
- [ ] Navbar renders at top (was missing before PR #74 — should now be there)
- [ ] Page h1 visible (project name)
- [ ] Page content renders
- [ ] No 404, no blank page
- [ ] No console errors
- [ ] **Copy rule check:** No mention of the words "remate", "subasta", or "liquidación" anywhere on the page (these are forbidden by the Banesco voice rule)
- [ ] **Brand rule check:** No mention of "Banesco" in any visible overlay or title

Repeat for one of these other proyectos:
- `/proyectos/buenaventura-ritz-reserve.html`
- `/proyectos/euphoria-art-district.html`
- `/proyectos/sanctuary-residences.html`

---

## SECTION 9 — Footer parity (2 min)

**Steps:**
1. On any page, scroll to the bottom
2. Inspect the footer

**Per language (EN/ES/PT/DE), verify:**

| Item | EN | ES | PT | DE |
|---|---|---|---|---|
| Copyright | © 2026 PanamaRealEstateGuide.com | © 2026 PanamaRealEstateGuide.com | © 2026 PanamaRealEstateGuide.com | © 2026 PanamaRealEstateGuide.com |
| Privacy link text | Privacy | Privacidad | Privacidade | Datenschutz |
| Terms link text | Terms | Términos | Termos | AGB |

**Pass criteria:**
- [ ] Footer renders on every page
- [ ] Footer language pill row (EN · ES · PT · DE) is clickable and switches to that language version

---

## SECTION 10 — Mobile burger menu (5 min)

**Steps (Chrome):**
1. Open DevTools (F12) → click the phone icon (top-left) to enter mobile mode
2. Set device to "iPhone 14 Pro" (390×844) OR drag to that size
3. Reload `/es/`

**Pass criteria:**
- [ ] Burger icon (three horizontal lines) visible top-right
- [ ] Top-right "Reservar unidad" button is HIDDEN (replaced by burger)
- [ ] Tap the burger icon → mobile menu slides in
- [ ] Mobile menu shows ALL 7 nav labels in Spanish: Proyectos / Regiones / Crónicas / Videos / Noticias / Residencia / Nosotros
- [ ] Mobile menu has language switcher at the bottom
- [ ] Mobile menu has orange "Reservar unidad" CTA at the bottom
- [ ] Tap any nav link → menu closes + page scrolls to anchor

Repeat on `/de/` — German labels in the burger menu.

---

## SECTION 11 — Browser auto-translate test (3 min)

**Steps:**
1. In Chrome, go to **Settings → Languages** (chrome://settings/languages)
2. Make sure your preferred language is **English only**
3. In a new incognito window, navigate to `/de/`

**Pass criteria:**
- [ ] Chrome does **NOT** display a yellow "Translate this page?" prompt at the top
- [ ] The page stays in German
- [ ] Navbar labels remain "Projekte", "Regionen", "Aufenthalt" (NOT "Projects", "Regions", "Stay")
- [ ] Page title remains "Developer-Direct-Projekte · Journal · Reservierungen"

Same test on `/es/` and `/pt/` (in fresh incognito tabs).

---

## SECTION 12 — Final smoke test (3 min)

**Steps:**
1. Open DevTools Console (F12 → Console tab) on any page
2. Look at the console output

**Pass criteria:**
- [ ] 0 red error messages
- [ ] 0 yellow warning messages about failed image/script loads
- [ ] No "Cannot read properties of undefined" type errors
- [ ] Acceptable: a single `[projects] using data.js fallback —` info message (defensive log, fine to ignore)

Repeat on `/es/`, `/de/`, `/pt/`, `/es/articles/panama-cost-of-living-2026.html`.

---

## OPTIONAL — Console diagnostic snippet

If you want a one-shot per-page health snapshot, paste this in DevTools Console:

```js
copy(JSON.stringify({
  url: location.pathname,
  lang: document.documentElement.lang,
  preg_lang: window.PREG_LANG || null,
  notranslate: !!document.querySelector('meta[name="google"][content="notranslate"]'),
  title: document.title,
  h1: document.querySelector('h1')?.textContent,
  nav: Array.from(document.querySelectorAll('header nav a, header a')).slice(0,10).map(a => a.textContent.trim()).filter(Boolean),
  brokenImgs: Array.from(document.querySelectorAll('img')).filter(i => i.complete && i.naturalWidth === 0).map(i => i.src),
  mergeMarkers: /[<>=]{7}/.test(document.body.innerHTML),
}, null, 2))
```

The snapshot is copied to clipboard. Paste into your bug report next to each failed test.

---

## REPORT TEMPLATE

For each ❌ found, fill out:

```
### [P0|P1|P2] <short title>
- **URL:** https://panamarealestateguide.com/...
- **Section:** (e.g. "Section 2 — Article detail pages")
- **Test step:** (which checkbox failed)
- **Expected:** (what the test plan said should happen)
- **Actual:** (what you observed)
- **Screenshot:** (attach or paste link)
- **Console snapshot:** (paste output of the diagnostic snippet if relevant)
```

**Severity guide:**
- **P0** — page broken/blank, merge conflict markers visible, broken images, wrong `<html lang>`, 404 from home page link
- **P1** — text in wrong language, missing translation, missing nav item, layout glitch
- **P2** — copy polish, minor padding/alignment, hreflang nuance

---

## FINAL SUMMARY (fill at end)

```
Total sections completed:    /12
Total pass criteria checked: /XXX (count all checkboxes)
Total passed: 
Total failed: 
P0 issues found: 
P1 issues found: 
P2 issues found: 

Overall verdict: [SHIPPABLE / NEEDS FIXES / BLOCKED]
Tester name:
Date:
Browser + version:
```

When 0 P0 + 0 P1 issues remain, the multilingual rollout is shippable.
