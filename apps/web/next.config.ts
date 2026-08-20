import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@communityos/ui"],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
