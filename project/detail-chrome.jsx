// Shared chrome for detail pages (project / article / news) — uses same design system
// Exposes: window.DetailNav, window.DetailFooter, window.DetailBack, window.DetailCTA

// ── i18n helper for chrome labels (reads window.PREG_LANG, falls back to EN)
const DC_LANG = (typeof window !== 'undefined' ? (window.PREG_LANG || 'en') : 'en').toLowerCase();
function dcT(path, fallback) {
  const root = (typeof window !== 'undefined' && window.PANAMA_DATA && window.PANAMA_DATA.chromeI18n) || {};
  const tree = root[DC_LANG] || root.en || {};
  const en   = root.en || {};
  const parts = path.split('.');
  function dive(obj) { let v = obj; for (const k of parts) { if (v && typeof v === 'object' && k in v) v = v[k]; else return undefined; } return v; }
  const v = dive(tree); if (v != null) return v;
  const e = dive(en); if (e != null) return e;
  return (fallback != null) ? fallback : path;
}
function dcLangPrefix() { return DC_LANG === 'en' ? '' : `/${DC_LANG}`; }

function DetailNav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const prefix = dcLangPrefix();
  // Per-language index pages NOW EXIST (PR #99/101): /es/articles/, /es/news/,
  // /es/videos/, /pt/articles/, etc. Each renders translated content via the
  // i18n-aware renderers. So lang-prefix all list page links too.
  const links = [
    { l: dcT('nav.projects', 'Projects'),   href: `${prefix}/#projects` },
    { l: dcT('nav.regions', 'Regions'),     href: `${prefix}/#regions`  },
    { l: dcT('nav.journal', 'Journal'),     href: `${prefix}/articles/` },
    { l: dcT('nav.videos', 'Videos'),       href: `${prefix}/videos/`   },
    { l: dcT('nav.news', 'News'),           href: `${prefix}/news/`     },
    { l: dcT('nav.residency', 'Residency'), href: `${prefix}/articles/?category=Residency` },
    { l: dcT('nav.about', 'About'),         href: `${prefix}/#about`    },
  ];
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(255, 253, 245, 0.92)' : 'var(--cream)',
      backdropFilter: scrolled ? 'blur(14px) saturate(1.2)' : 'none',
      borderBottom: '1px solid var(--line-soft)',
      transition: 'all 0.4s var(--ease)'
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 72, gap: 16
      }}>
        <Logo onDark={false} size={18}/>
        <nav className="nav-desktop" style={{ display: 'flex', gap: 28, fontSize: 13, fontWeight: 500 }}>
          {links.map(({ l, href }) => (
            <a key={l} href={href} style={{ color: 'inherit', textDecoration: 'none', opacity: 0.9 }}>{l}</a>
          ))}
        </nav>
        <div className="nav-cta-desktop" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <LangSwitcher current={DC_LANG.toUpperCase()} onDark={false}/>
          {/* US phone — always-visible tap-to-call in navbar */}
          <a href="tel:+17319379142" className="nav-callus" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'inherit', textDecoration: 'none',
            padding: '8px 12px', borderRadius: 999, border: '1px solid var(--line)',
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', fontWeight: 700,
            whiteSpace: 'nowrap'
          }} title="(731) 937-9142">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 15.5c-1.2 0-2.5-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2a15 15 0 0 1-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1A11.4 11.4 0 0 1 8.5 4c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/>
            </svg>
            US · (731) 937-9142
          </a>
          <a href={`${dcLangPrefix()}/#reserve`} className="btn btn-coral" style={{ padding: '11px 20px', fontSize: 11 }}>
            {dcT('nav.reserve_a_unit', 'Reserve a unit')} <Icon name="arrow" size={13}/>
          </a>
        </div>
        <button className="nav-burger" onClick={() => setOpen(!open)}
          style={{ display: 'none', background: 'transparent', border: 'none', color: 'var(--ink)', padding: 8, cursor: 'pointer' }}>
          <Icon name={open ? 'close' : 'menu'} size={22}/>
        </button>
      </div>
      {open && (
        <div className="show-mobile" style={{
          padding: '20px var(--gutter) 28px', background: 'var(--paper)',
          borderTop: '1px solid var(--line-soft)', display: 'flex', flexDirection: 'column', gap: 14
        }}>
          {links.map(({ l, href }) => (
            <a key={l} href={href} onClick={() => setOpen(false)}
               style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: 'var(--ink)', textDecoration: 'none' }}>{l}</a>
          ))}
          {/* Lang switcher in mobile burger menu — Comet QA v7 P1: was missing on article pages. */}
          <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <LangSwitcher current={DC_LANG.toUpperCase()} onDark={false}/>
            <a href={`${dcLangPrefix()}/#reserve`} className="btn btn-coral" style={{ justifyContent: 'center', flex: 1 }}>{dcT('nav.reserve_a_unit', 'Reserve a unit')}</a>
          </div>
          {/* Mobile-menu contact strip — direct WhatsApp + US call. Big tap targets. */}
          <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <a href="https://wa.me/50762534802" target="_blank" rel="noopener noreferrer"
               style={{ background: '#25D366', color: '#fff', padding: '12px 14px', borderRadius: 10,
                        textAlign: 'center', textDecoration: 'none', fontSize: 13, fontWeight: 700,
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
              WhatsApp · +507 6253-4802
            </a>
            <a href="tel:+17319379142"
               style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '12px 14px', borderRadius: 10,
                        textAlign: 'center', textDecoration: 'none', fontSize: 13, fontWeight: 700,
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
              US · (731) 937-9142
            </a>
          </div>
        </div>
      )}
      <FloatingContact/>
      <LeadCaptureModal/>
    </header>
  );
}

