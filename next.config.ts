import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [92],
  },
  // Keep development manifests isolated from production builds. This avoids
  // stale RSC/Webpack chunks when switching between `dev` and `build`.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default nextConfig;
