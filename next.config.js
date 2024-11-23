/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: true, // Enable gzip compression
    images: {
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
      imageSizes: [16, 32, 48, 64, 96, 128, 256],
      formats: ['image/webp', 'image/avif'], // Modern image formats
      domains: ['localhost'], // Add any image domains you need
      minimumCacheTTL: 60,
    },
    headers: async () => [
      {
        // Cache fonts
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache static assets
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate',
          },
        ],
      },
    ],
    poweredByHeader: false, // Remove X-Powered-By header
    reactStrictMode: true,
    swcMinify: true, // Use SWC for minification
  }
  
  // Enable bundle analysis if ANALYZE is true
  if (process.env.ANALYZE === 'true') {
    // Install first: npm install --save-dev @next/bundle-analyzer
    const withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: true,
    })
    module.exports = withBundleAnalyzer(nextConfig)
  } else {
    module.exports = nextConfig
  }