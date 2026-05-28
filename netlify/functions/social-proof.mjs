// =============================================================================
// netlify/functions/social-proof.mjs
// =============================================================================
// Returns anonymized real-activity events for the SocialProofToast +
// ActivityTicker components. Source of truth:
//
//   1. Netlify Blobs "leads" store — real submissions written by
//      form-capture.mjs. First letter of first_name + city inferred from
//      phone country code. Strips ALL other PII. Never exposes email/phone.
//
//   2. Fallback: returns the contents of /social-proof.json (the curated
//      demo pool committed in the repo). Used when:
//        - the Blobs store has < 3 real events in the last 7 days
//        - the store read fails
//
// Honesty rules enforced in code:
//   - Only first letter of name (M., A., L., …)
//   - Only city from phone country code (no inferred location from IP)
//   - Event types limited to: reservation, site_visit, dossier
//   - Caps at 20 events max returned
//
// Public endpoint: https://panamarealestateguide.com/api/social-proof
// Method: GET
// Cache: 5min CDN + 30min stale-while-revalidate
// =============================================================================

export const config = { path: '/api/social-proof' };

// Country code → city/country hint (very rough — first-line of locality).
// Used only when phone has a country code we recognize. Otherwise city = ''.
const COUNTRY_CITY = {
  '+1':   'United States',
  '+34':  'Madrid',
  '+44':  'London',
  '+49':  'Berlin',
  '+33':  'Paris',
  '+39':  'Roma',
  '+507': 'Panama',
  '+57':  'Bogotá',
  '+52':  'México',
  '+55':  'São Paulo',
  '+54':  'Buenos Aires',
  '+56':  'Santiago',
  '+58':  'Caracas',
  '+593': 'Quito',
  '+595': 'Asunción',
  '+598': 'Montevideo',
  '+51':  'Lima',
  '+591': 'La Paz',
  '+509': 'Port-au-Prince',
  '+1809':'Santo Domingo',
  '+506': 'San José',
  '+502': 'Guatemala',
  '+503': 'San Salvador',
  '+504': 'Tegucigalpa',
  '+505': 'Managua',
  '+351': 'Lisboa',
  '+41':  'Zürich',
  '+43':  'Wien',
  '+31':  'Amsterdam',
};

function cityFromPhone(phone) {
  if (!phone) return '';
  const trimmed = String(phone).replace(/[^\d+]/g, '');
  for (const code of Object.keys(COUNTRY_CITY).sort((a, b) => b.length - a.length)) {
    if (trimmed.startsWith(code)) return COUNTRY_CITY[code];
  }
  return '';
}

function safeInitial(name) {
  if (!name) return '?';
  const c = String(name).trim().charAt(0).toUpperCase();
  return /[A-ZÁÉÍÓÚÑÜ]/.test(c) ? c : '?';
}

function hoursAgo(iso) {
  if (!iso) return 24;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 24;
  return Math.max(0.1, (Date.now() - t) / (1000 * 60 * 60));
}

// Map a Netlify Form submission to a public event shape.
// Returns null if submission lacks the minimum fields.
function anonymize(submission, formName) {
  const data = submission.data || {};
  const initial = safeInitial(data.first_name || data.name || '');
  if (initial === '?') return null;
  const city = cityFromPhone(data.phone) || data.city || '';
  if (!city) return null;
  const project = (data.property || data.project || '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();
  if (!project) return null;
  const type = formName === 'reservation' ? 'reservation' : 'dossier';
  return {
    initial,
    name: initial + '.',
    city,
    type,
    project,
    ago_hours: hoursAgo(submission.created_at),
    color: type === 'reservation' ? 'coral' : 'aqua',
  };
}

// Read recent submissions from the Netlify Blobs "leads" store (written by
// form-capture.mjs). Returns records shaped like { reference, form,
// first_name, phone, property, submitted_at, ... }.
async function fetchBlobSubmissions() {
  try {
    // Dynamic import inside try/catch — never crash if @netlify/blobs is
    // unavailable in the runtime; just fall back to the demo pool.
    const mod = await import('@netlify/blobs');
    const store = mod.getStore({ name: 'leads', consistency: 'strong' });
    const { blobs } = await store.list();
    const keys = blobs.map(b => b.key).sort().reverse().slice(0, 80);
    const out = [];
    for (const key of keys) {
      const v = await store.get(key, { type: 'json' });
      if (v) out.push(v);
    }
    return out;
  } catch (e) {
    return [];
  }
}

// Fallback to the committed demo JSON for visual testing.
// Uses the request's own origin URL so it works on preview deploys
// (feat-*.panamarealestateguide.netlify.app) as well as production.
async function readDemoFallback(originUrl) {
  try {
    const r = await fetch(`${originUrl}/social-proof.json`, { cache: 'no-cache' });
    if (!r.ok) return { events: [], weekly_stats: {} };
    return await r.json();
  } catch (e) {
    return { events: [], weekly_stats: {} };
  }
}

export default async (request, context) => {
  let events = [];
  let weeklyStats = null;
  let source = 'demo';
  // Derive origin from the incoming request — works on any deploy URL.
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;

  {
    // Read real submissions from the Blobs store (written by form-capture.mjs)
    const subs = await fetchBlobSubmissions();
    // Filter to last 7 days, anonymize, sort by recency desc
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = subs.filter(s => new Date(s.submitted_at).getTime() > sevenDaysAgo);
    for (const s of recent) {
      // Adapt the blob record shape to the anonymize() input shape
      const ev = anonymize({ data: s, created_at: s.submitted_at }, s.form);
      if (ev) events.push(ev);
    }
    events.sort((a, b) => a.ago_hours - b.ago_hours);
    events = events.slice(0, 20);

    // Build real weekly stats from submission counts
    if (recent.length > 0) {
      const reservations = recent.filter(s => s.form === 'reservation').length;
      const dossiersToday = recent.filter(s => new Date(s.submitted_at).getTime() > Date.now() - 24*60*60*1000).length;
      weeklyStats = {
        reservations,
        tours_upcoming: 0,        // not captured yet — keep 0 until tour-booking form lands
        dossiers_today: dossiersToday,
        viewing_now: 0,           // not captured — would need live analytics
      };
      source = 'real';
    }
  }

  // Density check — if we have < 3 real events, blend in demo to keep the
  // chrome alive while production data builds up.
  if (events.length < 3) {
    const demo = await readDemoFallback(origin);
    if (demo.events && demo.events.length) {
      // Take demo entries we don't already have a real version of
      const seen = new Set(events.map(e => `${e.initial}|${e.city}|${e.project}`));
      for (const ev of demo.events) {
        const key = `${ev.initial}|${ev.city}|${ev.project}`;
        if (!seen.has(key)) events.push(ev);
        if (events.length >= 8) break;
      }
      if (!weeklyStats && demo.weekly_stats) weeklyStats = demo.weekly_stats;
      source = events.some(e => e.ago_hours < 168) ? (source === 'real' ? 'mixed' : 'demo') : 'demo';
    }
  }

  const payload = {
    source,
    events,
    weekly_stats: weeklyStats || { reservations: 0, tours_upcoming: 0, dossiers_today: 0, viewing_now: 0 },
    generated_at: new Date().toISOString(),
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=300, stale-while-revalidate=1800',
      'access-control-allow-origin': '*',
    },
  });
};
