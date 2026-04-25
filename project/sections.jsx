// Sections 2 — Projects, Regions, Journal (articles), News ticker, Testimonials, Reserve CTA, Footer

/* ── Projects (developer-only) ── */
function Projects() {
  const projects = window.PANAMA_DATA.projects;
  return (
    <section id="projects" style={{ padding: 'clamp(72px, 10vw, 140px) 0', background: 'var(--cream)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div className="reveal" style={{ maxWidth: 720 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              <span className="rule-coral"></span>Developer projects · 2026 collection
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(36px, 6vw, 84px)', margin: 0 }}>
              Twenty-four projects. <em>Five distinct coasts.</em> Zero resales.
            </h2>
            <p className="lede" style={{ marginTop: 20 }}>
              Every unit here is sold directly by the developer. No individual owner resales,
              no back-door inventory — just new-construction and first-release units with
              guaranteed title and refundable reservation deposits.
            </p>
          </div>
        </div>

        <div className="bento-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
          gridAutoRows: 'minmax(280px, auto)', gap: 16
        }}>
          {projects.map((p, i) => <ProjectCard key={p.id} p={p} i={i}/>)}
        </div>
      </div>

      <style>{`
        .bento-grid > :nth-child(1) { grid-column: span 4; grid-row: span 2; min-height: 580px; }
        .bento-grid > :nth-child(2) { grid-column: span 2; grid-row: span 1; min-height: 280px; }
        .bento-grid > :nth-child(3) { grid-column: span 2; grid-row: span 1; min-height: 280px; }
        .bento-grid > :nth-child(4) { grid-column: span 2; grid-row: span 1; min-height: 320px; }
        .bento-grid > :nth-child(5) { grid-column: span 2; grid-row: span 1; min-height: 320px; }
        .bento-grid > :nth-child(6) { grid-column: span 2; grid-row: span 1; min-height: 320px; }
        @media (max-width: 900px) {
          .bento-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .bento-grid > * { grid-column: span 1 !important; grid-row: span 1 !important; min-height: 380px !important; }
        }
      `}</style>
    </section>
  );
}

function ProjectCard({ p, i }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a className="reveal" href={`projects/${p.id}.html`}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
        textDecoration: 'none', color: 'inherit', display: 'block',
        transitionDelay: `${i * 0.06}s`,
        boxShadow: hover ? '0 28px 64px -20px rgba(11,39,51,0.35)' : '0 10px 28px -14px rgba(11,39,51,0.18)',
        transform: hover ? 'translateY(-4px)' : 'none',
        transition: 'transform 0.5s var(--ease), box-shadow 0.5s var(--ease)'
      }}>
      {p.cover && p.cover.indexOf('/') !== -1 ? (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <img src={p.cover} alt={p.name} loading="lazy" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', transform: hover ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.7s var(--ease)'
          }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.72) 100%)' }}/>
        </div>
      ) : (
        <div className={`ph ph-${p.cover}`} data-label={(p.cover||'').toUpperCase()} style={{ position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.72) 100%)' }}/>
        </div>
      )}

      <div style={{
        position: 'absolute', top: 18, left: 18, right: 18, zIndex: 2,
        display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap'
      }}>
        <span style={{
          background: 'rgba(255, 249, 236, 0.92)', color: 'var(--ink)',
          padding: '5px 11px', borderRadius: 999, fontSize: 10, fontFamily: 'var(--font-mono)',
          letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600
        }}>
          <span style={{ color: 'var(--coral)', marginRight: 6 }}>●</span>{p.status}
        </span>
        {p.highlight && (
          <span style={{
            background: 'var(--coral)', color: 'var(--paper)',
            padding: '5px 11px', borderRadius: 999, fontSize: 10, fontFamily: 'var(--font-mono)',
            letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700
          }}>
            {p.highlight}
          </span>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(18px, 2vw, 26px)', zIndex: 2, color: 'var(--cream)' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.16em',
          textTransform: 'uppercase', opacity: 0.85, marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Icon name="pin" size={11}/> {p.location}
        </div>
        <h3 className="display" style={{
          fontSize: p.size === 'large' ? 'clamp(30px, 4.5vw, 60px)' : 'clamp(24px, 3vw, 38px)',
          margin: 0, color: 'var(--cream)', textShadow: '0 2px 16px rgba(0,0,0,0.3)', lineHeight: 1
        }}>
          {p.name}
        </h3>
        {p.developer && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
            textTransform: 'uppercase', opacity: 0.7, marginTop: 8
          }}>
            by {p.developer}
          </div>
        )}
        {p.size === 'large' && p.tagline && (
          <p style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)',
            opacity: 0.95, marginTop: 14, marginBottom: 0, maxWidth: '36ch'
          }}>
            {p.tagline}
          </p>
        )}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginTop: p.size === 'large' ? 24 : 16, gap: 14, flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', opacity: 0.75, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {p.fromLabel} · {p.delivery}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10,
              background: 'var(--coral)', color: 'var(--paper)',
              padding: '6px 12px', borderRadius: 4, fontWeight: 700, fontSize: 12,
              fontFamily: 'var(--font-mono)', letterSpacing: '0.08em'
            }}>
              {p.priceFromLabel}
            </div>
          </div>
          <div style={{
            width: 42, height: 42, borderRadius: '50%', background: 'var(--cream)',
            color: 'var(--ink)', display: 'grid', placeItems: 'center',
            transform: hover ? 'rotate(-45deg) scale(1.08)' : 'none',
            transition: 'transform 0.5s var(--ease)'
          }}>
            <Icon name="arrow" size={17}/>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ── Regions ── */
