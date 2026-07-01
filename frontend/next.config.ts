import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["recruit-system.jetta.com"],
  devIndicators: false,
  async rewrites() {
    const backendUrl = process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8000";

    return [
      {
        source: "/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