function DetailBack({ label = 'All projects', href = '/#projects' }) {
  return (
    <a href={href} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
      textTransform: 'uppercase', color: 'var(--coral-deep)', fontWeight: 700,
      textDecoration: 'none'
    }}>
      <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={13}/></span>
      {label}
    </a>
  );
}

function DetailCTA({ kind = 'reserve' }) {
  if (kind === 'reserve') {
    // BUG-010 fix: preserve the article/project/video the visitor came from so the
    // landing-page reservation form (or analytics) can attribute the lead to a source
    // page. Slug is encoded as ?from=<slug> on the home anchor.
    let fromQs = '';
    let waQs = '';
    if (typeof window !== 'undefined') {
      const seg = window.location.pathname.split('/').filter(Boolean);
      const last = seg[seg.length - 1] || '';
      const slug = last.replace(/\.html$/, '');
      const kindGuess = seg.includes('articles') ? 'article' : seg.includes('projects') ? 'project' : seg.includes('news') ? 'news' : seg.includes('videos') ? 'video' : '';
      if (slug && slug !== 'index') {
        const enc = encodeURIComponent(slug);
        fromQs = `?from=${enc}${kindGuess ? `&type=${kindGuess}` : ''}`;
        const titleEl = document.querySelector('h1');
        const title = titleEl ? titleEl.textContent.trim().slice(0, 80) : slug;
        waQs = `?text=${encodeURIComponent(`Hi, I'm interested in: ${title} (panamarealestateguide.com${window.location.pathname})`)}`;
      }
    }
    return (
      <section style={{
        background: 'linear-gradient(160deg, #FFD8A8 0%, #FF9B6A 35%, #FF6B4A 70%, #C94628 100%)',
        padding: 'clamp(60px, 8vw, 100px) 0', color: 'var(--cream)'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}
             data-cta-grid>
          <div>
            <div className="eyebrow" style={{ color: 'rgba(255,249,236,0.9)', marginBottom: 16 }}>
              <span className="rule-coral" style={{ background: 'var(--cream)' }}></span>
              {dcT('cta.eyebrow', 'Reservations open · Refundable deposit')}
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(34px, 5vw, 60px)', margin: 0, color: 'var(--cream)', lineHeight: 1.02 }}>
              {dcT('cta.reserve_from', 'Reserve from')} <em>$5,000.</em> <br/>{dcT('cta.hold_for_thirty_days', 'Hold for thirty days')}<em>.</em>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <a href={`${dcLangPrefix()}/${fromQs}#reserve`} className="btn"
               style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
              {dcT('cta.start_a_reservation', 'Start a reservation')} <Icon name="arrow" size={14}/>
            </a>
            <a href={`https://wa.me/50762534802${waQs}`} className="btn btn-ghost-light">{dcT('cta.whatsapp_label', 'WhatsApp')} +507 6253-4802</a>
            <a href="tel:+17319379142" className="btn btn-ghost-light">{dcT('cta.call_us_label', 'Call US')} (731) 937-9142</a>
          </div>
        </div>
        <style>{`@media (max-width: 900px) { [data-cta-grid] { grid-template-columns: 1fr !important; } }`}</style>
      </section>
    );
  }
  return null;
}

function DetailFooter() {
  // Show legal disclaimer only on project detail pages (not articles/news)
  const showDisclaimer = typeof window !== 'undefined' && window.location.pathname.includes('/projects/');
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '48px 0 32px' }}>
      <div className="container">
        {showDisclaimer && (
          <div style={{
            background: 'rgba(255, 249, 236, 0.06)', borderLeft: '3px solid var(--coral, #E37363)',
            padding: '14px 18px', borderRadius: '0 8px 8px 0', fontSize: 13, lineHeight: 1.55,
            marginBottom: 32, opacity: 0.9
          }}>
            <strong>Aviso importante:</strong> La información de este proyecto tiene fines educativos
            y comerciales. <strong>No constituye asesoría de inversión, financiera ni legal.</strong>
            Renders, planos, precios y disponibilidad son referenciales y pueden cambiar por decisión
            del desarrollador. Antes de reservar, consulta con un asesor independiente. Ver{' '}
            <a href="/terminos" style={{ color: 'var(--coral, #E37363)' }}>términos completos</a>.
          </div>
        )}
        {/* Contact strip — high-visibility WhatsApp + US phone + Email row. */}
        <div style={{
          marginBottom: 28, padding: '18px 22px',
          background: 'linear-gradient(135deg, rgba(227,115,99,0.18), rgba(37,211,102,0.12))',
          border: '1px solid rgba(255,249,236,0.18)', borderRadius: 12,
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18,
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.85, fontWeight: 700 }}>
            {dcT('footer.talk_to_us', 'Talk to us — bilingual concierge')}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="https://wa.me/50762534802" target="_blank" rel="noopener noreferrer"
               style={{ background: '#25D366', color: '#fff', padding: '10px 16px', borderRadius: 999,
                        textDecoration: 'none', fontSize: 13, fontWeight: 700,
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
              WhatsApp · +507 6253-4802
            </a>
            <a href="tel:+17319379142"
               style={{ background: 'var(--coral, #E37363)', color: '#fff', padding: '10px 16px', borderRadius: 999,
                        textDecoration: 'none', fontSize: 13, fontWeight: 700,
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
              US · (731) 937-9142
            </a>
            <a href="mailto:reservations@panamarealestateguide.com"
               style={{ background: 'transparent', color: 'var(--cream)', padding: '10px 16px', borderRadius: 999,
                        textDecoration: 'none', fontSize: 13, fontWeight: 700,
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
                        border: '1px solid rgba(255,249,236,0.3)' }}>
              reservations@panamarealestateguide.com
            </a>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <Logo onDark={true} size={16}/>
          {/* List pages now have per-language versions (PR #99/101) — link to
              /<lang>/articles/, /<lang>/news/, /<lang>/videos/ so the user stays
              in their chosen language across the whole site. */}
          <div style={{ display: 'flex', gap: 24, fontSize: 12, opacity: 0.75, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', flexWrap: 'wrap' }}>
            <a href={`${dcLangPrefix()}/#projects`} style={{ color: 'inherit', textDecoration: 'none' }}>{dcT('footer.links.projects', 'Projects')}</a>
            <a href={`${dcLangPrefix()}/articles/`} style={{ color: 'inherit', textDecoration: 'none' }}>{dcT('footer.links.journal', 'Journal')}</a>
            <a href={`${dcLangPrefix()}/videos/`} style={{ color: 'inherit', textDecoration: 'none' }}>{dcT('footer.links.videos', 'Videos')}</a>
            <a href={`${dcLangPrefix()}/news/`} style={{ color: 'inherit', textDecoration: 'none' }}>{dcT('footer.links.news', 'News')}</a>
            <a href="/privacy.html" style={{ color: 'inherit', textDecoration: 'none' }}>{dcT('footer.links.privacy', 'Privacy')}</a>
            <a href="/terms.html" style={{ color: 'inherit', textDecoration: 'none' }}>{dcT('footer.links.terms', 'Terms')}</a>
          </div>
          <div style={{ fontSize: 11, opacity: 0.6, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>
            {dcT('footer.copyright', '© 2026 PanamaRealEstateGuide.com')}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Auto-inject schema.org RealEstateListing JSON-LD on project detail pages.
 * Runs once on DOMContentLoaded after window.PANAMA_DATA is available. */
(function autoInjectProjectSchema() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  function inject() {
    try {
      var path = window.location.pathname;
      if (!path.includes('/projects/')) return;
      if (!window.PANAMA_DATA || !window.PANAMA_DATA.projects) {
        // Data may load async — retry a few times
        if ((window.__schemaRetries = (window.__schemaRetries || 0) + 1) < 20) {
          setTimeout(inject, 250);
        }
        return;
      }
      if (document.querySelector('script[type="application/ld+json"][data-injected="schema-RealEstateListing"]')) return;
      var id = path.split('/').pop().replace('.html', '');
      var p = window.PANAMA_DATA.projects.find(function (x) { return x.id === id; });
      if (!p) return;
      // Parse priceFrom (e.g., "$285,000" or "USD $285K")
      var priceMatch = String(p.priceFrom || p.from || '').match(/(\d[\d,.]*)/);
      var lowPrice = priceMatch ? parseInt(priceMatch[1].replace(/[,.]/g, '')) : undefined;
      var schema = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        'name': p.name,
        'description': p.tagline || p.about || '',
        'url': window.location.href,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': p.location || p.region || 'Panama',
          'addressRegion': p.region || 'Panama',
          'addressCountry': 'PA'
        },
        'numberOfRooms': p.units || undefined,
        'floorSize': p.size ? { '@type': 'QuantitativeValue', 'value': p.size } : undefined,
        'datePosted': new Date().toISOString().slice(0, 10)
      };
      if (lowPrice) {
        schema.offers = {
          '@type': 'Offer',
          'price': lowPrice,
          'priceCurrency': 'USD',
          'availability': p.status && p.status.toLowerCase().includes('sold') ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock'
        };
      }
      if (p.developer) {
        schema.provider = { '@type': 'Organization', 'name': p.developer };
      }
      if (p.cover) {
        schema.image = p.cover.startsWith('http') ? p.cover : 'https://panamarealestateguide.com/' + p.cover.replace(/^\/?/, '');
      }
      var s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-injected', 'schema-RealEstateListing');
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    } catch (e) {
      console.warn('[schema] injection failed:', e);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();

Object.assign(window, { DetailNav, DetailBack, DetailCTA, DetailFooter });


/* Photo lightbox — click any project image to view it big.
   Pass an array of image URLs and the index to start at. */
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = React.useState(startIndex || 0);
  React.useEffect(() => {
    function key(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft')  setIdx(i => (i - 1 + images.length) % images.length);
    }
    window.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = '';
    };
  }, [images.length, onClose]);
  if (!images || !images.length) return null;
  const next = () => setIdx(i => (i + 1) % images.length);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(7, 23, 31, 0.94)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(20px, 4vw, 60px)', cursor: 'zoom-out'
    }}>
      <img src={`../${images[idx]}`} onClick={e => e.stopPropagation()}
        alt="" loading="lazy" decoding="async" style={{
          maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
          borderRadius: 6, boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)',
          cursor: 'default'
        }}/>
      {/* close button */}
      <button onClick={onClose} aria-label="Close" style={{
        position: 'absolute', top: 24, right: 24,
        width: 44, height: 44, border: 'none', borderRadius: '50%',
        background: 'rgba(255,249,236,0.12)', color: 'var(--cream)',
        fontSize: 22, cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      }}>&times;</button>
      {/* prev / next */}
      {images.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous" style={{
            position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
            width: 52, height: 52, border: 'none', borderRadius: '50%',
            background: 'rgba(255,249,236,0.12)', color: 'var(--cream)',
            fontSize: 22, cursor: 'pointer'
          }}>&#8592;</button>
          <button onClick={e => { e.stopPropagation(); next(); }} aria-label="Next" style={{
            position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
            width: 52, height: 52, border: 'none', borderRadius: '50%',
            background: 'rgba(255,249,236,0.12)', color: 'var(--cream)',
            fontSize: 22, cursor: 'pointer'
          }}>&#8594;</button>
          {/* counter */}
          <div style={{
            position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.14em',
            color: 'rgba(255,249,236,0.7)', textTransform: 'uppercase'
          }}>
            {String(idx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>
        </>
      )}
    </div>
  );
}
