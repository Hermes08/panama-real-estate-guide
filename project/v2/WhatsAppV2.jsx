/* ── WhatsAppV2 — concierge sticky with name + response promise + ES/EN flag ── */
function WhatsAppV2() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);

  // Auto-stop pulse after 12s so it doesn't annoy
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 12000);
    return () => clearTimeout(t);
  }, []);

  // Hardcoded correct per memory — live data.js still has stale 6761-0315 number
  const wa = 'https://wa.me/50762534802';
  const phone = '+507 6253-4802';

  const presets = [
    { lang: 'EN', text: "Hi Carlos — I'm exploring properties in Panama and would like a few options that fit my timeline." },
    { lang: 'ES', text: "Hola Carlos — estoy explorando propiedades en Panamá y me gustaría ver opciones que se ajusten a mi tiempo." },
    { lang: 'PT', text: "Olá Carlos — estou explorando imóveis no Panamá e gostaria de ver opções que se encaixem no meu prazo." },
    { lang: 'DE', text: "Hallo Carlos — ich erkunde Immobilien in Panama und möchte Optionen sehen, die zu meinem Zeitrahmen passen." },
  ];

  const sendPreset = (text) => {
    const url = `${wa}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <>
      <style>{`
        .v2-wa-fab {
          position: fixed; right: 22px; bottom: 22px; z-index: 60;
          display: inline-flex; align-items: center; gap: 12px;
          padding: 12px 18px 12px 14px; border-radius: 999px;
          background: #25D366; color: #ffffff;
          border: 2px solid #ffffff;
          box-shadow: 0 18px 36px -10px rgba(37, 211, 102, 0.55), 0 8px 18px -6px rgba(0,0,0,0.18);
          font-family: var(--font-body); font-weight: 600; font-size: 13.5px;
          cursor: pointer; transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
        }
        .v2-wa-fab:hover { transform: translateY(-2px); box-shadow: 0 24px 48px -10px rgba(37, 211, 102, 0.7); }
        .v2-wa-fab.pulse::after {
          content: ''; position: absolute; inset: -6px; border-radius: 999px;
          border: 2px solid #25D366; opacity: 0.6;
          animation: v2WaPulse 2.2s var(--ease) infinite;
        }
        @keyframes v2WaPulse {
          0% { transform: scale(0.96); opacity: 0.6; }
          100% { transform: scale(1.18); opacity: 0; }
        }
        .v2-wa-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: #ffffff url('https://api.dicebear.com/7.x/initials/svg?seed=Carlos&backgroundColor=FF6B4A&textColor=ffffff') center/cover;
          flex-shrink: 0; border: 1.5px solid rgba(255,255,255,0.6);
        }
        .v2-wa-meta { display: flex; flex-direction: column; line-height: 1.15; text-align: left; }
        .v2-wa-name { font-weight: 700; font-size: 13px; }
        .v2-wa-promise { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; opacity: 0.85; margin-top: 2px; }
        .v2-wa-panel {
          position: fixed; right: 22px; bottom: 88px; z-index: 60;
          width: 320px; max-width: calc(100vw - 44px);
          background: var(--paper); color: var(--ink);
          border: 1px solid var(--line); border-radius: 18px;
          box-shadow: 0 30px 60px -20px rgba(11,39,51,0.4);
          padding: 18px; animation: v2WaIn 0.32s var(--ease) both;
        }
        @keyframes v2WaIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .v2-wa-panel-head { display: flex; align-items: center; gap: 12px; padding-bottom: 14px; border-bottom: 1px solid var(--line-soft); margin-bottom: 14px; }
        .v2-wa-preset {
          display: block; width: 100%; text-align: left;
          background: transparent; border: 1px solid var(--line);
          padding: 12px 14px; border-radius: 12px; cursor: pointer;
          margin-bottom: 8px; font-family: var(--font-body); font-size: 13px;
          color: var(--ink); transition: all 0.25s var(--ease);
        }
        .v2-wa-preset:hover { border-color: var(--coral); background: rgba(255,107,74,0.05); transform: translateX(2px); }
        .v2-wa-preset .v2-wa-flag {
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.16em;
          color: var(--coral-deep); margin-right: 8px;
        }
        .v2-wa-close {
          position: absolute; top: 10px; right: 12px; background: transparent;
          border: none; color: var(--ink-mute); cursor: pointer; font-size: 18px;
        }
        @media (max-width: 720px) {
          .v2-wa-fab { padding: 10px 14px 10px 10px; font-size: 12px; }
          .v2-wa-promise { display: none; }
          .v2-wa-panel { right: 12px; left: 12px; bottom: 78px; width: auto; }
        }
      `}</style>

      {open && (
        <div className="v2-wa-panel" role="dialog" aria-label="Talk to Carlos on WhatsApp">
          <button className="v2-wa-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
          <div className="v2-wa-panel-head">
            <div className="v2-wa-avatar" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Carlos · Concierge</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
                color: 'var(--ink-mute)', textTransform: 'uppercase', marginTop: 3
              }}>Online · Replies in ~5 min</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 14px', lineHeight: 1.5 }}>
            Pick a starting line below — Carlos will reply on WhatsApp in your language.
          </p>
          {presets.map(p => (
            <button key={p.lang} className="v2-wa-preset" onClick={() => sendPreset(p.text)}>
              <span className="v2-wa-flag">{p.lang}</span>
              {p.text}
            </button>
          ))}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em',
            color: 'var(--ink-mute)', textTransform: 'uppercase', textAlign: 'center', marginTop: 6
          }}>
            {phone} · No spam, no auto-bots
          </div>
        </div>
      )}

      <button
        className={`v2-wa-fab ${pulse && !open ? 'pulse' : ''}`}
        onClick={() => { setOpen(o => !o); setPulse(false); }}
        aria-label="Open WhatsApp concierge"
        style={{ position: 'fixed', right: 22, bottom: 22 }}>
        <span className="v2-wa-avatar" />
        <span className="v2-wa-meta">
          <span className="v2-wa-name">Talk to Carlos</span>
          <span className="v2-wa-promise">Replies in 5 min · ES/EN/PT/DE</span>
        </span>
      </button>
    </>
  );
}
