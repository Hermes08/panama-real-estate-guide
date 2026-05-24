# Multilingual preview — browser E2E QA

**Preview:** https://feat-multilingual-i18n-may-202--panamarealestateguide.netlify.app/
**Date:** 2026-05-19
**Browser:** Chrome MCP (Browser 1, macOS, viewport 1419x668)
**Tester IP geolocation:** Spanish-mapped (banner appeared on `/` without `preg_lang` cookie)

---

## TL;DR — BLOCK MERGE

Two showstoppers that block merge of the multilingual feature branch:

1. **All per-language article pages render BLANK.** The HTML scaffold loads (correct `<title>`, correct `<html lang>` for ES/PT, `#root` div present) but the React mount script `/<lang>/article-renderer.js` returns **HTTP 404**, so `#root` stays empty (0 children, height 0). Verified for `/es/...`, `/pt/...`, `/de/...`. The unprefixed `/article-renderer.js` is also 404. This affects every translated article on the branch.
2. **Per-language home pages (`/es/`, `/pt/`, `/de/`, `/en/`) return Netlify default 404.** The banner CTA "Cambiar a español →" on the EN home page links to `/es/`, which 404s — so the user-visible language-switch flow is broken end-to-end.

The EN home page is fine, the geolocation banner from the edge function works, and the article HTML scaffolds (titles, meta description, lang attribute) are localized correctly — so the i18n *content pipeline* is mostly working. The deploy is missing the per-locale renderer JS and the per-locale home `index.html`.

---

## Scenario results

| # | Scenario | Result | Notes |
|---|---|---|---|
| 1 | ES article renders | **FAIL** | Title localized ("Internet en Panamá 2026: Tigo, +Móvil y Starlink…"), `<html lang="es">`, but body blank. `/es/article-renderer.js` → 404. |
| 2 | PT article renders | **FAIL** | Title localized ("Aposentar-se no Panamá 2026: 7 zonas para o investidor brasileiro comparar"), `<html lang="pt">`, body blank. `/pt/article-renderer.js` → 404. |
| 3 | DE article renders | **FAIL** | Title partially localized but MIXED EN+DE ("Internet in Panama 2026: Tigo, +Móvil, Starlink (Preise nach Zone)"). `<html lang="en">` (should be `de`). `/de/article-renderer.js` → 404. Body blank. |
| 4 | Console errors | **INCONCLUSIVE** | `read_console_messages` returned no messages even after fresh-tab reload with tracking primed. Likely a Chrome MCP limitation in this environment; cannot confirm errors but the 503/404 network responses are confirmed. |
| 5 | Edge-function language banner | **PASS** | On `/` (no cookie), banner injected at top: "Esta guía está disponible en español. [Cambiar a español →] [Dismiss]". Indicates IP geo → ES mapping and edge logic both work. |
| 6 | Cross-language navigation | **FAIL** | The EN page has visible EN/ES/PT/DE chips in the footer, but only the geo-banner "Cambiar a español" is an actual link (`href="/es/"`). The footer EN/ES/PT/DE labels are not wired up as anchors. AND the one working language link leads to a 404 (see issue 2). |

---

## Detailed findings

### Issue 1 — Per-language article pages blank (BLOCKER)

**Reproduce:** Open any of:
- `/es/articles/internet-providers-panama-expats.html`
- `/pt/articles/panama-retirement-communities.html`
- `/de/articles/internet-providers-panama-expats.html`

**Observed:** Paper-cream background only. No header, no body, no footer.

**Root cause:** The HTML loads 19 scripts. The last one, `/<lang>/article-renderer.js`, returns HTTP 404. Without it, `#root` is never hydrated. Verified via `fetch()`:

```
fetch('/es/article-renderer.js')  -> 404
fetch('/pt/article-renderer.js')  -> 404
fetch('/de/article-renderer.js')  -> 404
fetch('/article-renderer.js')     -> 404   (no unprefixed fallback either)
```

The network trace also shows the script registering as **HTTP 503** on the initial document load (likely Netlify-side transient on first hit; the manual `fetch()` returns the steady-state 404).

