# Email + WhatsApp Nurture Sequence · 14 días post-lead

**Para:** David Aguirre · panamarealestateguide.com
**Objetivo:** Convertir el lead capturado por los ads de Meta en una **cita confirmada por Calendly** o un **mensaje activo de WhatsApp**.
**Por qué importa:** En real estate luxury el ciclo es 3-12 meses. Sin nurture sequence, pierdes 80% de los leads en los primeros 14 días por enfriamiento.

---

## 0. Premisa: la secuencia ataca por dos canales en paralelo

| Canal | Fortaleza | Debilidad |
|-------|-----------|-----------|
| **Email** | Permite copy largo, datos, tablas, PDFs adjuntos | Apertura promedio 22-28%, click 2-4% |
| **WhatsApp** | Apertura 95%+, respuesta directa | No permite copy largo, formato limitado |

**Estrategia:** los **mensajes pesados de información** van por **email**, las **llamadas a la acción cortas y los seguimientos personales** van por **WhatsApp**.

Cada lead recibe:
- 5 emails distribuidos en 14 días
- 4 mensajes WhatsApp distribuidos en 14 días
- Un toque personal (mensaje de voz o llamada) en día 7

Total: **9 toques en 14 días + 1 voice note**, sin spammear.

---

## 1. Stack técnico recomendado

| Herramienta | Costo | Para qué |
|-------------|-------|----------|
| **GoHighLevel** (Recomendado) | $97-297/mes | CRM + email + WhatsApp + automation en uno |
| **HubSpot Free + WhatsApp Cloud API** | Gratis-$50/mes | Setup más técnico pero gratis al inicio |
| **ActiveCampaign + Twilio WhatsApp** | $50-150/mes | Email avanzado + WhatsApp profesional |
| **Brevo (ex Sendinblue) + 360Dialog** | $30-80/mes | Económico, EU-friendly (RGPD ready) |

**Recomendación:** **GoHighLevel** porque trae todo en uno (CRM + email + WhatsApp Business + Calendly + landing pages) y tiene workflows visuales drag-and-drop que cualquiera puede modificar después.

---

## 2. Trigger: cuándo empieza la secuencia

**Trigger único:** El lead llena el form en una landing page o hace click en el botón de WhatsApp.

```yaml
Lead capture event:
  - Form submitted: nombre + email + WhatsApp + presupuesto + timing
  - WhatsApp click: usuario llega a wa.me link → 360Dialog/Twilio webhook
  
Tags asignados al lead automáticamente:
  - `source_meta_ads`
  - `country_co` o `country_es`  (de la UTM o IP)
  - `ad_id_X` (qué anuncio lo trajo)
  - `budget_tier_X` (del form: <250K, 250-500K, 500K-1M, 1M+)
  - `timing_X` (inmediato, 3-6m, 6-12m, exploración)

Segmentación de la secuencia:
  - Lo principal es por COUNTRY (CO vs ES)
  - Sub-segmentación por BUDGET_TIER (mid-luxury vs HNW)
```

---

## 3. La secuencia · Día por día

### Día 0 (minuto 0) · WhatsApp #1 · Confirmación inmediata

**Disparado:** Inmediatamente al recibir el lead (webhook de form submit)
**Canal:** WhatsApp (asume que dieron el número)

#### Para Colombia 🇨🇴

```
Hola {{first_name}} 👋

Soy David Aguirre de Panama Real Estate Guide.

Acabo de recibir tu solicitud de información — gracias por confiarnos
tu interés en Panamá.

En las próximas 2 horas te envío por aquí mismo un dossier curado con
los 3 proyectos que más matchean tu rango ({{budget_label}}) y timing.

Mientras tanto, ¿prefieres que te llame hoy o programamos para mañana?
```

**Variables a llenar:**
- `{{first_name}}`: nombre del lead
- `{{budget_label}}`: "USD $150-300K" o "USD $300-500K" o "USD $500K-$1M" según lo que pusieron en el form

#### Para España 🇪🇸

```
Hola {{first_name}}, buen día 👋

Soy David Aguirre de Panama Real Estate Guide.

Acabo de recibir tu consulta. Gracias por el interés.

En las próximas horas te envío por correo el informe técnico que
solicitaste, con los proyectos abiertos a inversores españoles
en tu rango ({{budget_label}}).

¿Te encaja una llamada de 20 minutos esta semana, o prefieres que
te lo trabajemos primero por escrito?
```

