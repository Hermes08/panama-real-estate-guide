# Netlify Functions

Two serverless endpoints that bridge the website to the DO Panama CRM and Meta CAPI.

## `lead-submit.mjs` → `POST /api/lead-submit`

Browser-side form submissions land here. The function:

1. Validates `full_name` (required) + JSON body shape
2. Builds a CRM payload (`origin="website"`, all UTMs packed into `detailed_notes`)
3. Fires the CRM `POST /api/v1/crm/clients` request in parallel with Meta CAPI `Lead` ($50)
4. Returns `{ success, event_id, crm, meta_capi }` to the browser

Browser fetches via:
```js
fetch('/api/lead-submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    full_name: 'Maria Lopez',
    email: 'maria@example.com',
    phone: '+507 6000 0000',
    interest_category: 'Compra',
    zone_project: 'Bocas del Toro',
    budget: '$200K-300K',
    estimated_travel_date: '2026-08',
    utm_source: window.preg.getUTM('utm_source'),
    utm_campaign: window.preg.getUTM('utm_campaign'),
    fbclid: window.preg.getUTM('fbclid'),
    gclid: window.preg.getUTM('gclid'),
    landing_url: window.location.href,
    referrer: document.referrer
  })
});
```

## `calendly-webhook.mjs` → `POST /api/calendly-webhook`

Receives Calendly server-side webhooks (`invitee.created`). The function:

1. Verifies HMAC-SHA256 signature against `CALENDLY_WEBHOOK_SIGNING_KEY`
2. Pushes the lead to the CRM with `tag="Hot Lead - Calendly"` + meeting time in `next_action_date`
3. Fires Meta CAPI `Schedule` event ($200, deduped with browser Pixel via shared `event_id`)

Subscribe via Calendly API:
```bash
curl -X POST https://api.calendly.com/webhook_subscriptions \
  -H "Authorization: Bearer $CALENDLY_PERSONAL_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://panamarealestateguide.com/api/calendly-webhook",
    "events": ["invitee.created", "invitee.canceled"],
    "user": "https://api.calendly.com/users/c09ad360-055d-484e-8bf8-b761b1aacfbc",
    "scope": "user",
    "signing_key": "<random-hex>"
  }'
```

## Required env vars / GitHub Secrets

| Name | Purpose | Used by |
|------|---------|---------|
| `CRM_API_URL` | CRM POST clients endpoint (`https://playful-pony-8e9158.netlify.app/api/v1/crm/clients`) | both |
| `CRM_API_KEY` | Matches `OPENCLAW_API_KEY` in CRM Netlify env | both |
| `META_PIXEL_ID` | Already configured | both |
| `META_CAPI_TOKEN` | Already configured | both |
| `CALENDLY_WEBHOOK_SIGNING_KEY` | Random hex string used for HMAC verify | calendly-webhook only |

Set these in Netlify UI → Site settings → Environment variables, OR the deploy
workflow can pass them through from GitHub Secrets if we wire that up.
