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
    <a href={(() => {
         // Resolve to the language-specific home so we don't 404 on /es/articles/ etc.
         if (typeof window === 'undefined') return '/';
         const path = window.location.pathname;
         const langMatch = path.match(/^\/(es|pt|de)(\/|$)/);
         const langHome = langMatch ? `/${langMatch[1]}/` : '/';
         // If we're on the language home itself, scroll-to-top instead of navigating.
         if (path === langHome) return langHome;
         return langHome;
       })()}
       onClick={(e) => {
         if (typeof window === 'undefined') return;
         const path = window.location.pathname;
         const langMatch = path.match(/^\/(es|pt|de)(\/|$)/);
         const langHome = langMatch ? `/${langMatch[1]}/` : '/';
         if (path === langHome) {
           // Already on home — just smooth-scroll up instead of reloading
           e.preventDefault();
           window.scrollTo({ top: 0, behavior: 'smooth' });
         }
         // On subpages: let the default navigation happen (go to langHome)
       }}
       aria-label="PanamaRealEstateGuide.com — home"
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
  // Navigate to the per-language equivalent URL when a code is clicked.
  // We now have real per-language INDEX pages built:
  //   /es/articles/ /pt/articles/ /de/articles/
  //   /es/news/ /pt/news/ /de/news/
  //   /es/videos/ /pt/videos/ /de/videos/
  // So clicking ES on /articles/ → /es/articles/ (renders real Spanish article list).
  //
  // DETAIL pages without per-language versions on disk (/projects/<slug>.html,
  // /news/<slug>.html, /videos/<id>.html) fall back to EN canonical via _redirects,
  // so we just prefix and let Netlify handle it. For ARTICLES we explicitly check
  // articleMeta to know if a translated detail exists — if not, we route to the
  // /<lang>/articles/ index instead of letting the user land on a 404/EN bounce.
  function selectLang(code) {
    onChange?.(code);
    setOpen(false);
    if (typeof window === 'undefined') return;
    const target = code.toLowerCase();
    const path = window.location.pathname;
    // Strip any existing /es/ /pt/ /de/ prefix
    const stripped = path.replace(/^\/(es|pt|de)(\/|$)/, '/');
    let newPath;
    if (target === 'en') {
      newPath = stripped;
    } else {
      // For article-detail pages, only go to /<lang>/articles/<slug>.html if the
      // translation exists. Otherwise route to /<lang>/articles/ (the new index).
      const articleSlugMatch = stripped.match(/^\/articles\/([a-z0-9-]+)\.html$/);
      if (articleSlugMatch) {
        const slug = articleSlugMatch[1];
        const hasTranslation = window.PANAMA_DATA && window.PANAMA_DATA.articleMeta
          && window.PANAMA_DATA.articleMeta[target] && window.PANAMA_DATA.articleMeta[target][slug];
        newPath = hasTranslation ? `/${target}/articles/${slug}.html` : `/${target}/articles/`;
      } else {
        // Default: prefix everything else with the lang. Netlify serves
        // /<lang>/articles/ /<lang>/news/ /<lang>/videos/ from the new index files,
        // and redirects /<lang>/projects/* /<lang>/news/<slug> /<lang>/videos/<id>
        // back to EN canonical via _redirects.
        newPath = `/${target}${stripped === '/' ? '/' : stripped}`;
      }
    }
    // Persist preference so future pages honour it (geo-route edge function reads this)
    try { document.cookie = `preg_lang=${target};path=/;max-age=31536000;samesite=lax;secure`; } catch (e) {}
    window.location.href = newPath + window.location.search + window.location.hash;
  }
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
            <button key={l.code} onClick={() => selectLang(l.code)} style={{
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

/* ── FloatingContact — sticky bottom-right buttons (WhatsApp + Call US) ──
 *  Visible on every page, both mobile and desktop. Two big tap targets:
 *    • WhatsApp green circle → wa.me/50762534802 (+507 6253-4802)
 *    • Call US ink circle    → tel:+17319379142 ((731) 937-9142)
 *  Sits above the cookie banner (z-index 40) but below the nav (z-index 50).
 */
function FloatingContact() {
  const LANG = (typeof window !== 'undefined' && window.PREG_LANG) || 'en';
  const i18n = (window.PANAMA_DATA && window.PANAMA_DATA.chromeI18n && (window.PANAMA_DATA.chromeI18n[LANG] || window.PANAMA_DATA.chromeI18n.en)) || {};
  const labels = (i18n.floating_contact) || {};
  const lWhatsapp = labels.whatsapp || 'WhatsApp +507 6253-4802';
  const lCallUs   = labels.call_us  || 'Call US (731) 937-9142';

  // First-load pulse — WhatsApp pulses 2× over 3s, once per browser session.
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (!sessionStorage.getItem('preg_first_load_pulse')) {
        setPulse(true);
        sessionStorage.setItem('preg_first_load_pulse', '1');
        const t = setTimeout(() => setPulse(false), 3200);
        return () => clearTimeout(t);
      }
    } catch (e) {}
  }, []);

  const btnStyle = {
    width: 54, height: 54, borderRadius: '50%',
    display: 'grid', placeItems: 'center', textDecoration: 'none',
    transition: 'transform 0.15s var(--ease), box-shadow 0.2s var(--ease)'
  };
  // Portal to body so we escape any ancestor that creates a containing block
  // for fixed-positioned elements (e.g. backdrop-filter on the navbar).
  if (typeof document === 'undefined') return null;
  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed', right: 16, bottom: 16, zIndex: 40,
      display: 'flex', flexDirection: 'column', gap: 12,
      alignItems: 'flex-end'
    }}>
      <a href="tel:+17319379142" aria-label={lCallUs} title={lCallUs}
         style={{ ...btnStyle, background: 'var(--ink)', color: 'var(--cream)',
                  boxShadow: '0 12px 28px -8px rgba(11,39,51,0.6), 0 0 0 4px rgba(255,253,245,0.65)' }}
         onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
         onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20 15.5c-1.2 0-2.5-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2a15 15 0 0 1-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1A11.4 11.4 0 0 1 8.5 4c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/>
        </svg>
      </a>
      <a href="https://wa.me/50762534802" target="_blank" rel="noopener noreferrer"
         aria-label={lWhatsapp} title={lWhatsapp}
         className={pulse ? 'preg-pulse' : ''}
         style={{ ...btnStyle, background: '#25D366', color: '#fff',
                  boxShadow: '0 12px 28px -8px rgba(37,211,102,0.55), 0 0 0 4px rgba(255,253,245,0.65)',
                  position: 'relative' }}
         onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
         onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.7 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.2 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1a16 16 0 0 1-4.2-2.1 12 12 0 0 1-3.1-3.7c-.4-.6-.9-1.6-.9-2.5s.5-1.4.7-1.6c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.5c-.1.1-.3.3-.1.6a9 9 0 0 0 1.6 2 8 8 0 0 0 2.3 1.4c.3.1.5.1.6 0l.6-.7c.2-.3.5-.2.7-.1l2 .9c.2.1.4.2.5.3 0 .1 0 .7-.2 1.5Z"/>
        </svg>
      </a>
    </div>,
    document.body
  );
}

