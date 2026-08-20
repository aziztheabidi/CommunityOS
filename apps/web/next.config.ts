import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["@communityos/ui", "@communityos/maps"],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