**Fix direction:** The build needs to either (a) emit `article-renderer.js` into each `/{lang}/` output directory, or (b) change the HTML to load the renderer from a locale-agnostic path that does exist (e.g. `/article-renderer.js` at site root) and pass the locale via a global / data attribute.

### Issue 2 — Per-language home pages 404 (BLOCKER)

```
fetch('/es/')           -> 404
fetch('/pt/')           -> 404
fetch('/de/')           -> 404
fetch('/en/')           -> 404
fetch('/es/index.html') -> 404
```

The Netlify default "Page not found" page renders (not even the site's own 404 template). Pretty-URL config also has nothing to fall back on. Combined with Issue 1, there is no working multilingual surface area on this preview.

### Issue 3 — DE `<html lang>` and title are wrong

On `/de/articles/internet-providers-panama-expats.html`:
- `<html lang="en">` — should be `"de"`.
- Title is a partial mix of English + German: "Internet in Panama 2026: Tigo, +Móvil, Starlink (Preise nach Zone) | PanamaRealEstateGuide.com".

ES and PT both set `lang` correctly and have fully-translated titles. The DE article appears to not have its translation file picked up at HTML-generation time, or the lang attribute writer is keyed off something different than ES/PT.

### Issue 4 — Footer "EN ES PT DE" chips are not links

In the rendered EN home page text the footer shows `EN ES PT DE` as visible characters, but a DOM scan for `a[href*="/es/"|"/pt/"|"/de/"]` finds only the geolocation banner anchor. The footer chips are presented but inert. (This would be a non-blocker on its own, but combined with the per-language home 404 it confirms there's no working way for a user to navigate to another language.)

### Issue 5 — Edge function works (positive finding)

On `/` with no `preg_lang` cookie set, the Spanish-language opt-in banner is injected by the edge function. Banner is well-formatted, has a coral CTA button and a paper Dismiss button, and is visually consistent with site brand. This was the only multilingual feature observed to work end-to-end at the user-visible layer (though the CTA target itself 404s).

---

## Network observations (relevant subset)

From `/es/articles/internet-providers-panama-expats.html`:

| URL | Status |
|---|---|
| `/es/articles/internet-providers-panama-expats.html` | 200 |
| `/styles.css` | 304 |
| `/cookie-banner.js?v=1` | 304 |
| `/data-light.js` | 304 |
| `/es/articles/bodies/internet-providers-panama-expats.js` | 304 (body data IS deployed per-locale) |
| `/components.js` | 304 |
| `/detail-chrome.js` | 304 |
| **`/es/article-renderer.js`** | **503 → 404 on retry** |
| `unpkg.com/react@18.3.1` | 200 |
| `unpkg.com/react-dom@18.3.1` | 200 |

The per-locale article body data file (`/es/articles/bodies/...js`) IS being deployed correctly — only the renderer is missing. So the fix is small (publish the renderer per locale) and unblocks the entire feature.

---

## Screenshots captured (in-band, not saved separately)

- ES article URL → fully blank cream page (`ss_8896v4752`, `ss_3642xwct8`, `ss_1030a3oat`)
- PT article URL → fully blank cream page (`ss_7920suybi`)
- DE article URL → fully blank cream page (`ss_6078bcssx`)
- EN `/` → page renders correctly, Spanish geo-banner visible at top (`ss_67118fium`)
- `/es/` → Netlify default 404 (`ss_8133ufvj0`)

---

## Recommended next steps

1. **Do not merge** until Issues 1 and 2 are fixed.
2. Verify the build script publishes `article-renderer.js` (or whatever the renderer is named) into `/{lang}/` output directories, OR adjust the article HTML template to reference a locale-agnostic renderer path.
3. Generate `/{lang}/index.html` (or pretty-URL `/{lang}/`) for each locale, even if it's a redirect or stub, so the language switcher targets resolve.
4. Fix `<html lang>` and title-translation pipeline for `/de/articles/...` — the ES and PT paths show the same code-path produces correct output for those locales.
5. Wire the footer EN/ES/PT/DE chips on the EN home as actual anchors pointing to `/`, `/es/`, `/pt/`, `/de/` once those locale home pages exist.
6. (Re-test) After fix, re-run all six scenarios; confirm cookie `preg_lang=es` after banner CTA suppresses the banner on subsequent visits.
