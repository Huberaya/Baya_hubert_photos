/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 768, 1024, 1440, 1920],
    imageSizes: [32, 64, 96, 160, 256, 384],
    qualities: [65, 75, 85],
    minimumCacheTTL: 2678400,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
