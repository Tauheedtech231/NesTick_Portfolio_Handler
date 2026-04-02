// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['images.unsplash.com'],
    // Optional: Add remotePatterns for better security (Next.js 13+)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  
  // Fix for Turbopack font issues
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  
  // Webpack config for Three.js compatibility
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
  
  // Optional: Disable font optimization if issues persist
  // optimizeFonts: false,
};

export default nextConfig;