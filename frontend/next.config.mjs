/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.RENDER
          ? 'http://livio-backend:8083/api/:path*'
          : 'http://localhost:8083/api/:path*',
      },
    ];
  },
};

export default nextConfig;
