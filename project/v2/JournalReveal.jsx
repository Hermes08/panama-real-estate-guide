/* ── JournalReveal — "#1 hidden behind reveal" pattern to activate curiosity gap ── */
function JournalReveal() {
  const [revealed, setRevealed] = useState(false);
  const articles = ((window.PANAMA_DATA && window.PANAMA_DATA.articles) || []).slice(0, 5);
  const top = articles[0];
  const rest = articles.slice(1);

  return (
    <section id="journal" style={{
      background: 'var(--cream)', color: 'var(--ink)',
      paddingTop: 100, paddingBottom: 100
    }}>
      <style>{`
        .v2-jr-card { transition: transform 0.4s var(--ease), border-color 0.3s var(--ease), box-shadow 0.4s var(--ease); }
        .v2-jr-card:hover { transform: translateY(-4px); border-color: var(--coral); box-shadow: 0 24px 48px -20px rgba(11,39,51,0.18); }
        .v2-jr-reveal-btn:hover { background: var(--coral-deep) !important; transform: scale(1.02); }
        .v2-jr-cover-blur { filter: blur(28px) saturate(1.2); transform: scale(1.1); transition: filter 1.2s var(--ease), transform 1.2s var(--ease); }
        .v2-jr-cover-clear { filter: blur(0) saturate(1); transform: scale(1); }
        @keyframes v2JrFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .v2-jr-fade { animation: v2JrFade 0.6s var(--ease) both; }
        @media (max-width: 720px) {
          .v2-jr-grid { grid-template-columns: 1fr !important; }
          .v2-jr-rest { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56, flexWrap: 'wrap', gap: 24 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 18,
              display: 'inline-flex', alignItems: 'center', gap: 12
            }}>
              <span style={{ width: 28, height: 1, background: 'var(--coral)' }} />
              The Isthmus Quarterly · Most read this week
            </div>
            <h2 className="display" style={{
              fontSize: 'clamp(36px, 5.5vw, 64px)', lineHeight: 0.96,
              margin: 0, letterSpacing: '-0.02em'
            }}>
              The piece <em style={{ color: 'var(--coral)', fontStyle: 'italic', fontWeight: 300 }}>everyone</em> is reading
            </h2>
          </div>
          <a href="#full-journal" style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--ink)', textDecoration: 'none',
            borderBottom: '1px solid var(--ink)', paddingBottom: 4
          }}>
            Browse the full journal →
          </a>
        </div>

        {/* #1 reveal card */}
        {top && (
          <div className="v2-jr-grid" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
            background: 'var(--paper)', border: '1px solid var(--line)',
            borderRadius: 24, overflow: 'hidden', marginBottom: 64,
            boxShadow: '0 30px 60px -28px rgba(11,39,51,0.18)'
          }}>
            {/* left: cover (blurred until reveal) */}
            <div style={{
              position: 'relative', minHeight: 460, background: 'linear-gradient(135deg, var(--coral) 0%, var(--coral-deep) 50%, #8B2D1A 100%)',
              overflow: 'hidden'
            }}>
              <div className={`v2-jr-cover-blur ${revealed ? 'v2-jr-cover-clear' : ''}`} style={{
                position: 'absolute', inset: 0, opacity: 0.7,
                background: 'radial-gradient(circle at 30% 30%, rgba(255,249,236,0.6) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(31,95,74,0.5) 0%, transparent 60%)'
              }} />
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: '0.3em',
                textTransform: 'uppercase', opacity: revealed ? 0 : 0.85, transition: 'opacity 0.6s var(--ease)'
              }}>#1 of {articles.length}</div>
            </div>

            {/* right: content */}
            <div style={{ padding: 'clamp(32px, 4vw, 56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.24em',
                textTransform: 'uppercase', color: 'var(--coral-deep)', marginBottom: 20
              }}>
                ★ Most read · {top.read || ''}
              </div>

              {!revealed ? (
                <>
                  <h3 className="display" style={{
                    fontSize: 'clamp(28px, 3.4vw, 42px)', lineHeight: 1.05, margin: '0 0 18px',
                    color: 'var(--ink)', letterSpacing: '-0.01em'
                  }}>
                    The single article moving more reservations than any other this month.
                  </h3>
                  <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 28 }}>
                    Published {top.date || 'this month'}. Read by buyers from twenty-three countries in the last seven days. We held it back for a reason.
                  </p>
                  <button
                    className="v2-jr-reveal-btn"
                    onClick={() => setRevealed(true)}
                    style={{
                      background: 'var(--coral)', color: 'var(--paper)', border: 'none',
                      padding: '16px 28px', borderRadius: 999, fontFamily: 'var(--font-body)',
                      fontWeight: 600, fontSize: 14, letterSpacing: '0.04em', cursor: 'pointer',
                      transition: 'all 0.3s var(--ease)', alignSelf: 'flex-start',
                      display: 'inline-flex', alignItems: 'center', gap: 10
                    }}>
                    Reveal #1 →
                  </button>
                  <div style={{
                    marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 10,
                    letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)'
                  }}>{top.read || ''} read · No paywall</div>
                </>
              ) : (
                <div className="v2-jr-fade">
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
                    textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 14
                  }}>{top.category || 'Editorial'}</div>
                  <h3 className="display" style={{
                    fontSize: 'clamp(28px, 3.4vw, 42px)', lineHeight: 1.05, margin: '0 0 18px',
                    color: 'var(--ink)', letterSpacing: '-0.01em'
                  }}>{top.title}</h3>
                  <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 28 }}>
                    {top.excerpt}
                  </p>
                  <a href={`#article-${top.id}`} style={{
                    background: 'var(--coral)', color: 'var(--paper)',
                    padding: '14px 26px', borderRadius: 999, fontFamily: 'var(--font-body)',
                    fontWeight: 600, fontSize: 14, textDecoration: 'none',
                    alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 10
                  }}>Read the full piece →</a>
                  <div style={{
                    marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 10,
                    letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)'
                  }}>By {top.author || 'Editorial'} · {top.date || ''}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* the rest #2..#5 */}
        <div className="v2-jr-rest" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {rest.map((a, i) => (
            <article key={a.id} className="v2-jr-card" style={{
              background: 'var(--paper)', border: '1px solid var(--line)',
              borderRadius: 16, padding: 24, position: 'relative', cursor: 'pointer'
            }}>
              <div style={{
                position: 'absolute', top: -10, left: 24,
                background: 'var(--ink)', color: 'var(--cream)',
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
                padding: '4px 10px', borderRadius: 999
              }}>#{i + 2}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--coral-deep)', marginTop: 6, marginBottom: 14
              }}>{a.category}</div>
              <h4 className="display" style={{
                fontSize: 22, lineHeight: 1.15, margin: '0 0 12px', color: 'var(--ink)',
                letterSpacing: '-0.01em'
              }}>{a.title}</h4>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 16px' }}>
                {(a.excerpt || '').slice(0, 110)}…
              </p>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
                color: 'var(--ink-mute)', textTransform: 'uppercase'
              }}>{a.date || ''} · {a.read || ''}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