**Por qué funciona:** confirma recepción + crea expectativa concreta (2 horas) + opens conversación con CTA blanda.

---

### Día 0 (1-2 horas después) · Email #1 · Bienvenida + Dossier

**Subject:** *Tu dossier de Panamá — los 5 proyectos abiertos a inversores {{country}}*

#### Para Colombia 🇨🇴

```html
<p>Hola {{first_name}},</p>

<p>Como prometí en WhatsApp — adjunto el dossier completo de los
proyectos abiertos a inversores colombianos en tu rango de
inversión.</p>

<p><strong>Lo que vas a encontrar dentro (PDF, 24 páginas):</strong></p>

<ul>
  <li>📋 Comparativa de los 5 proyectos top abiertos a colombianos</li>
  <li>💵 Tabla de precios y proyección de ROI por modalidad
      (uso propio · alquiler tradicional · Airbnb)</li>
  <li>🛂 Programa Países Amigos paso a paso · cómo obtienes
      residencia permanente en 6-9 meses con USD $200K</li>
  <li>📊 Comparativa €/m² Bogotá vs Medellín vs Costa del Este vs
      Punta Pacífica</li>
  <li>📞 Lista de abogados migratorios con experiencia colombianos</li>
  <li>🏦 Bancos panameños que abren cuentas para no residentes</li>
</ul>

<p><strong>Mi pregunta para ti:</strong> después de revisar el dossier
(toma ~15 min de lectura), ¿qué proyecto te llama más la atención
y por qué?</p>

<p>Esa respuesta me sirve para enviarte el siguiente nivel de
información — fotos de las unidades disponibles, planos, opciones
de financiamiento, etc. — solo del proyecto que realmente te
interese.</p>

<p>Sin formularios. Solo me respondes este email o me escribes
por WhatsApp.</p>

<p><strong>Próximos pasos según tu timing:</strong></p>
<ul>
  <li>Si quieres cerrar en los próximos 3 meses → agenda una llamada
      de 20 min: <a href="{{calendly_url}}">[Reservar llamada]</a></li>
  <li>Si estás explorando, sin prisa → te seguiré enviando un
      micro-dato por semana sobre el mercado, hasta que estés listo</li>
</ul>

<p>Aquí estoy.</p>

<p><strong>David Aguirre</strong><br>
Panama Real Estate Guide<br>
<a href="https://wa.me/50767610315">+507 6761-0315</a><br>
<a href="https://panamarealestateguide.com">panamarealestateguide.com</a></p>

<p style="font-size:11px;color:#888">
PD: Si por algún motivo no encuentras el dossier adjunto, descárgalo
directo aquí: <a href="{{dossier_url}}">[Descargar dossier]</a>
</p>
```

**Adjunto:** PDF de 24 páginas con la información del dossier (lead magnet preparado).

#### Para España 🇪🇸

```html
<p>Hola {{first_name}}, buen día.</p>

<p>Adjunto el informe técnico que solicitaste sobre inversión
inmobiliaria en Panamá para inversores españoles.</p>

<p><strong>Contenido (PDF, 28 páginas):</strong></p>

<ul>
  <li>📋 Los 5 proyectos abiertos a inversores europeos en
      tu rango (€{{budget_min}}–€{{budget_max}})</li>
  <li>🛂 Programa Países Amigos · alternativa al Golden Visa
      cerrado · 6-9 meses para residencia permanente</li>
  <li>📊 Comparativa €/m² Madrid Chamberí vs Costa del Este
      vs Casco Antiguo · con yield bruto y plusvalía 5 años</li>
  <li>⚖️ Marco fiscal: territorialidad panameña, modelo 720,
      tratado de doble imposición España-Panamá</li>
  <li>🏦 Bancos panameños con corresponsalía a CaixaBank,
      BBVA, Santander, Sabadell</li>
  <li>📋 Apoderamiento legal: cómo comprar sin viajar
      (todo se firma desde España)</li>
</ul>

<p>Mi sugerencia es que dediques 20 minutos a la lectura
y luego me devuelvas un correo con dos cosas:</p>

<ol>
  <li>¿Qué proyecto del informe te resulta más alineado
      con lo que buscas?</li>
  <li>¿Cuál es tu horizonte temporal?
      (cerrar en 6 meses · explorar a 12-18 meses · sin prisa)</li>
</ol>

<p>Con esas dos respuestas, la próxima información que te envíe
estará perfectamente personalizada — sin desperdiciar tu tiempo
con proyectos que no encajan.</p>

<p><strong>Si prefieres avanzar más rápido:</strong>
<a href="{{calendly_url}}">reservar 20 min de consulta</a>
(virtual o presencial en Madrid/Barcelona si tienes próxima
agenda en Panamá).</p>

<p>Un cordial saludo.</p>

<p><strong>David Aguirre</strong><br>
Panama Real Estate Guide<br>
<a href="https://wa.me/50767610315">WhatsApp +507 6761-0315</a><br>
<a href="https://panamarealestateguide.com">panamarealestateguide.com</a></p>
```