/* ── LeadCaptureModal — pop-up after 3+ content pageviews ──────────────────
 *  Tracks distinct visits to article / project / news / video pages in
 *  localStorage. Once the visitor has seen >= 3 different content pages,
 *  shows a non-blocking modal asking for first name + last name + email +
 *  phone. Form POSTs to Netlify Forms (form name="lead-capture" declared
 *  statically in project/index.html so the Netlify build crawler indexes it).
 *
 *  Dismissal is remembered for 7 days; successful submit is remembered
 *  forever (until localStorage is cleared). i18n via chrome-i18n.lead_capture.
 */
function LeadCaptureModal() {
  const [open, setOpen]           = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const [error, setError]         = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '' });

  const LANG = (typeof window !== 'undefined' && window.PREG_LANG) || 'en';
  const i18n = (window.PANAMA_DATA && window.PANAMA_DATA.chromeI18n && (window.PANAMA_DATA.chromeI18n[LANG] || window.PANAMA_DATA.chromeI18n.en)) || {};
  const L = i18n.lead_capture || {};

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const VISITED_KEY = 'preg_visited_pages_v1';
      const SUBMITTED_KEY = 'preg_lead_submitted';
      const DISMISSED_KEY = 'preg_lead_dismissed_at';
      // Only content pages count: article / project / news / video detail (any lang)
      const path = window.location.pathname;
      const isContent = /^\/(?:[a-z]{2}\/)?(?:articles|projects|proyectos|news|videos)\/[a-z0-9_-]+\.html$/i.test(path);
      const visited = JSON.parse(localStorage.getItem(VISITED_KEY) || '[]');
      if (isContent && !visited.includes(path)) {
        visited.push(path);
        // cap stored history at 50 entries
        if (visited.length > 50) visited.shift();
        localStorage.setItem(VISITED_KEY, JSON.stringify(visited));
      }
      if (localStorage.getItem(SUBMITTED_KEY)) return;
      const dismissedAt = parseInt(localStorage.getItem(DISMISSED_KEY) || '0', 10);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (dismissedAt && (Date.now() - dismissedAt) < sevenDays) return;
      if (visited.length >= 3) {
        // delay so it doesn't feel aggressive
        const t = setTimeout(() => setOpen(true), 7000);
        return () => clearTimeout(t);
      }
    } catch (e) { /* localStorage may be blocked — silently skip */ }
  }, []);

  const dismiss = () => {
    setOpen(false);
    try { localStorage.setItem('preg_lead_dismissed_at', String(Date.now())); } catch (e) {}
  };

  const encodeForm = (data) =>
    Object.keys(data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.first_name) {
      setError(L.error_required || 'Name and email are required.');
      return;
    }
    setSending(true);
    let visited = [];
    try { visited = JSON.parse(localStorage.getItem('preg_visited_pages_v1') || '[]'); } catch (e) {}
    const payload = {
      _form: 'lead-capture',
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      language: LANG,
      visited_pages: visited.join('\n'),
      current_page: window.location.pathname,
      referer: document.referrer || '',
      submitted_at: new Date().toISOString(),
    };
    try {
      const res = await fetch('/api/form-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      setSubmitted(true);
      try { localStorage.setItem('preg_lead_submitted', '1'); } catch (e) {}
    } catch (err) {
      setError(L.error_network || 'Could not submit — please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  return ReactDOM.createPortal(
    <div role="dialog" aria-modal="true" aria-labelledby="lead-capture-title"
         className="preg-modal-backdrop"
         style={{
           position: 'fixed', inset: 0, zIndex: 60,
           background: 'rgba(11, 39, 51, 0.62)', backdropFilter: 'blur(6px)',
           display: 'grid', placeItems: 'center',
           padding: '20px'
         }}
         onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}>
      <div className="preg-modal-card" style={{
        background: 'var(--paper)', color: 'var(--ink)',
        maxWidth: 480, width: '100%', borderRadius: 18,
        padding: 'clamp(28px, 4vw, 40px)', position: 'relative',
        boxShadow: '0 30px 80px -20px rgba(0,0,0,0.5)'
      }}>
        <button onClick={dismiss} aria-label={L.dismiss || 'Close'}
                style={{
                  position: 'absolute', top: 14, right: 14,
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'transparent', border: '1px solid var(--line)',
                  display: 'grid', placeItems: 'center', cursor: 'pointer',
                  color: 'var(--ink)'
                }}>
          <Icon name="close" size={14}/>
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div className="preg-check">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              <span className="rule-coral"></span>{L.thank_you_eyebrow || 'Thank you'}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 14px', lineHeight: 1.1 }}>
              {L.thank_you_title || 'We’ll be in touch.'}
            </h3>
            <p style={{ fontSize: 15, opacity: 0.78, lineHeight: 1.55, marginBottom: 24 }}>
              {L.thank_you_body || 'A bilingual concierge will reach out within 24 hours on WhatsApp.'}
            </p>
            <a href="https://wa.me/50762534802" target="_blank" rel="noopener noreferrer"
               style={{ display: 'inline-block', padding: '12px 24px',
                        background: '#25D366', color: '#fff',
                        textDecoration: 'none', borderRadius: 999,
                        fontSize: 13, fontWeight: 700,
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
              {L.thank_you_whatsapp_now || 'Or message us on WhatsApp now'}
            </a>
          </div>
        ) : (
          <>
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              <span className="rule-coral"></span>{L.eyebrow || 'Get our project shortlist'}
            </div>
            <h3 id="lead-capture-title" style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 36px)',
              margin: '0 0 12px', lineHeight: 1.08
            }}>
              {L.title || 'The next three projects that fit you.'}
            </h3>
            <p style={{ fontSize: 14, opacity: 0.78, lineHeight: 1.55, margin: '0 0 22px' }}>
              {L.subtitle || 'Tell us how to reach you. We’ll send a personalised shortlist based on what you’ve been reading — no spam, ever.'}
            </p>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input required type="text" autoComplete="given-name" placeholder={L.first_name_placeholder || 'First name'}
                       value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                       style={inputStyle}/>
                <input type="text" autoComplete="family-name" placeholder={L.last_name_placeholder || 'Last name'}
                       value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                       style={inputStyle}/>
              </div>
              <input required type="email" autoComplete="email" placeholder={L.email_placeholder || 'Email address'}
                     value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                     style={inputStyle}/>
              <input type="tel" autoComplete="tel" placeholder={L.phone_placeholder || 'WhatsApp / phone (with country code)'}
                     value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                     style={inputStyle}/>
              {error && (
                <div style={{ color: '#C94628', fontSize: 13, padding: '6px 0' }}>{error}</div>
              )}
              <button type="submit" className="btn btn-coral" disabled={sending}
                      style={{ width: '100%', justifyContent: 'center', marginTop: 6,
                               opacity: sending ? 0.6 : 1 }}>
                {sending ? (L.submit_sending || 'Sending…') : (L.submit_label || 'Send me the shortlist')} <Icon name="arrow" size={14}/>
              </button>
              <p style={{ fontSize: 11, opacity: 0.6, lineHeight: 1.55, margin: '6px 0 0', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                {L.privacy_note || 'Your details stay private. We never share them with third parties.'}
              </p>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 10,
  border: '1px solid var(--line)', background: 'var(--cream)',
  fontSize: 15, fontFamily: 'inherit', color: 'var(--ink)',
  outline: 'none', transition: 'border-color 0.15s var(--ease)'
};

/* ── ReserveModal — 3-step reservation flow (replaces #reserve anchor) ───
 *  Opens when any link with href ending in #reserve is clicked anywhere on
 *  the page (intercepted globally on mount). 3 steps:
 *
 *    1. Your details — name, email, phone, project preview card
 *    2. Financing & budget — cash/financing/mixed + budget + timeline chips
 *    3. Review & confirm — summary card + opt-in checkbox + submit
 *
 *  Success state shows a "PRG-YYYY-XXXXXX" reference number (generated
 *  client-side) plus a one-tap WhatsApp link with the ref pre-filled in
 *  the message body.
 *
 *  Submissions POST to Netlify Forms (form name="reservation" declared
 *  statically in project/index.html alongside the lead-capture form).
 *  No backend / payment processor — this is a qualified lead capture.
 */
function generateRef() {
  // PRG-YYYY-XXXXXX (uppercase alphanumeric, easy to read aloud)
  const yr = new Date().getFullYear();
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 6; i++) rand += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `PRG-${yr}-${rand}`;
}

function ReserveModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const [error, setError]         = useState(null);
  const [refNum, setRefNum]       = useState('');
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    funding: '', budget: '', timeline: '',
    marketing_optin: true,
    property: '' // pre-filled from ?from=<slug> if present
  });

  const LANG = (typeof window !== 'undefined' && window.PREG_LANG) || 'en';
  const i18n = (window.PANAMA_DATA && window.PANAMA_DATA.chromeI18n && (window.PANAMA_DATA.chromeI18n[LANG] || window.PANAMA_DATA.chromeI18n.en)) || {};
  const R = i18n.reserve_modal || {};

  // Global click interceptor: any link ending in #reserve opens the modal instead.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!/#reserve(\?|$)/.test(href) && !href.endsWith('#reserve')) return;
      // Pre-fill property from ?from= query param if present on the link
      const m = href.match(/\?from=([^&#]+)/);
      let property = '';
      if (m) {
        try { property = decodeURIComponent(m[1]); } catch (e) {}
      } else if (window.location.pathname.match(/\/(projects|articles|news|videos)\/[^/]+\.html$/)) {
        // Pre-fill from current page slug
        const slug = window.location.pathname.split('/').pop().replace(/\.html$/, '');
        property = slug;
      }
      e.preventDefault();
      setForm(f => ({ ...f, property }));
      setStep(1);
      setSubmitted(false);
      setError(null);
      setOpen(true);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // ESC key dismiss
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const goNext = () => {
    setError(null);
    if (step === 1) {
      if (!form.first_name || !form.last_name || !form.email || !form.phone) {
        setError(R.error_step1 || 'All fields are required.');
        return;
      }
    }
    if (step === 2) {
      if (!form.funding || !form.budget || !form.timeline) {
        setError(R.error_step2 || 'Choose funding, budget, and timeline.');
        return;
      }
    }
    setStep(s => s + 1);
  };
  const goBack = () => { setError(null); setStep(s => s - 1); };

  const encodeForm = (data) =>
    Object.keys(data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&');

  const onSubmit = async () => {
    setError(null);
    setSending(true);
    const ref = generateRef();
    const payload = {
      _form: 'reservation',
      reference: ref,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      funding: form.funding,
      budget: form.budget,
      timeline: form.timeline,
      marketing_optin: form.marketing_optin ? 'yes' : 'no',
      property: form.property,
      language: LANG,
      current_page: typeof window !== 'undefined' ? window.location.pathname : '',
      referer: typeof document !== 'undefined' ? document.referrer : '',
      submitted_at: new Date().toISOString(),
      'bot-field': '',
    };
    try {
      const res = await fetch('/api/form-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json().catch(() => ({}));
      setRefNum(data.reference || ref);
      setSubmitted(true);
    } catch (err) {
      setError(R.error_network || 'Could not submit — please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  const fundingOptions = [
    { id: 'cash',      mark: 'A', label: R.funding_cash      || 'Cash',      sub: R.funding_cash_sub      || 'Funds ready' },
    { id: 'financing', mark: 'B', label: R.funding_financing || 'Financing', sub: R.funding_financing_sub || 'Need a loan' },
    { id: 'mixed',     mark: 'C', label: R.funding_mixed     || 'Mixed',     sub: R.funding_mixed_sub     || 'Cash + loan' },
  ];
  const budgetOptions = ['<$250k', '$250–500k', '$500k–1M', '$1M+'];
  const timelineOptions = [
    R.timeline_now      || 'Now',
    R.timeline_3m       || '3 months',
    R.timeline_6m       || '6 months',
    R.timeline_browsing || 'Just looking'
  ];

  if (typeof document === 'undefined') return null;
  return ReactDOM.createPortal(
    <div role="dialog" aria-modal="true" aria-labelledby="reserve-modal-title"
         className="preg-modal-backdrop"
         style={{
           position: 'fixed', inset: 0, zIndex: 70,
           background: 'rgba(11, 39, 51, 0.62)', backdropFilter: 'blur(6px)',
           display: 'grid', placeItems: 'center', padding: '20px',
           overflowY: 'auto'
         }}
         onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="preg-modal-card" style={{
        background: 'var(--paper)', color: 'var(--ink)',
        maxWidth: 540, width: '100%', borderRadius: 20,
        padding: 'clamp(28px, 4vw, 36px)', position: 'relative',
        boxShadow: '0 30px 80px -20px rgba(0,0,0,0.5)',
        margin: '20px 0'
      }}>
        <button onClick={() => setOpen(false)} aria-label={R.close || 'Close'}
                style={{
                  position: 'absolute', top: 16, right: 16,
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'transparent', border: '1px solid var(--line)',
                  display: 'grid', placeItems: 'center', cursor: 'pointer',
                  color: 'var(--ink-mute)'
                }}>
          <Icon name="close" size={14}/>
        </button>

        {submitted ? (
          /* ── SUCCESS STATE ─────────────────────────────────────────── */
          <div style={{ textAlign: 'center', padding: '12px 0 4px' }}>
            <div className="preg-check" style={{ width: 60, height: 60 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="eyebrow" style={{ marginBottom: 14, justifyContent: 'center', display: 'inline-flex' }}>
              <span className="rule-coral"></span>{R.success_eyebrow || 'Reserved · pending confirmation'}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 36px)', margin: '0 0 14px', lineHeight: 1.08 }}>
              {(R.success_title_prefix || 'Hold placed.')} <em style={{ fontStyle: 'italic', color: 'var(--coral)' }}>{form.first_name || R.success_title_suffix_generic || 'You\'re in'}.</em>
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 auto 22px', maxWidth: '42ch' }}>
              {R.success_body || 'A bilingual concierge will WhatsApp you within 24 hours to confirm and walk through next steps.'}
            </p>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
              color: 'var(--coral-deep)', padding: '8px 14px',
              background: 'rgba(255,107,74,0.08)', borderRadius: 999,
              display: 'inline-block', marginBottom: 24
            }}>
              REF · {refNum}
            </div>
            <div>
              <a href={`https://wa.me/50762534802?text=${encodeURIComponent(`Hi! My reservation reference is ${refNum}.`)}`}
                 target="_blank" rel="noopener noreferrer"
                 style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                          padding: '12px 22px', background: '#25D366', color: '#fff',
                          textDecoration: 'none', borderRadius: 999, fontWeight: 600,
                          fontSize: 13, fontFamily: 'var(--font-body)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.7 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z"/></svg>
                {R.success_whatsapp || 'Message us on WhatsApp now'}
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 26 }}>
              {[1,2,3].map(n => (
                <div key={n} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: n < step ? 'var(--coral-deep)' : (n === step ? 'var(--coral)' : 'var(--line)'),
                  transition: 'background 0.3s'
                }}/>
              ))}
            </div>

            <div className="eyebrow" style={{ marginBottom: 14 }}>
              <span className="rule-coral"></span>{R.step_label?.replace('{n}', step) || `Step ${step} of 3`} · {[R.step1_label || 'Your details', R.step2_label || 'Financing', R.step3_label || 'Review'][step-1]}
            </div>

            {/* STEP 1 — Details */}
            {step === 1 && (
              <>
                <h3 id="reserve-modal-title" style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 36px)',
                  margin: '0 0 10px', lineHeight: 1.08
                }}>
                  {R.step1_title_prefix || 'Hold this unit for'} <em style={{ fontStyle: 'italic', color: 'var(--coral)' }}>{R.step1_title_emphasis || 'thirty days'}.</em>
                </h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 0 20px' }}>
                  {R.step1_sub || 'Tell us how to reach you — a bilingual concierge will confirm within 24 hours. No payment required to begin.'}
                </p>

                {form.property && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', background: 'var(--cream)',
                    border: '1px solid var(--line)', borderRadius: 12, marginBottom: 18
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 8,
                      background: 'linear-gradient(135deg, var(--coral), var(--coral-deep))', flexShrink: 0
                    }}/>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500 }}>
                        {form.property.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 3 }}>
                        {R.step1_property_label || 'Selected property'}
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); goNext(); }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <input required style={inputStyle} type="text" autoComplete="given-name"
                           placeholder={R.first_name_placeholder || 'First name'}
                           value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}/>
                    <input required style={inputStyle} type="text" autoComplete="family-name"
                           placeholder={R.last_name_placeholder || 'Last name'}
                           value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}/>
                  </div>
                  <input required style={inputStyle} type="email" autoComplete="email"
                         placeholder={R.email_placeholder || 'Email address'}
                         value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/>
                  <input required style={inputStyle} type="tel" autoComplete="tel"
                         placeholder={R.phone_placeholder || 'WhatsApp / phone (with country code)'}
                         value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}/>
                  {error && <div style={{ color: '#C94628', fontSize: 13 }}>{error}</div>}
                  <button type="submit" className="btn btn-coral" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}>
                    {R.continue_step2 || 'Continue → Step 2'} <Icon name="arrow" size={14}/>
                  </button>
                </form>

                <div style={{ display: 'flex', justifyContent: 'space-around', gap: 12, marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
                  {[
                    { stat: '30d', label: R.trust_refundable || 'Refundable hold' },
                    { stat: '24h', label: R.trust_reply      || 'Reply guarantee' },
                    { stat: '$0',  label: R.trust_begin      || 'To begin' },
                  ].map((t, i) => (
                    <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, color: 'var(--coral)', fontWeight: 500, marginBottom: 4 }}>{t.stat}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>{t.label}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* STEP 2 — Financing / Budget / Timeline */}
            {step === 2 && (
              <>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 30px)', margin: '0 0 10px', lineHeight: 1.1 }}>
                  {R.step2_title_prefix || 'How are you'} <em style={{ fontStyle: 'italic', color: 'var(--coral)' }}>{R.step2_title_emphasis || 'planning to fund'}</em> {R.step2_title_suffix || 'the purchase?'}
                </h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 0 20px' }}>
                  {R.step2_sub || "No wrong answer — knowing this lets us prepare the right options before our first call."}
                </p>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 8 }}>
                  {R.funding_label || 'Funding source'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {fundingOptions.map(opt => {
                    const selected = form.funding === opt.id;
                    return (
                      <button key={opt.id} type="button"
                        onClick={() => setForm({ ...form, funding: opt.id })}
                        style={{
                          background: selected ? 'rgba(255,107,74,0.06)' : 'var(--cream)',
                          border: selected ? '1px solid var(--coral)' : '1px solid var(--line)',
                          borderRadius: 10, padding: '14px 12px', cursor: 'pointer',
                          textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6,
                          boxShadow: selected ? '0 0 0 2px rgba(255,107,74,0.12)' : 'none',
                          transition: 'all 0.15s'
                        }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: selected ? 'var(--coral)' : 'var(--ink)', fontStyle: selected ? 'italic' : 'normal', lineHeight: 1 }}>{opt.mark}</div>
                        <div style={{ fontWeight: 600, fontSize: 12 }}>{opt.label}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{opt.sub}</div>
                      </button>
                    );
                  })}
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 16, marginBottom: 8 }}>
                  {R.budget_label || 'Budget range · USD'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {budgetOptions.map(b => {
                    const selected = form.budget === b;
                    return (
                      <button key={b} type="button"
                        onClick={() => setForm({ ...form, budget: b })}
                        style={{
                          background: selected ? 'var(--ink)' : 'var(--cream)',
                          color: selected ? 'var(--cream)' : 'var(--ink)',
                          border: selected ? '1px solid var(--ink)' : '1px solid var(--line)',
                          borderRadius: 999, padding: '10px 8px', cursor: 'pointer',
                          fontFamily: 'var(--font-mono)', fontSize: 11,
                          letterSpacing: '0.06em', transition: 'all 0.15s'
                        }}>
                        {b}
                      </button>
                    );
                  })}
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 16, marginBottom: 8 }}>
                  {R.timeline_label || 'Timeline'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {timelineOptions.map(t => {
                    const selected = form.timeline === t;
                    return (
                      <button key={t} type="button"
                        onClick={() => setForm({ ...form, timeline: t })}
                        style={{
                          background: selected ? 'var(--ink)' : 'var(--cream)',
                          color: selected ? 'var(--cream)' : 'var(--ink)',
                          border: selected ? '1px solid var(--ink)' : '1px solid var(--line)',
                          borderRadius: 999, padding: '10px 8px', cursor: 'pointer',
                          fontFamily: 'var(--font-mono)', fontSize: 11,
                          letterSpacing: '0.06em', transition: 'all 0.15s'
                        }}>
                        {t}
                      </button>
                    );
                  })}
                </div>

                {error && <div style={{ color: '#C94628', fontSize: 13, marginTop: 12 }}>{error}</div>}

                <button type="button" onClick={goNext} className="btn btn-coral" style={{ width: '100%', justifyContent: 'center', marginTop: 22 }}>
                  {R.continue_review || 'Continue → Review'} <Icon name="arrow" size={14}/>
                </button>
                <button type="button" onClick={goBack} style={{
                  background: 'transparent', color: 'var(--ink-soft)', border: 'none',
                  padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 11,
                  letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
                  marginTop: 4
                }}>← {R.back_details || 'Back to details'}</button>
              </>
            )}

            {/* STEP 3 — Review */}
            {step === 3 && (
              <>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 30px)', margin: '0 0 10px', lineHeight: 1.1 }}>
                  {R.step3_title_prefix || 'A quick'} <em style={{ fontStyle: 'italic', color: 'var(--coral)' }}>{R.step3_title_emphasis || 'look back'}.</em>
                </h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 0 20px' }}>
                  {R.step3_sub || "Confirm and we'll reach out within 24 hours."}
                </p>

                <div style={{ background: 'var(--cream)', border: '1px solid var(--line)', borderRadius: 12, padding: 18 }}>
                  {[
                    { lbl: R.review_property || 'Property',  val: form.property ? form.property.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—' },
                    { lbl: R.review_name     || 'Name',      val: `${form.first_name} ${form.last_name}`.trim() },
                    { lbl: R.review_email    || 'Email',     val: form.email },
                    { lbl: R.review_phone    || 'Phone',     val: form.phone },
                    { lbl: R.review_funding  || 'Funding',   val: `${form.funding} · ${form.budget} · ${form.timeline}` },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                      fontSize: 13,
                      borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)'
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{row.lbl}</span>
                      <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{row.val}</span>
                    </div>
                  ))}
                </div>

                <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 18, fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                  <input type="checkbox" checked={form.marketing_optin}
                         onChange={(e) => setForm({ ...form, marketing_optin: e.target.checked })}
                         style={{ marginTop: 3 }}/>
                  <span>{R.opt_in || "I'd like to receive the personalised shortlist by email and WhatsApp."} <span style={{ color: 'var(--ink-mute)' }}>{R.opt_in_sub || 'No spam — unsubscribe anytime.'}</span></span>
                </label>

                {error && <div style={{ color: '#C94628', fontSize: 13, marginTop: 12 }}>{error}</div>}

                <button type="button" onClick={onSubmit} disabled={sending}
                        className="btn btn-coral"
                        style={{ width: '100%', justifyContent: 'center', marginTop: 18, opacity: sending ? 0.6 : 1 }}>
                  {sending ? (R.submitting || 'Submitting…') : (R.confirm || 'Confirm reservation hold')} <Icon name="arrow" size={14}/>
                </button>
                <button type="button" onClick={goBack} style={{
                  background: 'transparent', color: 'var(--ink-soft)', border: 'none',
                  padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 11,
                  letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
                  marginTop: 4
                }}>← {R.back_financing || 'Edit details'}</button>
              </>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

