import type { NextConfig } from "next";

const allowedOrigin = "https://job-tracking-application-c3zo53f5e-four181049-8397s-projects.vercel.app";

const nextConfig: NextConfig = {
  cacheComponents: true,
  async headers() {
    return [
      {
        // ครอบคลุม API routes ทั้งหมด
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: allowedOrigin },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
    ];
  },
};

export default nextConfig;
