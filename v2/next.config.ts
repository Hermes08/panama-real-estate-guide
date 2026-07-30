import path from "node:path";
import type { NextConfig } from "next";

// Host-only, so a malformed base URL fails here rather than at render time.
const mediaHost = process.env.NEXT_PUBLIC_MEDIA_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_MEDIA_BASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  // Pin the workspace root. Without this, Turbopack walks up and picks the
  // lockfile in the home directory instead of this app's.
  turbopack: {
    root: path.resolve(process.cwd()),
  },

  images: {
    // next/image refuses remote hosts that are not allow-listed. Only added
    // when a media base is configured, so local-only dev needs no entry.
    remotePatterns: mediaHost
      ? [{ protocol: "https", hostname: mediaHost, pathname: "/**" }]
      : [],
  },
};

export default nextConfig;
