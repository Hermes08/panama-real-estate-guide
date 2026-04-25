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
