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
 *   window.preg.trackAddToWishlist({project}) — for "Save project" buttons (Meta AddToWishlist, $15)
 *   window.preg.trackCompleteRegistration({event_name}) — for event RSVP confirmations (Meta CompleteRegistration, $400)
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

    // Google Ads conversion (no-op unless PREG_GADS configured by inject-tags.mjs)
    fireGoogleAdsConversion(eventName, props);
  }


  // ── 3b. Google Ads conversion firing ───────────────────────────────────
  // When a known revenue event fires, also fire gtag('event','conversion',...)
  // pointed at the Google Ads conversion action. Configured at build time by
  // inject-tags.mjs which writes window.PREG_GADS with the conversion_id and
  // a labels map. If either is missing, this is a silent no-op.
  var GADS_EVENT_MAP = {
    'lead_form_submit': { label: 'lead',     value: 50  },
    'whatsapp_click':   { label: 'whatsapp', value: 30  },
    'calendly_booked':  { label: 'calendly', value: 200 }
  };
  function fireGoogleAdsConversion(eventName, props) {
    var cfg = window.PREG_GADS;
    if (!cfg || !cfg.conversion_id) return;
    var entry = GADS_EVENT_MAP[eventName];
    if (!entry) return;
    var label = cfg.labels && cfg.labels[entry.label];
    if (!label) return;
    if (typeof window.gtag !== 'function') return;
    var value = (props && typeof props.value === 'number') ? props.value : entry.value;
    window.gtag('event', 'conversion', {
      send_to: cfg.conversion_id + '/' + label,
      value: value,
      currency: 'USD'
    });
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


  // ── 5b. AddToWishlist helper ────────────────────────────────────────────
  // Call from "Save project" / bookmark icon clicks. Maps to Meta AddToWishlist.
  function trackAddToWishlist(opts) {
    opts = opts || {};
    trackEvent('add_to_wishlist', {
      fb_event: 'AddToWishlist',
      currency: 'USD',
      value: 15,
      content_name: opts.project || opts.content_name || 'unknown_project',
      content_category: 'real_estate_project',
      page_path: window.location.pathname
    });
  }

  // ── 5c. CompleteRegistration helper ─────────────────────────────────────
  // Call from event RSVP / encuentro booking confirmations. Maps to Meta
  // CompleteRegistration ($400 — high signal, used for retargeting + lookalikes).
  function trackCompleteRegistration(opts) {
    opts = opts || {};
    trackEvent('event_rsvp_confirmed', {
      fb_event: 'CompleteRegistration',
      currency: 'USD',
      value: 400,
      content_name: opts.event_name || 'encuentro_privado',
      content_category: 'event_rsvp',
      registration_method: opts.method || 'form'
    });
  }

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


  // ── 6b. Calendly inline embed listener ────────────────────────────────
  // Calendly's embed widget posts messages of the shape:
  //   { event: 'calendly.event_scheduled', payload: { event: {uri}, invitee: {uri} } }
  // We catch event_scheduled and fire a 'calendly_booked' dataLayer event
  // (worth $200 — highest in the funnel). GTM forwards to Meta `Schedule`
  // and GA4 `calendly_booked`.
  function isCalendlyEvent(e) {
    return e && e.data && typeof e.data === 'object' &&
           typeof e.data.event === 'string' &&
           e.data.event.indexOf('calendly') === 0;
  }
  window.addEventListener('message', function (e) {
    if (!isCalendlyEvent(e)) return;
    var name = e.data.event;
    if (name === 'calendly.event_scheduled') {
      var payload = e.data.payload || {};
      trackEvent('calendly_booked', {
        fb_event: 'Schedule',
        currency: 'USD',
        value: 200,
        content_name: 'discovery_call',
        content_category: 'real_estate_consultation',
        event_uri: (payload.event && payload.event.uri) || '',
        invitee_uri: (payload.invitee && payload.invitee.uri) || '',
        utm_source: getUTM('utm_source'),
        utm_campaign: getUTM('utm_campaign'),
        utm_content: getUTM('utm_content')
      });
    } else if (name === 'calendly.event_type_viewed') {
      trackEvent('calendly_viewed', {
        fb_event: 'ViewContent',
        currency: 'USD',
        value: 5,
        content_name: 'calendar_widget'
      });
    } else if (name === 'calendly.date_and_time_selected') {
      trackEvent('calendly_time_selected', {
        fb_event: 'AddToCart',
        currency: 'USD',
        value: 50,
        content_name: 'time_selected'
      });
    }
  }, false);

  // Helper: open Calendly popup with UTM prefill (used by CTA buttons)
  function openCalendly(opts) {
    opts = opts || {};
    if (typeof window.Calendly === 'undefined') {
      console.warn('Calendly widget not loaded yet');
      return;
    }
    var url = opts.url || window.PREG_CALENDLY_URL || '';
    if (!url) { console.warn('No Calendly URL set'); return; }
    var utmObj = {
      utmSource: getUTM('utm_source') || 'website',
      utmMedium: getUTM('utm_medium') || 'cta',
      utmCampaign: getUTM('utm_campaign') || '',
      utmContent: getUTM('utm_content') || (opts.source || ''),
      utmTerm: getUTM('utm_term') || ''
    };
    window.Calendly.initPopupWidget({ url: url, utm: utmObj });
    trackEvent('calendly_cta_click', {
      fb_event: 'InitiateCheckout',
      currency: 'USD',
      value: 30,
      content_name: opts.source || 'cta'
    });
    return false; // for inline onclick
  }

  // ── 7. Public API ──────────────────────────────────────────────────────
  window.preg = window.preg || {};
  window.preg.getUTM = getUTM;
  window.preg.trackEvent = trackEvent;
  window.preg.trackWhatsApp = trackWhatsApp;
  window.preg.trackAddToWishlist = trackAddToWishlist;
  window.preg.trackCompleteRegistration = trackCompleteRegistration;
  window.preg.captureUTMs = captureUTMs;
  window.preg.openCalendly = openCalendly;
})();
