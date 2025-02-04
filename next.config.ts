import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "files.edgestore.dev"
    ]
  },
  // eslint: {
  //   // Disable ESLint during build
  //   ignoreDuringBuilds: true,
  // },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
