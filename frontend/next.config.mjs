const API_ORIGIN = process.env.INTERNAL_API_URL || "http://127.0.0.1:8083";

// Static export is only used by the root Dockerfile (Render single-port deployment),
// where Spring Boot serves the built files. OpenNext (Cloudflare) and `next start`
// need a normal SSR build instead.
const isStaticExport = process.env.STATIC_EXPORT === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

if (isStaticExport) {
  nextConfig.output = "export";
  nextConfig.images = {
    unoptimized: true,
  };
} else {
  // Dev server and SSR deployments: proxy API/upload requests to the backend.
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
}

export default nextConfig;
