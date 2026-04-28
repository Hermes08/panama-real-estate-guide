/* =============================================================================
 * tracking.js — minimal client-side tracking helpers for panamarealestateguide.com
 * =============================================================================
 *
 * Loaded on every page (linked from index.html). Independent of GTM/Pixel/GA4 —
 * pushes events into window.dataLayer. If GTM is configured at build time, those
 * events are forwarded to all destinations (Meta, Google, TikTok, etc.).
 *
 * Public API (exposed on window):
 *   window.dataLayer            — created if not exists
 *   window.preg.getUTM(name)    — read a UTM param from URL or sessionStorage
 *   window.preg.trackEvent(name, props) — push to dataLayer + direct tracker fallbacks
 *   window.preg.trackWhatsApp() — for inline onclick on wa.me links
 *   window.preg.captureUTMs()   — auto-populate hidden inputs in any <form>
 *
 * Loaded BEFORE the GTM/Pixel scripts inserted by inject-tags.mjs, so the
 * dataLayer is already initialized when those load.
 * ============================================================================= */

(function () {
  'use strict';

  // ── 1. Initialize dataLayer ─────────────────────────────────────────────
  window.dataLayer = window.dataLayer || [];

  // ── 2. UTM capture (sticky for the session) ────────────────────────────
  var UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
  var UTM_STORAGE_KEY = 'preg_utms_v1';

  function readSessionUTMs() {
    try {
      var raw = sessionStorage.getItem(UTM_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function writeSessionUTMs(obj) {
    try { sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(obj)); } catch (e) {}
  }

  // On page load, snapshot URL UTMs into sessionStorage (only if URL has them
  // — we don't want to overwrite earlier UTMs with empty values on subsequent
  // page navigations within the same session).
  (function snapshotUTMs() {
    var urlParams = new URLSearchParams(window.location.search);
    var fromURL = {};
    var hasAny = false;
    UTM_PARAMS.forEach(function (p) {
      var v = urlParams.get(p);
      if (v) { fromURL[p] = v; hasAny = true; }
    });
    if (hasAny) {
      var existing = readSessionUTMs();
      // First-touch wins: only set keys not already present.
      // (Switch to "last-touch wins" by removing the existing[k] guard.)
      var merged = {};
      Object.keys(existing).forEach(function (k) { merged[k] = existing[k]; });
      Object.keys(fromURL).forEach(function (k) {
        if (!merged[k]) merged[k] = fromURL[k];
      });
      writeSessionUTMs(merged);
    }
  })();

  function getUTM(name) {
    var urlParams = new URLSearchParams(window.location.search);
    var fromURL = urlParams.get(name);
    if (fromURL) return fromURL;
    var stored = readSessionUTMs();
    return stored[name] || '';
  }

  // ── 3. Generic event push with direct tracker fallbacks ────────────────
  // Pushes to dataLayer (GTM picks it up) AND directly calls fbq/gtag/ttq if
  // they happen to be loaded already. This way we don't lose events if GTM is
  // slow or blocked.
  function trackEvent(eventName, props) {
    props = props || {};
    var payload = Object.assign({ event: eventName }, props);

    // Push to dataLayer
    window.dataLayer.push(payload);

    // Meta Pixel
    if (typeof window.fbq === 'function') {
      var fbEvent = props.fb_event || eventName;
      var fbProps = {
        currency: props.currency || 'USD',
        value: typeof props.value === 'number' ? props.value : 0
      };
      if (props.content_name) fbProps.content_name = props.content_name;
      if (props.content_category) fbProps.content_category = props.content_category;
      window.fbq('track', fbEvent, fbProps);
    }

    // Google Analytics / Google Ads (gtag)
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, props);
    }

    // TikTok
    if (typeof window.ttq === 'object' && window.ttq.track) {
      window.ttq.track(eventName, props);
    }
  }

  // ── 4. WhatsApp click tracker (used by floating button + footer link) ──
  function trackWhatsApp(opts) {
    opts = opts || {};
    trackEvent('whatsapp_click', {
      fb_event: 'Contact',
      currency: 'USD',
      value: 30,
      content_name: opts.source || 'unknown',
      page_path: window.location.pathname,
      utm_source: getUTM('utm_source'),
      utm_campaign: getUTM('utm_campaign'),
      utm_content: getUTM('utm_content')
    });
  }

  // ── 5. Form helpers ─────────────────────────────────────────────────────
  // Auto-populate hidden inputs (utm_source, utm_medium, etc.) on every form
  // that has the matching <input type="hidden" name="utm_source"> etc.
  function captureUTMs() {
    document.querySelectorAll('form').forEach(function (form) {
      UTM_PARAMS.concat(['referrer', 'landing_url']).forEach(function (key) {
        var input = form.querySelector('input[name="' + key + '"]');
        if (!input) return;
        var value;
        if (key === 'referrer') value = document.referrer || '';
        else if (key === 'landing_url') value = window.location.href;
        else value = getUTM(key);
        input.value = value;
      });
    });
  }

  // Run capture as soon as DOM is ready (and again on dynamic form mounts via
  // a one-time observer — keeps things minimal).
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    captureUTMs();
    // Watch for forms added later (the React render can mount forms after
    // DOMContentLoaded). Disconnect after first hit to keep this cheap.
    if (typeof MutationObserver === 'function') {
      var seen = false;
      var mo = new MutationObserver(function () {
        if (seen) return;
        if (document.querySelector('form input[name^="utm_"]')) {
          seen = true;
          captureUTMs();
          mo.disconnect();
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
      setTimeout(function () { mo.disconnect(); }, 10000);
    }
  });

  // ── 6. Page view (explicit, in addition to GTM auto pageview) ──────────
  // Pushes a custom event so dataLayer-only consumers (without a GA4 tag)
  // still get a structured page_view.
  ready(function () {
    window.dataLayer.push({
      event: 'page_view',
      page_path: window.location.pathname,
      page_title: document.title,
      utm_source: getUTM('utm_source'),
      utm_campaign: getUTM('utm_campaign')
    });
  });

  // ── 7. Public API ──────────────────────────────────────────────────────
  window.preg = window.preg || {};
  window.preg.getUTM = getUTM;
  window.preg.trackEvent = trackEvent;
  window.preg.trackWhatsApp = trackWhatsApp;
  window.preg.captureUTMs = captureUTMs;
})();