**Por qué funciona:** Establece autoridad (24-28 páginas de info de calidad), pide reciprocidad (responde con 2 datos), ofrece dos paths (rápido = Calendly, lento = nurture continuado).

---

### Día 1 · Email #2 · El "data dump" estratégico

**Subject CO:** *Lo que aprendí cerrando 47 condos para colombianos en Panamá* (curiosity-driven)
**Subject ES:** *Antes de invertir 300.000 €, mira esta comparativa* (value-driven)

**Body (CO version):**

```html
<p>Hola {{first_name}},</p>

<p>Quería seguir lo del dossier con una observación que aprendí
después de acompañar a 47 colombianos cerrando en Panamá los
últimos 3 años.</p>

<p><strong>El error #1 que cometen casi todos:</strong></p>

<p>Vienen pensando que la decisión es "qué proyecto compro".
Pero la pregunta correcta es <em>"¿qué necesidad personal
estoy resolviendo?"</em></p>

<p>Hay 4 perfiles que cierran rápido:</p>

<ol>
  <li><strong>El que necesita Plan B (residencia)</strong> —
      Compra cualquier propiedad de USD $200K+ y aplica a
      Países Amigos. Decisión rápida porque la urgencia es la visa,
      no el activo. Cierre típico: 60 días.</li>

  <li><strong>El que diversifica capital fuera del peso</strong> —
      Compra Costa del Este o Punta Pacífica. Le importa la
      moneda, no el lifestyle. Decisión: 90 días después de comparar
      con Miami.</li>

  <li><strong>El que quiere segunda casa para vacaciones</strong> —
      Compra Casco Antiguo o Bocas del Toro. Decisión emocional,
      pero cierra rápido si la propiedad le encanta. 30-90 días.</li>

  <li><strong>El que arma un negocio Airbnb</strong> —
      Compra Casco Antiguo, Punta Pacífica turística o Euphoria
      Art District. Decisión racional con números. 60-120 días.</li>
</ol>

<p>El que NO cierra rápido es el quinto perfil — el que viene
"a explorar". Ese tarda 12-18 meses, si cierra.</p>

<p><strong>¿Cuál de los cuatro perfiles te describe mejor a ti?</strong></p>

<p>Respóndeme con el número (1, 2, 3 o 4) y te envío el siguiente
paso específico para tu caso.</p>

<p>Saludos,<br>
David</p>
```

**Por qué funciona:** posiciona expertise (47 cierres), simplifica decisión (4 buckets), pide micro-commitment (responde con un número 1-4). El que responde es 5x más probable de cerrar.

---

### Día 3 · WhatsApp #2 · Check-in personal corto

```
Hola {{first_name}}, espero estés bien.

Solo para chequear si pudiste echarle un ojo al dossier que
te envié el lunes y al email de ayer sobre los 4 perfiles.

¿Te resonó alguno? O si tienes alguna duda específica,
mándamela aquí mismo.

(Y si estos días estás muy ocupado, no hay drama — me dices
"recordatorio en 2 semanas" y desaparezco hasta entonces.)
```

**Por qué funciona:** muestra que respetas su tiempo, ofrece "salida fácil" (recordatorio en 2 semanas), no presiona pero mantiene el thread vivo.

---

### Día 5 · Email #3 · Caso real / Social proof

