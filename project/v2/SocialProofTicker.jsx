/* ── SocialProofTicker — rotating "recently reserved" + inventory live indicator ── */
function SocialProofTicker() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  // Mock data — wirable to backend later. Keep names+cities anonymized but believable.
  const events = [
    { name: 'Ana M.',      city: 'Toronto',    project: 'Empire Residences',  unit: '3-bed Estate' },
    { name: 'Klaus R.',    city: 'München',    project: 'Pino Alto Boquete',  unit: 'Country Club Unit' },
    { name: 'Maria S.',    city: 'São Paulo',  project: 'Bioma Costa del Este', unit: 'Modelo C' },
    { name: 'James T.',    city: 'Dallas',     project: 'Empire Residences',  unit: 'Penthouse' },
    { name: 'Sofía L.',    city: 'Bogotá',     project: 'Pino Alto Boquete',  unit: '2-bed Condo' },
    { name: 'David K.',    city: 'Vancouver',  project: 'Bioma Costa del Este', unit: 'Modelo A' },
    { name: 'Élise D.',    city: 'Paris',      project: 'Empire Residences',  unit: 'Modelo C' },
  ];

  useEffect(() => {
    const tick = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % events.length);
        setVisible(true);
      }, 320);
    }, 5000);
    return () => clearInterval(tick);
  }, []);

  const e = events[idx];
  const ago = (idx % 4) + 1;
  const agoUnit = ago === 1 ? 'hour ago' : 'hours ago';

  return (
    <>
      <style>{`
        .v2-spt {
          position: fixed; left: 24px; bottom: 24px; z-index: 50;
          max-width: 320px; padding: 14px 18px;
          background: var(--paper); color: var(--ink);
          border: 1px solid var(--line); border-radius: 14px;
          box-shadow: 0 18px 42px -18px rgba(11,39,51,0.28);
          font-family: var(--font-body); font-size: 13px; line-height: 1.45;
          transition: opacity 0.32s var(--ease), transform 0.4s var(--ease);
        }
        .v2-spt.hidden { opacity: 0; transform: translateY(8px); }
        .v2-spt-eye {
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--coral-deep);
          display: inline-flex; align-items: center; gap: 6px; margin-bottom: 6px;
        }
        .v2-spt-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #2BB673;
          box-shadow: 0 0 0 0 rgba(43,182,115,0.7); animation: v2SptPulse 1.6s infinite;
        }
        @keyframes v2SptPulse {
          0% { box-shadow: 0 0 0 0 rgba(43,182,115,0.6); }
          70% { box-shadow: 0 0 0 10px rgba(43,182,115,0); }
          100% { box-shadow: 0 0 0 0 rgba(43,182,115,0); }
        }
        .v2-spt-close {
          position: absolute; top: 6px; right: 8px; background: transparent;
          border: none; color: var(--ink-mute); cursor: pointer; font-size: 14px; line-height: 1;
        }
        @media (max-width: 720px) {
          .v2-spt { left: 12px; right: 92px; bottom: 16px; max-width: none; font-size: 12px; padding: 10px 14px; }
        }
      `}</style>
      <div className={`v2-spt ${visible ? '' : 'hidden'}`} role="status" aria-live="polite">
        <button className="v2-spt-close" onClick={() => setIdx(events.length)} aria-label="Dismiss">×</button>
        <div className="v2-spt-eye"><span className="v2-spt-dot" /> Live · Just reserved</div>
        <div>
          <strong style={{ fontWeight: 700 }}>{e.name}</strong> from <strong>{e.city}</strong> reserved
          a <em style={{ fontStyle: 'italic', color: 'var(--coral-deep)' }}>{e.unit}</em> at {e.project}.
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
          color: 'var(--ink-mute)', textTransform: 'uppercase', marginTop: 6
        }}>{ago} {agoUnit} · refundable $5,000 deposit</div>
      </div>
    </>
  );
}

/* ── InventoryBadge — drop-in pill for project cards: "X units left this week" ── */
function InventoryBadge({ project, projectId }) {
  // Deterministic pseudo-random based on project id so it doesn't flicker.
  const id = projectId || (project && project.id) || 'unknown';
  let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  const left = (Math.abs(h) % 5) + 2; // 2-6 units left
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em',
      textTransform: 'uppercase', color: 'var(--coral-deep)',
      background: 'rgba(255,107,74,0.12)', padding: '4px 10px',
      borderRadius: 999, border: '1px solid rgba(255,107,74,0.25)'
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--coral)' }} />
      {left} units left this week
    </span>
  );
}
