// landing-hydrate.js — runtime helper that overrides hero image, OG meta, and
// optional copy fields on landing pages with values from /airtable-landings.json.
//
// Loaded by all landing pages in /co/, /es/, and /proyectos/. If the JSON has
// no entry for the current landing, this is a no-op (page renders as deployed).
//
// Field overrides (all optional per-landing):
//   - heroImage  → swaps img.hero-img src + <link rel=preload> + og:image
//   - heroCaption → swaps the small caption text inside .hero-img on blinda
//   - title      → swaps document.title (only if non-empty)
//   - headline   → swaps the H1 inside .hero
//   - subheadline → swaps the first <p> inside .hero
//
// Fail-safe: any error is swallowed silently; the original deployed values stay.

(function () {
  function pathSlug() {
    // /co/airbnb-casco-antiguo.html → "co/airbnb-casco-antiguo"
    // /proyectos/euphoria-art-district.html → "proyectos/euphoria-art-district"
    var p = location.pathname.replace(/^\/+|\.html$/g, '');
    return p;
  }

  function applyOverrides(landing) {
    if (!landing) return;
    try {
      // Hero image
      if (landing.heroImage) {
        // <img class="hero-img">
        var img = document.querySelector('img.hero-img');
        if (img) img.src = landing.heroImage;
        // <link rel="preload" as="image">
        var preload = document.querySelector('link[rel="preload"][as="image"]');
        if (preload) preload.href = landing.heroImage;
        // <div class="hero-img"> (blinda case — uses background-image)
        var divHero = document.querySelector('div.hero-img');
        if (divHero) {
          divHero.style.backgroundImage = "linear-gradient(135deg,rgba(11,31,40,0.55) 0%,rgba(227,115,99,0.35) 100%),url('" + landing.heroImage + "')";
        }
      }
      // OG image meta
      if (landing.ogImage) {
        var og = document.querySelector('meta[property="og:image"]');
        if (og) og.setAttribute('content', location.origin + landing.ogImage);
      }
      // Hero caption (small text inside hero-img div)
      if (landing.heroCaption) {
        var captionSpan = document.querySelector('div.hero-img span');
        if (captionSpan) captionSpan.textContent = landing.heroCaption;
      }
      // Title
      if (landing.title) document.title = landing.title;
      // H1
      if (landing.headline) {
        var h1 = document.querySelector('section.hero h1, .hero h1');
        if (h1) h1.innerHTML = landing.headline;
      }
      // Subheadline
      if (landing.subheadline) {
        var heroP = document.querySelector('section.hero p, .hero p');
        if (heroP) heroP.innerHTML = landing.subheadline;
      }
    } catch (e) { console.warn('landing-hydrate error:', e); }
  }

  fetch('/airtable-landings.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data || !Array.isArray(data.landings)) return;
      var slug = pathSlug();
      var landing = data.landings.find(function (l) {
        return l.slug === slug
          || l.slug === slug.replace(/^proyectos\//, '')
          || (l.slug && slug.endsWith('/' + l.slug.split('/').pop()));
      });
      if (landing && landing.status !== 'Draft' && landing.status !== 'Retired') {
        applyOverrides(landing);
      }
    })
    .catch(function () { /* silent — fall back to deployed copy */ });
})();