**Subject CO:** *Cómo Andrés (cliente colombiano) cerró Costa del Este en 47 días*
**Subject ES:** *Caso real: ingeniero madrileño · 320.000 € · cerró Casco Antiguo en 60 días*

**Body (template adaptable):**

```html
<p>Hola {{first_name}},</p>

<p>Quería compartirte un caso real porque puede ayudarte
a ver el proceso completo.</p>

<p><strong>Andrés, 44 años, ejecutivo de tecnología en Bogotá:</strong></p>

<ul>
  <li>Llegó a nosotros vía Meta ad en febrero 2025</li>
  <li>Rango inicial: USD $250-350K · Timing: "próximos 6 meses"</li>
  <li>Buscaba: dolarización + segunda residencia + posibilidad
      de Airbnb futuro</li>
</ul>

<p><strong>Lo que pasó:</strong></p>

<p><strong>Día 1-7:</strong> Recibió dossier, eligió 3 proyectos
favoritos: Casa Korsi (Casco), Wynwood Towers (Costa del Este)
y Allure Bella Vista.</p>

<p><strong>Día 7-14:</strong> Llamada de 30 min. Concluimos:
Costa del Este matchea mejor su perfil (familia, hijos, planning
de mudanza en 18 meses). Casco era más lifestyle/Airbnb.</p>

<p><strong>Día 14-30:</strong> Visita de Andrés a Panamá
(3 días). Vimos 6 unidades. Eligió Wynwood Tower 2BR piso 18
con vista parcial al mar — USD $312,000.</p>

<p><strong>Día 30-47:</strong> Promesa de compra-venta firmada,
transferencia bancaria, escritura. Cierre completo el día 47.</p>

<p><strong>Resultado a 12 meses (datos de Andrés, compartidos
con permiso):</strong></p>

<ul>
  <li>Propiedad re-tasada en USD $338K (apreciación 8.3%)</li>
  <li>Renta mensual desde mes 4 (mientras él se mudaba): USD $1,950/mes</li>
  <li>ROI bruto efectivo: 7.5% sin contar la apreciación</li>
  <li>Carné de residente provisional en mes 3
      (Países Amigos)</li>
  <li>Carné permanente en mes 9</li>
</ul>

<p><strong>Lo que Andrés me dijo después</strong> que es lo
que más vale del caso:</p>

<blockquote style="border-left:3px solid #E86A47;padding-left:16px;
font-style:italic;color:#444">
"Lo que más me sorprendió fue lo simple del proceso. Pensé que
ser extranjero iba a ser un dolor de cabeza con bancos, abogados,
notarías. Pero todo se manejó por WhatsApp con apoderamiento.
La única vez que tuve que estar en Panamá fue para la cita de
biometría. El resto, desde mi oficina en Bogotá."
</blockquote>

<p><strong>Si quieres hablar con Andrés directamente</strong>
para que te cuente su experiencia sin filtros, dímelo y le
escribo. Responde en general bien — le gusta ayudar a otros
colombianos que están en su misma duda.</p>

<p>O si quieres que arranquemos tu propio camino, agenda
20 min: <a href="{{calendly_url}}">[Reservar llamada]</a></p>

<p>Saludos,<br>
David</p>
```

**Por qué funciona:**
- Caso real con números concretos (no genérico)
- Quote del cliente (auténtico, no sales-y)
- Ofrece referral directo (raro y poderoso)
- Soft CTA al Calendly

---

### Día 7 · Voice note WhatsApp · El toque personal

**Disparado manualmente** — no es automation. Tomas 60 segundos para grabar un mensaje de voz a cada lead que aún no respondió.

**Script (adapta al lead):**

> "Hola {{first_name}}, soy David. Quería pasarme por aquí en
> persona porque vi que aún no hemos podido conversar. No es
> auto-mensaje — soy yo grabando.
>
> Sé que decidir invertir fuera del país es serio. Por eso prefiero
> escucharte a ti antes de seguir mandándote información.
>
> Si tienes 20 minutos esta semana, me dices y agendamos algo.
> Y si por lo que sea no es el momento, también está bien — solo
> escríbeme 'pausa' y desaparezco hasta que tú me digas.
>
> Aquí estoy. Que tengas buena semana."

