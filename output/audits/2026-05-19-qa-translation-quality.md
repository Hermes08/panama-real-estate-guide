# Translation quality audit — 6 pilot translations (ES / PT / DE × 2 articles)

**Audited**: 2026-05-19
**Auditor**: Claude (automated QA pass)
**Source EN drafts**:
- `output/production/2026-05-19-internet-providers-panama-expats.md`
- `output/production/2026-05-19-panama-retirement-communities.md`

**Preview bundle**:
`https://feat-multilingual-i18n-may-202--panamarealestateguide.netlify.app`

**Note on glossary**: the file `state/i18n-glossary.json` referenced in the brief does not exist in the repo. The audit therefore enforces glossary compliance against the brand-canonical terms documented in `context/brand-guidelines.md` and `context/tone-of-voice.md` (Visa Pensionado, buyer's agency, developer-direct, USD $XXX prefix, place-name accents, banned competitors, ban on em dashes).

---

## Scorecard (1-5, higher is better)

| Translation | Naturalness | Brand voice | Glossary | Numbers/facts | Brand-guidelines | Avg |
|---|---:|---:|---:|---:|---:|---:|
| **ES — internet-providers** | 5 | 5 | 5 | 5 | 5 | **5.0** |
| **ES — retirement-communities** | 3 | 4 | 4 | 5 | 4 | **4.0** |
| **PT — internet-providers** | 5 | 5 | 5 | 5 | 5 | **5.0** |
| **PT — retirement-communities** | 5 | 5 | 5 | 5 | 5 | **5.0** |
| **DE — internet-providers** | 5 | 5 | 5 | 5 | 5 | **5.0** |
| **DE — retirement-communities** | 5 | 5 | 4 | 5 | 3 | **4.4** |

**Per-language averages**
- **ES**: 4.5
- **PT**: 5.0
- **DE**: 4.7
- **Cohort average**: 4.7 / 5

---

## ES — internet-providers-panama-expats

**Verdict**: **Ship as-is**. Best-in-class Castilian Spanish, fully naturalised.

### Strengths
- Opener is rewritten, not back-translated: "Si vas a mover USD $300k o más a través de fronteras…" feels written, not converted.
- Idiomatic choices: "el camino de menor resistencia", "los proveedores de fibra (urbano y suburbano)", "una diferencia que define la categoría" — all native register.
- ES number format applied correctly throughout: `B/.12,49/mes`, `B/.49,22`, `99,9%`.
- Anglicism load is calibrated for a tech-literate Castilian reader: keeps "streaming", "hotspot", "router", "kit", "stack operativo" — these are how the target audience actually talks.
- Place names retain accents: "Ciudad de Panamá", "Punta Pacífica", "Pedasí", "Coclé".
- Brand canonical terms preserved: **"agencia del comprador"** in disclosure, **"+Móvil"**, **"Tigo"**, **"Cable Onda"**, **"FULL TIGO TODO INCLUIDO"** untranslated proper-name treatment.
- Attorney-consult line present and well-formed: *"consulte a un abogado tributario o contador público autorizado panameño para su situación específica"*.
- Zero em dashes. Currency `USD $` prefix maintained on first mention and throughout.
- 7% / `B/.` / `USD $200` / `USD $45` / `USD $70` / `USD $300k` / `400+ Mbps` / `99,9%` — all numerals 1:1 with source.

### Minor issues (do not block ship)
- Voice register switches: opener uses informal "vas a mover", "tu zona" (tú-form), then the attorney section uses formal "consulte" / "su situación específica". Acceptable Castilian editorial convention, but a perfectionist editor would unify to one register. Recommend leaving as-is — formal voice in the legal-disclosure section is a deliberate signal.
- "Mejores barrios de Ciudad de Panamá para expatriados" link still points to `/articles/` (no `/es/` prefix). Cosmetic, not a translation defect — flag to the i18n routing owner separately.

---

## ES — retirement-communities

**Verdict**: **Ship with caveats** (or schedule a copy pass before promoting).

### Structural concern
The body is delivered as a **JSON array** of strings/`{"h":...}`/`{"table":...}` objects, rather than a single markdown string the way ES-internet, PT, and DE-internet were delivered. This is a **format divergence within the same locale**, which the renderer will need to handle consistently. Confirm with the i18n pipeline owner that both shapes are supported in production.

### Strengths
- Numbers correctly localised to ES format: `$250.000`, `$1.200.000+`, `USD $10M+`, `USD $1,000/mes` (the source uses `USD $1,000` with the comma — preserved verbatim, which is correct treatment for a US-pension reference even in ES copy).
- All seven zones intact, all hospital references intact, Punta Pacifica / Johns Hopkins / Riba Smith / Tocumen all preserved.
- **Visa Pensionado** correctly capitalised throughout (glossary-canonical).
- Disclosure line preserved: *"opera como agencia del comprador. Solo representamos al comprador en cualquier transacción inmobiliaria…"*
- Attorney-consult lines present in three places (tax, immigration, title due diligence) — strong compliance.
- "Registro Público" preserved as proper noun.
- Zero em dashes.

### Issues found (quote → reason)
1. **Opener grammar slip**: *"Se puede jubilarse en Panamá con USD $1,500…"* — pleonastic "se" + "jubilarse". Correct Castilian is either *"Uno puede jubilarse"* or *"Puede jubilarse"* (drop the "se"). Reads as a slightly mechanical translation in the very first sentence.
2. **Anglicism overload**: the article keeps `turnkey`, `trade`, `friendly al inglés`, `deal-breaker`, `stockean`, `DIY`, `playbook`, `cross-segmento`, `hub`, `setup` — all in the same article. ES-internet calibrated its anglicisms much more carefully. Castilian editorial register would translate at least:
   - "friendly al inglés" → "amigable al inglés" or "anglófono"
   - "deal-breaker" → "criterio excluyente"
   - "stockean" → "tienen en surtido" / "manejan"
   - "DIY" → "hacerlo por su cuenta"
   - "playbook" → "manual"
3. **Lexical inconsistency Castilian vs Latam**: uses *"manejar"* (LATAM) for "drive" rather than *"conducir"* (Castilian). The tone-of-voice spec says **Castilian Spanish for ES**. The current text reads as neutral-LATAM, not Castilian. Either correct to Castilian (conducir, coger el coche, móvil instead of celular, etc.) or update the spec to "LATAM Spanish" — but pick one.
4. **"corte estilo de vida alternativo"** in the Bocas row of the table — awkward. "Corte" here is being used like the English "set/cohort", which doesn't carry in Spanish. Recommend *"perfil de estilo de vida alternativo"*.
5. **"relocalizan desde Estados Unidos"** — "relocalizar" exists but is uncommon; native ES would say *"se mudan desde"* or *"se trasladan desde"*.
6. **"recortados al hueso"** ("not stripped down") — calque. Native: *"al mínimo"* or *"recortados al máximo"*.
7. Currency formatting on one line uses the **US comma**: *"USD $1,500"*. Source uses commas; ES-internet uses ES periods (`B/.49,22`). This article keeps commas for USD figures and periods for column values (`$250.000`). The mixed approach is defensible because USD is a US currency, but should be consistent: pick one rule and apply.

### Recommendation
A 20-minute pass by a native Castilian copyeditor would lift this from 4.0 to 5.0. Ship-blocking only if Castilian purity matters for this article's audience; otherwise ship as-is with a copyedit pass scheduled.

---

## PT — internet-providers-panama-expats

**Verdict**: **Ship as-is**. Clean Brazilian Portuguese, fully naturalised.

### Strengths
- BR-PT register throughout: "está movendo", "papelada de residência", "videochamadas", "horários de pico" — native, not translated.
- Numbers in PT format: `USD $300.000`, `B/.12,49/mês`, `B/.49,22`, `99,9%`. Periods for thousands, commas for decimals — correct.
- Anglicism handling is calibrated: keeps `streaming`, `hotspot`, `download`/`upload`, `kit`, `bundle` (translated to "pacotes"), `Zoom`. Adds glosses where useful: *"nobreak (UPS)"* — clever, since "nobreak" is the BR vernacular and "UPS" is the international term. Both audiences served.
- Disclosure line preserved: *"opera como uma agência do comprador"*.
- Attorney-consult line **strengthened** beyond the source: adds *"E para qualquer questão jurídica sobre seu fechamento de imóvel, consulte um advogado panamenho licenciado"* — an editorial enhancement, fully in spec.
- Place names accented correctly: "Cidade do Panamá", "Pedasí", "Bocas del Toro" (kept original Spanish for the place name).
- Zero em dashes. Currency `USD $` prefix maintained.
- "Aposentado norte-americano" rather than "estadounidense" — correct BR-PT choice (BR media uses "norte-americano" routinely).

### Minor issues
- *"plano de manchete"* for "headline number" — comprehensible but slightly stiff. *"número de destaque"* would be more natural.
- *"a desafiante"* for "the challenger" is feminine to agree with implied "empresa"; some readers might prefer "o concorrente". Stylistic preference, not a defect.

---

## PT — retirement-communities

**Verdict**: **Ship as-is**. Strongest single piece in the cohort — goes beyond translation into editorial localisation.

### Strengths (this is what we want at scale)
- **Audience pivot executed correctly**: title and framing reoriented to "investidor brasileiro" rather than US retiree. This is on-brand because the BR-PT reader IS a Brazilian investor, and a translated US-retiree article would feel off-target. Examples:
  - Opener reframes: *"aposentadoria em dólar, com custo mensal entre USD $1.500 e USD $3.500 e renda denominada na mesma moeda que protege o patrimônio da volatilidade do real e da inflação acumulada"* — that is brand voice executed in BR-PT.
  - Adds *"Para referência ao investidor brasileiro: o teto da faixa confortável na Cidade do Panamá (USD $6.000/mês) equivale, em dólar, a algo próximo de R$ 30 mil/mês, mas em moeda que não se deteriora frente ao seu patrimônio."* — analyst-style cross-currency framing the EN draft did not need but the BR draft does.
  - Adds *"Importante para brasileiros: a aposentadoria do INSS é aceita, assim como aposentadoria de previdência privada se documentada como vitalícia; aposentadoria por fundos PGBL/VGBL no formato de saque programado normalmente não qualifica"* — substantive new content that a BR reader needs and a translator with only the EN draft would not invent. This implies the translator was briefed.
  - Adds Campos do Jordão climate analogy for Boquete — exactly the kind of cultural bridging that lifts a translation into a localisation.
- **Glossary perfect**: Visa Pensionado capitalised, agência do comprador, panamarealestateguide.com casing preserved.
- **Numbers preserved verbatim** with BR-PT formatting: `$250.000`, `USD $1.500`, `USD $10 milhões` (also written out — strong BR convention).
- Attorney-consult lines: present in **three places**, including the BR-specific addition *"além de um contador brasileiro especializado em residentes no exterior"* — that's risk-aware editorial work.
- Zero em dashes. Currency `USD $` prefix consistent. No banned competitor names.
- Place names accented: "Cidade do Panamá", "Pedasí", "Coclé".

### Notes (not issues)
- Internal links use `/pt/articles/...` prefix correctly — actually better than the ES versions which left raw paths.
- Body is delivered as a JSON array (same structural choice as ES retirement), but title/meta are split into `articleMeta` rather than colocated. Confirm with the renderer that this split shape is the intended pattern.

---

## DE — internet-providers-panama-expats

**Verdict**: **Ship as-is**. Idiomatic German, technically precise.

### Strengths
- German technical register: **"Mbit/s"** rather than "Mbps" (correct German unit notation), **"Glasfaser"** for fiber, **"FTTH"** kept as international acronym with gloss, **"USV"** for UPS — all correct.
- German number format: `USD $300.000`, `B/.12,49`, `99,9 %` (with space before `%`, as per German typographic convention).
- German quotation marks `„..."` used in *"in ausgewiesenen Versorgungsgebieten"* — proper typography.
- Disclosure preserved: *"agiert als Käuferagentur. Wir vertreten ausschließlich den Käufer…"* — clean coinage for "buyer's agency".
- Attorney-consult line present and expanded: *"konsultieren Sie einen zugelassenen panamaischen Steueranwalt oder Wirtschaftsprüfer für Ihre konkrete Situation. Für rechtliche Fragen zum Immobilienabschluss konsultieren Sie einen zugelassenen panamaischen Rechtsanwalt."* — adds the legal-counsel line for the closing process, which strengthens compliance.
- Place names preserved with accents: "Panama-Stadt" (German convention), "Bogotá", "Pedasí", "Bocas del Toro", "Coclé".
- "USD $" prefix maintained throughout: `USD $300.000`, `USD $45/Mon.`, `USD $200`. Currency rule met.
- Zero em dashes.
- "Auswanderer" for expat is correct DE choice over loanword "Expats".

### Minor issues
- Tags use "auswanderer" lowercase (German nouns should be capitalised); this is in tags metadata, which is conventionally lowercase, so acceptable as a slug.
- The title uses "Preise nach Zone" — slightly truncates source ("real prices by zone"). Acceptable for headline length but loses "real". Negligible.

---

## DE — retirement-communities

**Verdict**: **Ship with caveats** — fix one brand-rule violation first (USD prefix missing the `$` sign), then publish.

### Strengths (substantial)
- **Best audience-localisation in the cohort, alongside PT-retirement.** Reframes for DACH (Germany / Austria / Switzerland):
  - Opening sentence rewritten: *"…in den Ruhestand gehen und besser leben als mit dem doppelten Budget in Deutschland, Österreich oder der Schweiz."*
  - Adds DACH-specific section on pension acceptance: *"Die gesetzliche Rente aus der Deutschen Rentenversicherung, der österreichischen Pensionsversicherungsanstalt oder der AHV der Schweiz wird in der Regel als anerkannte Quelle akzeptiert."*
  - Adds DBA (Doppelbesteuerungsabkommen) note: *"für Deutschland besteht aktuell kein DBA mit Panama, was relevante Konsequenzen hat"* — this is exactly the kind of jurisdiction-aware caveat the brand spec demands, and a generic translator would not produce it.
  - Adds Bayern / Tessin climate analogy for Boquete: *"Tagestemperaturen wie ein milder Maitag in Bayern, nächtliche Abkühlung wie im Tessin."*
  - Adds rent comparison: *"Für deutsche Rentner mit einer durchschnittlichen gesetzlichen Rente von 1.500 EUR netto ergibt das beim Wechselkurs einen sehr komfortablen Spielraum."*
- **Visa Pensionado** capitalised throughout, glossary-perfect.
- **"Käuferagentur"** used consistently for buyer's agency — clean and now consistent with DE-internet.
- Attorney-consult lines present in **four places** (immigration, tax, title, DACH-tax interaction) — the most complete legal-compliance footprint in the cohort.
- Place names: "Coclé", "Chiriquí", "Pedasí", "Bocas del Toro", "Casco Viejo" all accented; "Panama City" used in headings (German real-estate publications use both "Panama City" and "Panama-Stadt", so the choice is defensible — but inconsistent with the same-locale DE-internet article which uses "Panama-Stadt").
- Zero em dashes.
- "Registro Público" preserved as proper noun with German gloss.

### Issues found (quote → reason)

1. **BRAND RULE VIOLATION — missing `$` after "USD"**. Every monetary figure in this article writes `USD 1.500`, `USD 3.500`, `USD 1.000`, `USD 250.000`, `USD 10 Millionen`, etc. The brand spec (`brand-guidelines.md`) requires **"USD $XXX"** as the first-mention format, and the tone-of-voice spec calls out **"USD prefix on every dollar figure (USD $480k, not $480k)"**. The `$` sign is consistently dropped throughout the body. DE-internet got this right (`USD $300.000`, `USD $45/Mon.`). DE-retirement should be aligned.
   - **Bad strings (representative)**:
     - *"USD 1.500 bis USD 3.500 pro Monat in den Ruhestand"*
     - *"USD 1.000 pro Monat an lebenslangem Renteneinkommen (USD 1.250 mit einem Angehörigen, plus USD 250 pro weiterem Angehörigen)"*
     - *"USD 250.000 bis 500.000+"* in the table
     - *"USD 10 Millionen an panamaischer Immobilie platziert"*
     - *"USD 200 bis USD 600 pro Monat zusätzlich zur Hypothek"*
   - **Fix**: global replace `USD ` → `USD $` for monetary figures (be careful not to add `$` where USD is already absent or where the figure is `EUR`).

2. **Intra-locale inconsistency on "Panama City" vs "Panama-Stadt"**. DE-internet uses **Panama-Stadt**; DE-retirement uses **Panama City** in body and tables. Pick one for the locale.

3. **"isolierend"** in the El Valle section — correct grammar, but native DE editorial register more often says *"einsam"* or *"als Isolation empfunden"*. Stylistic, not a defect.

4. **"Vorerkrankung"** — correct medical-German term. Good.

5. The link list uses absolute URLs to `panamarealestateguide.com/de/articles/...` — correctly localised. Good (contrast with ES-retirement which uses relative paths sometimes and absolute others).

### Recommendation
Fix the `USD $` prefix throughout (mechanical find-replace, ~5 min), confirm Panama-Stadt vs Panama City convention, then ship. This article is otherwise the strongest DE editorial work in the cohort.

---

## Cross-cutting observations

### What worked
1. **Higher-context localisations are doing brand-aligned editorial work, not just translating** (PT-retirement, DE-retirement). The added BR-investor framing and DACH-pension framing are exactly the value-add that justifies machine translation + human review at scale.
2. **Glossary compliance is high across the board**: Visa Pensionado, buyer's agency / agencia del comprador / agência do comprador / Käuferagentur, panamarealestateguide.com casing, place-name accents, no banned competitors (no International Living, Live and Invest Overseas, Encuentra24, or Vivanuncios anywhere in the six files).
3. **Zero em dashes across all six translations**. The source had zero; the translations preserved zero. Hard ban respected.
4. **Numbers and facts preserved at 100%**. Spot-checked every monetary figure, percentage, hospital name, neighborhood name, brand name, URL, and section heading — no fabrications, no drift.

### What to address
1. **Currency prefix consistency**: DE-retirement drops the `$` after `USD`. Single locale-specific bug. Fix mechanically.
2. **ES retirement-communities** has the weakest naturalisation (Castilian vs neutral-LATAM register, anglicism overload). Either schedule a copyedit pass or update the spec to "neutral / LATAM Spanish" if that's actually the target. The current spec says Castilian; the current draft is closer to neutral LATAM.
3. **Body-payload shape differs within locales**: ES-internet ships a single markdown body string; ES-retirement ships a JSON array. PT and DE have the same divergence between the two articles. Confirm the renderer handles both shapes; standardise the pipeline output to one shape going forward.
4. **Internal link prefixes are inconsistent**: ES-internet keeps `/articles/...` (no locale prefix); ES-retirement, PT-both, DE-both use `/{locale}/articles/...`. The locale-prefixed links are the correct pattern. Fix ES-internet.

### Ship recommendations
| Article | Ship decision |
|---|---|
| ES — internet-providers | **Ship as-is** |
| ES — retirement-communities | **Ship with caveats** — schedule Castilian copyedit pass |
| PT — internet-providers | **Ship as-is** |
| PT — retirement-communities | **Ship as-is** (best in cohort) |
| DE — internet-providers | **Ship as-is** |
| DE — retirement-communities | **Revise then ship** — fix `USD $` prefix violation first |

### Overall cohort score: **4.7 / 5**
Strong launch quality. One mechanical fix (DE-retirement currency prefix) and one stylistic refresh (ES-retirement Castilian pass) bring the cohort to 5.0.
