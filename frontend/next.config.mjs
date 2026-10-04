const API_ORIGIN = process.env.INTERNAL_API_URL || "http://127.0.0.1:8083";

const isDev = process.env.NODE_ENV === "development";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

if (isDev) {
  // Dev: proxy API/upload requests to the Spring Boot backend (static export not used in dev).
  nextConfig.rewrites = async () => [
    {
      source: "/api/:path*",
      destination: `${API_ORIGIN}/api/:path*`,
    },
    {
      source: "/uploads/:path*",
      destination: `${API_ORIGIN}/uploads/:path*`,
    },
  ];
} else {
  // Production: static export served by Spring Boot on a single port.
  nextConfig.output = "export";
}

export default nextConfig;
