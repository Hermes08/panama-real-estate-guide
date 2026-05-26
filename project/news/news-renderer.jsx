const NEWS_ID = window.location.pathname.split('/').pop().replace('.html', '');
    // i18n: read page language and translated content from chrome-i18n
    var _NEWS_LANG = (typeof window !== 'undefined' && window.PREG_LANG) || 'en';
    var _NEWS_I18N = (window.PANAMA_DATA && window.PANAMA_DATA.chromeI18n && (window.PANAMA_DATA.chromeI18n[_NEWS_LANG] || window.PANAMA_DATA.chromeI18n.en)) || {};
    var _newsMeta = (window.PANAMA_DATA.news || []).find(function(x){ return x.slug === NEWS_ID; });
    // Body lookup chain:
    //   1. chrome-i18n news_full_bodies[lang][slug] (15 new news × 4 langs, authored manually)
    //   2. newsBodies[slug] (18 legacy English bodies) — translate chrome only
    //   3. stub from news[] metadata (everything else)
    var translatedBody = _NEWS_I18N.news_full_bodies && _NEWS_I18N.news_full_bodies[NEWS_ID];
    var translatedTitle = _NEWS_I18N.news_titles && _NEWS_I18N.news_titles[NEWS_ID];
    var translatedTag = function(tag) { return (_NEWS_I18N.news_tags && _NEWS_I18N.news_tags[tag]) || tag; };
    var n = window.PANAMA_DATA.newsBodies[NEWS_ID];
    if (translatedBody && _newsMeta) {
      n = { title: translatedTitle || _newsMeta.title, date: _newsMeta.date, tag: translatedTag(_newsMeta.tag), body: translatedBody };
    } else if (n && _NEWS_LANG !== 'en') {
      // Legacy EN newsBodies — translate chrome (title + tag) but keep body in EN
      n = Object.assign({}, n, { title: translatedTitle || n.title, tag: translatedTag(n.tag) });
    } else if (!n) {
      if (_newsMeta) {
        n = { title: translatedTitle || _newsMeta.title, date: _newsMeta.date, tag: translatedTag(_newsMeta.tag),
              body: [(_NEWS_I18N.news_index && _NEWS_I18N.news_index.coming_soon) || 'Full dispatch coming soon. In the meantime, see the latest at /news/.'] };
      } else {
        n = { title: 'News item not found', date: '', tag: '', body: ['This dispatch is not in the current news list. See /news/ for the latest.'] };
      }
    }
    document.title = `${n.title} — PanamaRealEstateGuide.com`;

    function NewsPage() {
      const allNews = window.PANAMA_DATA.news;
      const currentSlug = NEWS_ID;
      const others = allNews.filter(x => x.slug !== currentSlug).slice(0, 4);

      React.useEffect(() => {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
        return () => io.disconnect();
      }, []);

      return (
        <>
          <DetailNav/>

          {/* Newsroom-style header — tight and dated */}
          <section style={{ paddingTop: 96, paddingBottom: 48, background: 'var(--cream)', borderBottom: '1px solid var(--line)' }}>
            <div className="container" style={{ maxWidth: 880 }}>
              <div style={{ marginBottom: 28 }}>
                <DetailBack label="All news" href="/news/"/>
              </div>

              <div className="reveal" style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
                <span style={{
                  background: 'var(--ink)', color: 'var(--cream)', padding: '5px 12px', borderRadius: 4,
                  fontSize: 10.5, fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700
                }}>
                  {n.tag}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--coral-deep)', letterSpacing: '0.14em', fontWeight: 700 }}>
                  {n.date}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.14em' }}>
                  · Panama City newsroom
                </span>
              </div>

              <h1 className="display reveal d1" style={{
                fontSize: 'clamp(34px, 5vw, 68px)', margin: 0, lineHeight: 1.02, paddingBottom: '0.08em', maxWidth: '22ch'
              }}>
                {n.title}
              </h1>
            </div>
          </section>

          {/* BODY */}
          <section style={{ padding: 'clamp(56px, 7vw, 96px) 0' }}>
            <div className="container" style={{ maxWidth: 720 }}>
              {n.body.map((p, i) => (
                <p key={i} className="reveal" style={{
                  fontSize: 18, lineHeight: 1.8, color: 'var(--ink)', margin: '0 0 24px', textWrap: 'pretty'
                }}>
                  {i === 0 ? (
                    <>
                      <strong style={{
                        fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.18em',
                        textTransform: 'uppercase', color: 'var(--coral-deep)', marginRight: 12, fontWeight: 700
                      }}>
                        Panama City —
                      </strong>
                      {p}
                    </>
                  ) : p}
                </p>
              ))}

              {/* Press contact */}
              <div className="reveal" style={{
                marginTop: 48, padding: 24, background: 'var(--sand)', borderRadius: 12,
                display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap'
              }}>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontWeight: 700 }}>
                  Press / inquiries
                </div>
                <div style={{ fontSize: 14, color: 'var(--ink)' }}>
                  press@panamarealestateguide.com
                </div>
                <a href="/#reserve" className="btn btn-coral" style={{ marginLeft: 'auto', padding: '11px 20px', fontSize: 11 }}>
                  Contact newsroom <Icon name="arrow" size={13}/>
                </a>
              </div>
            </div>
          </section>

          {/* More news — sidebar-style list */}
          <section style={{ padding: 'clamp(48px, 6vw, 80px) 0', background: 'var(--ink)', color: 'var(--cream)' }}>
            <div className="container">
              <div className="eyebrow reveal" style={{ color: 'var(--aqua)', marginBottom: 24 }}>
                <span className="rule-coral"></span>More from the newsroom
              </div>
              <div>
                {others.map((o, i) => (
                  <a key={i} href={`${o.slug}.html`} className="reveal" style={{
                    display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 20, alignItems: 'center',
                    padding: '20px 0', borderBottom: '1px solid rgba(255,249,236,0.12)',
                    color: 'inherit', textDecoration: 'none', transitionDelay: `${i * 0.05}s`
                  }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--coral)', letterSpacing: '0.14em', fontWeight: 700 }}>{o.date}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 1.3vw, 20px)', lineHeight: 1.3, fontWeight: 400 }}>{o.title}</div>
                    <div className="hide-mobile" style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--aqua)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{o.tag}</div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <DetailCTA kind="reserve"/>
          <DetailFooter/>
        </>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<NewsPage/>);
