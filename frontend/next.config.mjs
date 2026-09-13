/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8083/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:8083/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
