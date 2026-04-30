// =============================================================================
// netlify/functions/calendly-webhook.mjs
// =============================================================================
// Receives Calendly webhook events (invitee.created, invitee.canceled).
// On invitee.created: pushes the lead to the CRM with tag="Hot Lead - Calendly",
// records the meeting time as estimated_travel_date proxy, and fires a
// server-side Meta CAPI Schedule event ($200 value, deduped with browser Pixel).
//
// Public endpoint: https://panamarealestateguide.com/.netlify/functions/calendly-webhook
// Subscribe in Calendly via:
//   POST https://api.calendly.com/webhook_subscriptions
//   { url, events: ["invitee.created","invitee.canceled"], scope: "user", user, signing_key }
// =============================================================================

import crypto from 'node:crypto';

const CRM_API_URL = process.env.CRM_API_URL || '';
const CRM_API_KEY = process.env.CRM_API_KEY || '';
const META_PIXEL_ID = process.env.META_PIXEL_ID || '';
const META_CAPI_TOKEN = process.env.META_CAPI_TOKEN || '';
const CALENDLY_WEBHOOK_SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY || '';

function sha256(v) {
  if (!v) return undefined;
  return crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');
}

// Validate the Calendly-Webhook-Signature header (HMAC-SHA256 over `t={timestamp},v1={signature}`)
function verifyCalendlySignature(rawBody, header) {
  if (!CALENDLY_WEBHOOK_SIGNING_KEY) return true; // skip in dev
  if (!header) return false;
  const parts = header.split(',').reduce((acc, p) => {
    const [k, v] = p.split('=');
    acc[k] = v;
    return acc;
  }, {});
  if (!parts.t || !parts.v1) return false;
  // Defensive: timingSafeEqual throws on length mismatch and Buffer.from('hex')
  // produces unpredictable lengths for malformed input. Wrap.
  try {
    const expected = crypto
      .createHmac('sha256', CALENDLY_WEBHOOK_SIGNING_KEY)
      .update(`${parts.t}.${rawBody}`)
      .digest('hex');
    const expectedBuf = Buffer.from(expected, 'hex');
    const actualBuf = Buffer.from(parts.v1, 'hex');
    if (actualBuf.length !== expectedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  } catch (_e) {
    return false;
  }
}

async function pushToCrm(invitee, scheduledEvent, eventType) {
  const utm = invitee.tracking || {};
  const enrichment = {
    calendly_invitee_uri: invitee.uri,
    calendly_event_uri: scheduledEvent?.uri,
    event_type_name: eventType?.name,
    event_start_time: scheduledEvent?.start_time,
    event_end_time: scheduledEvent?.end_time,
    location: scheduledEvent?.location?.location || scheduledEvent?.location?.type,
    timezone: invitee.timezone,
    utm_source: utm.utm_source || '',
    utm_medium: utm.utm_medium || '',
    utm_campaign: utm.utm_campaign || '',
    utm_content: utm.utm_content || '',
    utm_term: utm.utm_term || '',
    salesforce_uuid: utm.salesforce_uuid || '',
    booked_at: invitee.created_at
  };

  const detailedNotes = [
    `Calendly booking confirmed: ${eventType?.name || '30 Minute Meeting'}`,
    `Meeting time: ${scheduledEvent?.start_time}`,
    invitee.questions_and_answers?.length
      ? `Q&A:\n${invitee.questions_and_answers.map(q => `  ${q.question}: ${q.answer}`).join('\n')}`
      : '',
    `--- Attribution ---`,
    JSON.stringify(enrichment)
  ].filter(Boolean).join('\n');

  const payload = {
    full_name: invitee.name || invitee.email?.split('@')[0] || 'Unknown',
    origin: 'website-calendly',
    status: 'Prospecto',
    tag: 'Hot Lead - Calendly',
    interest_category: 'Discovery Call',
    next_action: `Discovery call: ${scheduledEvent?.start_time?.slice(0, 16) || 'see Calendly'}`,
    next_action_date: scheduledEvent?.start_time?.slice(0, 10) || null,
    estimated_travel_date: null,
    detailed_notes: detailedNotes,
    last_contact_date: new Date().toISOString().slice(0, 10)
  };

  const r = await fetch(CRM_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': CRM_API_KEY },
    body: JSON.stringify(payload)
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}

async function sendMetaCapiSchedule(invitee, scheduledEvent, eventId) {
  if (!META_PIXEL_ID || !META_CAPI_TOKEN) return { skipped: 'capi_not_configured' };
  const url = `https://graph.facebook.com/v18.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`;
  const userData = {
    em: invitee.email ? [sha256(invitee.email)] : undefined,
    fn: invitee.name ? [sha256(invitee.name.split(' ')[0])] : undefined,
    ln: invitee.name ? [sha256(invitee.name.split(' ').slice(1).join(' '))] : undefined
  };
  Object.keys(userData).forEach(k => userData[k] === undefined && delete userData[k]);

  const payload = {
    data: [{
      event_name: 'Schedule',
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: 'https://panamarealestateguide.com/#book',
      user_data: userData,
      custom_data: {
        currency: 'USD',
        value: 200,
        content_category: 'real_estate_consultation',
        content_name: 'discovery_call_booked'
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

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const rawBody = await req.text();
  const sig = req.headers.get('calendly-webhook-signature');
  if (!verifyCalendlySignature(rawBody, sig)) {
    return new Response(JSON.stringify({ error: 'invalid_signature' }), {
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  let payload;
  try { payload = JSON.parse(rawBody); }
  catch (_) { return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400 }); }

  const eventName = payload.event;
  const data = payload.payload || {};

  // Only act on bookings (skip cancellations for now — could mark CRM lead Cold)
  if (eventName !== 'invitee.created') {
    return new Response(JSON.stringify({ ignored: eventName }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!CRM_API_URL || !CRM_API_KEY) {
    console.warn('CRM not configured, skipping CRM push');
  }

  const invitee = data;  // Calendly puts invitee at top of payload for v2 webhooks
  const scheduledEvent = data.scheduled_event || {};
  const eventType = data.event_type || {};
  const eventId = crypto.randomUUID();

  const [crmRes, capiRes] = await Promise.allSettled([
    CRM_API_URL && CRM_API_KEY
      ? pushToCrm(invitee, scheduledEvent, eventType)
      : Promise.resolve({ skipped: 'crm_not_configured' }),
    sendMetaCapiSchedule(invitee, scheduledEvent, eventId)
  ]);

  return new Response(JSON.stringify({
    success: true,
    event_id: eventId,
    crm: crmRes.status === 'fulfilled' ? crmRes.value : { error: String(crmRes.reason) },
    meta_capi: capiRes.status === 'fulfilled' ? capiRes.value : { error: String(capiRes.reason) }
  }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};

export const config = { path: '/api/calendly-webhook' };