/* ── SocialProofToast — bottom-left rotating live activity ─────────────────
 *  Loads /social-proof.json on mount, shows ONE toast every 90-180s
 *  (randomized), max 5 per session. Each toast slides up, dwells 8s,
 *  slides down. Dismiss kills toasts for the session.
 *  Honesty rules built-in: only first name + city, only real event types,
 *  no fake timestamps, max 5/session.
 */
function SocialProofToast() {
  const [pool, setPool]   = useState([]);
  const [event, setEvent] = useState(null);
  const [shown, setShown] = useState(0);
  const dismissedRef = useRef(false);

  const LANG = (typeof window !== 'undefined' && window.PREG_LANG) || 'en';
  const i18n = (window.PANAMA_DATA && window.PANAMA_DATA.chromeI18n && (window.PANAMA_DATA.chromeI18n[LANG] || window.PANAMA_DATA.chromeI18n.en)) || {};
  const S = i18n.social_proof || {};

  // Load pool — try /api/social-proof (real Netlify Forms data) first,
  // fallback to /social-proof.json (curated demo entries) so the chrome
  // is always alive even on first deploy / when the API token isn't set yet.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    fetch('/api/social-proof', { cache: 'no-cache' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        if (data && data.events && data.events.length) setPool(data.events);
        else throw new Error('empty');
      })
      .catch(() => {
        // Fallback to static demo pool
        fetch('/social-proof.json', { cache: 'no-cache' })
          .then(r => r.ok ? r.json() : Promise.reject(r.status))
          .then(data => { if (data && data.events) setPool(data.events); })
          .catch(() => {});
      });
    try {
      const sessDismissed = sessionStorage.getItem('preg_social_proof_dismissed');
      if (sessDismissed) dismissedRef.current = true;
    } catch (e) {}
  }, []);

  // Scheduler: emit one toast every 90-180s, max 5 per session
  useEffect(() => {
    if (!pool.length || dismissedRef.current) return;
    if (shown >= 5) return;
    const delay = (shown === 0 ? 15 : 90 + Math.random() * 90) * 1000;
    const t = setTimeout(() => {
      const picked = pool[Math.floor(Math.random() * pool.length)];
      setEvent(picked);
      setShown(s => s + 1);
      // dwell 8s then hide
      setTimeout(() => setEvent(null), 8000);
    }, delay);
    return () => clearTimeout(t);
  }, [pool, shown, event]);

  const dismiss = () => {
    dismissedRef.current = true;
    setEvent(null);
    try { sessionStorage.setItem('preg_social_proof_dismissed', '1'); } catch (e) {}
  };

  if (!event) return null;

  // Build the verb + project text in current language
  const verb = (S.verbs && S.verbs[event.type]) || ({
    reservation: 'reserved a unit at',
    site_visit:  'booked a site visit at',
    dossier:     'requested a dossier for'
  })[event.type] || 'reserved a unit at';

  // Format ago
  const ago = event.ago_hours < 1
    ? `${Math.round(event.ago_hours * 60)} ${S.minutes_ago || 'minutes ago'}`
    : event.ago_hours < 24
      ? `${Math.round(event.ago_hours)} ${S.hours_ago || 'hours ago'}`
      : `${Math.round(event.ago_hours / 24)} ${S.days_ago || 'days ago'}`;

  if (typeof document === 'undefined') return null;
  return ReactDOM.createPortal(
    <div role="status" aria-live="polite" className="preg-toast-enter"
         style={{
           position: 'fixed', left: 16, bottom: 16, zIndex: 35,
           maxWidth: 380, width: 'calc(100% - 32px)',
           background: 'var(--paper)', color: 'var(--ink)',
           border: '1px solid var(--line)', borderRadius: 14,
           padding: '12px 14px 12px 12px',
           boxShadow: '0 18px 40px -16px rgba(11,39,51,0.25), 0 0 0 4px rgba(255,253,245,0.6)',
           display: 'flex', alignItems: 'center', gap: 12
         }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: event.color === 'aqua'
          ? 'linear-gradient(135deg, #1FC4C4, #044C5C)'
          : 'linear-gradient(135deg, var(--coral), var(--coral-deep))',
        color: 'var(--paper)', display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-display)', fontStyle: 'italic',
        fontWeight: 500, fontSize: 18
      }}>{event.initial}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, lineHeight: 1.35 }}>
          <b style={{ fontWeight: 700 }}>{event.name}, {event.city}</b> · {verb} <b style={{ fontWeight: 700 }}>{event.project}</b>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 3 }}>
          {ago}
        </div>
      </div>
      <button onClick={dismiss} aria-label={S.dismiss || 'Dismiss'}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--ink-mute)', padding: 4, marginRight: 2
              }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: '#25D366', flexShrink: 0,
        boxShadow: '0 0 0 4px rgba(37,211,102,0.18)',
        animation: 'preg-pulse-dot 2s ease-in-out infinite'
      }}/>
    </div>,
    document.body
  );
}

