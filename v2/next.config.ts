import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root. Without this, Turbopack walks up and picks the
  // lockfile in the home directory instead of this app's.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
