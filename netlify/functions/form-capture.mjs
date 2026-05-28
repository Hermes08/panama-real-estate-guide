// =============================================================================
// netlify/functions/form-capture.mjs
// =============================================================================
// Receives lead-capture + reservation submissions from the React modals and
// persists them in Netlify Blobs. Replaces the (broken) Netlify Forms path —
// Netlify Forms detection never runs on this site because it deploys pre-built
// files via the GitHub Actions / Netlify CLI pipeline (no native Netlify build
// step), so the <form data-netlify> tags were never registered and POSTs to
// "/" returned 404.
//
// Netlify Blobs works on ANY deploy method (CLI included) with zero config —
// the store is provisioned automatically per site.
//
// Endpoints (both on /api/form-capture):
//   POST  → store one submission. Body JSON: { _form, ...fields }
//           _form ∈ { "reservation", "lead-capture" }
//           Returns { ok: true, reference }
//   GET    → list recent submissions (PII). Requires ?token=<LEADS_ACCESS_TOKEN>
//           env var to match. Without the env var or a wrong token → 403.
//           Use this to pull leads into a CRM / sheet / inbox.
//
// The social-proof Function reads the SAME store to surface anonymized
// recent activity (first letter + city only) on the public toast/ticker.
// =============================================================================

// Netlify Blobs is loaded via DYNAMIC import inside a try/catch so a missing
// module (this site has no node_modules / package.json and functions run on
// built-ins only) can never crash the whole lambda at module-load time.
// If Blobs is unavailable, persistence is skipped gracefully and the lead is
// still forwarded to the CRM + the user still sees a success screen.
async function loadStore(name) {
  try {
    const mod = await import('@netlify/blobs');
    return mod.getStore({ name, consistency: 'strong' });
  } catch (e) {
    return null;
  }
}

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, GET, OPTIONS',
  'access-control-allow-headers': 'Content-Type',
};

const LEADS_ACCESS_TOKEN = process.env.LEADS_ACCESS_TOKEN || '';

function genRef() {
  const yr = new Date().getFullYear();
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 6; i++) rand += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `PRG-${yr}-${rand}`;
}

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: CORS });
  }

  const store = await loadStore('leads');

  // ── GET: list submissions (auth-gated) ────────────────────────────────
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const token = url.searchParams.get('token') || '';
    if (!LEADS_ACCESS_TOKEN || token !== LEADS_ACCESS_TOKEN) {
      return new Response(JSON.stringify({ error: 'forbidden' }), {
        status: 403, headers: { 'content-type': 'application/json', ...CORS },
      });
    }
    if (!store) {
      return new Response(JSON.stringify({ error: 'store_unavailable', count: 0, items: [] }), {
        status: 200, headers: { 'content-type': 'application/json', ...CORS },
      });
    }
    const form = url.searchParams.get('form'); // optional filter
    const { blobs } = await store.list();
    const keys = blobs
      .map(b => b.key)
      .filter(k => !form || k.startsWith(form + '/'))
      .sort()
      .reverse()
      .slice(0, 200);
    const items = [];
    for (const key of keys) {
      const v = await store.get(key, { type: 'json' });
      if (v) items.push(v);
    }
    return new Response(JSON.stringify({ count: items.length, items }), {
      status: 200, headers: { 'content-type': 'application/json', ...CORS },
    });
  }

  // ── POST: store one submission ─────────────────────────────────────────
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405, headers: { 'content-type': 'application/json', ...CORS },
    });
  }

  let body = {};
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = Object.fromEntries(new URLSearchParams(text));
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: 'bad_body' }), {
      status: 400, headers: { 'content-type': 'application/json', ...CORS },
    });
  }

  // Honeypot — bots fill this, humans don't. Silently accept + drop.
  if (body['bot-field']) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { 'content-type': 'application/json', ...CORS },
    });
  }

  const form = body._form === 'reservation' ? 'reservation'
             : body._form === 'lead-capture' ? 'lead-capture'
             : 'lead-capture';

  // Basic validation — need at least an email or phone to be useful.
  if (!body.email && !body.phone) {
    return new Response(JSON.stringify({ error: 'missing_contact' }), {
      status: 400, headers: { 'content-type': 'application/json', ...CORS },
    });
  }

  const reference = body.reference || genRef();
  const now = new Date().toISOString();
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';

  const record = {
    reference,
    form,
    first_name: body.first_name || '',
    last_name: body.last_name || '',
    email: body.email || '',
    phone: body.phone || '',
    funding: body.funding || '',
    budget: body.budget || '',
    timeline: body.timeline || '',
    property: body.property || '',
    marketing_optin: body.marketing_optin || '',
    visited_pages: body.visited_pages || '',
    language: body.language || 'en',
    current_page: body.current_page || '',
    referer: body.referer || '',
    submitted_at: now,
    ip,
  };

  // Persist to Blobs when available. If the store couldn't load (no runtime
  // support), we DON'T fail — the lead is still forwarded to the CRM below
  // and the user still gets a success screen.
  let persisted = false;
  if (store) {
    // Key sorts chronologically: <form>/<iso>-<ref>
    const key = `${form}/${now}-${reference}`;
    try {
      await store.setJSON(key, record);
      persisted = true;
    } catch (e) { /* fall through to CRM forward */ }
  }

  // PRIMARY durable path — forward to the existing /api/lead-submit Function,
  // which creates a client in the DO Panama CRM + fires Meta CAPI. This is the
  // store of record (verified working on every deploy). We AWAIT it so the
  // success we report to the user reflects a real persisted lead.
  let crm = 'skipped';
  try {
    const notesParts = [`Ref ${reference}`, `type=${form}`];
    if (record.funding)  notesParts.push(`funding=${record.funding}`);
    if (record.timeline) notesParts.push(`timeline=${record.timeline}`);
    if (record.marketing_optin) notesParts.push(`optin=${record.marketing_optin}`);
    if (record.visited_pages) notesParts.push(`pages=${record.visited_pages.replace(/\n/g, ', ')}`);
    const r = await fetch(`${new URL(request.url).origin}/api/lead-submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: `${record.first_name} ${record.last_name}`.trim() || record.email,
        email: record.email,
        phone: record.phone,
        interest_category: form === 'reservation' ? 'Reservation' : 'Lead capture',
        zone_project: record.property,
        budget: record.budget,
        detailed_notes: notesParts.join(' · '),
        landing_url: record.current_page,
        referrer: record.referer,
      }),
    });
    crm = r.ok ? 'ok' : `http_${r.status}`;
  } catch (e) {
    crm = 'error';
  }

  // The lead is captured if EITHER store accepted it.
  const ok = persisted || crm === 'ok';

  return new Response(JSON.stringify({ ok, reference, persisted, crm }), {
    status: ok ? 200 : 502, headers: { 'content-type': 'application/json', ...CORS },
  });
};

export const config = { path: '/api/form-capture' };
