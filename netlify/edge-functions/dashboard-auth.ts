import type { Context } from "https://edge.netlify.com";

// Basic Auth gate for /dashboard/*. Reads credentials from Netlify env vars
// DASHBOARD_USER and DASHBOARD_PASS. Returns 401 (which makes the browser
// show a native login prompt) unless the Authorization header matches.

export default async (request: Request, context: Context) => {
  const auth = request.headers.get("authorization");
  const user = Netlify.env.get("DASHBOARD_USER") || "admin";
  const pass = Netlify.env.get("DASHBOARD_PASS");

  if (!pass) {
    return new Response(
      "Dashboard not configured. Set DASHBOARD_PASS in Netlify env vars.",
      { status: 500 }
    );
  }

  const expected = "Basic " + btoa(`${user}:${pass}`);

  if (auth !== expected) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Four Systems Dashboard"',
        "Cache-Control": "no-store",
      },
    });
  }

  // Add headers to prevent search engines from indexing
  const response = await context.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
};

export const config = { path: "/dashboard/*" };
