/* =============================================================================
   Media resolution
   =============================================================================
   The single seam between where an image path is stored and where it is served
   from. Stored paths stay relative ("/projects/<slug>/01.webp") so nothing in
   the database or the JSON artifact is coupled to a CDN hostname — moving
   buckets, or moving off R2 entirely, is an env change.

   Unset  → served from v2/public (local dev, before an upload has run)
   Set    → served from the CDN base
   ============================================================================= */

const base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "");

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  const rel = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${rel}` : rel;
}

const SITE = "https://panamarealestateguide.com";

/** Absolute URL, for structured data and OG tags — both require a full URL
 *  even when the app is serving images from a relative path locally. */
export function absoluteMedia(path: string): string {
  const resolved = mediaUrl(path);
  if (!resolved) return "";
  return /^https?:\/\//.test(resolved) ? resolved : `${SITE}${resolved}`;
}
