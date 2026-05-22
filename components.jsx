// Components — Panama Real Estate Guide (logo Variant H + mobile-first nav + lang switcher)
const { useState, useEffect, useRef } = React;

/* ── Icons ── */
function Icon({ name, size = 18, sw = 1.5 }) {
  const P = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    arrowS: <><path d="M7 17 17 7"/><path d="M8 7h9v9"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    close: <><path d="M6 6l12 12"/><path d="M18 6 6 18"/></>,
    chev: <><path d="m6 9 6 6 6-6"/></>,
    chevR: <><path d="m9 6 6 6-6 6"/></>,
    pin: <><path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></>,
    play: <><path d="M8 5v14l11-7Z"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    beach: <><circle cx="6" cy="6" r="3"/><path d="M6 9v12"/><path d="M3 21h18"/><path d="m9 14 8-4"/></>,
    marina: <><path d="M12 3v13"/><path d="M5 9h14"/><path d="M4 17c2 1 3 2 8 2s6-1 8-2l-2-4H6Z"/></>,
    concierge: <><circle cx="12" cy="8" r="3"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/></>,
    pool: <><path d="M3 15c2 1 3-1 5 0s3-1 5 0 3-1 5 0 3-1 5 0"/><path d="M3 20c2 1 3-1 5 0s3-1 5 0 3-1 5 0 3-1 5 0"/><path d="M7 14V5a2 2 0 0 1 4 0v8"/><path d="M13 14V5a2 2 0 0 1 4 0v8"/></>,
    security: <><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6Z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    wave: <><path d="M3 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {P[name] || null}
    </svg>
  );
}

/* ── Logo · Variant H (ink-block bookends + coral .com sticker) ── */
function Logo({ onDark = false, size = 22 }) {
  const tldSize = Math.round(size * 0.84);
  const blockColor = onDark ? 'var(--cream)' : 'var(--ink)';
  const blockText = onDark ? 'var(--ink)' : 'var(--paper)';
  const middleColor = onDark ? 'var(--cream)' : 'var(--ink)';
  const shadowColor = onDark ? 'var(--cream)' : 'var(--ink)';

  return (
    <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
       aria-label="PanamaRealEstateGuide.com"
       style={{
         display: 'inline-flex', alignItems: 'center', textDecoration: 'none',
         fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: size,
         letterSpacing: 0, color: middleColor, whiteSpace: 'nowrap', lineHeight: 1
       }}>
      <span style={{ background: blockColor, color: blockText, padding: '2px 6px', borderRadius: 3, fontWeight: 800 }}>Panama</span>
      <span style={{ fontWeight: 300, opacity: 0.6, margin: '0 4px' }}>RealEstate</span>
      <span style={{ background: blockColor, color: blockText, padding: '2px 6px', borderRadius: 3, fontWeight: 800 }}>Guide</span>
      <span style={{
        display: 'inline-block', marginLeft: 8, padding: '4px 10px',
        background: 'var(--coral)', color: 'var(--paper)',
        fontWeight: 900, fontSize: tldSize,
        transform: 'rotate(-2deg)', borderRadius: 4,
        boxShadow: `3px 3px 0 ${shadowColor}`
      }}>.com</span>
    </a>
  );
}