function Regions() {
  const regions = window.PANAMA_DATA.regions;
  return (
    <section id="regions" style={{ padding: 'clamp(72px, 10vw, 140px) 0', background: 'var(--ink)', color: 'var(--cream)', overflow: 'hidden' }}>
      <div className="container">
        <div className="reveal" style={{ marginBottom: 56, maxWidth: 720 }}>
          <div className="eyebrow" style={{ color: 'var(--aqua)', marginBottom: 18 }}>
            <span className="rule-coral"></span>Where to land
          </div>
          <h2 className="display" style={{ fontSize: 'clamp(36px, 6vw, 84px)', margin: 0, color: 'var(--cream)' }}>
            Two oceans. <em style={{ color: 'var(--aqua)' }}>Five coasts.</em> One visa.
          </h2>
        </div>
        <div className="regions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {regions.map((r, i) => (
            <div key={r.id} className="reveal" style={{
              transitionDelay: `${i * 0.06}s`,
              padding: 24, borderRadius: 14,
              background: 'rgba(255, 249, 236, 0.04)', border: '1px solid rgba(255, 249, 236, 0.1)',
              cursor: 'pointer', transition: 'all 0.4s var(--ease)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(31, 196, 196, 0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 249, 236, 0.04)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--aqua)', letterSpacing: '0.16em', marginBottom: 14 }}>
                0{i+1} / 0{regions.length}
              </div>
              <h3 className="display" style={{ fontSize: 24, margin: '0 0 6px', color: 'var(--cream)' }}>{r.name}</h3>
              <div style={{ fontSize: 11, opacity: 0.65, marginBottom: 16, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>{r.sub}</div>
              <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6, minHeight: 72, margin: 0 }}>{r.blurb}</p>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255, 249, 236, 0.12)',
                fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em'
              }}>
                <span style={{ color: 'var(--aqua)' }}>{r.count} projects</span>
                <Icon name="arrow" size={13}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .regions-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ── Journal (articles) — magazine editorial layout ── */
