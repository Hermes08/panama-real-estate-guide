# SEO / hreflang / sitemap audit — multilingual deploy

**Date:** 2026-05-19
**Preview URL:** https://feat-multilingual-i18n-may-202--panamarealestateguide.netlify.app
**Auditor:** Claude Code (curl + offline HTML inspection, no browser MCP)
**Scope:** 2 sample articles × 4 languages = 8 URLs + sitemap + production parity check

---

## 1. Per-URL checklist

Legend: PASS / FAIL / N/A. "EM-dash" check is for the title and the `meta name="description"` content attribute.

### 1.1 EN — `articles/internet-providers-panama-expats.html`
| # | Check | Result | Detail |
|---|-------|--------|--------|
| 1 | HTTP 200 | PASS | 200 |
| 2 | `<html lang="en">` | PASS | `lang="en"` |
| 3 | Title in EN | PASS | `Internet providers in Panama 2026: Tigo, +Movil, Starlink (real prices by zone) — PanamaRealEstateGuide.com` |
| 4 | Meta description present + EN | PASS | "Tigo fiber 500 Mbps from B/.59/mo. +Movil symmetric fiber from B/.33/mo. Starlink USD $45 to USD $70/mo plus USD $200 hardware. The plan that works…" |
| 5 | hreflang block (5 variants) | **FAIL** | **Zero hreflang `<link>` tags emitted on the EN page** |
| 6 | Canonical → correct URL | PASS | `https://panamarealestateguide.com/articles/internet-providers-panama-expats.html` |
| 7 | og:locale matches lang | **FAIL** | No `og:locale` meta present at all |
| 8 | No em dash in title/desc | **FAIL (title)** | Title contains ` — PanamaRealEstateGuide.com` (U+2014) |

### 1.2 EN — `articles/panama-retirement-communities.html`
| # | Check | Result | Detail |
|---|-------|--------|--------|
| 1 | HTTP 200 | PASS | 200 |
| 2 | `<html lang="en">` | PASS | `lang="en"` |
| 3 | Title in EN | PASS | `Retirement communities in Panama 2026: 7 zones US retirees should compare — PanamaRealEstateGuide.com` |
| 4 | Meta description present + EN | PASS | "USD $1,500 to USD $3,500/mo buys you a comfortable Panama retirement, but the zone you pick decides healthcare access, English-speaking neighbors, and…" |
| 5 | hreflang block (5 variants) | **FAIL** | Zero hreflang tags |
| 6 | Canonical → correct URL | PASS | `https://panamarealestateguide.com/articles/panama-retirement-communities.html` |
| 7 | og:locale | **FAIL** | Missing |
| 8 | No em dash | **FAIL (title)** | Title contains ` — PanamaRealEstateGuide.com` |

### 1.3 ES — `/es/articles/internet-providers-panama-expats.html`
| # | Check | Result | Detail |
|---|-------|--------|--------|
| 1 | HTTP 200 | PASS | 200 |
| 2 | `<html lang="es">` | PASS | |
| 3 | Title in ES | PASS | `Internet en Panamá 2026: Tigo, +Móvil y Starlink (precios reales por zona) \| PanamaRealEstateGuide.com` |
| 4 | Meta description in ES | PASS | Spanish copy present |
| 5 | hreflang block (5 variants) | PASS | 5 entries: en, es, pt, de, x-default |
| 6 | Canonical → `/es/...` | PASS | `https://panamarealestateguide.com/es/articles/internet-providers-panama-expats.html` |
| 7 | og:locale = `es` | PASS (minor) | Value is `es`, not BCP-47 `es_PA` / `es_LA` — Facebook prefers underscored region |
| 8 | No em dash | PASS | Pipe `\|` separator used |

Side-finding: **No JSON-LD Article schema** in ES output (EN/PT have it).

### 1.4 ES — `/es/articles/panama-retirement-communities.html`
Same as 1.3 — all checks PASS for hreflang/canonical/og:locale/title/desc; **JSON-LD missing**.

### 1.5 PT — `/pt/articles/internet-providers-panama-expats.html`
| # | Check | Result | Detail |
|---|-------|--------|--------|
| 1 | HTTP 200 | PASS | |
| 2 | `<html lang="pt">` | PASS | |
| 3 | Title in PT | PASS | `Provedores de internet no Panamá 2026: Tigo, +Móvil, Starlink \| PanamaRealEstateGuide.com` |
| 4 | Meta description PT | PASS | |
| 5 | hreflang block (5 variants) | PASS | 5 entries present |
| 6 | Canonical → `/pt/...` | PASS | |
| 7 | og:locale = `pt` | PASS (minor) | Should ideally be `pt_BR` to match JSON-LD `inLanguage: pt-BR` |
| 8 | No em dash | PASS | |

Side-finding: JSON-LD `inLanguage` is `pt-BR` while og:locale is bare `pt` — inconsistent.

