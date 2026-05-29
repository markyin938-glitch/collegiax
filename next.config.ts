import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.collegiax.app" },
    ],
  },
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
