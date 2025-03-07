import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    SERVER_URL: 'http://localhost:3002',
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      }
    ]
  }
};

export default nextConfig;
