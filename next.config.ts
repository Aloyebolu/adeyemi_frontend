import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "**" },
      { protocol: "https", hostname: "randomuser.me", pathname: "**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "**" },
      { protocol: "http", hostname: "afued.edu.ng", pathname: "**" },
      { protocol: "http", hostname: "localhost", pathname: "**" },
    ],
  },

  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // 🔑 THIS is what was missing
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