function Journal() {
  const articles = window.PANAMA_DATA.articles;
  const featured = articles.filter(a => a.featured);
  const rest = articles.filter(a => !a.featured);

  return (
    <section id="journal" style={{ padding: 'clamp(72px, 10vw, 140px) 0', background: 'var(--cream)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 20 }}>
          <div className="reveal" style={{ maxWidth: 720 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              <span className="rule-coral"></span>The Journal · Issue 04 · April 2026
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(36px, 6vw, 84px)', margin: 0, lineHeight: 1.02, paddingBottom: '0.12em' }}>
              Reporting, <em>from the ground.</em>
            </h2>
            <p className="lede" style={{ marginTop: 32 }}>
              Market reports, residency guides, neighborhood deep-dives and news from the
              ground in Panama. Written by our team, not syndicated. Updated weekly.
            </p>
          </div>
          <a href="#all-articles" className="pill-link reveal d1">All articles <Icon name="arrowS" size={12}/></a>
        </div>

        {/* Featured — split magazine */}
        <div className="featured-grid" style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, marginBottom: 72
        }}>
          {featured.map((a, i) => (
            <a key={a.id} className="reveal" href={`articles/${a.id}.html`} style={{ transitionDelay: `${i * 0.1}s`, cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className={`ph ph-${a.cover}`} data-label="EDITORIAL" style={{
                position: 'relative', aspectRatio: i === 0 ? '16/11' : '4/3', borderRadius: 14, overflow: 'hidden', marginBottom: 20
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)' }}/>
                <div style={{
                  position: 'absolute', top: 18, left: 18, background: 'var(--coral)', color: 'var(--paper)',
                  padding: '5px 11px', borderRadius: 999, fontSize: 10, fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700
                }}>
                  {a.category}
                </div>
              </div>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)', letterSpacing: '0.12em', marginBottom: 10 }}>
                {a.date} · {a.read} · by {a.author}
              </div>
              <h3 className="display" style={{
                fontSize: i === 0 ? 'clamp(28px, 3.4vw, 46px)' : 'clamp(24px, 2.4vw, 34px)',
                margin: '0 0 14px', lineHeight: 1.05
              }}>
                {a.title}
              </h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.65, margin: 0, maxWidth: '52ch' }}>
                {a.excerpt}
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18,
                fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'var(--coral-deep)', fontWeight: 600
              }}>
                Read the article <Icon name="arrow" size={13}/>
              </div>
            </a>
          ))}
        </div>

        {/* Rest — editorial list */}
        <div className="article-list" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
          borderTop: '1px solid var(--line)', paddingTop: 48
        }}>
          {rest.map((a, i) => (
            <a key={a.id} className="reveal" href={`articles/${a.id}.html`} style={{ transitionDelay: `${i * 0.06}s`, cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className={`ph ph-${a.cover}`} data-label="" style={{
                aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden', marginBottom: 16
              }}/>
              <div style={{
                fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--coral-deep)',
                letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700
              }}>
                {a.category}
              </div>
              <h4 className="display" style={{
                fontSize: 'clamp(18px, 1.4vw, 22px)', margin: '0 0 10px', lineHeight: 1.2
              }}>
                {a.title}
              </h4>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)', letterSpacing: '0.1em' }}>
                {a.date} · {a.read}
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .featured-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .article-list { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
        }
        @media (max-width: 560px) {
          .article-list { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ── News ticker ── */
function News() {
  const news = window.PANAMA_DATA.news;
  return (
    <section id="news" style={{ padding: 'clamp(72px, 8vw, 110px) 0', background: 'var(--sand)' }}>
      <div className="container">
        <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60 }}>
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              <span className="rule-coral"></span>News & updates
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 54px)', margin: '0 0 20px' }}>
              The week in <em>Panama real estate.</em>
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.65 }}>
              Project milestones, infrastructure, regulatory updates and press mentions — short and timestamped.
            </p>
            <a href="news/index.html" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 28,
              padding: '12px 20px', border: '1px solid var(--coral-deep)', borderRadius: 999,
              color: 'var(--coral-deep)', textDecoration: 'none',
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
              textTransform: 'uppercase', fontWeight: 700, transition: 'all 0.25s var(--ease)'
            }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--coral-deep)'; e.currentTarget.style.color = 'var(--paper)'; }}
               onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--coral-deep)'; }}>
              Browse the full newsroom →
            </a>
          </div>
          <div className="reveal d1">
            {news.slice(0, 7).map((n, i) => (
              <a key={i} href={`news/${n.slug || 'palma-blanca-phase-ii'}.html`} style={{
                display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 20, alignItems: 'center',
                padding: '18px 0', borderBottom: i < Math.min(news.length, 7) - 1 ? '1px solid rgba(11,39,51,0.1)' : 'none',
                cursor: 'pointer', textDecoration: 'none', color: 'inherit'
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--coral-deep)', letterSpacing: '0.14em', fontWeight: 700 }}>
                  {n.date}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 1.3vw, 20px)', fontWeight: 400, letterSpacing: '-0.005em', lineHeight: 1.3 }}>
                  {n.title}
                </div>
                <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }} className="hide-mobile">
                  {n.tag}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .news-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}