/* ── Language switcher ── */
function LangSwitcher({ current = 'EN', onChange, onDark = false }) {
  const [open, setOpen] = useState(false);
  const langs = window.PANAMA_DATA.langs;
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        background: 'transparent', border: onDark ? '1px solid rgba(255,249,236,0.3)' : '1px solid var(--line)',
        color: 'inherit', padding: '8px 12px', borderRadius: 999, cursor: 'pointer',
        fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
        display: 'inline-flex', alignItems: 'center', gap: 8
      }}>
        <Icon name="globe" size={13}/> {current}
        <Icon name="chev" size={11}/>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 160,
          background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 8,
          padding: 6, boxShadow: '0 20px 40px -16px rgba(0,0,0,0.2)', zIndex: 60, color: 'var(--ink)'
        }}>
          {langs.map(l => (
            <button key={l.code} onClick={() => { onChange?.(l.code); setOpen(false); }} style={{
              display: 'flex', justifyContent: 'space-between', width: '100%',
              padding: '10px 12px', background: current === l.code ? 'rgba(255,107,74,0.1)' : 'transparent',
              border: 'none', color: current === l.code ? 'var(--coral-deep)' : 'var(--ink)',
              cursor: 'pointer', fontSize: 13, borderRadius: 4, alignItems: 'center'
            }}>
              <span>{l.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.6 }}>{l.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Navbar ── */
function Navbar({ transparent }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('EN');
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const isDark = transparent && !scrolled;
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: isDark ? 'transparent' : 'rgba(255, 253, 245, 0.88)',
      backdropFilter: scrolled ? 'blur(14px) saturate(1.2)' : 'none',
      borderBottom: scrolled ? '1px solid var(--line-soft)' : '1px solid transparent',
      color: isDark ? 'var(--cream)' : 'var(--ink)', transition: 'all 0.4s var(--ease)'
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 72, gap: 16
      }}>
        <Logo onDark={isDark} size={18}/>
        <nav className="nav-desktop" style={{ display: 'flex', gap: 28, fontSize: 13, fontWeight: 500 }}>
        {['Projects', 'Regions', 'Journal', 'News', 'Residency', 'About'].map(l => {
          const href = l === 'Projects' ? 'projects/palma-blanca.html'
                     : l === 'Journal' ? 'articles/2026-outlook.html'
                     : l === 'News' ? 'news/palma-blanca-phase-ii.html'
                     : `#${l.toLowerCase()}`;
          return <a key={l} href={href} style={{ color: 'inherit', textDecoration: 'none', opacity: 0.9 }}>{l}</a>;
        })}
        </nav>
        <div className="nav-cta-desktop" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <LangSwitcher current={lang} onChange={setLang} onDark={isDark}/>
          <a href="#reserve" className="btn btn-coral" style={{ padding: '11px 20px', fontSize: 11 }}>
            Reserve a unit <Icon name="arrow" size={13}/>
          </a>
        </div>
        <button className="nav-burger" onClick={() => setOpen(!open)}
          style={{ display: 'none', background: 'transparent', border: 'none', color: 'inherit', padding: 8, cursor: 'pointer' }}>
          <Icon name={open ? 'close' : 'menu'} size={22}/>
        </button>
      </div>
      {open && (
        <div className="show-mobile" style={{
          padding: '20px var(--gutter) 28px', background: 'var(--paper)', color: 'var(--ink)',
          borderTop: '1px solid var(--line-soft)', display: 'flex', flexDirection: 'column', gap: 14
        }}>
          {['Projects', 'Regions', 'Journal', 'News', 'Residency', 'About'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
               style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: 'var(--ink)', textDecoration: 'none' }}>{l}</a>
          ))}
          <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <LangSwitcher current={lang} onChange={setLang}/>
            <a href="#reserve" className="btn btn-coral" style={{ flex: 1, justifyContent: 'center' }}>Reserve a unit</a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Hero — Subtle rainforest + canal + toucan (restrained, not overwhelming) ── */
function Hero() {
  const canvasRef = useRef();
  useEffect(() => {
    if (!canvasRef.current) return;
    const s = window.RainforestScene(canvasRef.current);
    return () => s.stop();
  }, []);
  return (
    <section style={{
      position: 'relative', paddingTop: 100, paddingBottom: 40,
      background: 'var(--cream)', color: 'var(--ink)', overflow: 'hidden'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-grid" style={{
          display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center', minHeight: '72vh'
        }}>
          {/* Left — copy */}
          <div>
            <div className="eyebrow reveal in" style={{ marginBottom: 22 }}>
              <span className="rule-coral"></span>
              Developer-direct · Reservations open · 2026
            </div>

            <h1 className="display reveal in d1" style={{
              fontSize: 'clamp(44px, 6.5vw, 92px)',
              margin: '0 0 34px', maxWidth: '14ch', lineHeight: 1.0, paddingBottom: '0.14em'
            }}>
              Between two <em style={{ color: 'var(--palm)' }}>oceans,</em><br/>
              under one <em style={{ color: 'var(--coral)' }}>canopy.</em>
            </h1>

            <p className="lede reveal in d2" style={{ marginBottom: 32, maxWidth: '48ch' }}>
              We represent Panama's best developer projects — Caribbean overwater,
              Pacific resorts, colonial heritage and highland retreats. New-construction
              only. Reserve your unit with a refundable deposit from $5,000.
            </p>

            <div className="reveal in d3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <a href="#reserve" className="btn btn-coral">Reserve a unit <Icon name="arrow" size={14}/></a>
              <a href="#projects" className="btn btn-ghost">
                Browse 24 projects
              </a>
            </div>

            {/* inline stats row */}
            <div className="reveal in d3" style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18,
              paddingTop: 28, borderTop: '1px solid var(--line)', maxWidth: 560
            }}>
              {window.PANAMA_DATA.stats.map((s, i) => (
                <div key={i}>
                  <div className="display" style={{ fontSize: 28, lineHeight: 1, margin: 0 }}>{s.n}</div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 8 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — WebGL rainforest panel (ambient, restrained) */}
          <div className="reveal in d2" style={{
            position: 'relative', aspectRatio: '4/5', borderRadius: 18, overflow: 'hidden',
            border: '1px solid var(--line)', boxShadow: '0 30px 60px -24px rgba(11,39,51,0.25)'
          }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }}/>
            {/* soft cream vignette to blend into page */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(120% 80% at 50% 100%, rgba(255,249,236,0.35), transparent 60%)'
            }}/>
            {/* minimal label */}
            <div style={{
              position: 'absolute', top: 16, left: 16,
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
              color: 'var(--palm-deep)', textTransform: 'uppercase', opacity: 0.8,
              background: 'rgba(255,249,236,0.8)', padding: '5px 10px', borderRadius: 999
            }}>
              Panama · Rainforest &amp; canal
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; min-height: auto !important; gap: 28px !important; }
          .hero-grid > div:last-child { aspect-ratio: 5/4 !important; order: -1; }
        }
      `}</style>
    </section>
  );
}

/* ── Hero (Editorial variant) — magazine-style with giant wordmark headline + featured project card ── */
function HeroEditorial() {
  const featured = window.PANAMA_DATA.projects[0]; // Palma Blanca
  const news = window.PANAMA_DATA.news.slice(0, 3);
  const jaguarRef = React.useRef();

  React.useEffect(() => {
    let scene, cancelled = false;
    let tries = 0;
    const tryStart = () => {
      if (cancelled) return;
      if (jaguarRef.current && window.JaguarScene) {
        scene = window.JaguarScene(jaguarRef.current);
      } else if (tries++ < 80) {
        setTimeout(tryStart, 120); // wait up to ~10s for the ES module to load
      }
    };
    tryStart();
    return () => { cancelled = true; if (scene) scene.stop(); };
  }, []);

  return (
    <section style={{
      position: 'relative', paddingTop: 100, paddingBottom: 60,
      background: 'var(--cream)', color: 'var(--ink)', overflow: 'hidden'
    }}>
      {/* Editorial metadata row — issue number, date, location */}
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--ink-mute)', fontWeight: 600,
          paddingBottom: 18, marginBottom: 36, borderBottom: '1px solid var(--line)',
          flexWrap: 'wrap', gap: 16
        }}>
          <span>Vol. VII · 2026</span>
          <span className="hide-mobile">8°58′N · 79°32′W</span>
          <span>The Isthmus Quarterly</span>
        </div>

        {/* Enormous wordmark headline */}
        <div style={{ position: 'relative', marginBottom: 48 }}>
          <div className="eyebrow reveal in" style={{ marginBottom: 28 }}>
            <span className="rule-coral"></span>
            Developer-direct · 24 projects · Reservations open
          </div>
          <h1 className="display reveal in d1" style={{
            fontSize: 'clamp(72px, 13vw, 200px)',
            margin: 0, lineHeight: 0.82, letterSpacing: '-0.05em',
            paddingBottom: '0.06em', fontWeight: 300
          }}>
            Two oceans.<br/>
            <em style={{ color: 'var(--coral)', fontWeight: 300 }}>One country</em><br/>
            <span style={{ color: 'var(--palm)' }}>worth owning.</span>
          </h1>
        </div>

        {/* 3-column editorial grid: dek · featured project · news rail */}
        <div className="hero-ed-grid" style={{
          display: 'grid', gridTemplateColumns: '1.1fr 1.3fr 1fr', gap: 48,
          borderTop: '1px solid var(--line)', paddingTop: 40
        }}>
          {/* Left — dek + CTAs */}
          <div className="reveal in d2">
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--coral-deep)', fontWeight: 700, marginBottom: 14
            }}>
              The dek
            </div>
            <p style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300,
              fontSize: 'clamp(18px, 1.8vw, 23px)', lineHeight: 1.45,
              color: 'var(--ink)', margin: 0, textWrap: 'pretty', maxWidth: '28ch'
            }}>
              The definitive registry of developer-direct new construction across Panama's Caribbean, Pacific, Azuero and highland coasts. No resales. No mystery owners. Refundable reservations from $5,000.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 28 }}>
              <a href="#reserve" className="btn btn-coral">Reserve a unit <Icon name="arrow" size={14}/></a>
              <a href="#projects" className="btn btn-ghost">Browse 24 projects</a>
            </div>

            {/* stats strip */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginTop: 36,
              paddingTop: 24, borderTop: '1px solid var(--line)'
            }}>
              {window.PANAMA_DATA.stats.map((s, i) => (
                <div key={i}>
                  <div className="display" style={{ fontSize: 32, lineHeight: 1, margin: 0, color: 'var(--ocean-deep)' }}>{s.n}</div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 8 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Center — featured project "cover story" */}
          <a href={`projects/${featured.id}.html`} className="reveal in d3 featured-card" style={{
            position: 'relative', borderRadius: 18, overflow: 'hidden',
            background: 'var(--ocean-deep)', color: 'var(--cream)',
            textDecoration: 'none', display: 'block', minHeight: 520,
            boxShadow: '0 30px 60px -24px rgba(11,39,51,0.35)'
          }}>
            <div className={`ph ph-${featured.cover}`} style={{
              position: 'absolute', inset: 0
            }}/>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, transparent 0%, transparent 40%, rgba(11,39,51,0.85) 100%)'
            }}/>
            <div style={{
              position: 'absolute', top: 20, left: 20,
              display: 'inline-block', padding: '6px 12px',
              background: 'var(--coral)', color: 'var(--paper)',
              fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', fontWeight: 700, borderRadius: 4
            }}>
              Cover story · Reservations open
            </div>
            <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
                textTransform: 'uppercase', opacity: 0.85, marginBottom: 10
              }}>
                {featured.location}
              </div>
              <div className="display" style={{
                fontSize: 'clamp(28px, 3.2vw, 44px)', lineHeight: 1.02, margin: 0,
                letterSpacing: '-0.02em'
              }}>
                {featured.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontStyle: 'italic',
                fontSize: 17, lineHeight: 1.4, marginTop: 12, opacity: 0.9, maxWidth: '32ch'
              }}>
                {featured.tagline}
              </div>
              <div style={{
                marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,249,236,0.2)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 4 }}>
                    From
                  </div>
                  <div className="display" style={{ fontSize: 28, lineHeight: 1 }}>{featured.fromLabel.replace('From ','')}</div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
                  textTransform: 'uppercase', fontWeight: 700, color: 'var(--coral)'
                }}>
                  Read dispatch →
                </div>
              </div>
            </div>
          </a>

          {/* Right — news rail */}
          <div className="reveal in d3" style={{ borderLeft: '1px solid var(--line)', paddingLeft: 28 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--coral-deep)', fontWeight: 700, marginBottom: 18
            }}>
              From the newsroom
            </div>
            {news.map((n, i) => (
              <a key={n.slug} href={`news/${n.slug}.html`} style={{
                display: 'block', padding: '14px 0',
                borderBottom: i < news.length - 1 ? '1px solid var(--line-soft)' : 'none',
                textDecoration: 'none', color: 'inherit'
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--coral-deep)', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                  {n.date} · {n.tag}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400,
                  lineHeight: 1.3, letterSpacing: '-0.005em', color: 'var(--ink)', textWrap: 'pretty'
                }}>
                  {n.title}
                </div>
              </a>
            ))}
            <a href="news/index.html" style={{
              display: 'inline-block', marginTop: 18, fontSize: 11,
              fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--coral-deep)', textDecoration: 'none', fontWeight: 700,
              borderBottom: '1px solid var(--coral-deep)', paddingBottom: 3
            }}>
              All dispatches →
            </a>
          </div>
        </div>
      </div>

      {/* Ambient fauna — Panthera onca wireframe, decorative corner element.
          Subtle, doesn't compete with the projects. */}
      <div className="hero-fauna" style={{
        position: 'absolute', right: 20, bottom: 16, width: 240, height: 240,
        zIndex: 3, pointerEvents: 'none'
      }}>
        <canvas ref={jaguarRef} style={{ width: '100%', height: '100%', display: 'block' }}/>
        {/* species label — bottom right, mono caps, subtle */}
        <div style={{
          position: 'absolute', bottom: -2, right: 4,
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em',
          textTransform: 'uppercase', fontWeight: 600,
          color: 'var(--ink-mute)', display: 'flex', gap: 8, alignItems: 'baseline'
        }}>
          <span style={{ color: 'var(--coral-deep)' }}>●</span>
          <span>Panthera onca</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .hero-ed-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-ed-grid > div:last-child { grid-column: 1 / -1; border-left: none !important; padding-left: 0 !important; border-top: 1px solid var(--line); padding-top: 32px !important; margin-top: 12px; }
        }
        @media (max-width: 720px) {
          .hero-ed-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .featured-card { min-height: 420px !important; }
          .hide-mobile { display: none !important; }
          .hero-fauna { width: 160px !important; height: 160px !important; right: 12px !important; bottom: 12px !important; }
        }
        .featured-card:hover { transform: translateY(-4px); box-shadow: 0 40px 80px -24px rgba(11,39,51,0.45) !important; }
        .featured-card { transition: all 0.35s var(--ease); }
      `}</style>
    </section>
  );
}

/* ── Marquee ── */
function Marquee() {
  const items = ['Bocas del Toro', '◦', 'Pedasí', '◦', 'Casco Viejo', '◦', 'Boquete', '◦', 'Playa Blanca', '◦', 'Coronado', '◦', 'Panama City', '◦'];
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '24px 0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', width: '200%', animation: 'marquee 35s linear infinite' }}>
        {[0, 1].map(k => (
          <div key={k} style={{ display: 'flex', gap: 40, width: '50%', flexShrink: 0, paddingRight: 40 }}>
            {items.map((t, i) => (
              <span key={i} style={{
                fontFamily: t === '◦' ? 'var(--font-body)' : 'var(--font-display)',
                fontStyle: t === '◦' ? 'normal' : 'italic',
                fontSize: t === '◦' ? 18 : 28, color: t === '◦' ? 'var(--coral)' : 'var(--cream)',
                whiteSpace: 'nowrap', fontWeight: 300
              }}>{t}</span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { Icon, Logo, LangSwitcher, Navbar, Hero, HeroEditorial, Marquee });
