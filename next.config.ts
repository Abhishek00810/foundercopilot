/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this 'images' object
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },
};

module.exports = nextConfig;