/* ── Testimonials ── */
function Testimonials() {
  const tests = window.PANAMA_DATA.testimonials;
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % tests.length), 6500);
    return () => clearInterval(t);
  }, [tests.length]);
  const t = tests[idx];
  return (
    <section style={{ padding: 'clamp(80px, 12vw, 160px) 0', background: 'var(--ocean-deep)', color: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%', width: 400, height: 400,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,74,0.4) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none'
      }}/>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="eyebrow reveal" style={{ color: 'var(--aqua)', marginBottom: 32 }}>
          <span className="rule-coral"></span>In their own words
        </div>
        <blockquote key={idx} style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(24px, 4vw, 52px)', lineHeight: 1.2, margin: 0,
          maxWidth: '22ch', letterSpacing: '-0.01em', animation: 'fadeIn 0.8s var(--ease)'
        }}>
          <span style={{ color: 'var(--coral)', fontStyle: 'normal', marginRight: 8 }}>"</span>
          {t.quote}
          <span style={{ color: 'var(--coral)', fontStyle: 'normal', marginLeft: 4 }}>"</span>
        </blockquote>
        <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', background: 'var(--turquoise)',
            display: 'grid', placeItems: 'center', color: 'var(--ocean-deep)',
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20
          }}>
            {t.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{t.name}</div>
            <div style={{ fontSize: 12, opacity: 0.7, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginTop: 4 }}>{t.from}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {tests.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} style={{
                width: i === idx ? 32 : 8, height: 8, borderRadius: 4,
                background: i === idx ? 'var(--coral)' : 'rgba(255, 249, 236, 0.25)',
                border: 'none', cursor: 'pointer', transition: 'all 0.4s var(--ease)'
              }}/>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }`}</style>
    </section>
  );
}

/* ── FAQ ── */
function FAQ() {
  const faqs = window.PANAMA_DATA.faqs;
  const [open, setOpen] = React.useState(0);
  return (
    <section style={{ padding: 'clamp(72px, 10vw, 140px) 0' }}>
      <div className="container">
        <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 72 }}>
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 16 }}><span className="rule-coral"></span>Good to know</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 5vw, 64px)', margin: 0 }}>
              Questions we <em>answer daily.</em>
            </h2>
          </div>
          <div className="reveal d1">
            {faqs.map((f, i) => (
              <div key={i} style={{
                borderTop: '1px solid var(--line)',
                borderBottom: i === faqs.length - 1 ? '1px solid var(--line)' : 'none'
              }}>
                <button onClick={() => setOpen(open === i ? -1 : i)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px 0', background: 'transparent', border: 'none', cursor: 'pointer',
                  textAlign: 'left', color: 'var(--ink)', gap: 16
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 1.8vw, 24px)', fontWeight: 400 }}>{f.q}</span>
                  <span style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: open === i ? 'var(--coral)' : 'transparent',
                    border: open === i ? 'none' : '1px solid var(--line)',
                    color: open === i ? 'var(--cream)' : 'var(--ink)',
                    display: 'grid', placeItems: 'center', flexShrink: 0,
                    transition: 'all 0.4s var(--ease)'
                  }}>
                    <Icon name="plus" size={15}/>
                  </span>
                </button>
                {open === i && (
                  <div style={{ paddingBottom: 22, color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.7, maxWidth: '58ch' }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .faq-grid { grid-template-columns: 1fr !important; gap: 32px !important; } }`}</style>
    </section>
  );
}

