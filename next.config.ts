// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com", // ✅ allows Google profile images
//         pathname: "**",
//       },
//     ],
//   },
// };

// export default nextConfig;
// next.config.mjs (or next.config.ts)
import withTM from 'next-transpile-modules';

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
    
  },
  reactStrictMode: true,
};

// export default wrapped config
export default withTM(['recharts'])(nextConfig);
