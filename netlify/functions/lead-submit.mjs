// =============================================================================
// netlify/functions/lead-submit.mjs
// =============================================================================
// Receives lead form submissions from panamarealestateguide.com, enriches with
// UTMs/server-side data, and proxies to:
//   1. The DO Panama CRM (POST /api/v1/crm/clients)
//   2. Meta Conversions API (Lead event, $50 value, server-side dedup)
//
// Public endpoint:  https://panamarealestateguide.com/.netlify/functions/lead-submit
// Method: POST
// Body (JSON): { full_name, email, phone, [interest_category, zone_project,
//                 budget, estimated_travel_date, detailed_notes,
//                 utm_source, utm_medium, utm_campaign, utm_content, utm_term,
//                 fbclid, gclid, landing_url, referrer, page_path] }
// =============================================================================

import crypto from 'node:crypto';

const CRM_API_URL = process.env.CRM_API_URL || '';
const CRM_API_KEY = process.env.CRM_API_KEY || '';
const META_PIXEL_ID = process.env.META_PIXEL_ID || '';
const META_CAPI_TOKEN = process.env.META_CAPI_TOKEN || '';

// Hash PII for Meta CAPI (lowercased, trimmed, then sha256)
function sha256(value) {
  if (!value) return undefined;
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

// Build the CRM payload — only fields the CRM accepts, rest stuffed into detailed_notes
function buildCrmPayload(body, ip, userAgent) {
  const utm = {
    source: body.utm_source || '',
    medium: body.utm_medium || '',
    campaign: body.utm_campaign || '',
    content: body.utm_content || '',
    term: body.utm_term || '',
    fbclid: body.fbclid || '',
    gclid: body.gclid || ''
  };

  // Pack the rich attribution + raw form fields into detailed_notes as JSON
  // so nothing is lost when the CRM only has a TEXT column.
  const enrichment = {
    email: body.email || '',
    phone: body.phone || '',
    whatsapp: body.whatsapp || '',
    landing_url: body.landing_url || '',
    referrer: body.referrer || '',
    page_path: body.page_path || '',
    user_agent: userAgent || '',
    ip: ip || '',
    submitted_at: new Date().toISOString(),
    ...utm
  };

  const detailedNotes = [
    body.detailed_notes ? `User notes: ${body.detailed_notes}` : '',
    body.interest_category ? `Interest: ${body.interest_category}` : '',
    body.zone_project ? `Zone: ${body.zone_project}` : '',
    body.budget ? `Budget: ${body.budget}` : '',
    body.estimated_travel_date ? `Travel date: ${body.estimated_travel_date}` : '',
    `--- Attribution ---`,
    JSON.stringify(enrichment, null, 0)
  ].filter(Boolean).join('\n');

  return {
    full_name: body.full_name,
    origin: body.origin || 'website',
    status: body.status || 'Prospecto',
    tag: body.tag || 'Web Lead',
    interest_category: body.interest_category || null,
    zone_project: body.zone_project || null,
    budget: body.budget || null,
    estimated_travel_date: body.estimated_travel_date || null,
    detailed_notes: detailedNotes,
    last_contact_date: new Date().toISOString().slice(0, 10)
  };
}

// Fire Meta CAPI Lead event (server-side, with deduplication via event_id)
async function sendMetaCapi(body, ip, userAgent, eventId) {
  if (!META_PIXEL_ID || !META_CAPI_TOKEN) return { skipped: 'capi_not_configured' };
  const url = `https://graph.facebook.com/v18.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`;
  const userData = {
    em: body.email ? [sha256(body.email)] : undefined,
    ph: body.phone ? [sha256(body.phone.replace(/\D/g, ''))] : undefined,
    fn: body.full_name ? [sha256(body.full_name.split(' ')[0])] : undefined,
    ln: body.full_name ? [sha256(body.full_name.split(' ').slice(1).join(' '))] : undefined,
    fbc: body.fbclid ? `fb.1.${Date.now()}.${body.fbclid}` : undefined,
    fbp: body.fbp || undefined,
    client_ip_address: ip,
    client_user_agent: userAgent
  };
  Object.keys(userData).forEach(k => userData[k] === undefined && delete userData[k]);

  const payload = {
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: body.landing_url || body.page_path || 'https://panamarealestateguide.com/',
      user_data: userData,
      custom_data: {
        currency: 'USD',
        value: 50,
        content_category: body.interest_category || 'real_estate',
        content_name: body.zone_project || 'website_lead'
      }
    }]
  };

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return { ok: r.ok, status: r.status, body: await r.text() };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

const CORS = {
  'Access-Control-Allow-Origin': 'https://panamarealestateguide.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

export default async (req, context) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'method_not_allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...CORS }
    });
  }

  let body;
  try { body = await req.json(); }
  catch (_) {
    return new Response(JSON.stringify({ success: false, error: 'invalid_json' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...CORS }
    });
  }

  if (!body || !body.full_name) {
    return new Response(JSON.stringify({ success: false, error: 'full_name_required' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...CORS }
    });
  }

  if (!CRM_API_URL || !CRM_API_KEY) {
    return new Response(JSON.stringify({ success: false, error: 'crm_not_configured' }), {
      status: 503, headers: { 'Content-Type': 'application/json', ...CORS }
    });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  const userAgent = req.headers.get('user-agent') || '';
  const eventId = crypto.randomUUID();

  // Fire CRM and CAPI in parallel
  const crmPayload = buildCrmPayload(body, ip, userAgent);
  const [crmRes, capiRes] = await Promise.allSettled([
    fetch(CRM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': CRM_API_KEY },
      body: JSON.stringify(crmPayload)
    }).then(r => r.json().then(j => ({ status: r.status, body: j }))),
    sendMetaCapi(body, ip, userAgent, eventId)
  ]);

  const crmOk = crmRes.status === 'fulfilled' && crmRes.value?.body?.success === true;
  const result = {
    success: crmOk,
    event_id: eventId,
    crm: crmRes.status === 'fulfilled' ? crmRes.value : { error: String(crmRes.reason) },
    meta_capi: capiRes.status === 'fulfilled' ? capiRes.value : { error: String(capiRes.reason) }
  };

  return new Response(JSON.stringify(result), {
    status: crmOk ? 200 : 502,
    headers: { 'Content-Type': 'application/json', ...CORS }
  });
};

export const config = { path: '/api/lead-submit' };