/* ── Reserve CTA — the mojo ── */
function ReserveCTA() {
  return (
    <section id="reserve" style={{
      padding: 'clamp(80px, 10vw, 140px) 0',
      background: 'linear-gradient(160deg, #FFD8A8 0%, #FF9B6A 35%, #FF6B4A 70%, #C94628 100%)',
      position: 'relative', overflow: 'hidden', color: 'var(--cream)'
    }}>
      <div className="hide-mobile" style={{
        position: 'absolute', top: '25%', right: '8%', width: 220, height: 220,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,200,150,0.4) 60%, transparent 80%)', filter: 'blur(2px)'
      }}/>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="reveal" style={{ maxWidth: 860 }}>
          <div className="eyebrow" style={{ color: 'rgba(255, 249, 236, 0.9)', marginBottom: 18 }}>
            <span className="rule-coral" style={{ background: 'var(--cream)' }}></span>
            Reservations open · Refundable deposit
          </div>
          <h2 className="display" style={{
            fontSize: 'clamp(40px, 7vw, 108px)', margin: 0, color: 'var(--cream)',
            textShadow: '0 2px 20px rgba(0,0,0,0.15)'
          }}>
            Reserve from <em>$5,000.</em><br/>Walk it on <em>week two.</em>
          </h2>
          <p className="lede" style={{ color: 'rgba(255, 249, 236, 0.92)', marginTop: 28, fontSize: 'clamp(1rem, 1.3vw, 1.2rem)', maxWidth: 640 }}>
            A refundable reservation deposit holds a specific unit for 30 days.
            Funds go to the developer's escrow, never to us. Use the 30 days to
            review title, visit the project, or cancel for a full refund. No pressure.
          </p>
        </div>

        <div className="reveal d1 reserve-grid" style={{
          marginTop: 44, display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr', gap: 16,
          background: 'rgba(11, 39, 51, 0.88)', backdropFilter: 'blur(18px)',
          borderRadius: 18, padding: 28, color: 'var(--cream)',
          border: '1px solid rgba(255, 249, 236, 0.15)'
        }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--aqua)', marginBottom: 10 }}>WhatsApp / Phone</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic' }}>+507 6761-0315</div>
          </div>
          <div>
            <div className="eyebrow" style={{ color: 'var(--aqua)', marginBottom: 10 }}>Email</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, wordBreak: 'break-word' }}>reservations@panamarealestateguide.com</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a href="#form" className="btn btn-coral" style={{ width: '100%', justifyContent: 'center' }}>
              Start a reservation <Icon name="arrow" size={14}/>
            </a>
          </div>
        </div>

        <div className="reveal d2" style={{ marginTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13, opacity: 0.92 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Icon name="clock" size={15}/> 30-day hold
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Icon name="security" size={15}/> Full refund policy
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Icon name="globe" size={15}/> EN · ES · PT · DE
          </span>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .reserve-grid { grid-template-columns: 1fr !important; gap: 20px !important; } }`}</style>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '72px 0 36px' }}>
      <div className="container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
          <div>
            <Logo onDark={true} size={18}/>
            <p style={{ marginTop: 22, fontSize: 14, opacity: 0.75, maxWidth: '38ch', lineHeight: 1.6 }}>
              A boutique advisory representing Panama's best developer projects to
              international buyers since 2016. Four languages, one escrow, zero resales.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
              {window.PANAMA_DATA.langs.map(l => (
                <span key={l.code} style={{
                  padding: '4px 10px', borderRadius: 999, border: '1px solid rgba(255,249,236,0.2)',
                  fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em'
                }}>{l.code}</span>
              ))}
            </div>
          </div>
          {[
            { t: 'Projects', links: ['Pacific Coast', 'Bocas del Toro', 'Azuero', 'Highlands', 'Panama City'] },
            { t: 'Journal', links: ['Market Reports', 'Residency', 'Taxes', 'Neighborhoods', 'News'] },
            { t: 'Company', links: ['About', 'Team', 'Press', 'Podcast', 'Contact'] },
          ].map(col => (
            <div key={col.t}>
              <div className="eyebrow" style={{ color: 'var(--aqua)', marginBottom: 18 }}>{col.t}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <li key={l}><a href="#" style={{ color: 'var(--cream)', opacity: 0.85, textDecoration: 'none', fontSize: 14 }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          paddingTop: 28, borderTop: '1px solid rgba(255, 249, 236, 0.15)',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
          fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', opacity: 0.6, textTransform: 'uppercase'
        }}>
          <span>© 2026 PanamaRealEstateGuide.com · VIP Expats Panama S.A.</span>
          <span>Panama City · Oceania Business Plaza, T-2000</span>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; } } @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr !important; } }`}</style>
    </footer>
  );
}

Object.assign(window, { Projects, Regions, Journal, News, Testimonials, FAQ, ReserveCTA, Footer });