### 1.6 PT — `/pt/articles/panama-retirement-communities.html`
| # | Check | Result | Detail |
|---|-------|--------|--------|
| 1 | HTTP 200 | PASS | |
| 2 | `<html lang="pt">` | PASS | |
| 3 | Title in PT | PASS | `Aposentar-se no Panamá 2026: 7 zonas para o investidor brasileiro comparar` |
| 4 | Meta description PT | PASS | |
| 5 | hreflang block (5 variants) | **FAIL** | **Only 3 hreflang tags emitted: `en`, `pt`, `x-default`.** Missing `es` and `de` — but the ES and DE pages do exist (both return HTTP 200 and link back). Asymmetric hreflang cluster → Google ignores the whole cluster. |
| 6 | Canonical → `/pt/...` | PASS | |
| 7 | og:locale = `pt` | PASS (minor) | |
| 8 | No em dash | PASS | |

### 1.7 DE — `/de/articles/internet-providers-panama-expats.html`
| # | Check | Result | Detail |
|---|-------|--------|--------|
| 1 | HTTP 200 | PASS | |
| 2 | `<html lang="de">` | PASS | |
| 3 | Title in DE | PASS | `Internet in Panama 2026: Tigo, +Móvil, Starlink (Preise nach Zone) \| PanamaRealEstateGuide.com` |
| 4 | Meta description DE | PASS | German copy |
| 5 | hreflang block (5 variants) | PASS | 5 entries |
| 6 | Canonical → `/de/...` | PASS | |
| 7 | og:locale = `de` | PASS (minor) | Could be `de_DE` |
| 8 | No em dash | PASS | |

Side-finding: **No JSON-LD Article schema** in DE output.

### 1.8 DE — `/de/articles/panama-retirement-communities.html`
Same as 1.7 — checks PASS, **JSON-LD missing**.

---

## 2. Cross-language URL parity (hreflang reachability)

### 2.1 On the PREVIEW branch
All 4 lang variants resolve to HTTP 200 for **both** sample articles. Preview is internally consistent.

```
[200] /articles/internet-providers-panama-expats.html
[200] /es/articles/internet-providers-panama-expats.html
[200] /pt/articles/internet-providers-panama-expats.html
[200] /de/articles/internet-providers-panama-expats.html
[200] /articles/panama-retirement-communities.html
[200] /es/articles/panama-retirement-communities.html
[200] /pt/articles/panama-retirement-communities.html
[200] /de/articles/panama-retirement-communities.html
```

### 2.2 On PRODUCTION `panamarealestateguide.com` (today)
EN paths return 200. Every `/es/`, `/pt/`, `/de/` path **returns 404**:

```
[200] /articles/internet-providers-panama-expats.html
[404] /es/articles/internet-providers-panama-expats.html
[404] /pt/articles/internet-providers-panama-expats.html
[404] /de/articles/internet-providers-panama-expats.html
[200] /articles/panama-retirement-communities.html
[404] /es/articles/panama-retirement-communities.html
[404] /pt/articles/panama-retirement-communities.html
[404] /de/articles/panama-retirement-communities.html
```

This is the expected pre-merge state (multilingual hasn't shipped to prod yet). But it means: **the hreflang `<link>` tags emitted on the preview deploy reference URLs that 404 on production today**. If Google or social crawlers pick up the preview branch URL (it's publicly reachable, no `noindex`), they will see broken hreflang and may discount the cluster.

### 2.3 Production sentinel check
`https://panamarealestateguide.com/articles/internet-providers-panama-expats.html` — confirmed **no hreflang tags** in the live HTML today. Production is unchanged, as the brief expected.

---

## 3. Sitemap audit

`https://feat-multilingual-i18n-may-202--panamarealestateguide.netlify.app/sitemap.xml` → HTTP 200, 117 `<url>` entries.

| Check | Result | Detail |
|-------|--------|--------|
| Sitemap contains any `/es/` URLs | **FAIL** | 0 entries |
| Sitemap contains any `/pt/` URLs | **FAIL** | 0 entries |
| Sitemap contains any `/de/` URLs | **FAIL** | 0 entries |
| Sitemap uses `xhtml:link rel="alternate" hreflang=...` | **FAIL** | 0 entries; the `<urlset>` doesn't even declare the `xhtml` namespace |

The sitemap is still the pre-multilingual one. Google's documented "best practice" is that hreflang clusters should be declared **either in HTML head OR in the sitemap** (sitemap is preferred at scale). Right now neither path is complete: HTML head has hreflang only on translated pages (and asymmetric in one case), sitemap has nothing.

---

## 4. inject-hreflang.mjs sentinel check

The brief asked whether `<!-- BEGIN_HREFLANG -->` / `<!-- END_HREFLANG -->` sentinels are present.

**Result: 0 occurrences across all 8 inspected pages.** The hreflang tags on the translated pages were emitted by some path (likely a template render, not the post-build injector), but the post-build `inject-hreflang.mjs` script either:

- did not run, OR
- ran but uses a different wrapper convention than expected, OR
- only injects on EN files (which is where it was MOST needed) and crashed silently.

Given that EN pages have **zero** hreflang tags while ES/PT/DE pages do have them (asymmetrically in one case), the most likely root cause is: **the injection script targets a step that runs only on the translated-page render path, not on the canonical EN build artifact**. The EN page is the "root" of the cluster — without hreflang on the EN page, the entire hreflang reciprocity rule is broken for every translated sibling.

