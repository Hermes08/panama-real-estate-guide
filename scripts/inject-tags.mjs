#!/usr/bin/env node
// =============================================================================
// inject-tags.mjs — Build-time tag injection for panamarealestateguide.com
// =============================================================================
// Reads tracking IDs from environment variables (set as GitHub Secrets),
// injects the corresponding script tags into every HTML page in `project/`
// just before </head> and at the start of <body>.
//
// Idempotent — run multiple times, won't double-inject.
// Safe — if an env var is empty, that tag is skipped silently.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..', 'project');

// Marker comments that bracket the injected tags. Idempotent re-runs replace
// content between markers, never duplicating.
const HEAD_START = '<!-- BEGIN_TRACKING_HEAD -->';
const HEAD_END   = '<!-- END_TRACKING_HEAD -->';
const BODY_START = '<!-- BEGIN_TRACKING_BODY -->';
const BODY_END   = '<!-- END_TRACKING_BODY -->';

function buildHeadTags(env) {
  const parts = [HEAD_START];

  // Google Tag Manager (covers GA4 + Google Ads + TikTok via GTM)
  if (env.GTM_CONTAINER_ID) {
    parts.push(`<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${env.GTM_CONTAINER_ID}');</script>`);
  }

  // Meta Pixel (browser side; CAPI is server-side via Stape and lives outside this repo)
  if (env.META_PIXEL_ID) {
    parts.push(`<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${env.META_PIXEL_ID}');fbq('track','PageView');</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${env.META_PIXEL_ID}&ev=PageView&noscript=1"/></noscript>`);
  }

  // GA4 direct (in case GTM is not configured but GA4 is)
  if (env.GA4_MEASUREMENT_ID && !env.GTM_CONTAINER_ID) {
    parts.push(`<script async src="https://www.googletagmanager.com/gtag/js?id=${env.GA4_MEASUREMENT_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());gtag('config','${env.GA4_MEASUREMENT_ID}');</script>`);
  }

  // TikTok Pixel direct (in case GTM is not configured)
  if (env.TIKTOK_PIXEL_ID && !env.GTM_CONTAINER_ID) {
    parts.push(`<script>!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
ttq.load('${env.TIKTOK_PIXEL_ID}');ttq.page();}(window,document,'ttq');</script>`);
  }


  // Calendly inline embed widget (loads asynchronously)
  if (env.CALENDLY_BOOKING_URL) {
    parts.push(`<link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css">
<script async src="https://assets.calendly.com/assets/external/widget.js"></script>
<script>window.PREG_CALENDLY_URL=${JSON.stringify(env.CALENDLY_BOOKING_URL)};</script>`);
  }

  parts.push(HEAD_END);
  return parts.join('\n  ');
}

function buildBodyTags(env) {
  const parts = [BODY_START];
  if (env.GTM_CONTAINER_ID) {
    parts.push(`<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${env.GTM_CONTAINER_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`);
  }
  parts.push(BODY_END);
  return parts.join('\n  ');
}

function injectIntoHtml(html, headBlock, bodyBlock) {
  // Replace existing markers, otherwise insert before </head> and after <body>
  const headRe = new RegExp(`${HEAD_START}[\\s\\S]*?${HEAD_END}`);
  const bodyRe = new RegExp(`${BODY_START}[\\s\\S]*?${BODY_END}`);

  if (headRe.test(html)) {
    html = html.replace(headRe, headBlock);
  } else {
    html = html.replace(/<\/head>/i, `  ${headBlock}\n</head>`);
  }

  if (bodyRe.test(html)) {
    html = html.replace(bodyRe, bodyBlock);
  } else {
    html = html.replace(/<body([^>]*)>/i, `<body$1>\n  ${bodyBlock}`);
  }
  return html;
}

async function walkHtml(dir, list = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      // Skip large/non-content directories
      if (['screenshots', 'uploads', 'scraps', 'qa', 'assets'].includes(e.name)) continue;
      await walkHtml(p, list);
    } else if (e.name.endsWith('.html')) {
      list.push(p);
    }
  }
  return list;
}

async function main() {
  const env = process.env;
  const headBlock = buildHeadTags(env);
  const bodyBlock = buildBodyTags(env);

  // If both blocks would be empty (no env vars), we still write the markers so
  // future runs can replace them in place.
  const hasAnyTag =
    !!env.GTM_CONTAINER_ID ||
    !!env.META_PIXEL_ID ||
    !!env.GA4_MEASUREMENT_ID ||
    !!env.TIKTOK_PIXEL_ID ||
    !!env.CALENDLY_BOOKING_URL;

  const files = await walkHtml(PROJECT_DIR);
  let modified = 0;
  for (const f of files) {
    const original = await fs.readFile(f, 'utf8');
    const next = injectIntoHtml(original, headBlock, bodyBlock);
    if (next !== original) {
      await fs.writeFile(f, next, 'utf8');
      modified++;
    }
  }

  console.log(`inject-tags: ${modified}/${files.length} HTML files updated`);
  if (hasAnyTag) {
    const tagsActive = [
      env.GTM_CONTAINER_ID && `GTM(${env.GTM_CONTAINER_ID})`,
      env.META_PIXEL_ID && `MetaPixel(${env.META_PIXEL_ID})`,
      env.GA4_MEASUREMENT_ID && !env.GTM_CONTAINER_ID && `GA4(${env.GA4_MEASUREMENT_ID})`,
      env.TIKTOK_PIXEL_ID && !env.GTM_CONTAINER_ID && `TikTok(${env.TIKTOK_PIXEL_ID})`,
      env.CALENDLY_BOOKING_URL && `Calendly(${env.CALENDLY_BOOKING_URL.split('/').slice(-2).join('/')})`,
    ].filter(Boolean).join(', ');
    console.log(`inject-tags: active tags → ${tagsActive}`);
  } else {
    console.log('inject-tags: no tracking env vars set — markers inserted, no scripts.');
    console.log('  Add GTM_CONTAINER_ID / META_PIXEL_ID / GA4_MEASUREMENT_ID / TIKTOK_PIXEL_ID as GitHub Secrets to enable.');
  }
}

main().catch((err) => {
  console.error('inject-tags failed:', err);
  process.exit(1);
});
