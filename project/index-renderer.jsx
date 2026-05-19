// Lazy-loader: only fetch Three.js + webgl-rainforest when user actually picks
    // the Rainforest hero variant. Saves ~600 KB on initial page load and improves LCP.
    let rainforestLoadPromise = null;
    function loadScript(src, integrity) {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement('script');
        s.src = src;
        if (integrity) { s.integrity = integrity; s.crossOrigin = 'anonymous'; }
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.head.appendChild(s);
      });
    }
    function loadRainforest() {
      if (rainforestLoadPromise) return rainforestLoadPromise;
      rainforestLoadPromise = loadScript(
        'https://unpkg.com/three@0.160.0/build/three.min.js',
        'sha384-qOkzR5Ke/XkQxuGVJ9hpFEpDlcoLtWwVYhnJf06cLIZa2vaIptSqaubivErzmD5O'
      ).then(() => loadScript('webgl-rainforest.js?v=1777260393'));
      return rainforestLoadPromise;
    }

    function App() {
      const [heroVariant, setHeroVariantRaw] = React.useState(() => {
        return localStorage.getItem('heroVariant') || 'editorial';
      });
      const [rainforestReady, setRainforestReady] = React.useState(() => {
        // if initial variant is rainforest, trigger lazy load
        const v = localStorage.getItem('heroVariant') || 'editorial';
        if (v === 'rainforest') { loadRainforest().then(() => true); return false; }
        return true; // not needed for editorial
      });

      // Wrapper: lazy-load three+rainforest BEFORE switching to rainforest variant
      const setHeroVariant = (v) => {
        if (v === 'rainforest') {
          loadRainforest().then(() => { setRainforestReady(true); setHeroVariantRaw(v); });
        } else {
          setHeroVariantRaw(v);
        }
      };

      // also flip rainforestReady when initial-load promise resolves
      React.useEffect(() => {
        if (heroVariant === 'rainforest' && !rainforestReady) {
          loadRainforest().then(() => setRainforestReady(true));
        }
      }, []);

      React.useEffect(() => {
        localStorage.setItem('heroVariant', heroVariant);
      }, [heroVariant]);

      React.useEffect(() => {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
        }, { threshold: 0.1 });
        const obs = () => document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
        obs();
        const t = setInterval(obs, 500);
        return () => { io.disconnect(); clearInterval(t); };
      }, []);

      return (
        <>
          <Navbar transparent={false}/>
          {heroVariant === 'editorial' || !rainforestReady ? <HeroEditorial/> : <Hero/>}
          <Marquee/>
          <Projects/>
          <Regions/>
          <Journal/>
          <News/>
          <Testimonials/>
          <FAQ/>
          <BookConsultation/>
          <ReserveCTA/>
          <Footer/>

          {/* Hero variant switcher (small, bottom-left) */}
          <div style={{
            position: 'fixed', left: 20, bottom: 20, zIndex: 40,
            display: 'flex', gap: 0, background: 'var(--ink)', color: 'var(--cream)',
            borderRadius: 999, padding: 4, boxShadow: '0 12px 28px -8px rgba(11,39,51,0.4)',
            fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.08em',
            textTransform: 'uppercase', fontWeight: 700
          }}>
            <div style={{ padding: '6px 12px 6px 14px', opacity: 0.6 }}>Hero</div>
            {[
              { id: 'editorial', label: 'Editorial' },
              { id: 'rainforest', label: 'Rainforest' }
            ].map(v => (
              <button key={v.id} onClick={() => setHeroVariant(v.id)} style={{
                padding: '6px 14px', border: 'none', cursor: 'pointer',
                background: heroVariant === v.id ? 'var(--coral)' : 'transparent',
                color: heroVariant === v.id ? 'var(--paper)' : 'var(--cream)',
                borderRadius: 999, fontFamily: 'inherit', fontSize: 'inherit',
                letterSpacing: 'inherit', textTransform: 'inherit', fontWeight: 'inherit',
                transition: 'all 0.2s var(--ease)'
              }}>
                {v.label}
              </button>
            ))}
          </div>

          <a href="https://wa.me/50762534802" target="_blank" rel="noopener" aria-label="WhatsApp" style={{
            position: 'fixed', right: 20, bottom: 20, zIndex: 40,
            width: 54, height: 54, borderRadius: '50%',
            background: '#25D366', color: '#fff',
            boxShadow: '0 12px 28px -8px rgba(37,211,102,0.55)',
            display: 'grid', placeItems: 'center', textDecoration: 'none'
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-8.7 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.2 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1a16 16 0 0 1-4.2-2.1 12 12 0 0 1-3.1-3.7c-.4-.6-.9-1.6-.9-2.5s.5-1.4.7-1.6c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.5c-.1.1-.3.3-.1.6a9 9 0 0 0 1.6 2 8 8 0 0 0 2.3 1.4c.3.1.5.1.6 0l.6-.7c.2-.3.5-.2.7-.1l2 .9c.2.1.4.2.5.3 0 .1 0 .7-.2 1.5Z"/>
            </svg>
          </a>
        </>
      );
    }

    // Hydrate project data from the build-time Airtable snapshot, then render.
    // If the snapshot can't be loaded, render with the data.js fallback already in memory.
    function renderApp() {
      ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
    }

    fetch('airtable-projects.json', { cache: 'no-cache' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        if (data && Array.isArray(data.projects) && data.projects.length) {
          window.PANAMA_DATA.projects = data.projects;
          window.PANAMA_DATA._projectsSource = 'airtable';
          window.PANAMA_DATA._projectsGeneratedAt = data.generatedAt;
          window.PANAMA_DATA._projectsCount = data.count;
        }
      })
      .catch(err => {
        console.info('[projects] using data.js fallback —', err);
        window.PANAMA_DATA._projectsSource = 'fallback';
      })
      .finally(renderApp);
