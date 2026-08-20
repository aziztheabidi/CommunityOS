import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@communityos/ui", "@communityos/maps"],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
