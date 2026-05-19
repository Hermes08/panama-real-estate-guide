#!/usr/bin/env node
// =============================================================================
// inject-video-meta.mjs — generate /videos/{videoId}.html + /videos/index.html
// =============================================================================
// Reads project/youtube-videos.json and produces:
//   • project/videos/{videoId}.html  — one indexable page per video, with
//     embedded YouTube player, description, link to the matching project page,
//     and VideoObject + BreadcrumbList JSON-LD in the head.
//   • project/videos/index.html      — a video-hub page listing all videos with
//     CollectionPage JSON-LD and ItemList markup.
//
// Cleanup: removes any /videos/*.html that no longer corresponds to a video in
// the JSON, except for index.html itself.
//
// Idempotent — re-runs replace the existing files with identical content if
// the JSON hasn't changed.
//
// Why dedicated pages for 3-second cinemagraphs?
//   The pages aren't competing for top SERP slots on their own — they exist
//   to give each video an indexable host page Google can attach the
//   VideoObject and video sitemap entry to. The body content is intentionally
//   minimal (title + description + link back to the project article) so the
//   pages don't get filtered as "thin content"; they punch above their weight
//   by being part of a larger video set + linked from the index hub.
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..', 'project');
const VIDEOS_DIR = path.join(PROJECT_DIR, 'videos');
const VIDEOS_JSON = path.join(PROJECT_DIR, 'youtube-videos.json');
const DATA_JS = path.join(PROJECT_DIR, 'data.js');
const SITE_BASE = 'https://panamarealestateguide.com';
const PUBLISHER_LOGO = `${SITE_BASE}/cover_facebook_1640x856.png`;