---

## 5. Critical issues (BLOCK MERGE)

| # | Severity | Issue |
|---|----------|-------|
| C1 | **Blocker** | **EN pages have zero hreflang tags.** The EN page is the canonical, the x-default target, and (per traffic mix) the highest-volume page. Google requires bidirectional hreflang; if EN doesn't link to ES/PT/DE, the cluster is invalid and the translated variants will not be served in localized SERPs. Affects all EN articles (sample size 2 of 2). |
| C2 | **Blocker** | **`pt-retire` has asymmetric hreflang (3 tags instead of 5).** Missing `es` and `de` entries while those pages exist and DO link back. Per Google docs, any missing return-link invalidates the entire cluster. Suggests a per-page bug in the translation map (likely the PT retirement community translation file is missing two locale keys). |
| C3 | **Blocker** | **ES and DE pages have no JSON-LD `Article` or `BreadcrumbList` schema** (PT has both, EN has both + FAQ). This breaks structured-data parity, will surface as "missing structured data" in GSC for ES/DE only, and removes rich-result eligibility (article cards, breadcrumb trails) on two languages. |
| C4 | **High** | **Sitemap has zero translated URLs and no `xhtml:link` alternates.** Even if HTML-head hreflang were perfect, Google's crawler will not discover the new `/es/ /pt/ /de/` URLs in a timely fashion without sitemap entries. Easy fix at build time. |
| C5 | **High** | **EN titles contain em dash (—) before the brand suffix.** Violates the project's house style. Affects every EN article that uses the title template — sample showed 2/2 EN pages. Translated pages correctly use `\|`. |
| C6 | **Medium** | **EN pages missing `og:locale`.** All translated pages have it; the canonical EN page does not. Facebook/LinkedIn share cards will fall back to default region. |

---

## 6. Non-blocking observations

- **og:locale uses bare language codes** (`es`, `pt`, `de`) instead of Facebook's preferred `xx_YY` form (`es_PA`, `pt_BR`, `de_DE`). Not invalid, but suboptimal for OG validators.
- **PT pages declare `inLanguage: pt-BR`** in JSON-LD while `<html lang="pt">` and `og:locale="pt"` are language-only. If the audience is Brazilian (which the copy suggests — "investidor brasileiro"), align all three on `pt-BR`. If the audience is also Portuguese-from-Portugal, keep neutral `pt` everywhere and remove the `-BR` from JSON-LD.
- **EN title format** `Title — PanamaRealEstateGuide.com` repeats the brand inside og:title and twitter:title, increasing risk of truncation in SERPs (>60 chars on at least the retirement article).
- **Sample size:** only 2 articles audited. Strongly recommend extending this audit to: home (`/`, `/es/`, `/pt/`, `/de/`), articles index, news index, projects index, and at least one news + one project page before merge. The bugs found (missing EN hreflang, asymmetric pt-retire, missing ES/DE JSON-LD) are template-level, so they almost certainly recur across the entire content set.

---

## 7. Recommendations (priority order)

1. **Fix the `inject-hreflang.mjs` build step so it runs on EN canonical pages**, not just translated ones. EN must emit the same 5-tag hreflang block as the translated siblings. Verify with `grep -c hreflang= articles/*.html` returning >0 after build.
2. **Fix the PT retirement-community translation map** to include `es` and `de` keys so hreflang emits all 5 tags. Audit all PT pages similarly; this is unlikely to be the only one.
3. **Port the JSON-LD `Article` + `BreadcrumbList` rendering to the ES and DE templates.** Use the EN/PT templates as the reference. Add `inLanguage` matching the page lang.
4. **Regenerate the sitemap** to include all `/es/`, `/pt/`, `/de/` URLs and ideally use `<xhtml:link rel="alternate" hreflang="...">` clusters inside each `<url>` block. Declare the namespace: `xmlns:xhtml="http://www.w3.org/1999/xhtml"`.
5. **Strip em dashes from EN title templates.** Use `|` to match the translated pages and project style.
6. **Add `og:locale` to EN pages** (`en_US`).
7. **Standardize `og:locale` across all langs to BCP-47-style underscored values** (`es_PA`, `pt_BR`, `de_DE`, `en_US`). Reconcile with `<html lang>` and JSON-LD `inLanguage`.
8. **Optional but cheap:** add `<meta name="robots" content="noindex">` to the Netlify preview branch (or a deploy-context conditional) so the preview's hreflang-to-prod-404 mismatch never gets crawled in the wild.
9. **Re-run this audit after fixes** with a broader URL list (home + index pages + ~10 articles + ~5 news + ~5 projects) before merging to `main`.

---

## 8. Files inspected

- Live preview HTML pulled to `/tmp/seo-audit/{en,es,pt,de}-{internet,retire}.html`
- Live preview sitemap pulled to `/tmp/seo-audit/sitemap.xml`
- Production HTML pulled to `/tmp/seo-audit/prod-en-internet.html` for comparison