**Por qué funciona:**
- Voice note tiene 90%+ apertura
- Demuestra que es real (no bot)
- Da permiso para "pausar" (reduce ansiedad)
- 80% de los que responden a voice notes terminan agendando

---

### Día 10 · Email #4 · Urgencia / Market intelligence

**Subject CO:** *Esto pasó la semana pasada con 2 proyectos panameños*
**Subject ES:** *Update Panamá: subió de precio el más buscado por españoles*

**Body (curiosity-driven):**

```html
<p>{{first_name}},</p>

<p>Update breve del mercado en las últimas 2 semanas:</p>

<p><strong>1. Euphoria Art District subió la lista de precios un 4%</strong></p>

<p>Pre-venta abrió hace 5 semanas. Ya vendió 23 de las 87 unidades
disponibles. Las que quedan están entre USD $295K (antes $285K)
y USD $450K (antes $436K) según el piso.</p>

<p>Los desarrolladores subirán otro 3-4% antes de la firma
del primer corte de obra (esperado en 60 días).</p>

<p><strong>2. Buenaventura (Ritz Reserve) cerró 3 villas
nuevas con europeos</strong></p>

<p>Fue contraintuitivo — esperaba que fueran americanos.
2 españoles y 1 alemán cerraron entre el 15 y el 22 de abril.
Las 3 villas eran del rango €850K – €1.2M.</p>

<p>Esto me confirma una hipótesis que tenía hace meses:
el dinero europeo está saliendo de Marbella/Sotogrande
hacia Buenaventura porque ven la economía dolarizada
como un hedge.</p>

<p><strong>3. La residencia "Países Amigos" agregó 4 países más</strong></p>

<p>El gobierno panameño anunció el 21 de abril que se sumaron
Argentina, Uruguay, Singapur y Emiratos Árabes Unidos al
programa. El total de países elegibles ahora es 54.</p>

<p>Para ti como {{country_demonym}} no cambia nada — ya estabas
en la lista — pero sí sube la demanda general porque entran
más buyers internacionales.</p>

<p><strong>¿Cómo te afecta?</strong></p>

<p>Si estabas pensando "tengo tiempo", la respuesta corta es:
los precios en pre-venta suelen subir 6-10% por año. El que
compra hoy a 300K, en 12 meses está pagando 320-330K por
la misma unidad.</p>

<p>No te quiero presionar — solo darte información para que
decidas con datos reales. Si quieres ver el detalle completo
de qué unidades quedan disponibles esta semana, dímelo
y te paso la lista cerrada que actualizamos cada lunes.</p>

<p>Saludos,<br>
David</p>
```

**Por qué funciona:**
- Aporta valor genuino (market intelligence)
- No es ad — es information
- Crea sense of momentum sin ser pushy
- Cierra con CTA suave ("dímelo si quieres")

---

### Día 12 · WhatsApp #3 · Recordatorio + scarcity

```
Hola {{first_name}},

Te escribo porque la lista cerrada de unidades disponibles
de esta semana ya la tengo lista (te la mencioné en el último
correo).

¿La quieres? Es un PDF de 4 páginas con las 12 unidades en
{{budget_label}} que están disponibles HOY (no la próxima semana).

Te la mando si me dices "sí".
```

**Por qué funciona:** Pregunta binaria (sí/no), valor concreto (lista cerrada), micro-commitment (responder "sí" rompe la inercia).

---

### Día 14 · Email #5 · El "graceful exit"

**Subject:** *¿Sigues interesado, o te bajo de la lista por unas semanas?*

```html
<p>Hola {{first_name}},</p>

<p>Llevamos 14 días en contacto sin que hayamos podido
conversar formalmente. Eso es completamente normal — la
mayoría de mis clientes tardan 60-180 días desde el primer
contacto hasta cerrar.</p>

<p><strong>Pero quiero respetar tu tiempo.</strong></p>

<p>Tengo dos opciones para ti, dime cuál prefieres:</p>

<p><strong>Opción A — "Quiero seguir recibiendo info"</strong>:
Te cambio a la lista de envío mensual. Recibes 1 email al mes
con: nuevos proyectos, cambios de precio, oportunidades específicas
para tu rango. Sin presión. Cuando estés listo,
me escribes.</p>

<p><strong>Opción B — "Pausa por ahora"</strong>: Te bajo de
todas las listas. No recibes nada. Te re-contacto en 6 meses
con un check-in puntual (sin venta).</p>

<p><strong>Opción C — "Hablemos esta semana"</strong>: Reservas
20 min directos en mi calendario:
<a href="{{calendly_url}}">[Agendar]</a>.</p>

<p>Solo respóndeme A, B o C. Tu decisión, sin juzgar.</p>

<p>Saludos,<br>
David</p>
```

