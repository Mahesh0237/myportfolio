/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'diarysoulsapi.techdino.in',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**',
      },
    ],
 
  },
  allowedDevOrigins: [
    'diarysouls.techdino.in',
    'diarysoulsapi.techdino.in',
  ]
};
 
export default nextConfig;
 
 