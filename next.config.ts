import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    typedRoutes: false, 
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dwxplvmcebsbobyizqao.supabase.co', 
        port: '',
        pathname: '/storage/v1/object/public/**', 
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com', 
        port: '',
        pathname: '/**',
      },
      
    ],
  },
  
  // ADICIONADO: A função de reescrita para o subdomínio
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/pre-lancamento',
        has: [
          {
            type: 'host',
            value: 'pre-lancamento.phandshop.com.br',
          },
        ],
      },
    ];
  },
};

export default nextConfig;