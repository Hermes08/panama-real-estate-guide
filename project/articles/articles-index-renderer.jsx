// Pexels thumbnail-image picker (same logic as the article-detail template,
// renamed from pickCoverImg to avoid global-scope collision with the
// hero-size pickCoverImg in sections.js, which is also loaded on this page).
    const pickThumbImg = (a) => {
      if (!a || !a.id) return null;
      const POOLS = {
        sunset: [18185251, 1787057, 18027952],
        palm:   [4604439, 12858513, 29464869, 37120933],
        sand:   [11897606, 20891029, 16519714, 7938714],
        ocean:  [7938842, 8170288, 7233094, 31817155]
      };
      const pool = POOLS[a.cover] || POOLS.sunset;
      let h = 0;
      const id = String(a.id);
      for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
      const idx = Math.abs(h) % pool.length;
      return `https://images.pexels.com/photos/${pool[idx]}/pexels-photo-${pool[idx]}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
    };

    function ArticlesIndex() {
      const articles = window.PANAMA_DATA.articles || [];
      const categories = ['All', ...new Set(articles.map(a => a.category).filter(Boolean))];

      // i18n: detect page language and translate everything visible
      const LANG = (typeof window !== 'undefined' && window.PREG_LANG) || 'en';
      const i18n = (window.PANAMA_DATA.chromeI18n && window.PANAMA_DATA.chromeI18n[LANG]) || {};
      const i18nEn = (window.PANAMA_DATA.chromeI18n && window.PANAMA_DATA.chromeI18n.en) || {};
      function t(path, fallback) {
        const parts = path.split('.');
        let v = i18n;
        for (const k of parts) { if (v && typeof v === 'object' && k in v) v = v[k]; else { v = undefined; break; } }
        if (v != null) return v;
        let e = i18nEn;
        for (const k of parts) { if (e && typeof e === 'object' && k in e) e = e[k]; else { e = undefined; break; } }
        return (e != null) ? e : (fallback != null ? fallback : path);
      }
      function articleTitle(a) {
        if (LANG === 'en') return a.title;
        const meta = window.PANAMA_DATA.articleMeta;
        return (meta && meta[LANG] && meta[LANG][a.id] && meta[LANG][a.id].title) || a.title;
      }
      function articleExcerpt(a) {
        if (LANG === 'en') return a.excerpt;
        const meta = window.PANAMA_DATA.articleMeta;
        return (meta && meta[LANG] && meta[LANG][a.id] && meta[LANG][a.id].excerpt) || a.excerpt;
      }
      function articleHref(a) {
        // Prefer translated article page when available; fall back to EN canonical
        if (LANG !== 'en') {
          const meta = window.PANAMA_DATA.articleMeta;
          if (meta && meta[LANG] && meta[LANG][a.id]) return `/${LANG}/articles/${a.id}.html`;
        }
        return `/articles/${a.id}.html`;
      }
      function categoryLabel(cat) {
        if (LANG === 'en' || !cat) return cat;
        return (i18n.categories && i18n.categories[cat]) || cat;
      }

      // Read ?category=<X> from the URL so footer/deep-links can pre-select a tab.
      // Match case-insensitively + tolerant of common separators (Residency vs residency vs Residency-US).
      const readCategoryFromURL = () => {
        if (typeof window === 'undefined') return 'All';
        const q = new URLSearchParams(window.location.search).get('category');
        if (!q) return 'All';
        const needle = q.toLowerCase().replace(/[^a-z0-9]+/g, '');
        const match = categories.find(c => c.toLowerCase().replace(/[^a-z0-9]+/g, '') === needle);
        return match || 'All';
      };
      const [filter, setFilter] = React.useState(readCategoryFromURL);
      const filtered = filter === 'All' ? articles : articles.filter(a => a.category === filter);

      // Reflect tab changes in the URL (replaceState, does not pollute history)
      React.useEffect(() => {
        if (typeof window === 'undefined') return;
        const url = new URL(window.location.href);
        if (filter === 'All') url.searchParams.delete('category');
        else url.searchParams.set('category', filter);
        window.history.replaceState({}, '', url.toString());
      }, [filter]);

      React.useEffect(() => {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
        return () => io.disconnect();
      }, [filter]);

      return (
        <>
          <Navbar/>

          <section style={{ paddingTop: 96, paddingBottom: 32, background: 'var(--cream)' }}>
            <div className="container">
              <div className="reveal" style={{ maxWidth: 720 }}>
                <div className="eyebrow" style={{ color: 'var(--coral-deep)', marginBottom: 16 }}>{t('nav.journal', 'Journal')} · {articles.length} {t('home_sections.journal_eyebrow_count', 'articles')}</div>
                <h1 className="display" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.05, margin: '12px 0 24px' }}>
                  {t('articles_index.h1', 'Editorial coverage of Panama real estate, residency, taxes and lifestyle.')}
                </h1>
                <p style={{ fontSize: 18, color: 'var(--ink-mute)', maxWidth: 60+'ch', lineHeight: 1.55 }}>
                  {t('articles_index.dek', 'Long-form articles for international investors, retirees and second-home buyers. Each piece is researched, dated and updated annually.')}
                </p>
              </div>

              <div className="reveal d1" style={{ marginTop: 48, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {categories.map(c => (
                  <button key={c}
                    onClick={() => setFilter(c)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      border: '1px solid ' + (filter === c ? 'var(--coral-deep)' : 'rgba(11,31,40,0.15)'),
                      background: filter === c ? 'var(--coral-deep)' : 'transparent',
                      color: filter === c ? 'var(--cream)' : 'var(--ink)',
                      fontSize: 13,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      transition: 'all 0.18s'
                    }}>
                    {c === 'All' ? t('articles_index.all_filter', 'All') : categoryLabel(c)}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section style={{ paddingTop: 32, paddingBottom: 96, background: 'var(--cream)' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
                {filtered.map((a, i) => (
                  <a key={a.id}
                     href={articleHref(a)}
                     className="reveal"
                     style={{
                       textDecoration: 'none', color: 'inherit',
                       transitionDelay: `${(i % 9) * 0.04}s`,
                       display: 'block',
                       borderRadius: 16,
                       overflow: 'hidden',
                       background: '#fff',
                       boxShadow: '0 4px 16px -8px rgba(11,31,40,0.10)',
                       transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                     }}
                     onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px -10px rgba(11,31,40,0.18)'; }}
                     onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px -8px rgba(11,31,40,0.10)'; }}>
                    <div className={`ph ph-${a.cover}`}
                         data-label={(categoryLabel(a.category) || '').toUpperCase()}
                         style={{
                           aspectRatio: '16/10',
                           backgroundImage: `url(${pickThumbImg(a)})`,
                           backgroundSize: 'cover',
                           backgroundPosition: 'center'
                         }}/>
                    <div style={{ padding: '24px 24px 28px' }}>
                      <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--coral-deep)', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>
                        {categoryLabel(a.category) || t('article.article_word', 'Article')}
                      </div>
                      <h3 className="display" style={{ fontSize: 22, lineHeight: 1.2, margin: '0 0 12px', color: 'var(--ink)' }}>
                        {articleTitle(a)}
                      </h3>
                      <p style={{ fontSize: 14, color: 'var(--ink-mute)', lineHeight: 1.5, margin: '0 0 16px' }}>
                        {(() => { const ex = articleExcerpt(a) || ''; return ex.substring(0, 160) + (ex.length > 160 ? '…' : ''); })()}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)', letterSpacing: '0.06em', borderTop: '1px solid rgba(11,31,40,0.08)', paddingTop: 14 }}>
                        <span>{a.author || ''}</span>
                        <span>{a.date} · {a.read}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--ink-mute)' }}>
                  No articles in this category yet.
                </div>
              )}
            </div>
          </section>

          <Footer/>
        </>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<ArticlesIndex/>);
