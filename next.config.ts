import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', 'ui-avatars.com', 'plus.unsplash.com'], // ✅ plus.unsplash.com add kiya

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com', // ✅ YEH ADD KIYA
        pathname: '/**',
      },
    ],
  },

  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;