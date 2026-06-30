import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'images.unsplash.com', 
      'ui-avatars.com', 
      'plus.unsplash.com', 
      'res.cloudinary.com',
      'images.openai.com',
      'media.istockphoto.com' // ✅ Add this
    ],

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
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.openai.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com', // ✅ Add this too
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