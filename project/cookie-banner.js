/* =============================================================================
 * cookie-banner.js — minimal RGPD/CCPA-compliant consent banner
 * =============================================================================
 * Implements Google Consent Mode v2 default-deny + update-on-consent pattern.
 * Loads BEFORE GTM/Pixel so default consent state is "denied" until accepted.
 * Stores choice in localStorage for 6 months (per RGPD requirements).
 * =============================================================================
 */
(function () {
  'use strict';
  var STORAGE_KEY = 'preg_consent_v1';
  var SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 180;

  // Set Google Consent Mode v2 defaults to DENIED before any tracker loads
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // Check stored consent
  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp > SIX_MONTHS_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch (e) { return null; }
  }

  function applyConsent(state) {
    var granted = state === 'all';
    var analyticsOnly = state === 'analytics';
    gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      analytics_storage: (granted || analyticsOnly) ? 'granted' : 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted'
    });
    window.dataLayer.push({ event: 'consent_update', consent_state: state });
  }

  function saveConsent(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: state, timestamp: Date.now() }));
    } catch (e) {}
    applyConsent(state);
  }

  // Initial state: default-deny until banner action
  var existing = readConsent();
  if (existing) {
    applyConsent(existing.state);
  } else {
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 500
    });
  }

  function buildBanner() {
    if (existing) return;
    var banner = document.createElement('div');
    banner.id = 'preg-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.style.cssText = [
      'position:fixed','left:50%','bottom:20px','transform:translateX(-50%)',
      'max-width:680px','width:calc(100% - 32px)','z-index:9999',
      'background:#0B1F28','color:#FFF9EC','border-radius:14px',
      'box-shadow:0 12px 32px -4px rgba(0,0,0,0.45)',
      'padding:20px 24px','font-family:system-ui,-apple-system,sans-serif',
      'font-size:14px','line-height:1.5','animation:pregFadeIn 0.4s ease'
    ].join(';');
    banner.innerHTML = [
      '<style>@keyframes pregFadeIn{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}',
      '#preg-cookie-banner button{font:inherit;cursor:pointer;border-radius:8px;padding:9px 16px;border:none;font-weight:600;transition:opacity 0.2s}',
      '#preg-cookie-banner button:hover{opacity:0.85}',
      '#preg-cookie-banner a{color:#E37363;text-decoration:underline;text-underline-offset:2px}',
      '@media(max-width:560px){#preg-cookie-banner{padding:16px}#preg-cookie-banner .preg-cookie-actions{flex-direction:column}#preg-cookie-banner .preg-cookie-actions button{width:100%}}',
      '</style>',
      '<div style="margin-bottom:14px"><strong style="font-size:15px">Usamos cookies</strong> para analizar tráfico y mejorar tus anuncios. ',
      'Tus datos se rigen por nuestra <a href="/privacidad" target="_blank">política de privacidad</a> ',
      '(RGPD · Habeas Data Colombia).</div>',
      '<div class="preg-cookie-actions" style="display:flex;gap:10px;flex-wrap:wrap">',
      '<button id="preg-cookie-accept-all" style="background:#E37363;color:#fff;flex:1">Aceptar todo</button>',
      '<button id="preg-cookie-reject" style="background:transparent;color:#FFF9EC;border:1px solid rgba(255,249,236,0.3);flex:1">Rechazar</button>',
      '<button id="preg-cookie-essential" style="background:transparent;color:#FFF9EC;border:1px solid rgba(255,249,236,0.3);flex:1">Solo esencial</button>',
      '</div>'
    ].join('');
    document.body.appendChild(banner);

    function close(state) {
      saveConsent(state);
      banner.style.transition = 'opacity 0.3s';
      banner.style.opacity = '0';
      setTimeout(function () { banner.remove(); }, 320);
    }
    document.getElementById('preg-cookie-accept-all').onclick = function () { close('all'); };
    document.getElementById('preg-cookie-reject').onclick = function () { close('rejected'); };
    document.getElementById('preg-cookie-essential').onclick = function () { close('analytics'); };
  }

  if (document.readyState !== 'loading') buildBanner();
  else document.addEventListener('DOMContentLoaded', buildBanner);

  // Public API to revoke (for /privacidad page button)
  window.preg = window.preg || {};
  window.preg.revokeConsent = function () {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    location.reload();
  };
  window.preg.consentState = function () {
    var c = readConsent();
    return c ? c.state : 'pending';
  };
})();
