// =============================================================================
// geo-route.ts — Detect visitor country + browser language, inject a small
// dismissible "Switch to your language" banner on top of EN pages.
//
// Does NOT auto-redirect. Banner-only UX is less hostile + safer for SEO.
// NEVER touches bot user agents (Googlebot etc); they see exactly what they
// requested. Per-jurisdiction cookie banner logic also lives here.
//
// Runs on root + /articles/* + /projects/*. NOT on /es/*, /pt/*, /de/*
// (those pages are already in the target language).
// =============================================================================

import type { Context } from "https://edge.netlify.com";

const LANG_BY_COUNTRY: Record<string, string> = {
  // Portuguese
  BR: "pt", PT: "pt",
  // German
  DE: "de", AT: "de", CH: "de", LI: "de",
  // Spanish (LATAM + Iberia)
  ES: "es", MX: "es", CO: "es", AR: "es", CL: "es", PE: "es", VE: "es",
  EC: "es", UY: "es", PY: "es", BO: "es", DO: "es", CR: "es", PA: "es",
  GT: "es", HN: "es", NI: "es", SV: "es", CU: "es", PR: "es",
};

// EU member states + UK + Switzerland + Norway + Iceland (broad EEA-style scope for cookie compliance)
const GDPR_COUNTRIES = new Set([
  "AT","BE","BG","CY","CZ","DE","DK","EE","ES","FI","FR","GR","HR","HU","IE",
  "IT","LT","LU","LV","MT","NL","PL","PT","RO","SE","SI","SK",
  "GB","UK","CH","NO","IS","LI",
]);
const LGPD_COUNTRIES = new Set(["BR"]);
const HABEAS_DATA_COUNTRIES = new Set(["CO"]);
const LFPDPPP_COUNTRIES = new Set(["MX"]);

const BOT_UA = /(googlebot|bingbot|slackbot|twitterbot|facebookexternalhit|linkedinbot|whatsapp|telegrambot|duckduckbot|ahrefsbot|semrushbot|applebot|baiduspider|yandexbot|sogou|exabot|mj12bot|dotbot|petalbot|claudebot|gptbot|oai-searchbot)/i;

const LANG_LABELS: Record<string, { msg: string; cta: string }> = {
  es: { msg: "Esta guía está disponible en español.", cta: "Cambiar a español" },
  pt: { msg: "Este guia está disponível em português.", cta: "Mudar para português" },
  de: { msg: "Diese Anleitung ist auf Deutsch verfügbar.", cta: "Auf Deutsch wechseln" },
};

const COOKIE_LABELS: Record<string, { msg: string; accept: string; settings: string }> = {
  en: { msg: "We use cookies to improve your experience and analyze traffic.", accept: "Accept", settings: "Cookie settings" },
  es: { msg: "Usamos cookies para mejorar tu experiencia y analizar tráfico.", accept: "Aceptar", settings: "Configurar cookies" },
  pt: { msg: "Usamos cookies para melhorar sua experiência e analisar tráfego.", accept: "Aceitar", settings: "Configurar cookies" },
  de: { msg: "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und Traffic zu analysieren.", accept: "Akzeptieren", settings: "Cookie-Einstellungen" },
};

function parseCookies(header: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const pair of header.split(/;\s*/)) {
    const [k, v] = pair.split("=");
    if (k && v) out[k.trim()] = decodeURIComponent(v.trim());
  }
  return out;
}

function detectLang(country: string, acceptLang: string): string {
  if (LANG_BY_COUNTRY[country]) return LANG_BY_COUNTRY[country];
  const al = acceptLang.toLowerCase();
  if (al.startsWith("pt")) return "pt";
  if (al.startsWith("de")) return "de";
  if (al.startsWith("es")) return "es";
  return "en";
}

function detectCookieRegime(country: string): string {
  if (GDPR_COUNTRIES.has(country)) return "gdpr";
  if (LGPD_COUNTRIES.has(country)) return "lgpd";
  if (HABEAS_DATA_COUNTRIES.has(country)) return "habeas_data";
  if (LFPDPPP_COUNTRIES.has(country)) return "lfpdppp";
  return "standard";
}

