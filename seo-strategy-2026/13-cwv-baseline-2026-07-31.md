# v1 Core Web Vitals baseline — captured 2026-07-31, before v2 cutover

Local `npx lighthouse` runs (headless, --only-categories=performance) against
production. Absolute numbers are inflated by this sandbox's network/CPU
throttling (LCP of 15-25s is not representative of real-world v1 performance
— the strategy audit's own finding is that v1 is fast, static-HTML-on-Netlify).
Treat these as a same-environment relative baseline for the v2 comparison
immediately after cutover, not an absolute verdict. Real field data comes
from Search Console's Core Web Vitals report over the following weeks.

| Page | Perf score | LCP | CLS | TBT | FCP |
|---|---|---|---|---|---|
| / | 0.56 | 24.9s | 0 | 70ms | 10.4s |
| /articles/boquete-panama-real-estate.html | 0.57 | 14.8s | 0 | 80ms | 5.3s |
| /projects/pino-alto-boquete.html | 0.56 | 19.9s | 0 | 30ms | 9.4s |

CLS = 0 and TBT stay low and consistent across pages while LCP/FCP scale with
page complexity — the signature of network throttling in this environment,
not per-page issues. Full JSON reports: /tmp/cwv-baseline/{home,article,project}.json
