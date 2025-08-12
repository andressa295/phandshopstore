import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    typedRoutes: false, 
  },
  images: {
    domains: ['www.gravatar.com'],
  },
};

export default nextConfig;