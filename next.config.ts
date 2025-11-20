import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "afued.edu.ng",
        pathname: "**",
      },
    ],
  },

  // 🔥 Ignore TypeScript errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // 🔥 Ignore ESLint errors during builds
  // The 'eslint' property is not part of NextConfig type and has been removed.
};

export default nextConfig;
