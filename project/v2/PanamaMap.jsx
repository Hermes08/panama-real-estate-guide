/* ── PanamaMap — interactive 5-region SVG with hover tooltips and dispatched filter events ── */
function PanamaMap() {
  const [hovered, setHovered] = useState(null);

  const regions = (window.PANAMA_DATA && window.PANAMA_DATA.regions) || [];
  const byId = (id) => regions.find(r => r.id === id) || {};

  const pins = [
    { id: 'caribbean', x: 200, y: 150, name: 'Bocas del Toro',          tag: 'CARIBBEAN' },
    { id: 'highlands', x: 250, y: 300, name: 'Boquete · Volcán',        tag: 'HIGHLANDS' },
    { id: 'azuero',    x: 520, y: 480, name: 'Pedasí · Las Tablas',     tag: 'AZUERO' },
    { id: 'pacific',   x: 600, y: 380, name: 'Coronado · Playa Blanca', tag: 'PACIFIC' },
    { id: 'city',      x: 820, y: 340, name: 'Panama City · Casco',     tag: 'CITY' },
  ];

  const onPinClick = (id) => {
    window.dispatchEvent(new CustomEvent('v2-region-filter', { detail: { regionId: id } }));
    const el = document.querySelector('#projects');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="panama-map" style={{
      background: 'var(--ink)', color: 'var(--cream)',
      paddingTop: 100, paddingBottom: 100, position: 'relative', overflow: 'hidden'
    }}>
      <style>{`
        .v2-map-pulse { transform-origin: center; transform-box: fill-box; animation: v2MapPulse 2.6s var(--ease) infinite; }
        @keyframes v2MapPulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.6); opacity: 0; } }
        .v2-map-pin { cursor: pointer; outline: none; }
        .v2-map-pin:hover .v2-map-pin-outer,
        .v2-map-pin:focus .v2-map-pin-outer { stroke: var(--coral); fill: var(--coral); }
        .v2-map-pin:hover .v2-map-pin-label,
        .v2-map-pin:focus .v2-map-pin-label { fill: var(--coral); text-decoration: underline; text-underline-offset: 4px; }
        .v2-map-marquee { display: flex; white-space: nowrap; animation: v2MapMarquee 28s linear infinite; }
        .v2-map-marquee:hover { animation-play-state: paused; }
        @keyframes v2MapMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (max-width: 720px) {
          .v2-map-tooltip { left: 50% !important; top: auto !important; bottom: 60px !important; transform: translateX(-50%) !important; }
        }
      `}</style>

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 720, margin: '0 auto 56px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'rgba(255,249,236,0.6)', marginBottom: 22,
          display: 'inline-flex', alignItems: 'center', gap: 12
        }}>
          <span style={{ width: 28, height: 1, background: 'var(--coral)' }} />
          Five coasts · One country
        </div>
        <h2 className="display" style={{
          fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 0.96,
          margin: '0 0 18px', color: 'var(--cream)', letterSpacing: '-0.02em'
        }}>
          Hover the map. <em style={{ color: 'var(--coral)', fontStyle: 'italic', fontWeight: 300 }}>Find your shoreline.</em>
        </h2>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.05em',
          color: 'rgba(255,249,236,0.6)', margin: 0
        }}>
          Five regions, twenty-four developer projects. Every coordinate verified.
        </p>
      </div>

      <div style={{
        position: 'relative', maxWidth: 1100, margin: '0 auto',
        border: '1px solid rgba(255,249,236,0.15)', borderRadius: 24,
        overflow: 'hidden', aspectRatio: '16/9', background: 'rgba(255,249,236,0.02)'
      }}>
        <svg viewBox="0 0 1100 620" style={{ width: '100%', height: '100%', display: 'block' }}>
          {/* sea labels */}
          <text x="550" y="40" textAnchor="middle" style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em',
            fill: 'rgba(255,249,236,0.4)', textTransform: 'uppercase'
          }}>Caribbean Sea</text>
          <text x="550" y="600" textAnchor="middle" style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em',
            fill: 'rgba(255,249,236,0.4)', textTransform: 'uppercase'
          }}>Pacific Ocean</text>

          {/* stylized Panama silhouette — wavy C-curve, not geographically accurate */}
          <path
            d="M 80,300 C 200,180 380,220 520,260 C 660,300 800,240 940,290 C 1000,310 1040,360 1020,420 C 880,490 720,440 560,460 C 380,480 220,520 140,460 C 80,420 60,360 80,300 Z"
            fill="rgba(255,249,236,0.04)"
            stroke="rgba(255,249,236,0.18)"
            strokeWidth="1.5"
          />
          {/* suggested coastline */}
          <path d="M 100,330 C 240,250 420,290 560,320 C 700,350 860,310 980,340"
                fill="none" stroke="rgba(255,107,74,0.18)" strokeWidth="1" strokeDasharray="2,4" />
          <path d="M 120,420 C 260,460 440,440 600,430 C 760,420 880,440 980,400"
                fill="none" stroke="rgba(31,196,196,0.15)" strokeWidth="1" strokeDasharray="2,4" />

          {/* pins */}
          {pins.map((p, i) => (
            <g key={p.id}
               className="v2-map-pin"
               tabIndex={0}
               aria-label={`Filter by ${p.name}`}
               onMouseEnter={() => setHovered(p.id)}
               onMouseLeave={() => setHovered(null)}
               onFocus={() => setHovered(p.id)}
               onBlur={() => setHovered(null)}
               onClick={() => onPinClick(p.id)}
               onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPinClick(p.id); } }}>
              {/* pulsing ring */}
              <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="var(--coral)" strokeWidth="1"
                      className="v2-map-pulse" style={{ animationDelay: `${i * 0.5}s` }} />
              <circle className="v2-map-pin-outer" cx={p.x} cy={p.y} r="14"
                      fill="var(--ink)" stroke="var(--coral)" strokeWidth="1.5"
                      style={{ transition: 'all 0.3s var(--ease)' }} />
              <circle cx={p.x} cy={p.y} r="5" fill="var(--coral)" />
              <text className="v2-map-pin-label"
                    x={p.x} y={p.y + 32} textAnchor="middle"
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
                      fill: 'var(--cream)', textTransform: 'uppercase',
                      transition: 'all 0.3s var(--ease)', pointerEvents: 'none'
                    }}>{p.tag}</text>
            </g>
          ))}
        </svg>

        {/* tooltip */}
        {hovered && (() => {
          const p = pins.find(x => x.id === hovered);
          const r = byId(hovered);
          const onRight = p.x > 770;
          const tooltipLeftPct = onRight ? `calc(${(p.x / 1100) * 100}% - 260px)` : `calc(${(p.x / 1100) * 100}% + 30px)`;
          const tooltipTopPct = `calc(${(p.y / 620) * 100}% - 60px)`;
          return (
            <div className="v2-map-tooltip" style={{
              position: 'absolute', left: tooltipLeftPct, top: tooltipTopPct,
              width: 240, background: 'var(--paper)', color: 'var(--ink)',
              border: '1px solid var(--line)', borderRadius: 14, padding: 18,
              boxShadow: '0 24px 48px -16px rgba(0,0,0,0.4)',
              pointerEvents: 'none', zIndex: 5
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
                color: 'var(--coral-deep)', textTransform: 'uppercase', marginBottom: 8
              }}>{r.name || p.name}</div>
              <div className="display" style={{
                fontSize: 22, lineHeight: 1.05, marginBottom: 8, color: 'var(--ink)'
              }}>{r.sub || p.name}</div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '8px 0 12px', lineHeight: 1.5 }}>
                {r.blurb || ''}
              </p>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
                color: 'var(--coral-deep)', textTransform: 'uppercase'
              }}>{r.count || ''} projects →</div>
            </div>
          );
        })()}
      </div>

      {/* marquee strip */}
      <div style={{ marginTop: 56, overflow: 'hidden', borderTop: '1px solid rgba(255,249,236,0.1)', borderBottom: '1px solid rgba(255,249,236,0.1)', padding: '24px 0' }}>
        <div className="v2-map-marquee" style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(22px, 3vw, 34px)', color: 'rgba(255,249,236,0.4)',
          gap: 28, letterSpacing: '-0.01em'
        }}>
          {[...Array(2)].map((_, j) => (
            <div key={j} style={{ display: 'flex', gap: 28, paddingRight: 28 }}>
              {['Bocas del Toro','Boquete','Pedasí','Coronado','Casco Viejo','Costa del Este','Punta Pacífica','Volcán','Las Tablas','Playa Blanca'].map((n, i) => (
                <React.Fragment key={i}>
                  <span>{n}</span>
                  <span style={{ color: 'var(--coral)' }}>·</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
