/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Otimizações para build
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Configurar páginas estáticas
  output: 'standalone',
};

module.exports = nextConfig;