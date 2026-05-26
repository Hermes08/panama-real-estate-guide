function VideosIndexPage() {
      const videos = window.__VIDEOS_INDEX__ || [];
      const projects = (window.PANAMA_DATA && window.PANAMA_DATA.projects) || [];
      const projBySlug = Object.fromEntries(projects.map(p => [p.id, p]));
      // i18n
      const _LANG = (typeof window !== 'undefined' && window.PREG_LANG) || 'en';
      const _I18N = (window.PANAMA_DATA && window.PANAMA_DATA.chromeI18n && (window.PANAMA_DATA.chromeI18n[_LANG] || window.PANAMA_DATA.chromeI18n.en)) || {};
      function _t(path, fallback) {
        const parts = path.split('.');
        let v = _I18N;
        for (const k of parts) { if (v && typeof v === 'object' && k in v) v = v[k]; else { v = undefined; break; } }
        return (v != null) ? v : fallback;
      }
      const langPrefix = _LANG === 'en' ? '' : `/${_LANG}`;

      return (
        <>
          <DetailNav/>

          <section style={{ paddingTop: 110, paddingBottom: 'clamp(48px, 6vw, 90px)', background: 'var(--cream)' }}>
            <div className="container">
              <div style={{ marginBottom: 24 }}><DetailBack label={_t('back_links.home', 'Home')} href={`${langPrefix}/`}/></div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                <span className="rule-coral"></span>{_t('videos_index.eyebrow', 'Video library')}
              </div>
              <h1 className="display" style={{ fontSize: 'clamp(40px, 6vw, 80px)', margin: '0 0 16px', lineHeight: 1.02 }}>
                {_t('videos_index.h1', 'Panama real estate in motion.')}
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: '60ch', margin: '0 0 56px' }}>
                {_t('videos_index.dek', 'Short Spanish-narrated project tours and lifestyle clips from our team in Panama City and across the country. English subtitles available on YouTube.')} {videos.length} {_t('videos_index.videos_word', 'videos')}.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
                {videos.map(v => {
                  const proj = v.projectSlug ? projBySlug[v.projectSlug] : null;
                  const langBadge = (v.lang || 'es').toUpperCase();
                  return (
                    <a key={v.videoId} href={`${langPrefix}/videos/${v.videoId.toLowerCase()}.html`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                      <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 14, overflow: 'hidden', background: '#000', marginBottom: 18 }}>
                        <img src={v.thumbnailUrl || `https://i.ytimg.com/vi/${v.videoId}/maxresdefault.jpg`} alt={v.title} loading="lazy" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%)' }}/>
                        <div style={{ position: 'absolute', bottom: 12, right: 12, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ borderStyle: 'solid', borderWidth: '8px 0 8px 14px', borderColor: 'transparent transparent transparent #111', marginLeft: 3 }}/>
                        </div>
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: '0 0 6px', lineHeight: 1.25 }}>
                        <span style={{ display: 'inline-block', padding: '3px 8px', marginRight: 8, background: '#0B1F28', color: '#FFF9EC', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', borderRadius: 4, verticalAlign: 'middle' }}>{langBadge}</span>{v.title}
                      </h2>
                      {proj && (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
                          {proj.name}
                        </div>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      );
    }

    function mountIndex() {
      if (!document.getElementById('root')) return;
      ReactDOM.createRoot(document.getElementById('root')).render(<VideosIndexPage/>);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountIndex);
    } else {
      mountIndex();
    }
