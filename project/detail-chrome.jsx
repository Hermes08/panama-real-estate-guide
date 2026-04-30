// Shared chrome for detail pages (project / article / news) — uses same design system
// Exposes: window.DetailNav, window.DetailFooter, window.DetailBack, window.DetailCTA

function DetailNav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    { l: 'Projects', href: '../Panama Caribbean Projects.html#projects' },
    { l: 'Regions', href: '../Panama Caribbean Projects.html#regions' },
    { l: 'Journal', href: '../Panama Caribbean Projects.html#journal' },
    { l: 'News', href: '../news/index.html' },
    { l: 'About', href: '../Panama Caribbean Projects.html#about' },
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
          <LangSwitcher current="EN" onDark={false}/>
          <a href="../Panama Caribbean Projects.html#reserve" className="btn btn-coral" style={{ padding: '11px 20px', fontSize: 11 }}>
            Reserve a unit <Icon name="arrow" size={13}/>
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
          <div style={{ marginTop: 12 }}>
            <a href="../Panama Caribbean Projects.html#reserve" className="btn btn-coral" style={{ justifyContent: 'center', width: '100%' }}>Reserve a unit</a>
          </div>
        </div>
      )}
    </header>
  );
}

function DetailBack({ label = 'All projects', href = '../Panama Caribbean Projects.html#projects' }) {
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
              Reservations open · Refundable deposit
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(34px, 5vw, 60px)', margin: 0, color: 'var(--cream)', lineHeight: 1.02 }}>
              Reserve from <em>$5,000.</em> <br/>Hold for <em>thirty days.</em>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <a href="../Panama Caribbean Projects.html#reserve" className="btn"
               style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
              Start a reservation <Icon name="arrow" size={14}/>
            </a>
            <a href="https://wa.me/50767610315" className="btn btn-ghost-light">WhatsApp +507 6761-0315</a>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <Logo onDark={true} size={16}/>
          <div style={{ display: 'flex', gap: 24, fontSize: 12, opacity: 0.75, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', flexWrap: 'wrap' }}>
            <a href="../Panama Caribbean Projects.html#projects" style={{ color: 'inherit', textDecoration: 'none' }}>Projects</a>
            <a href="../Panama Caribbean Projects.html#journal" style={{ color: 'inherit', textDecoration: 'none' }}>Journal</a>
            <a href="../Panama Caribbean Projects.html#news" style={{ color: 'inherit', textDecoration: 'none' }}>News</a>
            <a href="/privacidad" style={{ color: 'inherit', textDecoration: 'none' }}>Privacidad</a>
            <a href="/terminos" style={{ color: 'inherit', textDecoration: 'none' }}>Términos</a>
          </div>
          <div style={{ fontSize: 11, opacity: 0.6, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>
            © 2026 PanamaRealEstateGuide.com
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
        alt="" style={{
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