const HEAD_START = '<!-- BEGIN_VIDEO_META -->';
const HEAD_END   = '<!-- END_VIDEO_META -->';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function attrEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
function jsonLdEscape(s) {
  return String(s).replace(/<\//g, '<\\/');
}
function truncate(s, n) {
  if (!s) return '';
  if (s.length <= n) return s;
  return s.slice(0, n).replace(/\s+\S*$/, '') + '…';
}
// Strip the boilerplate hashtag block + disclaimer that every video description
// ends with, leaving the editorial prose Google should actually index. Order
// matters: kill the trailing warning/disclaimer first, then the hashtag block
// (which then becomes the new end-of-string). The body version preserves
// paragraph breaks for legibility — the meta version collapses whitespace
// downstream (see buildVideoHead).
function cleanDescription(d) {
  if (!d) return '';
  let s = String(d).trim();
  s = s.replace(/\n+⚠️[\s\S]+$/g, '');
  s = s.replace(/\n+\*[^*]+\*\s*$/g, '');
  s = s.replace(/\n+#[A-Za-z0-9_# ]+$/g, '');
  s = s.replace(/\n{3,}/g, '\n\n').trim();
  return s;
}

// -----------------------------------------------------------------------------
// Project map (for linking back from video to project page).
// -----------------------------------------------------------------------------
async function loadProjects() {
  const out = {};
  // From data.js
  try {
    const src = await fs.readFile(DATA_JS, 'utf8');
    const sb = { window: {}, console: { log() {}, warn() {}, error() {} } };
    vm.createContext(sb);
    vm.runInContext(src, sb, { timeout: 5000 });
    for (const p of (sb.window.PANAMA_DATA?.projects || [])) {
      if (p?.id) out[p.id] = { slug: p.id, name: p.name || p.id, location: p.location || '' };
    }
  } catch (_) { /* fine */ }
  // Synthesize from /projects/*.html if data.js is empty
  try {
    const files = await fs.readdir(path.join(PROJECT_DIR, 'projects'));
    for (const f of files) {
      if (!f.endsWith('.html')) continue;
      const slug = f.replace(/\.html$/, '');
      if (!out[slug]) {
        out[slug] = {
          slug,
          name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          location: 'Panama',
        };
      }
    }
  } catch (_) {}
  return out;
}

// -----------------------------------------------------------------------------
// Per-video page renderer.
// -----------------------------------------------------------------------------
function buildVideoHead(video, project) {
  // Netlify's pretty_urls processing lowercases any URL that contains
  // uppercase letters, so we anchor the canonical at the lowercased slug.
  // The actual YouTube embed/content URLs keep the original case because
  // youtube.com IS case-sensitive.
  const slug = video.videoId.toLowerCase();
  const url = `${SITE_BASE}/videos/${slug}`;
  // Meta values must be single-line — collapse newlines + repeated whitespace.
  const collapsed = cleanDescription(video.description).replace(/\s+/g, ' ').trim();
  const desc = truncate(collapsed || video.title, 155);
  const titleTag = `${truncate(video.title, 65)} — Video — PanamaRealEstateGuide.com`;

  const ldVideo = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: cleanDescription(video.description) || video.title,
    thumbnailUrl: [
      video.thumbnailUrl,
      `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
    ].filter(Boolean),
    uploadDate: video.publishDate,
    duration: video.duration || 'PT3S',
    contentUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
    embedUrl: `https://www.youtube.com/embed/${video.videoId}`,
    publisher: {
      '@type': 'Organization',
      name: 'Panama Real Estate Guide',
      logo: { '@type': 'ImageObject', url: PUBLISHER_LOGO },
    },
    inLanguage: video.lang || 'es',
    isFamilyFriendly: true,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
  if (project) {
    ldVideo.about = {
      '@type': 'RealEstateListing',
      name: project.name,
      url: `${SITE_BASE}/projects/${project.slug}.html`,
    };
  }

  const ldBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Videos', item: `${SITE_BASE}/videos/` },
      { '@type': 'ListItem', position: 3, name: video.title, item: url },
    ],
  };

  return [
    HEAD_START,
    `<title>${attrEscape(titleTag)}</title>`,
    `<meta name="description" content="${attrEscape(desc)}"/>`,
    `<link rel="canonical" href="${attrEscape(url)}"/>`,
    `<meta property="og:type" content="video.other"/>`,
    `<meta property="og:title" content="${attrEscape(titleTag)}"/>`,
    `<meta property="og:description" content="${attrEscape(desc)}"/>`,
    `<meta property="og:url" content="${attrEscape(url)}"/>`,
    `<meta property="og:image" content="${attrEscape(video.thumbnailUrl || `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`)}"/>`,
    `<meta property="og:video" content="https://www.youtube.com/watch?v=${video.videoId}"/>`,
    `<meta property="og:site_name" content="Panama Real Estate Guide"/>`,
    `<meta name="twitter:card" content="player"/>`,
    `<meta name="twitter:title" content="${attrEscape(titleTag)}"/>`,
    `<meta name="twitter:description" content="${attrEscape(desc)}"/>`,
    `<meta name="twitter:image" content="${attrEscape(video.thumbnailUrl || `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`)}"/>`,
    `<meta name="twitter:player" content="https://www.youtube.com/embed/${video.videoId}"/>`,
    `<script type="application/ld+json">${jsonLdEscape(JSON.stringify(ldVideo))}</script>`,
    `<script type="application/ld+json">${jsonLdEscape(JSON.stringify(ldBreadcrumb))}</script>`,
    HEAD_END,
  ].join('\n  ');
}

function buildVideoPageHtml(video, project) {
  const headBlock = buildVideoHead(video, project);
  const safeVideo = JSON.stringify(video).replace(/</g, '\\u003c');
  const projectLinkHtml = project
    ? `<a href="/projects/${project.slug}.html" style="display:inline-block;margin-top:24px;padding:14px 28px;background:var(--coral);color:#fff;border-radius:999px;font-family:var(--font-mono);font-size:12px;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;font-weight:700">View ${attrEscape(project.name)} project →</a>`
    : '';
  const cleanedDesc = cleanDescription(video.description);
  const descParas = cleanedDesc
    ? cleanedDesc.split('\n').filter(l => l.trim()).map(l => `<p style="font-size:17px;line-height:1.7;color:var(--ink-soft);margin:0 0 18px;max-width:62ch">${attrEscape(l)}</p>`).join('\n        ')
    : `<p style="font-size:17px;line-height:1.7;color:var(--ink-soft);margin:0 0 18px;max-width:62ch">${attrEscape(video.title)}</p>`;

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Manrope:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="../styles.css"/>
  ${headBlock}
</head>
<body>
  <div id="root"></div>

  <!-- Static visible content for crawlers + no-JS users. The React app below
       enhances this by adding the site nav/footer and styled chrome. -->
  <noscript>
    <main style="max-width:980px;margin:0 auto;padding:80px 24px;font-family:'Manrope',system-ui,sans-serif">
      <h1 style="font-family:'Fraunces',serif;font-size:clamp(32px,5vw,56px);line-height:1.05;margin:0 0 24px">${attrEscape(video.title)}</h1>
      <div style="position:relative;padding-top:56.25%;background:#000;border-radius:14px;overflow:hidden;margin-bottom:32px">
        <iframe src="https://www.youtube.com/embed/${video.videoId}?rel=0" title="${attrEscape(video.title)}" loading="lazy" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
      </div>
      ${descParas}
      ${projectLinkHtml}
    </main>
  </noscript>

  <script>window.__VIDEO_DATA__ = ${safeVideo};</script>
  <script src="../data-light.js"></script>
  <script defer src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" integrity="sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z" crossorigin="anonymous"></script>
  <script defer src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" integrity="sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1" crossorigin="anonymous"></script>
  <script defer src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
  <script type="text/babel" src="../components.jsx"></script>
  <script type="text/babel" src="../detail-chrome.jsx"></script>

  <script type="text/babel">
    function VideoPage() {
      const v = window.__VIDEO_DATA__ || {};
      const projects = (window.PANAMA_DATA && window.PANAMA_DATA.projects) || [];
      const project = v.projectSlug ? projects.find(p => p.id === v.projectSlug) : null;

      const cleanLines = (v.description || '').split('\\n').map(l => l.trim()).filter(l =>
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
                  src={\`https://www.youtube-nocookie.com/embed/\${v.videoId}?rel=0\`}
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
                      <a href={\`/projects/\${project.id}.html\`} style={{
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
                  <a href={\`https://www.youtube.com/watch?v=\${v.videoId}\`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>YouTube ↗</a>
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
  </script>
</body>
</html>
`;
}

// -----------------------------------------------------------------------------
// Videos index page.
// -----------------------------------------------------------------------------
function buildIndexHead(videoCount) {
  const url = `${SITE_BASE}/videos/`;
  const desc = `Video tours of Panama real estate projects from Panama Real Estate Guide. ${videoCount} short tours covering oceanfront, mountain and city residences across Panama.`;
  const ldCollection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Panama Real Estate Videos',
    description: desc,
    url,
    inLanguage: 'es-PA',
    publisher: {
      '@type': 'Organization',
      name: 'Panama Real Estate Guide',
      logo: { '@type': 'ImageObject', url: PUBLISHER_LOGO },
    },
  };
  const ldBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Videos', item: url },
    ],
  };
  return [
    HEAD_START,
    `<title>Panama Real Estate Videos — Project Tours — PanamaRealEstateGuide.com</title>`,
    `<meta name="description" content="${attrEscape(desc)}"/>`,
    `<link rel="canonical" href="${url}"/>`,
    `<meta property="og:type" content="website"/>`,
    `<meta property="og:title" content="Panama Real Estate Videos — Project Tours"/>`,
    `<meta property="og:description" content="${attrEscape(desc)}"/>`,
    `<meta property="og:url" content="${url}"/>`,
    `<meta property="og:image" content="${PUBLISHER_LOGO}"/>`,
    `<meta property="og:site_name" content="Panama Real Estate Guide"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<script type="application/ld+json">${jsonLdEscape(JSON.stringify(ldCollection))}</script>`,
    `<script type="application/ld+json">${jsonLdEscape(JSON.stringify(ldBreadcrumb))}</script>`,
    HEAD_END,
  ].join('\n  ');
}

function buildIndexHtml(videos, projects) {
  const head = buildIndexHead(videos.length);
  const safeVideos = JSON.stringify(videos).replace(/</g, '\\u003c');
  // Static fallback list for crawlers (mirrors what the React tile grid shows).
  const staticCards = videos.map(v => {
    const proj = v.projectSlug ? projects[v.projectSlug] : null;
    return `      <li style="margin:0 0 32px;padding:0">
        <a href="/videos/${v.videoId.toLowerCase()}" style="text-decoration:none;color:inherit;display:block">
          <img src="${attrEscape(v.thumbnailUrl || `https://i.ytimg.com/vi/${v.videoId}/maxresdefault.jpg`)}" alt="${attrEscape(v.title)}" loading="lazy" style="width:100%;border-radius:14px;display:block"/>
          <h2 style="font-family:'Fraunces',serif;font-size:24px;margin:18px 0 6px;color:#111">${attrEscape(v.title)}</h2>
          ${proj ? `<div style="font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#666">${attrEscape(proj.name)}</div>` : ''}
        </a>
      </li>`;
  }).join('\n');

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Manrope:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="../styles.css"/>
  ${head}
</head>
<body>
  <div id="root"></div>

  <noscript>
    <main style="max-width:1100px;margin:0 auto;padding:80px 24px;font-family:'Manrope',system-ui,sans-serif">
      <h1 style="font-family:'Fraunces',serif;font-size:clamp(40px,6vw,72px);line-height:1.04;margin:0 0 16px;color:#111">Panama Real Estate Videos</h1>
      <p style="font-size:18px;line-height:1.6;color:#444;max-width:60ch;margin:0 0 48px">Short project tours and lifestyle clips from our team in Panama City and across the country.</p>
      <ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:32px">
${staticCards}
      </ul>
    </main>
  </noscript>

  <script>window.__VIDEOS_INDEX__ = ${safeVideos};</script>
  <script src="../data-light.js"></script>
  <script defer src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" integrity="sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z" crossorigin="anonymous"></script>
  <script defer src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" integrity="sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1" crossorigin="anonymous"></script>
  <script defer src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
  <script type="text/babel" src="../components.jsx"></script>
  <script type="text/babel" src="../detail-chrome.jsx"></script>

  <script type="text/babel">
    function VideosIndexPage() {
      const videos = window.__VIDEOS_INDEX__ || [];
      const projects = (window.PANAMA_DATA && window.PANAMA_DATA.projects) || [];
      const projBySlug = Object.fromEntries(projects.map(p => [p.id, p]));

      return (
        <>
          <DetailNav/>

          <section style={{ paddingTop: 110, paddingBottom: 'clamp(48px, 6vw, 90px)', background: 'var(--cream)' }}>
            <div className="container">
              <div style={{ marginBottom: 24 }}><DetailBack label="Home" href="/"/></div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                <span className="rule-coral"></span>Video library
              </div>
              <h1 className="display" style={{ fontSize: 'clamp(40px, 6vw, 80px)', margin: '0 0 16px', lineHeight: 1.02 }}>
                Panama real estate <em>in motion</em>.
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: '60ch', margin: '0 0 56px' }}>
                Short project tours and lifestyle clips from our team in Panama City and across the country. {videos.length} videos.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
                {videos.map(v => {
                  const proj = v.projectSlug ? projBySlug[v.projectSlug] : null;
                  return (
                    <a key={v.videoId} href={\`/videos/\${v.videoId.toLowerCase()}\`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                      <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 14, overflow: 'hidden', background: '#000', marginBottom: 18 }}>
                        <img src={v.thumbnailUrl || \`https://i.ytimg.com/vi/\${v.videoId}/maxresdefault.jpg\`} alt={v.title} loading="lazy" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%)' }}/>
                        <div style={{ position: 'absolute', bottom: 12, right: 12, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ borderStyle: 'solid', borderWidth: '8px 0 8px 14px', borderColor: 'transparent transparent transparent #111', marginLeft: 3 }}/>
                        </div>
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: '0 0 6px', lineHeight: 1.25 }}>{v.title}</h2>
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
  </script>
</body>
</html>
`;
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
async function main() {
  let data;
  try {
    data = JSON.parse(await fs.readFile(VIDEOS_JSON, 'utf8'));
  } catch (e) {
    console.warn(`inject-video-meta: youtube-videos.json missing (${e.code || e.message}) — nothing to generate`);
    return;
  }
  const videos = Array.isArray(data.videos) ? data.videos : [];
  const projects = await loadProjects();

  await fs.mkdir(VIDEOS_DIR, { recursive: true });

  // Generate per-video pages.
  // Filename uses lowercased video ID to play nice with Netlify pretty_urls
  // (which lowercases any URL containing uppercase letters). The original
  // case-sensitive videoId is still used for youtube.com URLs in the page.
  const expectedFiles = new Set(['index.html']);
  let written = 0;
  for (const v of videos) {
    if (!v.videoId) continue;
    const fname = `${v.videoId.toLowerCase()}.html`;
    expectedFiles.add(fname);
    const project = v.projectSlug ? projects[v.projectSlug] : null;
    const html = buildVideoPageHtml(v, project);
    const out = path.join(VIDEOS_DIR, fname);
    // Idempotent: only write if changed.
    let prev = '';
    try { prev = await fs.readFile(out, 'utf8'); } catch (_) {}
    if (prev !== html) {
      await fs.writeFile(out, html, 'utf8');
      written++;
    }
  }

  // Generate index.
  const indexHtml = buildIndexHtml(videos, projects);
  const indexPath = path.join(VIDEOS_DIR, 'index.html');
  let prevIndex = '';
  try { prevIndex = await fs.readFile(indexPath, 'utf8'); } catch (_) {}
  if (prevIndex !== indexHtml) {
    await fs.writeFile(indexPath, indexHtml, 'utf8');
    written++;
  }

  // Cleanup stale pages.
  let removed = 0;
  try {
    const existing = await fs.readdir(VIDEOS_DIR);
    for (const f of existing) {
      if (!f.endsWith('.html')) continue;
      if (!expectedFiles.has(f)) {
        await fs.unlink(path.join(VIDEOS_DIR, f));
        removed++;
      }
    }
  } catch (_) {}

  console.log(`inject-video-meta: wrote ${written} files · ${videos.length} videos · ${removed} stale removed`);
}

main().catch((err) => { console.error('inject-video-meta failed:', err); process.exit(1); });
