# Templates / Plantillas

Plantillas reutilizables para generar nuevas páginas del sitio sin copiar-pegar.
Cada `.template.html` está pensado para ser expandido por un script en `scripts/`.

---

## `proyecto-landing.template.html` — Landing en español para un proyecto

Página single-file (sin React) que vive en `/proyectos/<slug>.html`. Hereda los
estilos y trackers globales del sitio, embebe Calendly, y dispara eventos de
Meta Pixel + un POST a `/api/lead-submit` cuando alguien llena el formulario.

### Cuándo usarla

- Cuando vas a lanzar campañas pagas (Meta / Google) hacia un proyecto puntual
  y quieres una landing limpia, rápida y bien instrumentada.
- Cuando un proyecto necesita una página "permanente" en español que viva fuera
  del flujo de `/projects/` (inglés, generado desde `data.js` + Airtable).
- Cuando quieres una página con FAQ + dossier + Calendly + form de leads
  en un solo HTML que pesa <30 KB.

### Cómo crear una nueva

```bash
node scripts/scaffold-proyecto.mjs <slug> [--name "Display Name"] [--location "Punta Pacifica"]
```

Ejemplos:

```bash
# Mínimo — toma el slug y deriva todo lo demás
node scripts/scaffold-proyecto.mjs ocean-reef-residences

# Con overrides
node scripts/scaffold-proyecto.mjs casa-azuero-pedasi \
  --name "Casa Azuero" \
  --location "Pedasí · Azuero" \
  --hero-image "/airtable-assets/casa-azuero/00.jpg"
```

Lo que hace:

1. Si ya existe `project/proyectos/<slug>.html` → aborta (usa `--force` para sobreescribir).
2. Lee `templates/proyecto-landing.template.html`.
3. Sustituye `{{SLUG}}`, `{{NAME}}`, `{{LOCATION}}`, `{{HERO_IMAGE}}` (auto o desde flags).
4. Rellena el resto de `{{TOKENS}}` con defaults seguros — los párrafos editoriales
   quedan como `"PARA LLENAR — descripción del proyecto en 80-120 palabras"`.
5. Escribe `project/proyectos/<slug>.html`.
6. Imprime la lista de tokens que aún están sin resolver (si los hay).

### Checklist editorial — qué llenar antes de hacer push

| Bloque | Token(s) | Qué poner |
|---|---|---|
| Title + meta | `{{HOOK_TITLE}}` `{{HOOK_DESCRIPTION}}` | Frase con tipología + ubicación + precio + 1 diferenciador. Bajo 60 chars para title; 150 chars para description. |
| Schema | `{{PRICE_LOW}}` `{{PRICE_HIGH}}` | Precios sin signo ni comas (ej. `385000`). Si solo hay un precio, repítelo en ambos. |
| Hero image | `{{HERO_IMAGE}}` | Path absoluto a un asset que ya esté en Netlify (usualmente `/airtable-assets/<slug>/00.jpg`). |
| Hero copy | `{{HERO_TITLE_PART1}}` `{{HERO_TITLE_PART2}}` `{{HERO_SUBHEAD}}` | Title rompe el nombre en dos partes para italizar la segunda. Subhead es la promesa en 1 línea (15-20 palabras). |
| Contexto | `{{CONTEXT_LEAD}}` `{{CONTEXT_PARAGRAPH_1..3}}` | 3 párrafos. Primero = tipología + ubicación + precio + 1 diferenciador. Segundo = amenidades + ratio parking. Tercero = calendario obra + yield + perfil comprador. ~80-120 palabras por párrafo. |
| 4 razones | `{{REASON_X_TITLE/BODY}}` | Por qué este proyecto pasó el filtro. Cada razón = 1 titular + 1 párrafo de 30-50 palabras. |
| Unidades | `{{UNIT_X_TITLE/BODY}}` | 3 tipologías con metraje + precio + disponibilidad. |
| FAQ | `{{FAQ_X_Q/A}}` | 3 preguntas. Default sugiere: fideicomiso, calendario de pagos, plusvalía + exit. Cada respuesta 80-150 palabras (importante para el FAQPage schema). |
| Interest cat | `{{INTEREST_CATEGORY}}` | Etiqueta interna para el CRM. Ej: `"Compra inversión Airbnb"`, `"Compra retiro"`, `"Compra primera residencia"`. |

### Después de llenar el HTML

```bash
node scripts/build-jsx.mjs        # solo si tocaste el footer Featured-projects list
node scripts/build-sitemap.mjs    # añade la nueva URL al sitemap.xml
```

Y si quieres exponer el proyecto en el footer del sitio (la fila "Featured
projects"), agrega su `{ slug, name, from }` al array en
`project/sections.jsx` (línea ~798, dentro de `Footer()`).

### Lo que NO necesitas hacer

- ❌ Agregarlo a `data.js` — esta plantilla es independiente, no consume `PANAMA_DATA`.
- ❌ Compilar JSX — es HTML puro, no pasa por `build-jsx.mjs`.
- ❌ Inyectar GTM / Pixel — los marcadores `BEGIN_TRACKING_HEAD` y
  `BEGIN_TRACKING_BODY` los rellena `inject-tags.mjs` automáticamente al hacer deploy.

### Diferencia vs `/projects/<slug>.html`

| | `/projects/` (inglés, React) | `/proyectos/` (español, esta plantilla) |
|---|---|---|
| Lenguaje | en | es |
| Origen de datos | `data.js` + Airtable | HTML puro, copy directo |
| Renderizado | React (Hydration) | Server-side / estático puro |
| Pixel + GA | Sí (via inject-tags) | Sí (via inject-tags) |
| Form de leads | No (CTA externo) | Sí — POST a `/api/lead-submit` |
| Calendly embed | Botón externo | Embed inline 720px |
| Uso típico | Catálogo + SEO orgánico | Landing para pauta paga + FB Ads / Google Ads |

---

## Próximas plantillas (placeholder)

Si en el futuro agregamos otras plantillas single-file (newsletter signup,
referral program, etc.), van en este mismo directorio con un script
acompañante en `scripts/scaffold-<algo>.mjs` y un entry en este README.
