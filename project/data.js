// Data — Panama Real Estate Guide (projects only, developer-sold) + editorial content
window.PANAMA_DATA = {
  brand: {
    name: 'PanamaRealEstateGuide.com',
    phone: '+507 6761-0315',
    whatsapp: 'https://wa.me/50767610315',
    email: 'reservations@panamarealestateguide.com',
    address: 'Oceania Business Plaza, Tower 2000, Panama City'
  },

  langs: [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'PT', name: 'Português' },
    { code: 'DE', name: 'Deutsch' }
  ],

  stats: [
    { n: '24', l: 'Developer Projects' },
    { n: '12', l: 'Coastal Communities' },
    { n: '100%', l: 'USD · No FX Risk' },
    { n: '7+',  l: 'Years in Panama' }
  ],

  // Developer-sold projects only — no individual resales
  projects: [
    {
      id: 'palma-blanca',
      name: 'Palma Blanca Resort & Residences',
      developer: 'Grupo Mar Azul',
      location: 'Playa Blanca · Pacific Coast',
      region: 'Pacific Coast',
      tagline: 'Where the palms meet the Pacific.',
      priceFromLabel: 'Reserve from $5,000',
      priceFrom: 285000,
      fromLabel: 'From $285,000',
      delivery: 'Phase II · 2027',
      status: 'Pre-construction',
      highlight: 'Reservations open',
      cover: 'ocean',
      size: 'large',
      about: `Palma Blanca Resort & Residences sits on 1.2 km of uninterrupted white-sand Pacific beach, 90 minutes west of Panama City. Phase II releases 186 units across low-rise condominium buildings, four-bedroom beach villas and a limited collection of oceanfront townhomes. The project is operated as a hotel-residence — owners may place units in the rental program, self-manage, or simply live there.`,
      units: [
        { type: '1-Bed Condominium', size: '68 m²', from: '$285,000' },
        { type: '2-Bed Condominium', size: '94 m²', from: '$395,000' },
        { type: '3-Bed Beachfront', size: '138 m²', from: '$625,000' },
        { type: '4-Bed Villa',       size: '220 m²', from: '$1,150,000' }
      ],
      amenities: ['3 pools incl. infinity', 'Private beach club', 'Full-service spa', '18-hole golf adjacent', '24/7 security', 'Rental management program', 'Owner concierge', 'Kids club'],
      timeline: [
        { phase: 'Reservation', desc: 'Refundable $5,000 deposit holds unit 30 days.' },
        { phase: 'Promise-of-sale', desc: '10% down, signed within 30 days of reservation.' },
        { phase: 'Construction payments', desc: '30% staged over build period.' },
        { phase: 'Delivery Q4 2027', desc: '60% on turnover with title transfer.' }
      ]
    },
    {
      id: 'coral-cove',
      name: 'Coral Cove Bocas',
      developer: 'Isla Bastimentos Holdings',
      location: 'Isla Colón · Bocas del Toro',
      tagline: 'Barefoot luxury in the Caribbean archipelago.',
      priceFromLabel: 'Reserve from $10,000',
      fromLabel: 'From $420,000',
      delivery: 'Phase I · Q3 2026',
      status: 'Selling now',
      highlight: 'Limited release',
      cover: 'ocean',
      size: 'medium',
      region: 'Caribbean',
      about: 'Coral Cove Bocas brings barefoot-luxury Caribbean living to Isla Colón — 42 overwater bungalows and beachfront lofts facing the mangrove cays. The resort operates on 100% solar with a dedicated desalination plant, a working marina, and a direct speedboat line to Bocas Town.',
      units: [
        { type: 'Overwater Bungalow', size: '78 m²', from: '$420,000' },
        { type: 'Beachfront Loft',    size: '110 m²', from: '$580,000' },
        { type: '2-Bed Villa',        size: '160 m²', from: '$820,000' }
      ],
      amenities: ['Private marina', 'Overwater deck', 'Dive center', 'Solar + desalination', 'Mangrove tours', 'Rental program'],
      timeline: [
        { phase: 'Reservation', desc: 'Refundable $10,000 deposit · 30-day hold.' },
        { phase: 'Promise-of-sale', desc: '15% down.' },
        { phase: 'Construction', desc: '25% staged.' },
        { phase: 'Delivery Q3 2026', desc: '60% on turnover.' }
      ]
    },
    {
      id: 'azuero-shores',
      name: 'Azuero Shores',
      developer: 'Pedasí Coastal Ltd.',
      location: 'Pedasí · Azuero Peninsula',
      tagline: 'The last untouched coast in the Americas.',
      priceFromLabel: 'Reserve from $8,000',
      fromLabel: 'From $365,000',
      delivery: 'Move-in ready',
      status: 'Move-in ready',
      highlight: 'Final units',
      cover: 'palm',
      size: 'medium',
      region: 'Azuero Peninsula',
      about: 'Azuero Shores sits on the last undeveloped stretch of the Azuero Peninsula — a fishing town called Pedasí with three-thousand inhabitants, two direct weekly flights from Panama City, and a surf coast that has only just begun to attract resort-grade development. Final units in Phase I are move-in ready.',
      units: [
        { type: '2-Bed Coastal',    size: '98 m²',  from: '$365,000' },
        { type: '3-Bed Ranch-Villa', size: '155 m²', from: '$495,000' },
        { type: 'Equestrian Estate', size: '2.5 ha', from: '$1,400,000' }
      ],
      amenities: ['Beach club', 'Equestrian facilities', 'Surf access', 'Private airstrip access', 'Farm-to-table restaurant', 'Owner workshop'],
      timeline: [
        { phase: 'Reservation', desc: 'Refundable $8,000 deposit.' },
        { phase: 'Promise-of-sale', desc: '20% down (move-in ready).' },
        { phase: 'Title transfer', desc: '80% on closing, typically 45 days.' }
      ]
    },
    {
      id: 'casco-malecon',
      name: 'Malecón Casco',
      developer: 'Casco Heritage S.A.',
      location: 'Casco Viejo · UNESCO Quarter',
      tagline: 'Heritage with an ocean view.',
      priceFromLabel: 'Reserve from $15,000',
      fromLabel: 'From $890,000',
      delivery: 'Ready Q4 2026',
      status: 'Near completion',
      highlight: 'Restoration',
      cover: 'sunset',
      size: 'small',
      region: 'Panama City',
      about: 'Malecón Casco is a restored 1870s colonial building at the edge of the UNESCO-listed Casco Viejo quarter, directly overlooking Panama Bay. Original ironwork, coral-stone facades and hand-laid tile are preserved. Twenty-two residences across four stories, delivered with modern systems and a private rooftop pool.',
      units: [
        { type: '1-Bed Loft',      size: '84 m²',  from: '$890,000' },
        { type: '2-Bed Residence', size: '128 m²', from: '$1,250,000' },
        { type: 'Penthouse',       size: '240 m²', from: '$2,850,000' }
      ],
      amenities: ['Rooftop pool with bay view', 'Concierge', 'Wine cellar', 'Private parking', 'UNESCO heritage designation', 'Restaurant ground-floor'],
      timeline: [
        { phase: 'Reservation', desc: 'Refundable $15,000 deposit.' },
        { phase: 'Promise-of-sale', desc: '20% down.' },
        { phase: 'Delivery Q4 2026', desc: '80% on turnover.' }
      ]
    },
    {
      id: 'vista-verde',
      name: 'Vista Verde Boquete',
      developer: 'Chiriquí Highlands Group',
      location: 'Boquete · Highlands',
      tagline: 'Spring, eternal.',
      priceFromLabel: 'Reserve from $6,000',
      fromLabel: 'From $340,000',
      delivery: 'Phase II · 2027',
      status: 'Pre-construction',
      highlight: 'Cloud forest',
      cover: 'palm',
      size: 'small',
      region: 'Highlands',
      about: 'Vista Verde Boquete sits in the coffee-country highlands of Chiriquí, 1,600 meters above sea level, with year-round spring weather and cloud-forest hiking at the doorstep. Phase II releases 48 mountain-view cottages and two boutique lodges.',
      units: [
        { type: '2-Bed Cottage',   size: '110 m²', from: '$340,000' },
        { type: '3-Bed Mountain Home', size: '175 m²', from: '$495,000' }
      ],
      amenities: ['Cloud-forest trails', 'Coffee farm tours', 'Clubhouse & spa', 'Heated pool', 'Boutique lodge'],
      timeline: [
        { phase: 'Reservation', desc: 'Refundable $6,000 deposit.' },
        { phase: 'Promise-of-sale', desc: '15% down.' },
        { phase: 'Construction', desc: '25% staged.' },
        { phase: 'Delivery 2027', desc: '60% on turnover.' }
      ]
    },
    {
      id: 'bay-tower-47',
      name: 'Bay Tower 47',
      developer: 'Balboa Developments',
      location: 'Avenida Balboa · Panama City',
      tagline: 'The city at your feet, the bay at your door.',
      priceFromLabel: 'Reserve from $12,000',
      fromLabel: 'From $720,000',
      delivery: 'Ready 2026',
      status: 'Move-in ready',
      highlight: 'Skyline',
      cover: 'sunset',
      size: 'small',
      region: 'Panama City',
      about: 'Bay Tower 47 is a forty-seven-story glass residential tower on Avenida Balboa, with every unit facing the bay. Full-floor penthouses, sky-garden amenity levels at 20 and 45, and direct pedestrian access to the Cinta Costera seafront park.',
      units: [
        { type: '2-Bed High-Floor', size: '120 m²', from: '$720,000' },
        { type: '3-Bed Corner',     size: '180 m²', from: '$1,150,000' },
        { type: 'Penthouse',        size: '420 m²', from: '$3,800,000' }
      ],
      amenities: ['Sky gym at floor 45', 'Infinity pool', 'Wine lounge', 'Co-working floor', 'Private valet', '24/7 concierge'],
      timeline: [
        { phase: 'Reservation', desc: 'Refundable $12,000 deposit.' },
        { phase: 'Promise-of-sale', desc: '20% down (ready stock).' },
        { phase: 'Title transfer', desc: '80% on closing.' }
      ]
    }
  ],

  regions: [
    { id: 'pacific', name: 'Pacific Coast', sub: 'Playa Blanca · Coronado', count: 8, blurb: 'White-sand beaches 60–90 minutes from the capital.' },
    { id: 'caribbean', name: 'Caribbean', sub: 'Bocas del Toro · San Blas', count: 5, blurb: 'Overwater living, reef frontage, rainforest islands.' },
    { id: 'azuero', name: 'Azuero Peninsula', sub: 'Pedasí · Las Tablas', count: 4, blurb: 'The last untouched coast — surf, ranches, traditions.' },
    { id: 'highlands', name: 'Highlands', sub: 'Boquete · Volcán', count: 3, blurb: 'Year-round spring, coffee country, cloud forest.' },
    { id: 'city', name: 'Panama City', sub: 'Casco · Balboa · Punta Pacífica', count: 4, blurb: 'Latin America\'s banking capital — towers and old town.' }
  ],

  // Editorial — the core of the site
  articles: [
    {
      id: '2026-outlook',
      category: 'Market Report',
      title: 'Panama 2026 property outlook: where the supply is tightening',
      excerpt: 'Coronado is sold out through Phase III. Bocas inventory has compressed 38% year over year. A data-driven look at which coasts still have room — and which have closed.',
      author: 'Kent Davis',
      date: 'April 22, 2026',
      read: '8 min read',
      cover: 'ocean',
      featured: true
    },
    {
      id: 'friendly-nations-2026',
      category: 'Residency',
      title: 'The Friendly Nations Visa in 2026 — what changed, what stayed',
      excerpt: 'The 2021 reform is settled law now. Here is the actual paperwork, timeline, and cost in 2026 dollars — with a checklist for each of the three qualifying routes.',
      author: 'Paola Estévez',
      date: 'April 18, 2026',
      read: '11 min read',
      cover: 'sand',
      featured: true
    },
    {
      id: 'pedasi-rising',
      category: 'Neighborhood',
      title: 'Pedasí is quietly becoming Panama\'s most-wanted coast',
      excerpt: 'A fishing town of 3,000 now has two direct weekly flights and four resort-grade projects under construction. We visit, talk to developers, and map what comes next.',
      author: 'Kent Davis',
      date: 'April 12, 2026',
      read: '13 min read',
      cover: 'sunset',
      featured: false
    },
    {
      id: 'rental-yields',
      category: 'Investment',
      title: 'Short-term rental yields by province — a 2026 breakdown',
      excerpt: 'Gross vs. net. Occupancy realities. Who is actually earning 9% and who is closer to 4%. Province-by-province numbers, with the caveats.',
      author: 'Paola Estévez',
      date: 'April 3, 2026',
      read: '9 min read',
      cover: 'palm',
      featured: false
    },
    {
      id: 'dollarization',
      category: 'Economics',
      title: 'Why Panama\'s 116-year dollarization still matters for buyers',
      excerpt: 'Panama adopted the US dollar in 1904 and has never printed its own paper money since. For international buyers, this is the quiet superpower.',
      author: 'Kent Davis',
      date: 'March 28, 2026',
      read: '7 min read',
      cover: 'sunset',
      featured: false
    },
    {
      id: 'tax-primer',
      category: 'Taxes',
      title: 'The 2026 Panama property-tax primer for foreign owners',
      excerpt: 'New-construction exemptions. Primary-residence cutoffs. What changed in 2024 that is still mis-reported online. A straight read.',
      author: 'Paola Estévez',
      date: 'March 20, 2026',
      read: '6 min read',
      cover: 'sand',
      featured: false
    }
  ,
    {
      id: 'pensionado-panama-city-condo-2026',
      category: 'Residency · US',
      title: 'Pensionado Visa + Panama City Condo: The Underrated Retirement Play Americans Are Quietly Making in 2026',
      excerpt: 'You can fly from Miami to Panama City in three hours, walk into a downtown condo with a 30-floor Pacific view, and spend the rest of your life paying 0% tax on every dollar you earn outside Panama. The visa that makes this work —…',
      author: 'Kent Davis',
      date: 'April 24, 2026',
      read: '8 min read',
      cover: 'sunset',
      lang: 'en'
    },
    {
      id: 'condos-panama-bajo-400k-colombianos',
      category: 'Investment · CO',
      title: 'Condos en Panamá bajo USD 400.000: la jugada inmobiliaria que los colombianos no encuentran en Bogotá ni Medellín (2026)',
      excerpt: 'Mientras un apartamento de 90 m² en El Poblado se cotiza en COP 1.300–1.800 millones (≈ USD 320–450K) con tasas hipotecarias en 13% y un peso que perdió 18% frente al dólar entre 2023 y 2026, la misma plata compra un condo de 90 m² en…',
      author: 'Carolina Ríos',
      date: 'April 23, 2026',
      read: '8 min read',
      cover: 'ocean',
      lang: 'es'
    },
    {
      id: 'comprar-imovel-panama-brasileiros-2026',
      category: 'Investment · BR',
      title: 'Comprar imóvel no Panamá em 2026: o guia para investidores brasileiros (USD, isenção fiscal e o que ninguém te conta sobre Sea Point Paitilla)',
      excerpt: 'Em abril de 2026, o real já testou os R$ 5,80/USD. A Selic ronda 11–13% e o IR sobre dividendos começou a ser cobrado. Enquanto isso, a três horas e meia de avião de São Paulo, é possível comprar um apartamento de 2 quartos com vista para…',
      author: 'Luis Mendes',
      date: 'April 22, 2026',
      read: '8 min read',
      cover: 'palm',
      lang: 'pt'
    },
    {
      id: 'panama-inversion-mexicanos-2026',
      category: 'Investment · MX',
      title: 'Por qué los mexicanos están descubriendo Panamá: la inversión inmobiliaria en dólares que ningún broker en CDMX te está ofreciendo (2026)',
      excerpt: 'En abril de 2026, comprar un departamento de 90 m² en Polanco cuesta MXN 12–18 millones (USD 600–900 mil) con yields brutos de 4–5%. A 2 horas y media de avión desde el AICM, en Ciudad de Panamá, USD 320 mil compran un condo equivalente…',
      author: 'Carolina Ríos',
      date: 'April 21, 2026',
      read: '9 min read',
      cover: 'sunset',
      lang: 'es'
    },
    {
      id: 'espanoles-panama-alternativa-golden-visa-2026',
      category: 'Residency · ES',
      title: 'Por qué cada vez más españoles eligen Panamá en 2026: la alternativa real al Golden Visa que España acaba de cerrar',
      excerpt: 'En abril de 2025 el Gobierno español aprobó el fin del Golden Visa por inversión inmobiliaria. En paralelo, la fiscalidad sobre rentas del capital subió hasta el 30%, el patrimonio sigue gravado en algunas comunidades y los precios de la…',
      author: 'Carolina Ríos',
      date: 'April 20, 2026',
      read: '9 min read',
      cover: 'sand',
      lang: 'es'
    }
  ],

  news: [
    { slug: 'palma-blanca-phase-ii', date: 'Apr 22', month: '2026-04', iso: '2026-04-22', title: 'Palma Blanca Phase II breaks ground — 186 units released', tag: 'Project update' },
    { slug: 'international-living-ranking', date: 'Apr 18', month: '2026-04', iso: '2026-04-18', title: 'Panama ranked #2 retirement destination in Latin America (International Living)', tag: 'Press' },
    { slug: 'copa-pedasi-route', date: 'Apr 14', month: '2026-04', iso: '2026-04-14', title: 'Copa adds second direct Miami → Pedasí route for 2026 season', tag: 'Infrastructure' },
    { slug: 'friendly-nations-up', date: 'Apr 09', month: '2026-04', iso: '2026-04-09', title: 'Friendly Nations Visa approvals up 22% YoY — immigration stats', tag: 'Residency' },
    { slug: 'bocas-fiber', date: 'Apr 02', month: '2026-04', iso: '2026-04-02', title: 'Bocas del Toro connectivity upgrade: fiber backbone completed', tag: 'Infrastructure' },
    { slug: 'casco-restoration-grant', date: 'Mar 28', month: '2026-03', iso: '2026-03-28', title: 'Ministry of Culture approves $4.2M restoration grant for Casco Viejo', tag: 'Regulatory' },
    { slug: 'aqua-lodge-delivery', date: 'Mar 19', month: '2026-03', iso: '2026-03-19', title: 'Aqua Lodge Bocas delivers first 12 overwater bungalows — keys handed to owners', tag: 'Project update' },
    { slug: 'coronado-sold-out', date: 'Mar 11', month: '2026-03', iso: '2026-03-11', title: 'Coronado reaches 100% reservation on three flagship projects — waiting lists open', tag: 'Market' },
    { slug: 'pedasi-water-plant', date: 'Feb 27', month: '2026-02', iso: '2026-02-27', title: 'Pedasí desalination plant commissioned — tripling potable water capacity', tag: 'Infrastructure' },
    { slug: 'boquete-trail-network', date: 'Feb 14', month: '2026-02', iso: '2026-02-14', title: 'Boquete Highlands municipality expands protected trail network by 340 hectares', tag: 'Regulatory' },
    { slug: 'q4-2025-absorption', date: 'Jan 30', month: '2026-01', iso: '2026-01-30', title: 'Q4 2025 absorption report: coastal inventory down 38% year over year', tag: 'Market' },
    { slug: 'airport-tocumen-expansion', date: 'Jan 21', month: '2026-01', iso: '2026-01-21', title: 'Tocumen International opens Terminal 2 satellite concourse — capacity +40%', tag: 'Infrastructure' },
    { slug: 'wsj-panama-feature', date: 'Jan 08', month: '2026-01', iso: '2026-01-08', title: 'Wall Street Journal: "Why Panama is absorbing the spillover from Costa Rica"', tag: 'Press' },
    { slug: 'new-tax-incentive', date: 'Dec 18', month: '2025-12', iso: '2025-12-18', title: 'National Assembly extends 20-year property tax exemption for new construction', tag: 'Regulatory' },
    { slug: 'palma-blanca-phase-i-sellout', date: 'Dec 04', month: '2025-12', iso: '2025-12-04', title: 'Palma Blanca Phase I records final sale — 100% delivered, 86% occupancy', tag: 'Project update' },
    { slug: 'bloomberg-retirement-index', date: 'Nov 22', month: '2025-11', iso: '2025-11-22', title: 'Bloomberg Retirement Index moves Panama into top 10 globally', tag: 'Press' },
    { slug: 'chiriqui-highway-open', date: 'Nov 09', month: '2025-11', iso: '2025-11-09', title: 'Pan-American Highway Chiriquí expansion opens — Boquete drive time cut to 5h', tag: 'Infrastructure' },
    { slug: 'buoy-hurricane-corridor', date: 'Oct 18', month: '2025-10', iso: '2025-10-18', title: 'NOAA reaffirms Panama outside Atlantic hurricane corridor — 119 year record intact', tag: 'Market' }
  ],

  articleBodies: {
    '2026-outlook': [
      { h: 'Supply is no longer abundant' },
      'Three years ago the conversation about Panama real estate was about selection — seven coasts, dozens of projects, plenty to choose from. In 2026 that framing has flipped. Coronado, the gateway beach town that anchored the Pacific expansion, is effectively sold out through Phase III of its three biggest resort-residence projects. Bocas del Toro inventory has compressed thirty-eight percent year over year, with two overwater developments now taking waiting-list names only.',
      'This is not a bubble story. New project launches through 2027 remain healthy, and the pipeline from the Ministry of Housing shows 42 permitted coastal residential projects in active construction. But the distribution has changed: supply is concentrating in secondary markets that were peripheral three years ago.',
      { h: 'Where supply is still loose' },
      'Pedasí and the broader Azuero Peninsula remain the clearest opportunity. A fishing town of roughly three thousand people, Pedasí now receives two direct weekly flights from Panama City and has four resort-grade developments under construction — but absorption has been slower, and promotional pricing persists.',
      'The Chiriquí highlands — Boquete and Volcán — are the other zone with room. Altitude keeps demand tempered: North American buyers who land in Panama City for the first time rarely imagine themselves in a sweater. Those who do tend to buy twice.',
      { h: 'Where it has closed' },
      'Coronado, San Carlos, the immediate Bocas Town ring and Casco Viejo restoration stock. If your buyer is fixed on any of these four markets, the reservation list is now the product.'
    ],
    'friendly-nations-2026': [
      'The Friendly Nations Visa is Panama\'s most discussed residency program among North American and European buyers — and the most mis-described online. Much of what is still published about the program refers to the pre-2021 rules. This is a clean restatement of where it stands in 2026.',
      { h: 'Who qualifies' },
      'Citizens of fifty countries including the United States, Canada, most of Western Europe, Australia, New Zealand, Japan, South Korea, Brazil, Argentina and Chile. The list has been stable since 2012.',
      { h: 'The three routes' },
      'One: A labor contract with a Panamanian employer. Two: The establishment of a Panamanian company with you as its director. Three: A real-estate investment of at least $200,000 USD in Panamanian property, held in your own name or through a Panamanian holding entity.',
      'The real-estate route is the one that matters to our clientele. In 2026 it is the fastest and cleanest of the three: a qualifying purchase generates a temporary residency card within roughly 45 days of application, and permanent residency after 24 months.',
      { h: 'What it actually costs' },
      'Government fees, notary, translations and legal work for a principal applicant total between $6,500 and $8,500 USD in 2026. Add a spouse ($1,500–$2,500), each dependent child ($1,200–$1,800), and annual renewal filings for the first two years. The $200,000 investment is a floor, not a fee; you retain full title to the property throughout.'
    ],
    'pedasi-rising': [
      'For twenty years Pedasí was the kind of place you reached by driving five hours from Panama City, eating fried fish at a roadside stand halfway, and arriving in a town where the single guesthouse had seven rooms. In 2026 that drive is under four hours on the completed Interamerican spur, a small commercial airport just outside town handles eight flights a week, and four resort-grade projects are under simultaneous construction.',
      'We spent four days in Pedasí in March — walking the coast, sitting with the three largest developers, eating at the new restaurants that have opened in the last eighteen months, and talking to foreign residents who bought in the first wave.',
      { h: 'What changed' },
      'Three things converged. Copa Airlines formalized a year-round seasonal route to Pedasí\'s airstrip in 2024. A long-stalled fiber-optic backbone connecting the peninsula to Panama City\'s network was completed in 2025. And the municipal government — with coaching from Tourism Minister Iván Eskildsen — passed a coastal-residential zoning code that is permissive enough to attract developers but strict enough on height (four stories maximum) to preserve the town\'s character.',
      { h: 'What it feels like' },
      'It feels, to our reporter\'s eye, like Costa Rica\'s Nosara did in 2004. A working town with a fishing fleet and a main square and a parish church, onto which a careful layer of resort-residential development is being grafted. It is a moment that will not last.'
    ],
    'rental-yields': [
      'The question we get asked most — and the question most mis-answered online — is what a Panama property actually yields as a short-term rental. The right answer is a range, because yield compounds across province, project class, unit size, rental-program participation, and whether you are counting gross or net.',
      { h: 'Gross vs. net' },
      'Gross yield is annual rental revenue divided by purchase price. Net yield subtracts management fees (typically 15–25% of gross at resort projects), maintenance, utilities covered by owner, reservation taxes, and HOA. Net runs 55–70% of gross across the projects we represent.',
      { h: 'By province' },
      'Bocas del Toro oceanfront condominiums: 8–11% gross, 5.5–7.5% net. Coronado/Playa Blanca resort-residences: 6.5–9% gross, 4–6% net (higher occupancy, lower nightly rate). Casco Viejo heritage: 9–12% gross, 5–7% net (higher nightly, lower occupancy). Boquete cottages: 5–7% gross, 3–4.5% net.',
      { h: 'The caveats' },
      'These numbers assume the rental program at the project — which every project we represent has — and a delivered unit with at least twelve months of operating history. Pre-construction projects are projections, and developers vary in how conservatively they project. We tell clients: underwrite on the low end of the range, and treat the top end as upside.'
    ],
    dollarization: [
      'Panama adopted the United States dollar as its primary currency in 1904, one year after independence from Colombia. The country\'s own currency — the Balboa — exists as a coinage supplement at parity with the dollar, but Panama has never printed its own paper money. In 116 years, through every regional currency crisis from Argentina to Venezuela, this has not changed.',
      'For a Panamanian citizen, this means predictable purchasing power. For an international property buyer, it means something more specific: the currency of your contract, your mortgage (if any), your rental income and your eventual exit is the same currency as your bank account at home.',
      { h: 'What it removes' },
      'It removes the two risks that make Mexican, Colombian and Costa Rican real estate more complicated for dollar-based buyers: FX risk on the transaction itself, and FX risk on repatriation of sale proceeds years later. A 2015 buyer of a Panama City condominium who sells in 2026 transacts in the same currency both times. A 2015 buyer of a Mexico City condominium transacts in pesos that have devaluated against the dollar by roughly 25% in the interim.',
      'This is a quiet superpower. It does not produce a headline. It produces an absence of a certain kind of headline.'
    ],
    'tax-primer': [
      'Panama reformed its property-tax code in 2017, clarified the exemptions in 2019, and made minor technical adjustments in 2024. Much of the online guidance on Panama property taxes still reflects the pre-2017 framework and is therefore wrong on material points. This is the current state.',
      { h: 'Primary residence' },
      'For primary-residence-registered properties (your declared home, not a rental), the first $120,000 of assessed value is exempt. Value above $120,000 is taxed on a progressive schedule topping out at 0.7% annually. For most foreign buyers of a primary-residence unit, annual tax is modest.',
      { h: 'Secondary & rental properties' },
      'Non-primary properties (rental, vacation, investment) are taxed on a different schedule: $30,000 exemption, then progressive up to 1.0%. Effective rates on most owner-occupied rentals fall between 0.5% and 0.9% of assessed value annually.',
      { h: 'New-construction exemption' },
      'Newly constructed property — most of what we represent — enjoys a construction-improvement tax exemption that ranges from ten to twenty years depending on the date the construction permit was issued and the improvement value. This is set at the project level; ask us for the specific exemption attached to any unit.',
      'There are no capital-gains surprises. A flat 10% capital gains tax applies on sale, with a 3% withholding at closing that credits against the final liability.'
    ]
  ,
    'pensionado-panama-city-condo-2026': [
      "You can fly from Miami to Panama City in three hours, walk into a downtown condo with a 30-floor Pacific view, and spend the rest of your life paying 0% tax on every dollar you earn outside Panama. **The visa that makes this work — Pensionado — has existed since 1987, and in 2026 it is still the most generous retirement residency program in the Western Hemisphere.**",
      "Most Americans we talk to discovered Panama through a Caribbean cruise stop or a Copa Airlines layover. They went home, did the math on Florida property insurance and Arizona summer electric bills, and realized that the same monthly budget buys 2× the lifestyle in Panama City. This guide is for them.",
      "By the end you will know exactly what the Pensionado visa requires, which Panama City neighborhoods make sense for an American with a $300K–$700K budget, what the buying process looks like as a US citizen, and how the math actually works once you're living there.",
      { h: 'Why right now, in 2026' },
      "Three things changed in the last 24 months that pushed Panama back to the top of the retirement-abroad conversation.",
      "First, the **dollar economy**. Panama uses the US dollar as legal tender. There is no currency conversion, no hedging, no waking up to a 12% peso devaluation overnight. Your Social Security check buys exactly what it buys at home.",
      "Second, **insurance and tax pressure** at home. Florida homeowners are seeing 30–80% premium increases. Arizona, Texas and California property taxes keep climbing. Capital gains exposure on US securities is at historical highs. Panama's territorial tax system means foreign-source income is not taxed in Panama at all.",
      "Third, the **infrastructure**. Tocumen Airport is now the largest hub south of the Rio Grande. Fiber internet is available in every Panama City neighborhood we'll discuss. Hospital Punta Pacifica is Johns Hopkins-affiliated. The country has matured into a place an American can land Tuesday and be operational by Friday.",
      "> **Field note from VIP Expats:** \"The clients who do best aren't the ones chasing the cheapest condo. They're the ones who buy 10 minutes from a Johns Hopkins-affiliated hospital, in a building with English-speaking property management, and who keep a US bank account funded for 12 months. That setup makes Year 1 invisible — which is exactly when most expats quit.\"",
      { h: 'The Pensionado visa in plain English' },
      "The headline number is **$1,000 per month** of guaranteed lifetime pension income (US Social Security, pension fund, military retirement, IRA annuity all qualify). Add $250/month for each dependent. If you buy property in Panama for $100,000 USD or more, the pension threshold drops to $750/month.",
      "What you get in return:",
      "- **Permanent residency** for you and your spouse, plus a *cédula* (Panamanian ID). - **Tax exemption on imported household goods** (one container, one time). - **Tax exemption on a new car** every two years. - **Discounts written into law**: 50% off entertainment, 30% off public transport, 25% off restaurants and airline tickets, 20% off medical services and prescriptions, 15% off hospital bills. - **Zero tax on foreign-source income** — your US dividends, pension, IRA distributions, rental income from your old house — none of it is taxed by Panama.",
      "Application takes 4–8 months from filing. You hire a Panamanian immigration attorney, apostille a short list of documents in the US (FBI background check, marriage certificate if applicable, proof of pension), fly down for biometrics, and wait. Cost runs $2,500–$4,500 in attorney fees plus government fees.",
      "| Pensionado vs. competing residencies (2026) | Panama Pensionado | Costa Rica Pensionado | Portugal D7 | | --- | --- | --- | --- | | Min. monthly pension | $1,000 ($750 with property) | $1,000 | ~$870 | | Permanent on issue? | Yes | No (3 yrs to permanent) | No (5 yrs to permanent) | | Income tax on foreign income | 0% | 0% (limited window) | Up to 48% (NHR ended) | | Time to approval | 4–8 months | 6–14 months | 8–18 months | | Spouse + dependents | Yes, +$250/mo each | Yes | Yes, with proof | | Discounts on local services | Codified by law (large) | Limited | None |",
      { h: 'Where to actually live in Panama City' },
      "Panama City is not Cancun. It is a real Latin American capital — banking center, regional HQs, traffic jams, sushi delivery, and the only place in the country where you'll find a Cheesecake Factory and a private chef on the same block. Below are the four neighborhoods that consistently work for our American clients.",
      "**Costa del Este.** Master-planned waterfront community on the eastern edge of the city. Wide sidewalks (rare in Latin America), grocery on every block, the city's best private schools, sea breeze. Two-bedrooms run $250K–$450K. Best fit if you want suburban quiet 15 minutes from downtown.",
      "**Punta Pacifica.** Where the towers are. Trump Ocean Club, Yoo, Sanctuary, Lee Towers, The Reserve — everything from $400K studios to $2M penthouses. The best hospital in Central America (Hospital Punta Pacifica, Johns Hopkins-affiliated) is here. Best fit for couples who want walkable, view-driven, low-maintenance living.",
      "**Casco Antiguo (Casco Viejo).** UNESCO old town, restored colonial. The lifestyle pick — cobblestone streets, rooftop bars, Friday-night jazz, art galleries. Inventory is limited and prices have climbed; expect $500K–$1.2M for a turnkey 2-bedroom. Best fit for cultural buyers who don't need a parking spot.",
      "**Bella Vista / El Cangrejo.** The \"old money\" mid-city neighborhoods. Walking distance to clinics, supermarkets, restaurants. Older buildings — you trade glassy newness for square footage. $200K–$400K buys a generously sized 2-bedroom. Best fit for budget-conscious retirees who prioritize location over amenities.",
      "We typically steer first-time buyers away from **Punta Paitilla** (older inventory, traffic, dated buildings) and away from beach communities for the *first* property — the Pensionado lifestyle works best when you're 10 minutes from a hospital, not 90.",
      { h: 'Buying as an American: the actual process' },
      "Foreign nationals can own property in Panama in fee simple, full title, no restrictions outside the 10km coastal/border concession zones. The process from Letter of Intent to keys in hand is typically 60–90 days.",
      "1. **Letter of Intent (LOI)** — non-binding, sets price and timeline. 1 week. 2. **Promise to Purchase / Earnest deposit** — usually 10% to escrow with a Panamanian attorney. 1 week. 3. **Due diligence** — title search at the Public Registry, certificate of \"no encumbrances,\" HOA financials, building permit history. 2–3 weeks. 4. **Closing (Escritura)** — signed before a Public Notary, registered at the Public Registry. 2–4 weeks.",
      "**Closing costs to budget:** 2% transfer tax (paid by seller, but verify it's clear), 0.4% notary, attorney fees of 1–1.5% of purchase price, registry fees. Total buyer-side: typically 1.5–2.5% on top of purchase price.",
      "**Financing.** Panamanian banks will lend to foreigners but the terms are not US-style. Expect 30–50% down, 5.5–7.5% interest, 15–25 year amortization. Most American clients we work with pay cash from the sale of their US home or a 1031-style portfolio rebalance, then optionally take a Panamanian mortgage 12 months later once they've built local banking history.",
      { h: 'What your monthly budget really looks like' },
      "A realistic 2026 monthly budget for an American couple living in a Punta Pacifica or Costa del Este 2-bedroom condo:",
      "| Line item | Monthly USD | | --- | --- | | HOA + condo fees | $250 – $500 | | Electricity (with AC) | $120 – $220 | | Internet (1 Gbps) | $50 – $80 | | Mobile (2 lines) | $30 – $50 | | Health insurance (couple, 60s, private) | $400 – $900 | | Groceries | $500 – $800 | | Restaurants (weekly date + casual) | $300 – $500 | | Domestic help (2× per week) | $80 – $160 | | Transportation (Uber + occasional rental) | $150 – $300 | | **Total** | **$1,880 – $3,510** |",
      "A retired American couple comfortable on $4,500/month gross can live well in Panama City. The same lifestyle in Miami in 2026 starts at $7,200/month with rent or condo carrying costs included.",
      { h: 'FAQs' },
      "**Can I qualify for Pensionado on Social Security alone?** Yes. SSA income letter is one of the most commonly accepted income documents. You need to show $1,000/month or more.",
      "**Do I lose my US Medicare?** Medicare doesn't pay for care abroad with rare exceptions, so most retirees keep Part A (free) and drop Part B until they return for visits. Combine Panamanian private insurance ($400–$900/month for a couple in their 60s) with a US emergency-only travel policy for trips back.",
      "**What's the property tax bill?** Properties valued under $120,000 owe $0. From $120K to $700K, the rate runs 0.5–0.7%. Above $700K, 0.9%. Many residential properties also qualify for primary-residence exemptions of up to $120K of assessed value.",
      "**Do I need to learn Spanish?** No, but it doubles your quality of life. Panama City is bilingual at the professional and service-industry level. Outside the city, English drops sharply.",
      "**Can I leave the US tax system?** No. US citizens are taxed on worldwide income regardless of where they live. The Foreign Earned Income Exclusion ($126,500 for 2026) helps if you have *earned* income, but Pensionado income is unearned and stays fully reportable. The benefit isn't escaping US tax — it's avoiding additional Panamanian tax and dramatically lowering your cost of living.",
      { h: 'Next steps with VIP Expats' },
      "Most of our American Pensionado clients close on a condo within 90 days of their first Panama trip. The pattern that works: **scouting trip → put a property under LOI → fly home → file the visa → close on the property → fly back with the container.**",
      "If you want to compress that timeline, [book a relocation consult](https://panamarealestatesale.com/en/relocation/tours) or message us directly on **WhatsApp +507 6761-0315**. We'll send you a curated list of properties that match your Pensionado strategy and connect you with our preferred immigration attorney.",
      "Related reading: - [How to Move to Panama 2026: Step-by-Step Complete Guide](https://panamarealestatesale.com/en/blog/how-to-move-to-panama-step-by-step-2026) - [Best Neighborhoods Panama City 2026: Expats Living Guide](https://panamarealestatesale.com/en/blog/best-neighborhoods-panama-city-expats)",
      "**One-line takeaway:** Pensionado + a $400K Panama City condo is the most under-marketed retirement strategy of 2026 — three hours from Miami, zero tax on your US income, and a hospital with Johns Hopkins on the wall."
    ],
    'condos-panama-bajo-400k-colombianos': [
      "Mientras un apartamento de 90 m² en El Poblado se cotiza en COP 1.300–1.800 millones (≈ USD 320–450K) con tasas hipotecarias en 13% y un peso que perdió 18% frente al dólar entre 2023 y 2026, **la misma plata compra un condo de 90 m² en Punta Pacífica con vista al Pacífico, en USD, en un país sin control de cambios y con impuesto territorial al 0% sobre tu ingreso colombiano.**",
      "Este artículo es para el colombiano profesional o empresario que ya entendió que diversificar fuera del peso no es paranoia, es matemática. La pregunta es práctica: con USD 250.000 a 400.000 en la mano, ¿qué se compra hoy en Panamá, cómo se financia, qué visa aplica, y cuál es el riesgo real?",
      { h: 'Por qué Panamá ahora (y por qué los colombianos están entrando)' },
      "Los datos del Meta Ad Library en abril 2026 confirman lo que la diáspora colombiana en Panamá ya sabe: **17 anuncios activos de Buenaventura dirigidos a Colombia, llevan 112 días corriendo. Sea Point Paitilla lleva 167 días con copy en español.** En publicidad digital, los anuncios que no convierten se apagan en semanas. Que estos sigan vivos significa que los colombianos están comprando.",
      "Tres razones lo explican:",
      "**Primera, el dólar.** Panamá usa el dólar estadounidense como moneda legal. No hay TRM diaria, no hay control de cambios, no hay declaración de movimientos sobre USD 10.000. Tu plata está en dólares desde el día que firmas la promesa de compra.",
      "**Segunda, fiscalidad territorial.** Panamá no grava ingresos generados fuera de Panamá. Tu salario, tus dividendos, tu renta de un apartamento en Bogotá — nada de eso paga impuestos en Panamá. Solo se grava lo que generes dentro del país.",
      "**Tercera, residencia rápida.** El programa **Países Amigos** te da residencia permanente en 6–9 meses. Con USD 200.000 invertidos en propiedad o un depósito a plazo, calificas. No hay que mostrar ingreso pasivo de USD 1.000 mensuales como en otros programas — la inversión sustituye el ingreso.",
      "> **Nota de campo de VIP Expats:** \"El cliente colombiano que cierra rápido es el que viene con dos cosas claras: monto en dólares, y rango de años para vivir o rentar. Los que llegan a 'mirar opciones' tardan 18 meses. Los que llegan con USD 350K para un dos-alcobas en Costa del Este y un horizonte de 5 años cierran en 60 días.\"",
      { h: 'El segmento que nadie está vendiéndote: USD 250K–400K' },
      "Toda la publicidad pesada en Colombia está en dos extremos: **luxury en Buenaventura** (USD 1M+, club de golf y playa) y **proyectos boutique en Bocas del Toro** (USD 250–600K, rentabilidad turística pero lejos de la ciudad). El segmento del medio — condos urbanos en Ciudad de Panamá entre USD 250K y 400K, ideales para vivir o rentar a expats corporativos — tiene cero competencia colombiana en Meta.",
      "Cuatro proyectos donde hoy se compra exactamente eso:",
      "**Euphoria Art District (Panama Art District, cerca de Multiplaza)** — Lanzamiento marzo 2026. Modelo lock-off (la unidad se divide en dos para Airbnb). 80 m² 2 alcobas desde USD 285.000, 94 m² desde USD 334.000, 116 m² 3 alcobas piso 37 a USD 436.000. Pre-venta, entrega 2027–2028.",
      "**Wynwood Towers (Costa del Este / cercanías)** — Pre-venta y resale. Dos alcobas en USD 280–380K. Estilo industrial-loft, perfil joven profesional.",
      "**Allure Bella Vista (Provivienda)** — Listo para entrega o entregado. Dos alcobas USD 220–320K. Bella Vista es la zona \"vieja consolidada\" — caminable, médica, supermercados a la cuadra.",
      "**Costa del Este (mercado secundario)** — Múltiples edificios entregados con dos alcobas en USD 280–420K. Comunidad master-planned, colegios privados internacionales, ciclo-rutas, perfil familiar.",
      "| Proyecto | Zona | 2BR desde (USD) | Ideal para | Renta mensual estimada | | --- | --- | --- | --- | --- | | Euphoria Art District | Multiplaza / Art District | $285.000 | Inversión Airbnb (lock-off) | $2.200–$2.800 | | Wynwood Towers | Costa del Este | $280.000 | Pareja sin hijos / nómada | $1.800–$2.400 | | Allure Bella Vista | Bella Vista | $220.000 | Pied-à-terre urbano | $1.500–$2.000 | | Resale Costa del Este | Costa del Este | $280.000 | Familia / vivir | $1.800–$2.200 | | Sea Point Paitilla | Punta Paitilla | $480.000+ | Vista mar premium | $2.500–$3.500 | | Buenaventura (Bern) | Pacífico Río Hato | $1.000.000+ | Segunda casa lujo | N/A (uso propio) |",
      { h: 'La visa: Países Amigos en menos de 9 meses' },
      "Colombia es uno de los 50+ países dentro del programa **Países Amigos** de Panamá. El proceso para un colombiano que invierte en propiedad:",
      "1. **Comprar la propiedad** por mínimo USD 200.000 (en uno o varios inmuebles), o abrir un depósito a plazo fijo por el mismo monto en banco panameño. 2. **Apostillar en Colombia** los siguientes documentos: pasaporte, antecedentes penales DAS/Procuraduría, registro civil de matrimonio (si aplica), partida de nacimiento de los hijos. 3. **Filar la solicitud en Panamá** con un abogado migratorio panameño. Costo legal típico: USD 2.500–4.500 por solicitante principal, USD 1.000–1.500 por dependiente. 4. **Carné de residente provisional** en 30–60 días. 5. **Carné de residente permanente** en 6–9 meses. 6. **Cédula** y, después de 5 años, opcionalmente nacionalidad.",
      "**Diferencia importante con la Pensionado:** Países Amigos no exige ingreso mensual mínimo. Lo que se valida es la inversión inmobiliaria (USD 200K) o el depósito a plazo. Para un colombiano de 35–55 años aún en etapa productiva, este es el camino correcto.",
      { h: 'Cómo se financia siendo colombiano' },
      "Hay tres caminos prácticos:",
      "**1. Cash desde Colombia.** El más rápido. Se transfiere de tu banco colombiano (con declaración de origen de fondos, monto > USD 10K reportable a la UIAF) a tu cuenta de fideicomiso en Panamá. La promesa de compra-venta debe ser un instrumento bilingüe protocolizado por notario panameño. Tiempo total: 30–45 días desde la firma.",
      "**2. Crédito hipotecario panameño para extranjeros.** Banistmo, BAC, Multibank y Banesco prestan a no residentes con: 30–40% de cuota inicial, tasa 6,5–8,5% (mucho más baja que Colombia), plazo 15–25 años. Requieren extractos bancarios colombianos de 12 meses, declaración de renta, certificación laboral y carta de origen de fondos. Aprobación: 4–8 semanas.",
      "**3. Equity release desde Colombia.** Refinanciar tu propiedad colombiana, sacar 50–60% del valor, y comprar al cash en Panamá. Funciona si el peso está estable y la propiedad colombiana ya está libre de hipoteca. La aritmética suele dar mejor que el crédito panameño cuando se proyecta a 10 años.",
      { h: 'Costo de cierre y carga fiscal real' },
      "Sobre un condo de USD 350.000 en Ciudad de Panamá:",
      "| Concepto | Monto USD | | --- | --- | | Precio de compra | $350.000 | | Honorarios abogado (1–1,5%) | $3.500–$5.250 | | Notaría y registro | $1.400–$2.100 | | Impuesto de transferencia (lo paga vendedor en pre-venta nueva) | $0–$7.000 | | **Total al firmar** | **$354.900–$364.350** |",
      "**Impuesto predial anual:** Bajo USD 120.000 = 0%. De USD 120K a 700K = 0,5–0,7%. El predial sobre un condo de USD 350K corre alrededor de **USD 1.100–1.600 al año**.",
      "**ITBI sobre rentas:** Si rentas el condo, el alquiler genera impuesto sobre la renta panameño (territorial), pero la depreciación, mantenimiento y administración son deducibles. Margen efectivo típico para un colombiano: 12–15% del bruto.",
      { h: 'Comparación pura: COP en Bogotá vs. USD en Panamá' },
      "Asumiendo COP 1.500 millones disponibles ≈ USD 365.000 a tasa 4.110:",
      "| Métrica | Apartamento Bogotá (Chicó/Salitre, 2BR 90m²) | Condo Panamá (Costa del Este, 2BR 90m²) | | --- | --- | --- | | Precio | COP 1.500 M | USD 365.000 | | Moneda | COP | USD | | Renta bruta mensual | COP 4,5–6 M (USD 1.100–1.460) | USD 1.800–2.200 | | Renta neta anual | COP 35–45 M | USD 16.000–20.000 | | Yield bruto | 3,6–4,8% | 5,9–7,2% | | Apreciación 2020–2025 | 4–8% en COP | 6–10% en USD | | Riesgo cambiario | Alto (COP devaluó 18% vs USD 2023–26) | Cero | | Impuesto sobre renta extranjera del propietario | Hasta 39% (DIAN) | 0% (territorial) | | Tiempo a residencia segunda nacionalidad | N/A | 6–9 meses |",
      { h: 'Preguntas frecuentes' },
      "**¿Tengo que pagar impuestos en Colombia por la compra?** Sí debes declarar el inmueble en tu declaración de renta colombiana (formulario 210 o 110, casilla de patrimonio en el exterior) si superas los topes anuales DIAN. La compra en sí no genera renta gravable, pero el alquiler que generes en Panamá sí debe declararse en Colombia bajo el principio de renta mundial — con el respectivo crédito por impuestos pagados en Panamá (que serán bajos por la territorialidad).",
      "**¿Puedo comprar a través de mi sociedad colombiana?** Sí, pero suele ser más eficiente comprar a través de una sociedad anónima panameña. Costo de constitución: USD 1.000–1.500. Beneficios: privacidad, sucesión más simple, separación patrimonial.",
      "**¿Qué pasa si Panamá vuelve a la \"lista gris\"?** Panamá ha entrado y salido de la lista del GAFI varias veces. Para personas naturales colombianas con compra trazable y origen de fondos limpio, no afecta la operación. Solo complica la operativa bancaria si se hacen estructuras corporativas opacas.",
      "**¿Cuál es el mínimo realista para vivir bien en Ciudad de Panamá?** Para una familia colombiana (pareja + 1 hijo) en Costa del Este: USD 3.500–4.500/mes incluye condo administración, colegio bilingüe (USD 600–1.200/mes según el colegio), salud privada, comida, transporte. Para una pareja sin hijos: USD 2.500–3.200.",
      "**¿La seguridad es realmente mejor que Bogotá o Medellín?** En Ciudad de Panamá zona financiera y residencial, sí — significativamente. Tasa de homicidios país en 2025: 13/100K (vs Colombia 26/100K). Pero como en cualquier ciudad latinoamericana, hay zonas que se evitan. Costa del Este, Punta Pacífica, San Francisco, Bella Vista y Casco Antiguo son seguras 24/7.",
      { h: 'Próximos pasos con VIP Expats' },
      "Si llevas más de 6 meses pensándolo, ya estás en el grupo del 70% que termina comprando. La diferencia entre cerrar en 2026 y cerrar en 2027 es típicamente 8–12% de apreciación más prima del peso.",
      "Te enviamos por WhatsApp una shortlist de 5 condos que matchean exactamente tu rango y perfil — sin formularios. Escríbenos a **+507 6761-0315** o [agenda un tour de relocación](https://panamarealestatesale.com/es/relocation/tours).",
      "Lecturas relacionadas: - [Panamá para Colombianos: Guía 2026](https://panamarealestatesale.com/es/blog/panama-para-colombianos-guia-2026) - [Cómo comprar propiedad en Panamá: proceso paso a paso](https://panamarealestatesale.com/es/blog/panama-property-buying-process-guide)",
      "**Resumen de una línea:** En 2026, USD 350K en Panamá te dan dólares, residencia, 0% de impuesto territorial sobre tu ingreso colombiano y un yield 50% mayor que tu apartamento de El Poblado."
    ],
    'comprar-imovel-panama-brasileiros-2026': [
      "Em abril de 2026, o real já testou os R$ 5,80/USD. A Selic ronda 11–13% e o IR sobre dividendos começou a ser cobrado. Enquanto isso, **a três horas e meia de avião de São Paulo, é possível comprar um apartamento de 2 quartos com vista para o Pacífico, em dólar, em um país que não tributa renda gerada fora dele e onde sua residência permanente sai em 6 a 9 meses.**",
      "Este guia foi escrito para o brasileiro que já entendeu que dolarizar parte do patrimônio não é luxo — é gestão de risco. A pergunta é prática: com USD 250 mil a 500 mil disponíveis (ou R$ 1,5 M a 3 M, dependendo da cotação no dia), o que se compra hoje em Cidade do Panamá, como funciona o financiamento sendo brasileiro, qual visto se aplica, e por onde começar sem queimar 18 meses descobrindo o caminho.",
      { h: 'Por que o Panamá agora — e por que tão poucos brasileiros sabem disso' },
      "A Meta Ad Library mostra um sinal silencioso mas inequívoco: a Inmobiliaria del Este, dona do projeto Sea Point Paitilla, gasta com anúncios em português há 167 dias seguidos. Em mídia paga, anúncio que não converte é desligado em semanas. **167 dias é a confirmação de que brasileiros estão comprando.**",
      "E quase nenhum outro player do Panamá entrou no Brasil. A Bern (Buenaventura, Ritz-Carlton) compete na Colômbia e nos EUA com 112 e 18 dias de campanha. No Brasil? Zero. O canal está praticamente vazio — o que significa duas coisas: pouca competição na hora de buscar produto, e CPMs mais baixos quando você (eventualmente, se quiser) anunciar a revenda.",
      "Os três motivos pelos quais a tese funciona:",
      "**1. Economia em dólar real.** O Panamá usa o dólar dos Estados Unidos como moeda legal desde 1904. Não há \"dolarização\" no sentido argentino — o país é literalmente dolarizado. Não há controle cambial, não há IOF de 6,38%, não há limite de saída de divisa. Você transfere via Swift do seu banco brasileiro (com declaração de remessa), e os dólares chegam.",
      "**2. Tributação territorial.** O Panamá só tributa o que é gerado dentro do Panamá. Seu pró-labore brasileiro, seus dividendos, seus aluguéis em Pinheiros — nada disso é tributado pelo Panamá. Apenas o aluguel do imóvel panamenho (se você alugar) gera IR territorial — e ele é dedutível dos custos de manutenção, administração e depreciação.",
      "**3. Residência por investimento de USD 200K (Países Amigos).** O programa Países Amigos inclui o Brasil. Com USD 200 mil em propriedade ou em depósito a prazo num banco panamenho, você obtém residência permanente em 6–9 meses. O carnê (cédula) sai junto. Nenhum exigência de renda mensal, nenhuma comprovação de patrimônio adicional.",
      "> **Nota de campo da VIP Expats:** \"O cliente brasileiro que mais cresce em quantidade hoje não é o investidor de R$ 50 milhões. É o profissional liberal de R$ 5–8 milhões de patrimônio que entendeu que ter 30% disso fora do Brasil em dólar não é fuga — é higiene financeira. Ele compra um 2-quartos em Costa del Este, aluga por USD 1.800 enquanto não usa, e usa duas vezes ao ano.\"",
      { h: 'Onde realmente comprar (e o que evitar)' },
      "Cidade do Panamá tem 14+ bairros viáveis, mas para o investidor brasileiro buscando dólar + bom aluguel + segurança, a lista útil são quatro.",
      "**Punta Pacífica.** O bairro das torres premium. Vista para a Cinta Costera e para a baía. Hospital Punta Pacífica (afiliado ao Johns Hopkins) fica aqui. Edifícios: Yoo Panama, Sanctuary, Lee Towers, The Reserve, Sea Point. Faixa USD 400K–1,5 M. Ideal para quem quer revenda fácil e aluguel premium.",
      "**Costa del Este.** Comunidade master-planned ao leste, à beira-mar. Calçadas largas (raridade na América Latina), shopping Town Center, escolas internacionais. Mercado mais maduro com inventário 80% entregue. Faixa USD 280–600K. Perfil: famílias e profissionais que buscam bairro suburbano de alto padrão.",
      "**Casco Antiguo (Casco Viejo).** Patrimônio UNESCO restaurado. Restaurantes, rooftops, jazz, galerias. Inventário limitado, preços subiram (USD 500K–1,2 M para um 2-quartos turn-key). Aluguel de temporada (Airbnb) gera 8–12% bruto. Ideal para quem mistura uso pessoal + renda de curto prazo.",
      "**Bella Vista / El Cangrejo.** Os \"bairros antigos consolidados\". Caminhável, próximo de hospital, supermercados na esquina. Edifícios mais antigos, mas área útil maior por dólar. Faixa USD 200–400K. Yield: 6–7,5% bruto. Ideal para o investidor que prioriza renda sobre status.",
      "| Projeto / Bairro | Tipologia | Preço USD (2BR 90m²) | Yield bruto anual | Perfil | | --- | --- | --- | --- | --- | | Sea Point Paitilla | Premium | $480K–$700K | 5,5–6,5% | Vista mar premium | | Wynwood Towers (Costa del Este) | Mid-luxury | $280K–$380K | 6,5–7,5% | Profissional jovem | | Euphoria Art District | Pre-venda lock-off | $285K–$436K | 8–10% (Airbnb) | Investidor + Airbnb | | Costa del Este (revenda) | Família | $280K–$420K | 6–7% | Famílias | | Bella Vista (Allure / similares) | Mid-mercado | $220K–$320K | 6,5–7,5% | Renda recorrente | | Buenaventura (Bern) | Resort luxo | $1M+ | N/A (uso próprio) | Segunda casa |",
      { h: 'O visto: Países Amigos passo a passo para brasileiro' },
      "O Brasil é membro pleno do programa Países Amigos. O caminho com investimento imobiliário:",
      "1. **Comprar imóvel(is) somando USD 200.000+** ou abrir CDB equivalente em banco panamenho (Banistmo, BAC, Multibank). 2. **Apostilar no Brasil**: passaporte, certidão de antecedentes criminais (PF e estadual), certidão de casamento (se aplicável), certidões de nascimento dos dependentes. Apostila Haia em qualquer cartório autorizado. 3. **Tradução juramentada para espanhol** dos documentos. 4. **Protocolar em Cidade do Panamá** com advogado migratório panamenho. Custo legal típico: USD 2.500–4.500 por solicitante principal, USD 1.000–1.500 por dependente. 5. **Carnê provisório** em 30–60 dias. Permite entrar e sair do país sem visto. 6. **Carnê permanente** em 6–9 meses. 7. **Cédula** (RG panamenho) e direito a aplicar para naturalização após 5 anos.",
      "**Diferença em relação à Pensionado:** Países Amigos não exige USD 1.000/mês de renda passiva — o investimento substitui a comprovação de renda. Para o brasileiro ainda em fase produtiva, é o caminho correto.",
      { h: 'Como financiar sendo brasileiro' },
      "Três caminhos práticos:",
      "**1. À vista, com remessa via Swift.** O mais rápido. Banco brasileiro → fideicomisso (escrow) panamenho. Documente origem dos fundos (extratos, declaração IRPF, comprovação de venda de outro ativo). IOF cambial de 0,38% sobre a remessa. Tempo total da firma de promessa de compra à escritura: 30–45 dias.",
      "**2. Crédito hipotecário panamenho para estrangeiros.** Banistmo, BAC, Multibank e Banesco emprestam para não residentes a partir de: - Entrada: 30–40% do valor - Taxa: 6,5–8,5% ao ano (em USD — bem abaixo de qualquer financiamento brasileiro) - Prazo: 15–25 anos - Documentos: 12 meses de extratos, IRPF dos últimos 2 anos, comprovação de renda, carta de origem de fundos",
      "Aprovação: 4–8 semanas. Vale para quem quer alavancar 60–70% e deixar mais capital líquido.",
      "**3. Equity release no Brasil.** Refinanciar imóvel quitado no Brasil, sacar 50–60% do valor de mercado, comprar à vista no Panamá. Custo financeiro brasileiro tende a ser maior, mas elimina a fricção bancária panamenha. Funciona melhor para quem tem propriedade brasileira de alto valor já paga.",
      { h: 'Custos de fechamento e impostos reais' },
      "Sobre um condo de USD 350.000 em Cidade do Panamá:",
      "| Item | Valor USD | | --- | --- | | Preço de compra | $350.000 | | Honorários advogado (1–1,5%) | $3.500–$5.250 | | Cartório e registro | $1.400–$2.100 | | Imposto de transferência (paga vendedor em pré-venda nova) | $0–$7.000 | | IOF cambial 0,38% sobre remessa | $1.330 | | **Custo total ao assinar** | **$356.230–$365.680** |",
      "**IPTU panamenho:** Imóveis abaixo de USD 120 mil = 0%. De USD 120K a 700K = 0,5–0,7% ao ano. Sobre um condo de USD 350K, o IPTU anual fica em **USD 1.100–1.600**.",
      "**IR sobre aluguel:** Receita de aluguel é territorial — tributada no Panamá com alíquota efetiva 10–12% após deduções. **Importante:** o Brasil tributa renda mundial. Você precisa declarar o imóvel no IRPF (ficha \"Bens e Direitos\") e a renda de aluguel mensalmente via carnê-leão, com crédito do imposto pago no Panamá. Procure um contador com experiência internacional — economiza muito mais do que cobra.",
      { h: 'Comparação direta: imóvel SP vs. condo Panamá' },
      "Cenário: R$ 1,8 milhão (≈ USD 320 mil a R$ 5,60) disponível para investir.",
      "| Métrica | Apto SP (Pinheiros, 2 quartos 80m²) | Condo Panamá (Costa del Este, 2 quartos 90m²) | | --- | --- | --- | | Preço | R$ 1,8 M | USD 320 mil | | Moeda | BRL | USD | | Aluguel mensal bruto | R$ 6.000–8.000 | USD 1.700–2.100 | | Aluguel anual líquido | R$ 55–70 mil | USD 14–18 mil | | Yield bruto | 4,5–5,3% | 6,4–7,9% | | Apreciação 2020–25 | 5–9% em BRL | 6–10% em USD | | Risco cambial | Alto (BRL caiu ~25% vs USD 2020–25) | Zero (já é USD) | | IR sobre aluguel | 27,5% (carnê-leão) | ~10% (territorial) | | Tempo a segunda residência | N/A | 6–9 meses | | IPTU anual | R$ 7–12 mil | USD 1.100–1.600 |",
      { h: 'Perguntas frequentes' },
      "**Preciso declarar o imóvel no Brasil?** Sim, sempre. Vai na ficha \"Bens e Direitos\" do IRPF, em \"Bens no Exterior\". Comprou em USD, declara em USD pelo câmbio do dia da compra, e mantém esse valor histórico até venda. A renda de aluguel é tributada via carnê-leão mensalmente, com crédito de IR pago no Panamá.",
      "**Posso comprar via empresa offshore brasileira?** Tecnicamente sim, mas a maioria dos investidores prefere comprar via sociedade anônima panamenha (custa USD 1.000–1.500 para constituir, USD 300–500/ano para manter). Vantagens: sucessão direta, privacidade, separação patrimonial. Sempre declarar a participação societária no IRPF.",
      "**Há risco de Panamá voltar à lista cinza GAFI/FATF?** O Panamá entrou e saiu da lista cinza nas últimas décadas. Para pessoa física brasileira com origem de fundos limpa e compra rastreável, **isso não afeta a operação**. Apenas complica estruturas corporativas opacas.",
      "**Qual o ticket realista para morar bem em Cidade do Panamá?** Casal sem filhos em Costa del Este: USD 2.500–3.500/mês (condo, condomínio, plano de saúde privado, alimentação, transporte). Família com 1 filho em escola bilíngue internacional: USD 4.000–5.500/mês.",
      "**Quanto custa o voo SP–Cidade do Panamá?** Copa Airlines voa diário direto. Preço médio em 2026: R$ 3.500–5.500 ida e volta em econômica, R$ 9–14 mil em executiva. 6h30 de voo direto.",
      "**A segurança é melhor que São Paulo?** Em zonas residenciais e financeiras de Cidade do Panamá, sim, significativamente. Taxa de homicídios país 2025: 13/100K (vs. SP cidade ~14/100K, mas com distribuição muito desigual). Costa del Este, Punta Pacífica, Casco Antiguo, San Francisco e Bella Vista são seguros 24/7.",
      { h: 'Próximos passos com a VIP Expats' },
      "A janela de melhor preço de entrada para 2026 fecha quando os concorrentes da Inmobiliaria del Este perceberem o que ela já está aprendendo há 167 dias. Quando isso acontecer (provavelmente em 6–12 meses), os CPMs sobem e os preços de pré-venda fecham 8–12% acima.",
      "Mande-nos uma mensagem no **WhatsApp +507 6761-0315** com seu rango de investimento (USD 250K, USD 400K, USD 600K+) e horizonte (uso próprio, renda, second passport) — devolvemos uma curadoria de 5 unidades que se encaixam exatamente no seu perfil, sem formulários intermediários. Ou [agende um tour de relocação](https://panamarealestatesale.com/pt/relocation/tours) presencial.",
      "Leituras complementares: - [Panamá para brasileiros: guia 2026](https://panamarealestatesale.com/pt/blog/panama-para-brasileiros-guia-2026) - [Como comprar propriedade no Panamá: processo passo a passo](https://panamarealestatesale.com/pt/blog/panama-property-buying-process-guide)",
      "**Resumo em uma linha:** Em 2026, USD 320 mil em Cidade do Panamá te dão dólar, 6–8% de yield, residência permanente em 9 meses e zero imposto sobre sua renda gerada no Brasil."
    ],
    'panama-inversion-mexicanos-2026': [
      "En abril de 2026, comprar un departamento de 90 m² en Polanco cuesta MXN 12–18 millones (USD 600–900 mil) con yields brutos de 4–5%. **A 2 horas y media de avión desde el AICM, en Ciudad de Panamá, USD 320 mil compran un condo equivalente con vista al Pacífico, en dólares, en un país que no grava ni un peso de tu ingreso mexicano.**",
      "Y aquí está el dato que casi nadie en México conoce: según el Meta Ad Library de abril 2026, **cero promotores panameños están comprando publicidad dirigida a México**. Los colombianos, brasileños y estadounidenses ya están invirtiendo en Panamá. Los mexicanos están entrando casi en silencio, vía word-of-mouth y boutique brokers privados.",
      "Si entendiste el momento — peso volátil, inseguridad creciente en zonas premium, restricciones bancarias post-reforma fiscal, y el agotamiento de Miami como única opción de dolarización — este artículo es para ti.",
      { h: 'Por qué Panamá ahora (la versión que importa para mexicanos)' },
      "Cuatro factores cambiaron la ecuación entre 2024 y 2026:",
      "**1. Economía 100% dolarizada.** Panamá adoptó el USD como moneda legal desde 1904. No hay tipo de cambio diario, no hay control cambial, no hay reportar a SAT cada vez que mueves USD 10K (sí declaras a SAT por ser residente fiscal mexicano, pero la operación bancaria local es transparente). Tu plata está en dólares desde el día que firmas la promesa.",
      "**2. Fiscalidad territorial.** Panamá solo grava ingreso generado en Panamá. Tus honorarios en CDMX, los dividendos de tu empresa mexicana, la renta de tu departamento en Polanco — nada de eso paga impuestos en Panamá. **Esto no te exime del SAT** (México grava renta mundial), pero significa cero impuesto adicional en Panamá. Para profesionales independientes que ya pagan ISR del 35%, no agregar otra capa fiscal es valioso.",
      "**3. Residencia rápida vía Países Amigos.** México es uno de los 50+ países dentro del programa Países Amigos. Con USD 200 mil invertidos en propiedad o depósito a plazo fijo en banco panameño, obtienes residencia permanente en 6–9 meses. Carné de residente y opcionalmente cédula. Sin requisito de ingreso mensual mínimo.",
      "**4. Vuelo directo y zona horaria compatible.** Aeroméxico y Copa Airlines vuelan directo desde CDMX (2h 30min). La diferencia horaria es 1 hora (Panamá no usa horario de verano). Puedes estar en CDMX el martes desayunando, en Panamá el martes para junta a las 11, y de regreso el martes en la noche.",
      "> **Nota de campo de VIP Expats:** \"El cliente mexicano que cierra rápido es el que entiende dos cosas: que diversificar 30% del patrimonio fuera de México en USD no es radicalismo, es seguro patrimonial; y que Panamá no es Miami. Miami es el ego trip caro. Panamá es la jugada inteligente. Yields el doble, costos de vida 35–45% menos, y residencia en 9 meses en vez de tu visa B1/B2 que cada renovación es ruleta.\"",
      { h: 'Qué se compra hoy con USD 250K–500K en Ciudad de Panamá' },
      "Cinco zonas que importan para el inversionista mexicano:",
      "**Costa del Este.** Comunidad master-planned al este, frente al mar. Banderas y embajadas. Calles amplias, banquetas, áreas verdes. Town Center mall + colegios bilingües internacionales. Perfil familiar y profesional. Faixa: USD 280–600K para un 2 alcobas.",
      "**Punta Pacífica.** Las torres premium. Yoo Panama, Sanctuary, Lee Towers, The Reserve, Sea Point Paitilla. Vista a la Cinta Costera. Hospital Punta Pacífica (afiliado al Johns Hopkins). USD 400K–1.2M. Ideal para reventa rápida y renta corporativa.",
      "**Casco Antiguo (Casco Viejo).** Patrimonio UNESCO restaurado. Restaurantes, rooftops, jazz, galerías. Inventario limitado, precios altos pero estables (USD 500K–1.2M para un 2 alcobas turn-key). Renta de temporada (Airbnb) genera 8–12% bruto. Ideal para uso propio + Airbnb.",
      "**Bella Vista / El Cangrejo.** Los barrios \"consolidados antiguos\". Caminables, hospital cerca, supermercados a la cuadra. Edificios más viejos pero mayor superficie por dólar. USD 200–400K. Yields 6,5–7,5% bruto. Para inversionista que prioriza renta sobre status.",
      "**Euphoria Art District (lanzamiento marzo 2026).** Pre-venta cerca de Multiplaza. Modelo lock-off (la unidad se divide en dos para Airbnb). 80 m² desde USD 285.000, 116 m² piso 37 a USD 436.000. Entrega 2027–2028. Para inversionista que quiere precio de pre-venta y angularse a Airbnb.",
      "| Proyecto / Zona | Tipología | Precio USD (2BR 90m²) | Yield bruto anual | Perfil | | --- | --- | --- | --- | --- | | Sea Point Paitilla | Premium | $480K–$700K | 5,5–6,5% | Vista mar premium | | Costa del Este (resale) | Mid-luxury | $280K–$420K | 6–7% | Familias, vivir | | Euphoria Art District | Pre-venta lock-off | $285K–$436K | 8–10% (Airbnb) | Inversión Airbnb | | Wynwood Towers | Mid-luxury urbano | $280K–$380K | 6,5–7,5% | Profesional joven | | Bella Vista (Allure y similares) | Mid-mercado | $220K–$320K | 6,5–7,5% | Renta recurrente |",
      { h: 'Visa Países Amigos: el camino exacto para un mexicano' },
      "México califica al programa **Países Amigos**. Pasos prácticos:",
      "1. **Comprar inmueble(s) por USD 200.000+** o abrir depósito a plazo equivalente en banco panameño. 2. **Apostillar en México** los siguientes documentos (Ministerio de Relaciones Exteriores o gobiernos estatales): pasaporte vigente, antecedentes penales (carta de no antecedentes federales y estatal de tu CURP), acta de matrimonio (si aplica), actas de nacimiento de los hijos. 3. **Traducción oficial al español panameño** (si los documentos están en otro idioma — generalmente no aplica para mexicanos). 4. **Filar la solicitud en Panamá** con un abogado migratorio. Costo legal típico: USD 2.500–4.500 por solicitante principal, USD 1.000–1.500 por dependiente. 5. **Carné de residente provisional** en 30–60 días (te permite entrar y salir sin visa). 6. **Carné de residente permanente** en 6–9 meses. 7. **Cédula** y elegibilidad para nacionalidad después de 5 años.",
      "**Nota crítica:** Mantener residencia panameña no te quita residencia fiscal mexicana automáticamente. Sigues siendo residente fiscal mexicano si tienes \"centro de intereses vitales\" en México (familia inmediata, negocio principal, propiedad). Para cambiar residencia fiscal a Panamá hay que hacer un proceso formal con el SAT (artículo 9 LISR) y pasar más de 183 días al año fuera de México con vínculos económicos en Panamá.",
      "Para muchos clientes mexicanos esto es exactamente lo que quieren: **mantener el negocio en México, dolarizar parte del patrimonio en Panamá, y tener una segunda residencia operativa.** No buscan dejar de ser mexicanos — buscan optionalidad.",
      { h: 'Cómo se financia siendo mexicano' },
      "Tres rutas:",
      "**1. Cash desde México.** Transferencia SPEI internacional o SWIFT. Tu banco mexicano (BBVA, Banamex, Santander, Banorte) reporta a la UIF si supera USD 10K. El Panamá no tiene IOF como Brasil. Cuenta de fideicomiso en banco panameño recibe los dólares y se ejecuta la compra. Plazo total: 30–45 días desde la firma de la promesa.",
      "**2. Crédito hipotecario panameño para extranjeros.** Banistmo, BAC, Multibank y Banesco prestan a no residentes con: - Inicial: 30–40% - Tasa: 6,5–8,5% en USD (versus 10–12% en MXN si financias en México con CAT real) - Plazo: 15–25 años - Documentos: 12 meses de estados de cuenta, declaración SAT 2 últimos años, carta laboral o estado contable de tu negocio, comprobación de origen de fondos",
      "Aprobación: 4–8 semanas. Conviene si quieres dejar capital líquido para diversificar.",
      "**3. Equity release sobre tu inmueble mexicano.** Refinanciar tu departamento de Polanco, Lomas o San Pedro Garza García, sacar 50–60% del valor (LTV permite 70% en algunos bancos), comprar al cash en Panamá. Funciona mejor con tasas mexicanas estabilizadas.",
      { h: 'Costos de cierre y carga fiscal real' },
      "Sobre un condo de USD 350.000 en Ciudad de Panamá:",
      "| Concepto | USD | | --- | --- | | Precio de compra | $350.000 | | Honorarios abogado (1–1,5%) | $3.500–$5.250 | | Notaría y registro | $1.400–$2.100 | | Impuesto de transferencia (paga vendedor en pre-venta nueva) | $0–$7.000 | | **Costo total al firmar** | **$354.900–$364.350** |",
      "**Predial panameño:** Bajo USD 120.000 = 0%. De USD 120K a 700K = 0,5–0,7% al año. Sobre un condo de USD 350K: **USD 1.100–1.600 al año**.",
      "**ISR sobre rentas:** El alquiler genera ISR territorial panameño (10–12% efectivo después de deducciones). **México grava renta mundial.** Debes declarar el inmueble en tu DAP anual SAT, declarar la renta neta panameña como ingreso del extranjero, y aplicar el crédito por impuesto pagado en Panamá vía artículo 5 LISR. Contador con experiencia internacional es indispensable.",
      { h: 'Comparación directa: CDMX vs. Panamá' },
      "Escenario: MXN 6,5 millones (≈ USD 320K a tipo de cambio 20.31) disponibles para inversión.",
      "| Métrica | Departamento Polanco/Roma Norte (2BR 90m²) | Condo Costa del Este (2BR 90m²) | | --- | --- | --- | | Precio | MXN 6,5 M | USD 320 mil | | Moneda | MXN | USD | | Renta bruta mensual | MXN 25–35 mil (USD 1.230–1.720) | USD 1.700–2.100 | | Yield bruto anual | 4,5–5,3% | 6,4–7,9% | | Apreciación 2020–25 | 4–8% en MXN | 6–10% en USD | | Riesgo cambiario | Alto (peso volátil 18–22 vs USD) | Cero | | ISR efectivo sobre renta | 25–35% (México) | ~10–12% (Panamá territorial) | | Predial anual | MXN 30–60 mil | USD 1.100–1.600 | | Tiempo a residencia segunda nacionalidad | N/A | 6–9 meses | | Tiempo de vuelo desde CDMX | N/A | 2h 30min |",
      { h: 'Preguntas frecuentes' },
      "**¿Tengo que avisarle al SAT?** Sí. La compra del inmueble panameño debe declararse en tu Declaración Anual SAT como activo en el extranjero (anexo de \"Operaciones con entidades en el extranjero\" si compras vía sociedad). La renta generada en Panamá debe acumularse a tu ingreso global con crédito de ISR pagado en Panamá. Si el inmueble está a nombre de una sociedad anónima panameña, declaras la participación.",
      "**¿Conviene comprar a nombre personal o vía sociedad anónima panameña?** Para inversiones <USD 500K y uso mixto (uso propio + renta), suele convenir a nombre personal. Para portafolios de USD 500K+ o estructuras de sucesión, sociedad anónima panameña (USD 1.000–1.500 de constitución, USD 300–500 anuales de mantenimiento) ofrece mejor protección, sucesión directa, y menor fricción operativa. Siempre se declara al SAT como participación societaria.",
      "**¿La seguridad es mejor que CDMX?** En zonas residenciales y financieras de Ciudad de Panamá, sí, claramente. Tasa de homicidios país 2025: 13/100K (vs. CDMX ~10/100K, México país 26/100K — la varianza zona-a-zona en México es enorme; en Panamá es mucho más uniforme). Costa del Este, Punta Pacífica, Casco Antiguo, San Francisco y Bella Vista son seguros 24/7.",
      "**¿Cuál es el ticket realista para vivir bien en Ciudad de Panamá?** Pareja sin hijos en Costa del Este: USD 2.500–3.500/mes (condo, administración, seguro privado, comida, transporte). Familia con 1 hijo en colegio bilingüe internacional: USD 4.000–5.500/mes.",
      "**¿Qué pasa si Panamá vuelve a la lista gris GAFI?** Panamá ha entrado y salido varias veces en la última década. Para personas físicas con compra trazable y origen de fondos limpio, no afecta la operación. Solo complica estructuras corporativas opacas, que no es el caso del inversionista mexicano típico.",
      "**¿Cuánto cuesta el vuelo CDMX–Panamá?** Aeroméxico y Copa Airlines vuelan directo. Precio promedio 2026: MXN 8–14 mil ida y vuelta económica, MXN 25–40 mil ejecutiva. 2h 30min de vuelo.",
      { h: 'Próximos pasos con VIP Expats' },
      "El canal mexicano hacia Panamá es hoy un blue ocean: cero promotores panameños anuncian en México vía Meta. Eso significa que si entras en 2026 con ticket promedio USD 300K, encuentras inventario de pre-venta a precio aún no inflado por la guerra de medios que vendrá cuando los demás se den cuenta.",
      "Mándanos un mensaje a **WhatsApp +507 6761-0315** con tu rango de inversión (USD 250K, USD 400K, USD 600K+) y horizonte (uso propio, renta, segunda residencia, second passport) — te devolvemos una shortlist curada de 5 unidades que coinciden exactamente con tu perfil. Sin formularios intermedios. O [agenda un tour de relocación presencial](https://panamarealestatesale.com/es/relocation/tours).",
      "Lecturas relacionadas: - [Panamá para mexicanos: Guía 2026](https://panamarealestatesale.com/es/blog/panama-para-mexicanos-guia-2026) - [Cómo comprar propiedad en Panamá: proceso paso a paso](https://panamarealestatesale.com/es/blog/panama-property-buying-process-guide)",
      "**Resumen de una línea:** En 2026, USD 320 mil en Ciudad de Panamá compran dólares, residencia permanente en 9 meses, yield 50% mayor que tu departamento de Polanco, y cero impuesto adicional sobre tu ingreso mexicano."
    ],
    'espanoles-panama-alternativa-golden-visa-2026': [
      "En abril de 2025 el Gobierno español aprobó el fin del Golden Visa por inversión inmobiliaria. En paralelo, la fiscalidad sobre rentas del capital subió hasta el 30%, el patrimonio sigue gravado en algunas comunidades y los precios de la vivienda en Madrid, Barcelona y costas alcanzaron máximos históricos en 2026 con yields brutos en el 3–4%.",
      "**Mientras tanto, a 9 horas de vuelo desde Madrid-Barajas, en Ciudad de Panamá, USD 250.000 (≈ €230.000) compran un piso de dos habitaciones en una torre con vistas al Pacífico, en dólares, en un país que no grava ni un euro de tu ingreso español.**",
      "Y la residencia permanente sale en 6–9 meses por el programa **Países Amigos**, sin necesidad de demostrar renta pasiva mensual — solo la inversión inmobiliaria.",
      "Si el cierre del Golden Visa te dejó sin tu plan B, este artículo es para ti.",
      { h: 'Por qué Panamá para un español, en 2026' },
      "Cuatro razones que cambiaron el cálculo entre 2024 y 2026:",
      "**1. Economía dolarizada y sin control de cambios.** Panamá usa el dólar estadounidense como moneda legal desde 1904. No hay ITP, no hay AJD a tipos comunitarios, no hay reportar a Banco de España cada vez que mueves dinero — la transferencia SEPA-internacional o SWIFT desde tu banco español llega a tu cuenta de fideicomiso panameño en 2–3 días.",
      "**2. Fiscalidad territorial.** Panamá solo grava ingresos generados dentro del país. Tus dividendos de empresa española, los honorarios de tu actividad profesional, la renta de tu piso en Chamberí o Gracia — nada de eso paga impuesto en Panamá. **Importante:** si mantienes residencia fiscal española (más de 183 días en España o centro de intereses vitales en España), Hacienda te sigue gravando renta mundial. Pero al menos no añades una segunda capa fiscal panameña sobre lo que ya pagas en España.",
      "**3. Residencia rápida vía Países Amigos.** España es uno de los 50+ países dentro del programa. Con USD 200.000 invertidos en inmueble o depósito a plazo en banco panameño, obtienes residencia permanente en 6–9 meses. Sin requisito de renta mensual mínima. Carné de residente y elegibilidad para nacionalidad después de 5 años. **El mismo perfil de inversión que el extinto Golden Visa español, en menos tiempo y sin los topes que se discutieron.**",
      "**4. Idioma, cultura y vuelo directo.** Se habla español. La diferencia cultural es real pero superable en 90 días. Iberia y Air Europa operan vuelos directos Madrid–Panamá (9 h, salida noche / llegada mañana = un día perdido como mucho). Diferencia horaria de 6–7 horas según horario de verano español.",
      "> **Nota de campo de VIP Expats:** \"El cliente español del último año tiene un perfil distinto al colombiano o al mexicano. No viene huyendo de inseguridad ni de inflación. Viene buscando dos cosas: optionalidad fiscal y un activo en dólares fuera del euro y fuera de la costa española sobrecalentada. Compra Costa del Este o Punta Pacífica para vivir 4–6 meses al año, y la residencia panameña le da una salida si Madrid o Barcelona se complican.\"",
      { h: 'Qué se compra hoy con €200K–€500K en Ciudad de Panamá' },
      "Cinco zonas que tiene sentido considerar:",
      "**Costa del Este.** Comunidad master-planned al este, frente al mar. Aceras anchas (rareza en Latinoamérica), zonas verdes, centros comerciales, colegios bilingües internacionales, embajadas. Perfil familiar y profesional. Faixa: USD 280–600K para 2 dormitorios.",
      "**Punta Pacífica.** El distrito de torres premium. Yoo Panama, Sanctuary, Lee Towers, The Reserve, Sea Point Paitilla. Vista a la Cinta Costera, el equivalente al Manhattan tropical. Hospital Punta Pacífica afiliado al Johns Hopkins. USD 400K–1.2M. Ideal para reventa rápida y alquiler corporativo.",
      "**Casco Antiguo (Casco Viejo).** Patrimonio UNESCO restaurado — el Casco recuerda en muchos puntos al Albayzín granadino o al Born barcelonés. Restaurantes, jazz, galerías, rooftops. Inventario limitado, USD 500K–1.2M para 2 dormitorios turn-key. Alquiler vacacional 8–12% bruto. Para quien mezcla uso propio + Airbnb.",
      "**Bella Vista / El Cangrejo.** Los barrios \"consolidados antiguos\". Caminables, hospital cerca, supermercados a la cuadra. Edificios algo más antiguos pero mayor superficie por euro. USD 200–400K. Rentabilidad bruta 6,5–7,5%. Para inversor que prioriza renta sobre estatus.",
      "**Euphoria Art District (lanzamiento marzo 2026).** Pre-venta cerca de Multiplaza. Modelo lock-off (la unidad se divide en dos para alquiler corto). 80 m² desde USD 285.000, 116 m² piso 37 a USD 436.000. Entrega 2027–2028. Para inversor que quiere precio de pre-venta y vocación de alquiler turístico.",
      "| Proyecto / Zona | Tipología | Precio USD (2BR 90m²) | Yield bruto anual | Perfil | | --- | --- | --- | --- | --- | | Sea Point Paitilla | Premium | $480K–$700K | 5,5–6,5% | Vista mar premium | | Costa del Este (resale) | Mid-luxury | $280K–$420K | 6–7% | Familias, vivir | | Euphoria Art District | Pre-venta lock-off | $285K–$436K | 8–10% (Airbnb) | Inversor + Airbnb | | Casco Antiguo | Boutique colonial | $500K–$1,2M | 8–12% (Airbnb) | Mixto: uso + alquiler | | Bella Vista (Allure) | Mid-mercado | $220K–$320K | 6,5–7,5% | Renta recurrente |",
      { h: 'Visa Países Amigos paso a paso para un español' },
      "El proceso para un español que invierte en propiedad:",
      "1. **Comprar inmueble(s) sumando USD 200.000+** o abrir depósito a plazo equivalente en banco panameño (Banistmo, BAC, Multibank, Banesco). 2. **Apostillar en España** los siguientes documentos: pasaporte vigente, certificado de antecedentes penales (Ministerio de Justicia), certificado de matrimonio (si aplica), certificados de nacimiento de hijos. Apostilla de La Haya en Tribunal Superior de Justicia o Ministerio de Justicia. 3. **Traducción jurada al español panameño no es necesaria** (mismo idioma). 4. **Filar la solicitud en Panamá** con un abogado migratorio panameño. Coste legal típico: USD 2.500–4.500 por solicitante principal, USD 1.000–1.500 por dependiente. 5. **Carné de residente provisional** en 30–60 días. Permite entrar y salir sin necesidad de visado. 6. **Carné de residente permanente** en 6–9 meses. 7. **Cédula** y derecho a aplicar para naturalización después de 5 años (España y Panamá tienen tratado de doble nacionalidad — no pierdes la española).",
      "**Diferencia clave con la Pensionado:** Países Amigos no exige USD 1.000/mes de renta pasiva. La inversión inmobiliaria sustituye la comprobación de ingreso. Para profesionales españoles aún en etapa productiva o pre-jubilación, este es el camino correcto.",
      { h: 'Cómo financiar la compra siendo español' },
      "Tres rutas:",
      "**1. Cash desde España, transferencia SEPA-internacional o SWIFT.** El más rápido. Tu banco español (BBVA, Santander, CaixaBank, Sabadell) reporta a Banco de España y a la AEAT por importes superiores a €10K-€50K según vehículo. La cuenta de fideicomiso panameña recibe los dólares y se ejecuta la compra. Tiempo total desde firma de promesa: 30–45 días.",
      "**2. Hipoteca panameña para extranjeros.** Banistmo, BAC, Multibank y Banesco prestan a no residentes con: - Entrada: 30–40% - Tipo: 6,5–8,5% en USD (vs. 3–4,5% en euros en España actualmente — mayor coste pero te endeudas en USD, lo que cubre el riesgo cambiario si tu ingreso es en EUR) - Plazo: 15–25 años - Documentos: 12 meses de extractos bancarios españoles, declaración de la Renta de los 2 últimos años, vida laboral / informe de actividad económica si autónomo, carta de origen de fondos.",
      "Aprobación: 4–8 semanas.",
      "**3. Equity release sobre tu vivienda en España.** Refinanciar tu piso en Madrid, Barcelona, Valencia o Málaga, sacar 50–60% del valor (LTV permite hasta 70% en algunas entidades), comprar al cash en Panamá. Funciona mejor con tipos hipotecarios españoles bajos y vivienda libre de carga.",
      { h: 'Costes de cierre y carga fiscal real' },
      "Sobre un piso de USD 350.000 en Ciudad de Panamá:",
      "| Concepto | USD | | --- | --- | | Precio de compra | $350.000 | | Honorarios abogado (1–1,5%) | $3.500–$5.250 | | Notaría y registro público | $1.400–$2.100 | | Impuesto de transferencia (paga vendedor en pre-venta nueva) | $0–$7.000 | | **Coste total al firmar** | **$354.900–$364.350** |",
      "**IBI panameño (impuesto de inmueble):** Bajo USD 120.000 = 0%. De USD 120K a 700K = 0,5–0,7% al año. Sobre un piso de USD 350K: **USD 1.100–1.600 al año** (significativamente menos que el IBI español sobre vivienda equivalente).",
      "**IRPF sobre rentas:** El alquiler genera impuesto territorial panameño, alrededor del 10–12% efectivo después de deducciones (mantenimiento, administración, depreciación). **España grava renta mundial.** Si mantienes residencia fiscal española, debes declarar el inmueble en el modelo 720 (bienes en el extranjero) y la renta de alquiler en tu IRPF, con deducción por doble imposición internacional (artículo 80 LIRPF).",
      "**ITP / AJD / Patrimonio en España:** No aplican a la compra panameña. Pero sí entra en el cómputo del Impuesto sobre el Patrimonio (en comunidades donde aplique, con mínimos exentos de €700K + vivienda habitual €300K). Asesor fiscal con experiencia internacional es clave.",
      { h: 'Comparación directa: Madrid (Chamberí o Salamanca) vs. Panamá Costa del Este' },
      "Escenario: €320.000 (≈ USD 350K a 1.09) disponibles para inversión.",
      "| Métrica | Piso Madrid centro (Chamberí, 80m² 2BR) | Condo Costa del Este (90m² 2BR) | | --- | --- | --- | | Precio | €320.000 | USD 350.000 | | Moneda | EUR | USD | | Alquiler bruto mensual | €1.100–€1.500 | USD 1.700–2.100 | | Yield bruto anual | 4,1–5,6% | 5,8–7,2% | | Apreciación 2020–25 | 6–10% en EUR | 6–10% en USD | | Riesgo divisa para perfil EUR | Bajo (es tu base) | Diversificación a USD | | IRPF efectivo sobre alquiler | 19–47% | ~10–12% (territorial) | | IBI / impuesto inmueble anual | €600–€1.200 | USD 1.100–1.600 | | Tiempo a residencia segunda nacionalidad | N/A | 6–9 meses | | Tiempo de vuelo desde Madrid | N/A | 9 h directo |",
      { h: 'Preguntas frecuentes' },
      "**¿Tengo que declarar el piso panameño en el modelo 720?** Sí, si la suma de tus bienes inmuebles en el extranjero supera los €50.000. El modelo 720 tiene plazo del 1 de enero al 31 de marzo de cada año. La sentencia del TJUE de enero 2022 anuló las sanciones desproporcionadas, pero el modelo sigue siendo obligatorio. La renta de alquiler también se declara en IRPF con deducción por doble imposición.",
      "**¿Puedo perder la residencia fiscal española?** Solo si pasas más de 183 días al año fuera de España y trasladas tu \"centro de intereses vitales\" (familia inmediata, fuente principal de ingresos, vinculo económico principal) a Panamá. Es un proceso real y verificable, no automático por sacarse la residencia panameña. Muchos clientes españoles mantienen la doble residencia (residencia fiscal en España, residencia legal en Panamá) deliberadamente.",
      "**¿España y Panamá tienen convenio para evitar la doble imposición?** No hay CDI vigente España–Panamá. Esto significa que la deducción por impuesto pagado en Panamá se hace por el método unilateral del artículo 80 LIRPF, con tope al porcentaje que sería aplicable en España. En la práctica, como la fiscalidad panameña sobre alquileres es baja (~10%), la deducción es menor pero existe.",
      "**¿Cuál es el coste realista para vivir bien en Ciudad de Panamá?** Pareja sin hijos en Costa del Este: USD 2.500–3.500/mes (piso, comunidad, seguro privado, comida, transporte). Pareja con un hijo en colegio bilingüe internacional: USD 4.000–5.500/mes. Significativamente menor que Madrid centro o Barcelona Eixample.",
      "**¿Es seguro Ciudad de Panamá comparado con ciudades españolas?** Tasa de homicidios país 2025: 13/100K (vs. España 0,7/100K — España es excepcionalmente segura a nivel global). Pero Ciudad de Panamá no se compara mal con otras capitales latinoamericanas — Costa del Este, Punta Pacífica, Casco Antiguo, San Francisco y Bella Vista son seguras 24/7. La sensación general en zonas residenciales premium es comparable a la zona Salamanca de Madrid o Diagonal de Barcelona.",
      "**¿Qué pasa si Panamá entra de nuevo en la lista gris GAFI/UE?** Para personas físicas españolas con compra trazable y origen de fondos transparente, no afecta. La operativa bancaria local sigue funcionando normalmente. Solo complica estructuras corporativas opacas, que no es el caso del comprador español típico.",
      { h: 'Próximos pasos con VIP Expats' },
      "Con el Golden Visa cerrado y la fiscalidad española al alza, los flujos de inversión patrimonial española hacia Latinoamérica se están reasignando. Portugal cerró su NHR; México tiene fricción burocrática; Uruguay es viable pero con yields bajos. **Panamá es, en 2026, la opción que combina velocidad de residencia, fiscalidad territorial y mercado inmobiliario con yields todavía interesantes.**",
      "Mándanos un mensaje al **WhatsApp +507 6761-0315** con tu rango de inversión (USD 250K, USD 400K, USD 600K+) y horizonte (uso propio, alquiler, segunda residencia, plan B) — te devolvemos una shortlist curada de 5 unidades que coinciden exactamente con tu perfil. Sin formularios intermedios. O [agenda un tour de relocación presencial](https://panamarealestatesale.com/es/relocation/tours).",
      "Lecturas complementarias: - [Panamá vs. España: comparativa de jubilación y vida](https://panamarealestatesale.com/es/blog/panama-vs-spain-retirement) - [Cómo comprar propiedad en Panamá: proceso paso a paso](https://panamarealestatesale.com/es/blog/panama-property-buying-process-guide)",
      "**Resumen de una línea:** En 2026, USD 350K en Ciudad de Panamá te dan dólares, residencia permanente en 9 meses, yield bruto 30–50% mayor que un piso en Madrid centro, y fiscalidad territorial sobre la renta del alquiler — la alternativa más limpia al Golden Visa que España cerró."
    ]
  },

  newsBodies: {
    'palma-blanca-phase-ii': {
      date: 'April 22, 2026',
      title: 'Palma Blanca Phase II breaks ground — 186 units released',
      tag: 'Project update',
      body: [
        'Grupo Mar Azul broke ground on Phase II of Palma Blanca Resort & Residences yesterday, releasing 186 units for reservation. Phase II includes four low-rise condominium buildings, eight four-bedroom beach villas and sixteen oceanfront townhomes, on the southern third of the resort\'s 1.2 km of Pacific beach frontage.',
        'Phase I, delivered in 2023, is fully occupied and operating at 86% annual occupancy through the rental-management program. Phase II delivery is targeted for Q4 2027.',
        'Reservations open today at a refundable $5,000 deposit, with a thirty-day hold period for due diligence. The project is represented by PanamaRealEstateGuide.com for international buyers.'
      ]
    },
    'international-living-ranking': {
      date: 'April 18, 2026',
      title: 'Panama ranked #2 retirement destination in Latin America',
      tag: 'Press',
      body: [
        'International Living\'s 2026 Global Retirement Index ranked Panama second in Latin America and fifth globally for retirement destinations. The ranking evaluates housing cost, healthcare access, visa friendliness, infrastructure, climate and cost of living.',
        'Panama\'s Pensionado Visa — which offers permanent residency to retirees with a minimum $1,000 monthly pension and delivers discounts of 15–50% on everything from airfare to medication — was cited as a principal driver of the country\'s ranking.',
        'The full report is available at internationalliving.com.'
      ]
    },
    'copa-pedasi-route': {
      date: 'April 14, 2026',
      title: 'Copa adds second direct Miami → Pedasí route for 2026 season',
      tag: 'Infrastructure',
      body: [
        'Copa Airlines announced today a second weekly direct route from Miami International to Pedasí\'s regional airstrip, effective December 2026 through April 2027. The new flight brings total direct North American service to Pedasí to two weekly inbound and two weekly outbound.',
        'The route is a material shift for the Azuero Peninsula, which has historically required a Panama City layover for international arrivals. It is also an indicator of the expected growth in inbound traffic to the peninsula\'s emerging resort projects.'
      ]
    },
    'friendly-nations-up': {
      date: 'April 09, 2026',
      title: 'Friendly Nations Visa approvals up 22% YoY',
      tag: 'Residency',
      body: [
        'The Panamanian National Immigration Service released first-quarter 2026 statistics today, showing Friendly Nations Visa approvals up twenty-two percent year over year. The largest single country of origin was the United States, with Germany and Canada tied for second.',
        'The real-estate investment route accounted for 61% of approvals, up from 48% in 2023 — reflecting a shift in applicant profile toward retirees and investors and away from contract-employment applicants.'
      ]
    },
    'bocas-fiber': {
      date: 'April 02, 2026',
      title: 'Bocas del Toro connectivity upgrade: fiber backbone completed',
      tag: 'Infrastructure',
      body: [
        'The long-anticipated fiber-optic backbone connecting the Bocas del Toro archipelago to Panama\'s mainland network was commissioned this week. The link delivers gigabit symmetric service to Isla Colón and Isla Bastimentos, with extension to Isla Solarte scheduled for Q3 2026.',
        'Reliable high-bandwidth connectivity has been the principal infrastructure constraint on Bocas as a remote-work destination. The upgrade is expected to accelerate development of remote-work-oriented residential and hospitality product on the archipelago.'
      ]
    },
    'casco-restoration-grant': {
      date: 'March 28, 2026',
      title: 'Ministry of Culture approves $4.2M restoration grant for Casco Viejo',
      tag: 'Regulatory',
      body: [
        'Panama\'s Ministry of Culture has approved a $4.2 million restoration grant for Casco Viejo, the UNESCO-listed colonial quarter of Panama City. The funds target structural reinforcement and façade restoration of seventeen buildings in the Avenida Central and Calle Primera corridors, where several private development projects are under active construction.',
        'The grant is the largest single cultural-heritage disbursement in the quarter\'s history and reflects sustained government commitment to the UNESCO designation secured in 1997. Restoration work is expected to begin in Q2 2026, with a projected 18-month completion window.',
        'The announcement follows a sustained period of private investment in Casco Viejo restoration. Our Malecón Casco project is among the residential developments adjacent to the grant area and will benefit from the improved streetscape.'
      ]
    },
    'aqua-lodge-delivery': {
      date: 'March 19, 2026',
      title: 'Aqua Lodge Bocas delivers first 12 overwater bungalows',
      tag: 'Project update',
      body: [
        'Aqua Lodge Bocas handed keys to the first twelve owners of its overwater bungalow collection on Isla Bastimentos this week, marking the first major delivered product in Bocas del Toro\'s new generation of resort-residence development. The units sit on private dock systems in the Bahía Honda protected lagoon.',
        'All twelve delivered units have been enrolled in the project\'s rental management program. Occupancy in the first operational weeks has run above projections, with high-season weekends at full capacity.',
        'Phase II of Aqua Lodge — a second ring of bungalows and three beachfront villas — remains in pre-construction with reservations open. Delivery is targeted for Q1 2027.'
      ]
    },
    'coronado-sold-out': {
      date: 'March 11, 2026',
      title: 'Coronado reaches 100% reservation on three flagship projects',
      tag: 'Market',
      body: [
        'The three largest resort-residence projects in Coronado — Panama\'s closest major beach market to the capital — have each reached 100% reservation status, with waiting lists now the only entry point for prospective buyers. The milestone was confirmed by developer representatives across all three projects.',
        'Coronado\'s full absorption reflects a supply compression that has been building since 2023, when phase two releases were 60–70% reserved within weeks of announcement. Panama City buyers and returning expats have been the dominant purchaser profiles, with North American buyers making up roughly 30% of transactions.',
        'For buyers focused on the Pacific corridor, the alternative markets of Playa Blanca and San Carlos still carry available inventory at competitive pre-construction pricing. Both are represented in our current collection.'
      ]
    },
    'pedasi-water-plant': {
      date: 'February 27, 2026',
      title: 'Pedasí desalination plant commissioned — tripling potable water capacity',
      tag: 'Infrastructure',
      body: [
        'A new desalination plant serving Pedasí and the surrounding coastal zone was commissioned this week, tripling the town\'s potable water capacity. The project was funded jointly by the Panamanian Ministry of Public Works and a consortium of four resort-residential developers active on the Azuero Peninsula.',
        'Water supply constraints had been cited by developers as a factor limiting construction timelines in the Pedasí corridor. The new plant, with a capacity of 2,400 cubic meters per day, is designed to support both existing residential demand and projected growth through 2035.',
        'The infrastructure upgrade is a meaningful signal for the peninsula\'s development trajectory. Azuero Shores, the coastal project we represent in Pedasí, counts reliable potable water as a prerequisite for its long-term rental program operations.'
      ]
    },
    'boquete-trail-network': {
      date: 'February 14, 2026',
      title: 'Boquete Highlands municipality expands protected trail network by 340 hectares',
      tag: 'Regulatory',
      body: [
        'The Boquete municipality in Chiriquí province has voted to expand its protected cloud-forest trail network by 340 hectares, adding four new marked routes to the existing Sendero Los Quetzales system. The expansion creates contiguous protected access from the town center to the upper slopes of Volcán Barú.',
        'The move follows sustained growth in highland tourism and validates the outdoor-lifestyle positioning that has driven demand for Boquete residential product among North American and European buyers. The new routes include an accessible low-gradient loop designed for residents and visitors who are not technical hikers.',
        'Vista Verde Boquete, our highland project, sits at the trailhead of one of the newly designated routes. The proximity to protected forest is among the project\'s principal marketing points in conversations with buyers considering the highlands versus the coast.'
      ]
    },
    'q4-2025-absorption': {
      date: 'January 30, 2026',
      title: 'Q4 2025 absorption report: coastal inventory down 38% year over year',
      tag: 'Market',
      body: [
        'Panama\'s coastal residential inventory finished 2025 at a thirty-eight percent compression versus Q4 2024, according to data compiled from developer reservation records and notarized promise-of-sale filings reviewed by our market team. The tightest markets were Bocas del Toro (down 52%) and the Coronado strip (down 44%), where waiting lists have replaced public reservation windows.',
        'The pipeline remains active — forty-two coastal residential projects are in active permitted construction, per Ministry of Housing data. But the distribution of new supply has shifted materially toward secondary markets: Pedasí, Volcán and the outer Pacific islands now represent 38% of the permitted pipeline, versus 19% in 2022.',
        'For buyers tracking the market, the Q4 report is consistent with the advice we\'ve been giving since mid-2025: act in the secondary markets now, as the pattern of Coronado and Bocas compression tends to replicate in the markets that follow them by two to three years.'
      ]
    },
    'airport-tocumen-expansion': {
      date: 'January 21, 2026',
      title: 'Tocumen International opens Terminal 2 satellite concourse — capacity +40%',
      tag: 'Infrastructure',
      body: [
        'Tocumen International Airport inaugurated its Terminal 2 satellite concourse this week, adding twenty-two gates and increasing the airport\'s annual passenger capacity by approximately 40%. The expansion brings Tocumen\'s total gate count to 57 and adds dedicated busing facilities for regional and charter operations.',
        'The expansion is the latest phase of a multi-year capital program that has transformed Tocumen into the principal aviation hub for northern South America and Central America. Copa Airlines, which operates the majority of Tocumen\'s international routes, is the primary beneficiary of the new capacity.',
        'For Panama property buyers, the expanded connectivity reinforces the accessibility argument. Panama City is now within five hours of virtually every major North American city with a Copa connection — a fact that has measurable effect on second-home and investment buyer profiles.'
      ]
    },
    'wsj-panama-feature': {
      date: 'January 08, 2026',
      title: 'Wall Street Journal: "Why Panama is absorbing the spillover from Costa Rica"',
      tag: 'Press',
      body: [
        'The Wall Street Journal ran a feature story on Panama\'s real estate market on January 8, citing the country\'s growing role as a destination for buyers priced out of or otherwise redirected from Costa Rica. The piece interviewed buyers, developers and market observers across Panama City, Bocas del Toro and the Azuero Peninsula.',
        'The article\'s central thesis — that Panama\'s combination of dollarization, Friendly Nations Visa access, and lower base pricing versus comparable Costa Rican coastal markets is driving meaningful demand — is consistent with the trend we have observed in our own buyer inquiries since 2023.',
        'The Journal piece is behind a paywall at wsj.com. We have summarized the key market data points for clients who request it; contact us for the briefing.'
      ]
    },
    'new-tax-incentive': {
      date: 'December 18, 2025',
      title: 'National Assembly extends 20-year property tax exemption for new construction',
      tag: 'Regulatory',
      body: [
        'Panama\'s National Assembly voted on December 18 to extend the twenty-year property tax improvement exemption for new residential construction. The exemption, which applies to the improvement value of newly built structures, was previously set to step down in scope for permits issued after January 1, 2026. The extension maintains the full exemption for permits issued through December 31, 2028.',
        'For buyers of new-construction properties in Panama — the entirety of what we represent — the extension means that annual property tax exposure remains near zero for the first two decades of ownership. The exemption applies at the project level and is specified in the title documentation.',
        'The vote was 48 to 13. We have updated our tax primer to reflect the extension; the revised document is available on request.'
      ]
    },
    'palma-blanca-phase-i-sellout': {
      date: 'December 04, 2025',
      title: 'Palma Blanca Phase I records final sale — 100% delivered, 86% occupancy',
      tag: 'Project update',
      body: [
        'Grupo Mar Azul has confirmed the final sale in the Phase I collection of Palma Blanca Resort & Residences, completing a 100% delivery and sale of the project\'s 94-unit first phase. Phase I was delivered in stages between Q2 and Q4 2023.',
        'The project\'s rental management program reports 86% annualized occupancy across the Phase I units enrolled in the program — a figure that developer representatives describe as above initial projections. Average nightly rates have run 12% above the rate schedule included in Phase I reservation documents.',
        'Phase II is now in pre-construction with reservations open. The ground-breaking announcement is scheduled for early 2026. Buyers interested in Phase II units should note that Phase I performance data is available as part of the due diligence package we prepare for reservation clients.'
      ]
    },
    'bloomberg-retirement-index': {
      date: 'November 22, 2025',
      title: 'Bloomberg Retirement Index moves Panama into top 10 globally',
      tag: 'Press',
      body: [
        'Bloomberg\'s annual Retirement Destinations Index placed Panama in the global top 10 for the first time, citing healthcare infrastructure improvements, the continued strength of the Pensionado Visa program, and the city\'s expanding international connectivity. Panama ranked ninth overall and second in the Western Hemisphere behind Portugal.',
        'The Bloomberg index uses a composite methodology incorporating cost of living, healthcare access, political stability, tax environment and connectivity. Panama scored particularly strongly on tax environment — reflecting both the new-construction exemption and the absence of a remittance or foreign-income tax for most resident classifications.',
        'The index is published at bloomberg.com/retirement. The Panama chapter includes data on healthcare facilities and expat community size across Panama City, Boquete, Coronado and Bocas del Toro.'
      ]
    },
    'chiriqui-highway-open': {
      date: 'November 09, 2025',
      title: 'Pan-American Highway Chiriquí expansion opens — Boquete drive time cut to 5h',
      tag: 'Infrastructure',
      body: [
        'The Chiriquí expansion section of the Pan-American Highway was opened to full traffic on November 9, reducing the Panama City to Boquete drive time from approximately seven hours to just under five. The section covers 84 kilometers of widened and realigned road through the Coclé and Veraguas provinces.',
        'Travel time from Panama City to the Chiriquí highlands has been among the primary friction points for buyers considering Boquete property. The five-hour threshold is widely seen in real estate circles as a psychological barrier that meaningfully expands the pool of Boquete buyers relative to the coastal alternatives.',
        'Vista Verde Boquete\'s sales team reports a measurable uptick in inquiry volume since the opening, with buyers specifically mentioning the improved drive time as a factor in their consideration.'
      ]
    },
    'buoy-hurricane-corridor': {
      date: 'October 18, 2025',
      title: 'NOAA reaffirms Panama outside Atlantic hurricane corridor — 119 year record intact',
      tag: 'Market',
      body: [
        'NOAA\'s annual Atlantic hurricane season summary, published October 18, reaffirmed that Panama lies entirely outside the Atlantic basin hurricane corridor and has recorded zero direct hurricane strikes in 119 years of modern record-keeping. The 2025 season, which produced four major Atlantic hurricanes, produced no weather events of significance in Panama.',
        'Panama\'s geographic position — south of the traditional hurricane belt at roughly 8–9 degrees north latitude — is one of the country\'s least-discussed but most relevant property attributes for international buyers from the Gulf Coast, Florida and the Eastern Seaboard.',
        'Insurance costs for Panama coastal property reflect this reality: standard property insurance rates in Bocas del Toro and the Pacific coast run approximately 40–55% lower than comparable Caribbean island markets. We include insurance cost comparisons in the due diligence packages we prepare for clients.'
      ]
    }
  },

  testimonials: [
    { quote: 'The sunsets on the Pacific are worth the move alone. Our Palma Blanca unit pays for itself through the rental program.',
      name: 'Robert & Linda M.', from: 'Chicago → Playa Blanca' },
    { quote: 'I wanted the Caribbean without the bureaucracy of the US islands. Bocas gave me overwater living for a fraction of Belize.',
      name: 'James T.', from: 'Toronto → Bocas del Toro' },
    { quote: 'Pedasí feels like Costa Rica twenty years ago. The PREG team walked us through title, residency, and closing.',
      name: 'David & Sarah K.', from: 'Miami → Azuero' }
  ],

  faqs: [
    { q: 'Why only developer projects — no resales?',
      a: 'We represent new-construction and developer-direct units exclusively. No individual owner resales. That lets us guarantee pricing, title, reservation terms and delivery timelines — and stand behind every transaction.' },
    { q: 'How does a reservation work?',
      a: 'A refundable reservation deposit (typically $5,000–$15,000 USD) holds a specific unit for 30 days while you complete due diligence and sign the promise-of-sale. Funds go to the developer\'s escrow account, never to us.' },
    { q: 'Can I reserve remotely?',
      a: 'Yes — every project we represent supports remote reservation via DocuSign and wire. We coordinate a site visit at your pace, before or after reservation, refundable either way.' },
    { q: 'What languages do you work in?',
      a: 'English, Spanish, Portuguese and German — both sales team and closing documents.' }
  ]
};
