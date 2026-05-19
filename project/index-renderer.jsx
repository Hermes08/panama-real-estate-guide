function App() {
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
      <HeroEditorial/>
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
