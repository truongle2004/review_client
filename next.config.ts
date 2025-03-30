import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    SERVER_URL: 'http://localhost:3000',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
};

export default nextConfig;