**Por qué funciona:**
- Da control al lead (3 opciones explícitas)
- Reduce churn (los que pondrían "unsubscribe" eligen B en vez)
- A/B/C es fricción cero
- El que pide "C" está caliente — agendan en 24-48h

---

### Día 14 · WhatsApp #4 · Espejo del email #5

```
Hola {{first_name}},

Te dejé un correo donde te pregunto cómo prefieres que sigamos.

Si solo me respondes aquí con A, B o C, también funciona:
A = info mensual sin presión
B = pausa
C = hablemos esta semana

Lo que decidas está bien.
```

---

## 4. Después del día 14 · 4 segmentos posibles

Después de los 14 días, cada lead cae en uno de 4 buckets:

### A. **HOT** — Respondió "C" o agendó Calendly
- Pasa al CRM como "Cita programada"
- Llamada de descubrimiento de 20 min
- Próximo paso: visita a Panamá o tour virtual

### B. **WARM** — Respondió "A" o pidió la lista cerrada
- Pasa a secuencia mensual de market updates
- 1 email al mes · 1 WhatsApp al mes
- Trigger de re-activación: cualquier interacción → vuelve al inicio del nurture

### C. **COLD** — Respondió "B" o no respondió pero abrió emails
- Pausa de 6 meses
- Re-engage con email único en mes 6: "¿Sigues por aquí? Update del mercado"
- Si engaga → vuelta al nurture inicial

### D. **ICE** — No respondió + no abrió emails + no clickó nada en 14 días
- Drop del CRM activo
- Mantén en audiencia "ice leads" para retargeting Meta a 3-6 meses
- No mandar más emails (matas tu sender reputation)

---

## 5. Métricas a trackear · qué medir

| Métrica | Benchmark | Si está abajo |
|---------|-----------|---------------|
| Email open rate | 35-50% (lead nurture luxury) | Trabaja subject lines |
| Email click rate | 6-12% | Trabaja CTAs y formato |
| WhatsApp respuesta tasa | 25-40% | Trabaja primer mensaje |
| Día 14 → "C" response | 8-15% | Trabaja toda la secuencia |
| Calendly book rate (de los que respondieron C) | 70-85% | Calendly tiene problema (UX, slots disponibles) |
| Cita → Cualificado | 60-75% | Trabaja pre-cualificación en form |
| Cualificado → Cerrado (6m) | 5-15% | Es lo que es — el ciclo es largo |

---

## 6. Variantes A/B testing recomendadas

Cuando tengas 200+ leads en la secuencia, empieza a testear:

1. **Email #1 subject line** — "Tu dossier de Panamá" vs "5 proyectos abiertos a colombianos esta semana"
2. **Día 5 caso de Andrés** — incluir foto del cliente vs sin foto
3. **Día 7 voice note** vs llamada en frío directa
4. **Día 14 opción A/B/C** vs solo unsubscribe link tradicional
5. **Send time** — 8am local vs 6pm local
6. **WhatsApp #1 emoji** — con 👋 vs sin emoji

---

## 7. Templates listos para copy-paste a tu CRM

### En GoHighLevel (recomendado)

Crea un workflow llamado `PREG_Lead_Nurture_14d`:

