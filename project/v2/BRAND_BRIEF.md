# v2 Component Brand Brief — Panama Real Estate Guide

## Tech stack
- React 18 via global `React` and `ReactDOM` (no JSX compiler — Babel standalone is in the page)
- Components are plain functions: `function Foo() { return (<div>...</div>); }`
- Use inline styles + CSS variables (NO Tailwind, NO styled-components)
- Data accessed via `window.PANAMA_DATA` (see below)
- Animations use class `reveal in` plus optional delay class `d1`/`d2`/`d3`

## Brand tokens (CSS vars — already in styles.css, just reference them)
- `--cream: #FFF9EC` (page background)
- `--paper: #FFFDF5` (card background)
- `--coral: #FF6B4A` (primary CTA)
- `--coral-deep: #E14F2E` (CTA hover)
- `--ink: #0B2733` (primary text)
- `--ink-soft: #254957`
- `--ink-mute: #6E8A91`
- `--line: rgba(11, 39, 51, 0.12)`
- `--line-soft: rgba(11, 39, 51, 0.06)`
- `--palm: #1F5F4A` (forest accent)
- `--font-display: 'Fraunces', 'Cormorant Garamond', Georgia, serif` (use italic via `<em>` for high-emphasis words)
- `--font-mono: 'JetBrains Mono'` (for eyebrows, stats, numbers)
- `--gutter: clamp(20px, 4vw, 64px)`
- `--ease: cubic-bezier(0.22, 1, 0.36, 1)`

## Typography rules
- Eyebrows: monospace, 11px, letter-spacing 0.22em, uppercase, color ink-mute
- Display headlines: Fraunces 300-weight, very tight line-height (0.92-1.0), use `<em>` for italic emphasized words (often colored coral or palm)
- Body: Manrope, 16px, line-height 1.55

## Existing component patterns to MIRROR
- `<button>` for CTAs styled with classes `btn btn-coral` (filled) or `btn btn-ghost` (outline)
- Cards: white-ish bg, 1px line border, 18px radius, subtle shadow `0 30px 60px -24px rgba(11,39,51,0.25)`
- Tags: `tag tag-coral` (coral chip), `tag tag-sand` (warm chip)
- Section pattern: `<section><div className="container">...</div></section>`

## window.PANAMA_DATA shape
```js
{
  brand: { name, phone:'+507 6253-4802', whatsapp:'https://wa.me/50762534802', email },
  langs: [{code, name}, ...],
  stats: [{n,l}, ...],
  projects: [
    {
      id, name, location, region, // region = "Highlands"|"Panama City"|"" (may be empty)
      about, aboutES, priceFrom (number), fromLabel,
      status, // "Pre-construction"|"Move-in Ready"
      website, cover, images: [...],
      units: [{type, size, from, features}],
      amenities: [...]
    }
  ],
  regions: [
    {id, name, sub, count, blurb}, ...
    // ids: pacific, caribbean, azuero, highlands, city
  ],
  articles: [{id, category, title, excerpt, author, date, read, cover, featured}, ...]
}
```

## CRITICAL constraints
- DO NOT touch the existing `Book a 30-min consultation` form — it ties to a marketing integration. Components may LINK to `#book-consultation` anchor but must not modify the form.
- DO NOT change palette or fonts.
- WhatsApp number is `+507 6253-4802` (already in data.brand.whatsapp).
- Always add `*Precios inversor sujeto a disponibilidad` after specific dollar prices in marketing copy.
- DO NOT invent project names. Only use names from PANAMA_DATA.projects.
- Lifestyle taxonomy: City / Beach / Mountain (NOT Pacific/Caribbean/Atlantic — those are too geographic for international buyers).
  - City → Panama City projects (Bioma, Empire, Casco, Costa del Este)
  - Beach → Pacific (Playa Blanca, Coronado, Pedasí) + Caribbean (Bocas)
  - Mountain → Boquete, Volcán (Pino Alto)

## Output format for each component
- Single file under /sessions/exciting-vibrant-ride/mnt/outputs/v2_components/<ComponentName>.jsx
- Self-contained — assume PANAMA_DATA, React hooks (useState, useEffect, useRef), and Icon component already exist
- File should start with `/* ── ComponentName — short description ── */` then `function ComponentName() { ... }`
- No imports/exports — components attach to global scope via the babel-standalone runtime
- Include any new CSS as a `<style>` block inside the component, scoped via prefix (e.g. `.v2-quiz-step`)
