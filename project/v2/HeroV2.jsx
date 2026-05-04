/* ── HeroV2 — editorial hero with lifestyle trio (City/Beach/Mountain) ── */

function HeroV2() {
  const [hoveredCard, setHoveredCard] = React.useState(null);

  const handleLifestyleClick = (lifestyle) => {
    window.dispatchEvent(
      new CustomEvent('v2-lifestyle-filter', {
        detail: { lifestyle }
      })
    );
    // Smooth scroll to #projects
    const projectsEl = document.getElementById('projects');
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const lifestyleCards = [
    {
      key: 'city',
      counter: '01 / 03',
      label: 'City.',
      caption: 'Casco · Costa del Este'
    },
    {
      key: 'beach',
      counter: '02 / 03',
      label: 'Beach.',
      caption: 'Pacífico · Caribe · Pedasí'
    },
    {
      key: 'mountain',
      counter: '03 / 03',
      label: 'Mountain.',
      caption: 'Boquete · Volcán'
    }
  ];

  const stats = window.PANAMA_DATA?.stats || [
    { n: '24', l: 'Developer Projects' },
    { n: '12', l: 'Coastal Communities' },
    { n: '100%', l: 'USD · No FX Risk' },
    { n: '7+', l: 'Years in Panama' }
  ];

  return (
    <>
      <style>{`
        .v2-hero {
          padding-top: 100px;
          background-color: var(--cream);
          color: var(--ink);
        }

        .v2-hero-editorial-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.22em;
          color: var(--ink-mute);
          text-transform: uppercase;
          margin-bottom: clamp(40px, 6vw, 80px);
          padding: 0 var(--gutter);
        }

        .v2-hero-eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-mute);
          padding-bottom: 16px;
          border-bottom: 2px solid var(--coral);
          margin-bottom: 40px;
          padding-left: var(--gutter);
          padding-right: var(--gutter);
        }

        .v2-hero-headline {
          font-family: var(--font-display);
          font-size: clamp(56px, 9vw, 132px);
          font-weight: 300;
          line-height: 0.92;
          letter-spacing: -0.025em;
          color: var(--ink);
          margin-bottom: 24px;
          padding-left: var(--gutter);
          padding-right: var(--gutter);
        }

        .v2-hero-headline em {
          font-style: italic;
          color: var(--coral);
          font-weight: 400;
        }

        .v2-hero-headline .palm {
          color: var(--palm);
        }

        .v2-hero-motion-strip {
          width: 100%;
          height: 80px;
          background: linear-gradient(
            90deg,
            var(--coral),
            var(--cream),
            var(--coral)
          );
          background-size: 200% 100%;
          margin-bottom: 60px;
          animation: v2-hero-sweep 8s ease-in-out infinite;
        }

        @keyframes v2-hero-sweep {
          0% {
            background-position: 0% 0;
          }
          50% {
            background-position: 100% 0;
          }
          100% {
            background-position: 0% 0;
          }
        }

        .v2-hero-lifestyle-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 60px;
          padding-left: var(--gutter);
          padding-right: var(--gutter);
        }

        @media (max-width: 720px) {
          .v2-hero-lifestyle-container {
            grid-template-columns: 1fr;
          }
        }

        .v2-hero-lifestyle-card {
          display: flex;
          flex-direction: column;
          height: 220px;
          padding: 24px;
          background-color: var(--paper);
          border: 1px solid var(--line);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.4s var(--ease);
        }

        .v2-hero-lifestyle-card:hover {
          transform: translateY(-4px);
          border-color: var(--coral);
        }

        .v2-hero-lifestyle-card:hover .v2-hero-lifestyle-word {
          color: var(--coral);
        }

        .v2-hero-lifestyle-counter {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-mute);
          margin-bottom: auto;
        }

        .v2-hero-lifestyle-word {
          font-family: var(--font-display);
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 300;
          font-style: italic;
          color: var(--ink);
          line-height: 1;
          transition: color 0.4s var(--ease);
        }

        .v2-hero-lifestyle-caption {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-mute);
          margin-top: auto;
          padding-top: 12px;
        }

        .v2-hero-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 60px;
          padding-left: var(--gutter);
          padding-right: var(--gutter);
        }

        @media (max-width: 720px) {
          .v2-hero-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .v2-hero-stat {
          text-align: center;
        }

        .v2-hero-stat-number {
          font-family: var(--font-display);
          font-size: clamp(32px, 5vw, 64px);
          font-weight: 300;
          color: var(--ink);
          line-height: 1;
          margin-bottom: 8px;
        }

        .v2-hero-stat-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-mute);
        }

        .v2-hero-cta-row {
          display: flex;
          gap: 16px;
          padding-left: var(--gutter);
          padding-right: var(--gutter);
          padding-bottom: 100px;
        }

        @media (max-width: 720px) {
          .v2-hero-cta-row {
            flex-direction: column;
          }
        }

        .btn {
          padding: 14px 24px;
          border-radius: 8px;
          font-family: 'Manrope', sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s var(--ease);
          border: 1px solid transparent;
          display: inline-block;
        }

        .btn-coral {
          background-color: var(--coral);
          color: white;
        }

        .btn-coral:hover {
          background-color: var(--coral-deep);
        }

        .btn-ghost {
          background-color: transparent;
          color: var(--ink);
          border-color: var(--line);
        }

        .btn-ghost:hover {
          border-color: var(--ink);
          background-color: var(--line-soft);
        }
      `}</style>

      <section className="v2-hero">
        {/* Editorial top bar */}
        <div className="v2-hero-editorial-bar">
          <span>VOL. VII · 2026</span>
          <span>8°58'N · 79°32'W</span>
          <span>THE ISTHMUS QUARTERLY</span>
        </div>

        {/* Eyebrow */}
        <div className="v2-hero-eyebrow">
          ▬ DEVELOPER-DIRECT · 24 PROJECTS · RESERVATIONS OPEN
        </div>

        {/* Headline with italic coral emphasis */}
        <h1 className="v2-hero-headline">
          Two oceans.
          <br />
          <em>One country</em>
          <br />
          <span className="palm">worth owning.</span>
        </h1>

        {/* Subtle motion strip */}
        <div className="v2-hero-motion-strip" />

        {/* Lifestyle trio cards */}
        <div className="v2-hero-lifestyle-container">
          {lifeStyleCards.map((card) => (
            <div
              key={card.key}
              className="v2-hero-lifestyle-card"
              onMouseEnter={() => setHoveredCard(card.key)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleLifestyleClick(card.key)}
            >
              <div className="v2-hero-lifestyle-counter">{card.counter}</div>
              <div className="v2-hero-lifestyle-word">{card.label}</div>
              <div className="v2-hero-lifestyle-caption">{card.caption}</div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="v2-hero-stats">
          {stats.map((stat, idx) => (
            <div key={idx} className="v2-hero-stat">
              <div className="v2-hero-stat-number">{stat.n}</div>
              <div className="v2-hero-stat-label">{stat.l}</div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="v2-hero-cta-row">
          <a className="btn btn-coral" href="#book-consultation">
            Reserve a unit →
          </a>
          <a className="btn btn-ghost" href="#projects">
            Browse 24 projects
          </a>
        </div>
      </section>
    </>
  );
}
