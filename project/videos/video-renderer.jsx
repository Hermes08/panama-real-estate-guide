function VideoPage() {
      const v = window.__VIDEO_DATA__ || {};
      const projects = (window.PANAMA_DATA && window.PANAMA_DATA.projects) || [];
      const project = v.projectSlug ? projects.find(p => p.id === v.projectSlug) : null;

      const cleanLines = (v.description || '').split('\n').map(l => l.trim()).filter(l =>
        l && !l.startsWith('#') && !l.startsWith('*') && !l.startsWith('⚠️')
      );

      return (
        <>
          <DetailNav/>

          <section style={{ paddingTop: 110, paddingBottom: 'clamp(48px, 6vw, 90px)', background: 'var(--cream)' }}>
            <div className="container">
              <div style={{ marginBottom: 24 }}><DetailBack label="All videos" href="/videos/"/></div>

              <div className="eyebrow" style={{ marginBottom: 16 }}>
                <span className="rule-coral"></span>Video tour · {project ? project.name : 'Panama Real Estate Guide'}
              </div>

              <h1 className="display" style={{ fontSize: 'clamp(36px, 5vw, 64px)', margin: '0 0 32px', lineHeight: 1.05 }}>
                {v.title}
              </h1>

              <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 18, overflow: 'hidden', background: '#000', boxShadow: '0 30px 80px rgba(0,0,0,0.18)' }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.videoId}?rel=0`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>

              <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 56 }}>
                <div>
                  {cleanLines.map((l, i) => (
                    <p key={i} style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--ink-soft)', margin: '0 0 18px', maxWidth: '62ch' }}>
                      {l}
                    </p>
                  ))}
                </div>
                <aside style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)', letterSpacing: '0.08em', borderTop: '1px solid var(--line)', paddingTop: 24 }}>
                  {project && (
                    <>
                      <div style={{ opacity: 0.6, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Project</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink)', fontWeight: 500, marginBottom: 20 }}>{project.name}</div>
                      <a href={`/projects/${project.id}.html`} style={{
                        display: 'inline-block', padding: '14px 28px', background: 'var(--coral)', color: '#fff',
                        borderRadius: 999, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
                        textDecoration: 'none', fontWeight: 700, marginBottom: 24
                      }}>View {project.name} →</a>
                    </>
                  )}
                  <div style={{ opacity: 0.6, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Published</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', fontWeight: 500, marginBottom: 20 }}>
                    {new Date(v.publishDate).toLocaleDateString('es-PA', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div style={{ opacity: 0.6, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Watch on</div>
                  <a href={`https://www.youtube.com/watch?v=${v.videoId}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>YouTube ↗</a>
                </aside>
              </div>
            </div>
          </section>
        </>
      );
    }

    function mountVideoPage() {
      if (!document.getElementById('root')) return;
      ReactDOM.createRoot(document.getElementById('root')).render(<VideoPage/>);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountVideoPage);
    } else {
      mountVideoPage();
    }
