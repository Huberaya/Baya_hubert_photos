/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 768, 1024, 1440, 1920],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