/* ── ActivityTicker — slim ink strip under the navbar with rotating stats ── */
function ActivityTicker() {
  const [stats, setStats]   = useState(null);
  const [idx, setIdx]       = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const LANG = (typeof window !== 'undefined' && window.PREG_LANG) || 'en';
  const i18n = (window.PANAMA_DATA && window.PANAMA_DATA.chromeI18n && (window.PANAMA_DATA.chromeI18n[LANG] || window.PANAMA_DATA.chromeI18n.en)) || {};
  const T = i18n.activity_ticker || {};

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Honor 24h dismissal
    try {
      const dismissedAt = parseInt(localStorage.getItem('preg_ticker_dismissed_at') || '0', 10);
      if (dismissedAt && (Date.now() - dismissedAt) < 24 * 60 * 60 * 1000) {
        setDismissed(true);
        return;
      }
    } catch (e) {}
    // Try real data first, fall back to demo JSON
    fetch('/api/social-proof', { cache: 'no-cache' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        if (data && data.weekly_stats) setStats(data.weekly_stats);
        else throw new Error('no stats');
      })
      .catch(() => {
        fetch('/social-proof.json', { cache: 'no-cache' })
          .then(r => r.ok ? r.json() : Promise.reject(r.status))
          .then(data => { if (data && data.weekly_stats) setStats(data.weekly_stats); })
          .catch(() => {});
      });
  }, []);

  // Cycle stats every 6s
  useEffect(() => {
    if (!stats || dismissed) return;
    const t = setInterval(() => setIdx(i => i + 1), 6000);
    return () => clearInterval(t);
  }, [stats, dismissed]);

  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem('preg_ticker_dismissed_at', String(Date.now())); } catch (e) {}
  };

  if (!stats || dismissed) return null;

  // Stat templates per language
  const templates = T.stats || [
    'reservations_week|tours_tomorrow',
    'dossiers_today|viewing_now',
  ];
  const lines = [
    { html: <span><b>{stats.reservations} {T.reservations_label || 'reservations'}</b> {T.this_week || 'this week'} · <b>{stats.tours_upcoming} {T.tours_label || 'tours'}</b> {T.tomorrow || 'tomorrow'}</span> },
    { html: <span><b>{stats.dossiers_today} {T.dossiers_label || 'dossiers'}</b> {T.today || 'today'} · <b>{stats.viewing_now} {T.viewing_label || 'viewing'}</b> {T.right_now || 'right now'}</span> },
  ];
  const line = lines[idx % lines.length];

  if (typeof document === 'undefined') return null;
  return ReactDOM.createPortal(
    <div role="status" aria-live="polite" style={{
      position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
      zIndex: 30, maxWidth: 540, width: 'calc(100% - 32px)',
      background: 'var(--ink)', color: 'var(--cream)',
      borderRadius: 14, padding: '12px 16px',
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: '0 18px 40px -16px rgba(11,39,51,0.3)'
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em',
        textTransform: 'uppercase', color: 'var(--coral)', flexShrink: 0
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%', background: '#25D366',
          boxShadow: '0 0 0 3px rgba(37,211,102,0.2)',
          animation: 'preg-pulse-dot 2s ease-in-out infinite'
        }}/>
        {T.live_label || 'Live'}
      </span>
      <span style={{ flex: 1, fontSize: 13.5, color: 'var(--cream)' }} key={idx}>
        {line.html}
      </span>
      <button onClick={dismiss} aria-label={T.dismiss || 'Dismiss'}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'rgba(255,249,236,0.5)', padding: 4
              }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>,
    document.body
  );
}

