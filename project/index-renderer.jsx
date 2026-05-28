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
      {/* Floating WhatsApp + Call US buttons rendered by <Navbar/> via <FloatingContact/>. */}
    </>
  );
}

// Hydrate project data from the build-time Airtable snapshot, then render.
// If the snapshot can't be loaded, render with the data.js fallback already in memory.
function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
}

fetch('/airtable-projects.json', { cache: 'no-cache' })
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
