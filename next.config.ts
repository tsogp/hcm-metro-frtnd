import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Use the built-in CSS handling in Next.js
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
