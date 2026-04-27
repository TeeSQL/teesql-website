import type { NextConfig } from "next";

// Static export — Cloudflare Pages serves the contents of `out/` directly.
// No server-side runtime, no API routes; auth + dashboard live elsewhere.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