/* ── Navbar ── */
function Navbar({ transparent }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Derive language strictly from URL path — NOT from cookie / PREG_LANG.
  // Otherwise a visitor with a stale es cookie lands on `/` and sees ES nav targets
  // (BUG flagged in QA v3): English content + Spanish nav prefixes.
  const [lang, setLang] = useState((() => {
    if (typeof window === 'undefined') return 'EN';
    const m = window.location.pathname.match(/^\/(es|pt|de)(\/|$)/);
    return m ? m[1].toUpperCase() : 'EN';
  })());
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
        {(() => {
          // BUG-001 fix: prefix nav links with the current language + use chrome-i18n labels
          const langCode = lang.toLowerCase();
          const prefix = langCode === 'en' ? '' : `/${langCode}`;
          const i18n = (window.PANAMA_DATA && window.PANAMA_DATA.chromeI18n && (window.PANAMA_DATA.chromeI18n[langCode] || window.PANAMA_DATA.chromeI18n.en)) || {};
          const navLabels = (i18n.nav) || {};
          return ['Projects', 'Regions', 'Journal', 'Videos', 'News', 'Residency', 'About'].map(l => {
            const key = l.toLowerCase();
            const label = navLabels[key] || l;
            // Per-language index pages NOW EXIST (PR #99/101) — /es/articles/, /es/news/,
            // /es/videos/, /pt/articles/, etc. Each renders translated content. So
            // lang-prefix list page links too — user stays in their chosen language
            // across the entire site.
            const href = l === 'Journal' ? `${prefix || ''}/articles/`
                       : l === 'Videos' ? `${prefix || ''}/videos/`
                       : l === 'News' ? `${prefix || ''}/news/`
                       : l === 'Residency' ? `${prefix || ''}/articles/?category=Residency`
                       : l === 'About' ? `${prefix || ''}/#regions`
                       : `${prefix || ''}/#${l.toLowerCase()}`;
            return <a key={l} href={href} style={{ color: 'inherit', textDecoration: 'none', opacity: 0.9 }}>{label}</a>;
          });
        })()}
        </nav>
        <div className="nav-cta-desktop" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <LangSwitcher current={lang} onChange={setLang} onDark={isDark}/>
          {/* US phone — always-visible tap-to-call in navbar */}
          <a href="tel:+17319379142" className="nav-callus" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'inherit', textDecoration: 'none',
            padding: '8px 12px', borderRadius: 999,
            border: isDark ? '1px solid rgba(255,249,236,0.3)' : '1px solid var(--line)',
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', fontWeight: 700,
            whiteSpace: 'nowrap'
          }} title="(731) 937-9142">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 15.5c-1.2 0-2.5-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2a15 15 0 0 1-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1A11.4 11.4 0 0 1 8.5 4c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/>
            </svg>
            <span className="us-prefix">US · </span>(731) 937-9142
          </a>
          <a href={`${(() => { const lc = lang.toLowerCase(); return lc === 'en' ? '' : `/${lc}`; })()}/#reserve`} className="btn btn-coral" style={{ padding: '11px 20px', fontSize: 11 }}>
            {(() => {
              const lc = lang.toLowerCase();
              const i = (window.PANAMA_DATA && window.PANAMA_DATA.chromeI18n && (window.PANAMA_DATA.chromeI18n[lc] || window.PANAMA_DATA.chromeI18n.en)) || {};
              return (i.nav && i.nav.reserve_a_unit) || 'Reserve a unit';
            })()} <Icon name="arrow" size={13}/>
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
          {(() => {
            // Mirror the desktop nav: read the user's language and look up labels + prefix per locale.
            const langCode = lang.toLowerCase();
            const prefix = langCode === 'en' ? '' : `/${langCode}`;
            const i18n = (window.PANAMA_DATA && window.PANAMA_DATA.chromeI18n && (window.PANAMA_DATA.chromeI18n[langCode] || window.PANAMA_DATA.chromeI18n.en)) || {};
            const navLabels = (i18n.nav) || {};
            return ['Projects', 'Regions', 'Journal', 'Videos', 'News', 'Residency', 'About'].map(l => {
              const key = l.toLowerCase();
              const label = navLabels[key] || l;
              const href = l === 'Journal' ? `${prefix}/articles/`
                         : l === 'Videos' ? `${prefix}/videos/`
                         : l === 'News' ? `${prefix}/news/`
                         : l === 'Residency' ? `${prefix}/articles/?category=Residency`
                         : l === 'About' ? `${prefix || ''}/#regions`
                         : `${prefix || ''}/#${l.toLowerCase()}`;
              return (
                <a key={l} href={href} onClick={() => setOpen(false)}
                   style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: 'var(--ink)', textDecoration: 'none' }}>{label}</a>
              );
            });
          })()}
          <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <LangSwitcher current={lang} onChange={setLang}/>
            <a href="/#reserve" className="btn btn-coral" style={{ flex: 1, justifyContent: 'center' }}>{(() => {
              const lc = lang.toLowerCase();
              const i = (window.PANAMA_DATA && window.PANAMA_DATA.chromeI18n && (window.PANAMA_DATA.chromeI18n[lc] || window.PANAMA_DATA.chromeI18n.en)) || {};
              return (i.nav && i.nav.reserve_a_unit) || 'Reserve a unit';
            })()}</a>
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
      <ReserveModal/>
      <SocialProofToast/>
      <ActivityTicker/>
    </header>
  );
}