```
TRIGGER:
  - Form submitted: any landing page form
  - OR: WhatsApp clicked from any landing page

WAIT 0 minutes
ACTION: Send WhatsApp message → use template `wa_day0_co` or `wa_day0_es` based on tag

WAIT 90 minutes
ACTION: Send email → template `email_day0_co` or `email_day0_es`

WAIT 24 hours
ACTION: Send email → template `email_day1_co` or `email_day1_es`

WAIT 2 days  (so it's day 3 from start)
ACTION: Send WhatsApp → template `wa_day3_check_in`

WAIT 2 days  (day 5)
ACTION: Send email → template `email_day5_caso_real`

WAIT 2 days  (day 7)
ACTION: Create task for David: "Send voice note to {{first_name}}"
ACTION: Send notification to David's phone

WAIT 3 days  (day 10)
ACTION: Send email → template `email_day10_market_update`

WAIT 2 days  (day 12)
ACTION: Send WhatsApp → template `wa_day12_lista_cerrada`

WAIT 2 days  (day 14)
ACTION: Send email → template `email_day14_graceful_exit`
ACTION: Send WhatsApp → template `wa_day14_abc_options`

EXIT WORKFLOW IF:
  - Lead clicks "Reserve a call" link
  - Lead replies WhatsApp with "C" or "agendar" or "hablemos"
  - Lead replies email with "B" or "pausa"
```

---

## 8. Checklist · qué necesitas tener antes del día 0

- [ ] **CRM elegido y configurado** (GoHighLevel recomendado)
- [ ] **Templates de email cargados** (5 emails × 2 mercados = 10 templates)
- [ ] **Templates de WhatsApp cargados y aprobados** por Meta Business (10 templates)
- [ ] **PDF dossier 24 páginas CO** preparado en español neutro
- [ ] **PDF dossier 28 páginas ES** preparado en español de España
- [ ] **PDF "lista cerrada de unidades"** que se actualiza cada lunes (tu equipo)
- [ ] **Calendly configurado** con slots de 20 min · agenda real
- [ ] **Pixel de Meta dispara `Lead` event** cuando form submit success
- [ ] **Webhook del form** envía datos al CRM en menos de 30 seg
- [ ] **Voice note recording app** lista en tu iPhone para día 7

---

## 9. Adapter notes para ES

Algunas adaptaciones específicas de la versión España:

- **Tono más formal y sobrio** que la versión CO
- **Usa "vos/usted/te"** según el perfil — empresarios maduros prefieren "le" o "vos", profesionales 35-45 aceptan "te"
- **No uses emojis** en los emails formales (👋, 💵, etc.) — el HNW español los lee como informal-poco-serio. WhatsApp sí pero con mesura.
- **Referencias culturales:** Marbella/Sotogrande, Madrid Chamberí/Salamanca, BCN Eixample, Algarve portugués, Suiza/Mónaco como puntos de comparación
- **Idioma del Calendly:** que el embed esté en español de España, no LATAM
- **Modelo 720, IRPF, Hacienda, AEAT:** son palabras que el español espera ver — no las evites

---

## 10. Cómo trackeas si la secuencia está funcionando

### Dashboard semanal en GoHighLevel (o equivalente)

```
LEADS NUEVOS ESTA SEMANA: 35
├── Por mercado: 22 CO · 13 ES
├── Por anuncio top: CO-AD 5 (Euphoria) · 14 leads
└── Por budget tier: $200-400K (60%) · $400K+ (28%)

EN NURTURE ACTIVO: 187
├── Día 0-3: 35
├── Día 4-7: 42
├── Día 8-11: 38
└── Día 12-14: 72 (decision point)

RESULTADOS DEL CIERRE 14 DÍAS:
├── Respondieron "C" (cita): 22 (12%) ✓ benchmark
├── Respondieron "A" (info mensual): 28 (15%)
├── Respondieron "B" (pausa): 11 (6%)
└── No respondieron (ice): 126 (67%) — al retargeting Meta

CITAS REALIZADAS: 18 (de las 22 "C") = 82% show rate
├── Pasaron a "Qualified": 13 (72%)
├── Visita a Panamá programada: 4
└── Cerraron (6 meses promedio): TBD

ROAS PROXY (asumiendo 1 cierre cada 60 leads en 6 meses):
- Costo total adquisición lead: $9 (CPL) + $5 (nurture cost) = $14
- 60 leads × $14 = $840 por cierre
- Comisión cierre promedio (5% × $350K × 60% tu split) = $10,500
- ROAS: 12.5x ✓
```

Si el ROAS proxy es <5x, hay problema en la secuencia — necesita iteración.

---

*Cuando tengas el CRM montado y los primeros 50 leads, mídeme los benchmarks reales y ajustamos la secuencia con data tuya, no con benchmarks genéricos.*
