import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "files.edgestore.dev"
    ]
  },
  eslint: {
    // Disable ESLint during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