/* ── Hero (Editorial variant) — magazine-style with giant wordmark headline + featured project card ── */
function HeroEditorial() {
  // Defensive: projects may be empty if airtable-projects.json fetch failed or fired late.
  const projects = (window.PANAMA_DATA && window.PANAMA_DATA.projects) || [];
  const featuredPool = projects.slice(0, 5);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  React.useEffect(() => {
    if (featuredPool.length < 2) return;
    const id = setInterval(() => {
      setFeaturedIdx(i => (i + 1) % featuredPool.length);
    }, 5500);
    return () => clearInterval(id);
  }, [featuredPool.length]);
  const featured = featuredPool[featuredIdx] || projects[0] || null;
  const news = ((window.PANAMA_DATA && window.PANAMA_DATA.news) || []).slice(0, 3);
  // Pull hero copy from chrome-i18n.json so /es/, /pt/, /de/ render translated strings.
  // Falls back to EN labels when keys are missing.
  const LANG = (typeof window !== 'undefined' && window.PREG_LANG) || 'en';
  const _i18n = (window.PANAMA_DATA && window.PANAMA_DATA.chromeI18n && (window.PANAMA_DATA.chromeI18n[LANG] || window.PANAMA_DATA.chromeI18n.en)) || {};
  const H = (_i18n.home_hero) || {};
  const navLabels = (_i18n.nav) || {};
  if (!featured) {
    // Render a minimal hero skeleton instead of crashing when projects haven't loaded yet
    return <section style={{ paddingTop: 100, minHeight: 400, background: 'var(--cream)' }}/>;
  }

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
          <span>{H.issue_line || 'Vol. VII · 2026'}</span>
          <span className="hide-mobile">8°58′N · 79°32′W</span>
          <span>{H.publication || 'The Isthmus Quarterly'}</span>
        </div>

        {/* Enormous wordmark headline */}
        <div style={{ position: 'relative', marginBottom: 48 }}>
          <div className="eyebrow reveal in" style={{ marginBottom: 28 }}>
            <span className="rule-coral"></span>
            {H.eyebrow || 'Developer-direct · 24 projects · Reservations open'}
          </div>
          <h1 className="display reveal in d1" style={{
            fontSize: 'clamp(72px, 13vw, 200px)',
            margin: 0, lineHeight: 0.82, letterSpacing: '-0.05em',
            paddingBottom: '0.06em', fontWeight: 300
          }}>
            {H.headline_line_1 || 'Two oceans.'}<br/>
            <em style={{ color: 'var(--coral)', fontWeight: 300 }}>{H.headline_line_2 || 'One country'}</em><br/>
            <span style={{ color: 'var(--palm)' }}>{H.headline_line_3 || 'worth owning.'}</span>
          </h1>
        </div>

        {/* 3-column editorial grid: dek · featured project · news rail */}
        <div className="hero-ed-grid" style={{
          display: 'grid', gridTemplateColumns: '1.1fr 1.3fr 1fr', gap: 48,
          borderTop: '1px solid var(--line)', paddingTop: 40
        }}>
          {/* Left: dek + CTAs */}
          <div className="reveal in d2">
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--coral-deep)', fontWeight: 700, marginBottom: 14
            }}>
              {H.from_editor || 'From the editor'}
            </div>
            <p style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300,
              fontSize: 'clamp(18px, 1.8vw, 23px)', lineHeight: 1.45,
              color: 'var(--ink)', margin: 0, textWrap: 'pretty', maxWidth: '28ch'
            }}>
              {H.dek || "The definitive registry of developer-direct new construction across Panama's Caribbean, Pacific, Azuero and highland coasts. No resales. No mystery owners. Refundable reservations from $5,000."}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 28 }}>
              <a href="/#reserve" className="btn btn-coral">{navLabels.reserve_a_unit || 'Reserve a unit'} <Icon name="arrow" size={14}/></a>
              <a href="#projects" className="btn btn-ghost">{H.browse_projects || 'Browse 24 projects'}</a>
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
          <a href={'/projects/' + featured.id + '.html'} className="reveal in d3 featured-card" style={{
            position: 'relative', borderRadius: 18, overflow: 'hidden',
            background: 'var(--ocean-deep)', color: 'var(--cream)',
            textDecoration: 'none', display: 'block', minHeight: 520,
            boxShadow: '0 30px 60px -24px rgba(11,39,51,0.35)'
          }}>
            {featured.cover && featured.cover.indexOf('/') !== -1 ? (
              <img key={featured.id} src={(featured.cover.startsWith('http') || featured.cover.startsWith('/')) ? featured.cover : '/' + featured.cover} alt={featured.name} style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', animation: 'feat-fade 0.6s ease'
              }}/>
            ) : (
              <div className={`ph ph-${featured.cover}`} style={{ position: 'absolute', inset: 0 }}/>
            )}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, transparent 0%, transparent 40%, rgba(11,39,51,0.85) 100%)'
            }}/>
            {/* Pagination dots */}
            <div style={{
              position: 'absolute', top: 56, left: 20, right: 20,
              display: 'flex', gap: 6, zIndex: 3, pointerEvents: 'none'
            }}>
              {featuredPool.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 2,
                  background: i === featuredIdx ? 'var(--coral)' : 'rgba(255,249,236,0.25)',
                  borderRadius: 1, transition: 'background 0.4s ease'
                }}/>
              ))}
            </div>
            <div style={{
              position: 'absolute', top: 20, left: 20,
              display: 'inline-block', padding: '6px 12px',
              background: 'var(--coral)', color: 'var(--paper)',
              fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', fontWeight: 700, borderRadius: 4
            }}>
              {H.cover_story || 'Cover story · Reservations open'}
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
                    {H.from_label || 'From'}
                  </div>
                  <div className="display" style={{ fontSize: 28, lineHeight: 1 }}>{(featured.fromLabel || '').replace('From ','')}</div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
                  textTransform: 'uppercase', fontWeight: 700, color: 'var(--coral)'
                }}>
                  {H.read_dispatch || 'Read dispatch →'}
                </div>
              </div>
            </div>
          </a>

          {/* Right — news rail on a dark panel.
              The jaguar mascot sits on top-right of this panel; its coral neon
              glow visually spills onto the news cards via the radial corner light. */}
          <div className="reveal in d3" style={{
            background: '#0B1F28',
            borderRadius: 18,
            padding: '28px 26px 32px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 620,
            boxShadow: '0 24px 60px -20px rgba(11,39,51,0.55), inset 0 1px 0 rgba(255,249,236,0.04)'
          }}>
            {/* Jaguar canvas — fills the ENTIRE panel so the background color is
                uniform top-to-bottom. The cat itself only occupies the bottom
                portion of the canvas (positioned via Three.js camera), so the
                upper area is just the matching clearColor — visually identical
                to the panel. News content sits on top via z-index 2. */}
            <div className="hero-fauna" style={{
              position: 'absolute', inset: 0,
              zIndex: 1,
              pointerEvents: 'none'
            }}>
              <img
                src="/assets/jaguar-static.webp"
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                fetchpriority="high"
                style={{
                  width: '100%', height: '100%', display: 'block',
                  objectFit: 'cover', objectPosition: 'center bottom',
                  userSelect: 'none', WebkitUserDrag: 'none',
                  // Fade the upper portion so news headlines remain readable
                  // (mimics the WebGL wireframe's natural transparency at the top)
                  maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 32%, rgba(0,0,0,0.4) 50%, black 70%, black 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 32%, rgba(0,0,0,0.4) 50%, black 70%, black 100%)'
                }}
              />
            </div>


            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'var(--coral)', fontWeight: 700, marginBottom: 18,
                textShadow: '0 0 14px rgba(255,107,74,0.5)'
              }}>
                {H.from_newsroom || 'From the newsroom'}
              </div>
              {news.map((n, i) => (
                <a key={n.slug} href={'/news/' + n.slug + '.html'} style={{
                  display: 'block', padding: '14px 0',
                  borderBottom: i < news.length - 1 ? '1px solid rgba(255,249,236,0.08)' : 'none',
                  textDecoration: 'none', color: 'inherit'
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,196,170,0.95)',
                    letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6,
                    textShadow: '0 0 12px rgba(11,31,40,0.6)'
                  }}>
                    {n.date} · {(_i18n.news_tags && _i18n.news_tags[n.tag]) || n.tag}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400,
                    lineHeight: 1.3, letterSpacing: '-0.005em', color: 'var(--cream)', textWrap: 'pretty',
                    textShadow: '0 1px 12px rgba(11,31,40,0.6)'
                  }}>
                    {(() => { const nt = _i18n.news_titles && n.slug && _i18n.news_titles[n.slug]; return nt || n.title; })()}
                  </div>
                </a>
              ))}
              <a href="news/index.html" className="all-dispatches-cta" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                marginTop: 22, fontSize: 11,
                fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--cream)', textDecoration: 'none', fontWeight: 700,
                padding: '11px 18px',
                background: 'rgba(11, 31, 40, 0.78)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 107, 74, 0.55)',
                borderRadius: 999,
                boxShadow: '0 0 24px rgba(255, 107, 74, 0.18), inset 0 0 0 1px rgba(255,249,236,0.04)',
                transition: 'all 0.25s ease'
              }}>
                <span>{H.all_dispatches || 'All dispatches'}</span>
                <span style={{ color: 'var(--coral)', fontWeight: 800 }}>→</span>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* (jaguar canvas now lives INSIDE the dark news panel below) */}

      <style>{`
        @media (max-width: 1100px) {
          .hero-ed-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-ed-grid > div:last-child { grid-column: 1 / -1; border-left: none !important; padding-left: 0 !important; border-top: 1px solid var(--line); padding-top: 32px !important; margin-top: 12px; }
        }
        @media (max-width: 720px) {
          .hero-ed-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .featured-card { min-height: 420px !important; }
          .hide-mobile { display: none !important; }
        }
        .featured-card:hover { transform: translateY(-4px); box-shadow: 0 40px 80px -24px rgba(11,39,51,0.45) !important; }
        .featured-card { transition: all 0.35s var(--ease); }
      `}</style>
    </section>
  );
}

/* ── Marquee ── */
function Marquee() {
  // single flat row with 2 concatenated copies; animation translates by -50% of
  // its own width, which equals exactly one copy-worth — perfect seamless loop.
  // Width: max-content lets the flex row size to its content, so items never
  // overflow / overlap at the loop boundary.
  const items = ['Bocas del Toro', '◦', 'Pedasí', '◦', 'Casco Viejo', '◦', 'Boquete', '◦', 'Playa Blanca', '◦', 'Coronado', '◦', 'Panama City', '◦'];
  const doubled = [...items, ...items];
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '24px 0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 60, width: 'max-content', animation: 'marquee 35s linear infinite' }}>
        {doubled.map((t, i) => (
          <span key={i} style={{
            fontFamily: t === '◦' ? 'var(--font-body)' : 'var(--font-display)',
            fontStyle: t === '◦' ? 'normal' : 'italic',
            fontSize: t === '◦' ? 18 : 28, color: t === '◦' ? 'var(--coral)' : 'var(--cream)',
            whiteSpace: 'nowrap', fontWeight: 300, paddingRight: t === '◦' ? 0 : 0
          }}>{t}</span>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { Icon, Logo, LangSwitcher, Navbar, HeroEditorial, Marquee });
