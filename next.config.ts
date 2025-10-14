import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // ✅ allows Google profile images
        pathname: "**",
      },
      // You can easily add more domains later:
      // {
      //   protocol: "https",
      //   hostname: "res.cloudinary.com",
      //   pathname: "**",
      // },
    ],
  },
};

export default nextConfig;