function renderLangBanner(targetLang: string, currentPath: string): string {
  const labels = LANG_LABELS[targetLang];
  if (!labels) return "";
  // Translate /articles/X.html -> /<lang>/articles/X.html
  const translatedPath = `/${targetLang}${currentPath.startsWith("/") ? currentPath : "/" + currentPath}`;
  return `<div id="preg-lang-banner" style="position:fixed;top:0;left:0;right:0;z-index:9999;background:#0b1f28;color:#fdf8ef;padding:10px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;display:flex;align-items:center;justify-content:center;gap:16px;box-shadow:0 2px 8px rgba(0,0,0,0.18)">
  <span>${labels.msg}</span>
  <a href="${translatedPath}" onclick="document.cookie='preg_lang=${targetLang};path=/;max-age=31536000;samesite=lax'" style="background:#d65a45;color:#fdf8ef;padding:6px 14px;border-radius:4px;text-decoration:none;font-weight:600">${labels.cta} &rarr;</a>
  <button onclick="this.parentElement.remove();document.cookie='preg_lang=en;path=/;max-age=31536000;samesite=lax'" style="background:transparent;color:#fdf8ef;border:1px solid #fdf8ef33;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:13px">Dismiss</button>
</div>`;
}

function renderCookieBanner(regime: string, lang: string): string {
  if (regime === "standard") return ""; // existing cookie-banner.js handles standard
  const labels = COOKIE_LABELS[lang] || COOKIE_LABELS.en;
  const badges: Record<string, string> = {
    gdpr: "GDPR",
    lgpd: "LGPD",
    habeas_data: "Habeas Data",
    lfpdppp: "LFPDPPP",
  };
  return `<div id="preg-cookie-banner" style="position:fixed;bottom:0;left:0;right:0;z-index:9998;background:#fdf8ef;color:#0b1f28;border-top:2px solid #d65a45;padding:14px 20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
  <span><strong>${badges[regime] || regime}</strong> &middot; ${labels.msg}</span>
  <div style="display:flex;gap:8px;align-items:center">
    <a href="/privacy" style="color:#0b1f28cc;font-size:12px">${labels.settings}</a>
    <button onclick="document.cookie='preg_cookie=accepted;path=/;max-age=31536000;samesite=lax';this.parentElement.parentElement.remove()" style="background:#0b1f28;color:#fdf8ef;border:0;padding:8px 16px;border-radius:4px;cursor:pointer;font-weight:600">${labels.accept}</button>
  </div>
</div>`;
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const ua = request.headers.get("user-agent") || "";

  // 1. Bot pass-through (CRITICAL for SEO: don't redirect/modify content for crawlers)
  if (BOT_UA.test(ua)) return;

  // 2. Skip if already on a per-language path
  if (/^\/(es|pt|de)\//.test(url.pathname)) return;

  // 3. Detect lang + cookie regime
  const country = (context.geo?.country?.code || "").toUpperCase();
  const acceptLang = request.headers.get("accept-language") || "";
  const cookies = parseCookies(request.headers.get("cookie") || "");
  const detectedLang = detectLang(country, acceptLang);
  const cookieRegime = detectCookieRegime(country);

  // 4. Pass through if user already chose a language OR detected lang is EN (current page)
  const langCookie = cookies.preg_lang;
  const cookieAccepted = cookies.preg_cookie === "accepted";
  const showLangBanner = !langCookie && detectedLang !== "en" && LANG_BY_COUNTRY[country];
  const showCookieBanner = !cookieAccepted && cookieRegime !== "standard";

  if (!showLangBanner && !showCookieBanner) return;

  // 5. Mutate response: inject banners after <body>
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();
  let injection = "";
  if (showLangBanner) injection += renderLangBanner(detectedLang, url.pathname);
  if (showCookieBanner) injection += renderCookieBanner(cookieRegime, detectedLang);
  if (injection) {
    html = html.replace("<body>", `<body>${injection}`);
  }

  return new Response(html, {
    status: response.status,
    headers: { ...Object.fromEntries(response.headers), "content-type": "text/html; charset=utf-8" },
  });
};

export const config = {
  path: ["/", "/articles/*", "/projects/*"],
};
