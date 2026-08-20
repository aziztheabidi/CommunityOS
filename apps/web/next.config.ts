import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // UI has JSX and must be transpiled. Maps is plain ESM dist — leave it out so
  // named exports (buildBasemapStyle, etc.) resolve correctly in webpack.
  transpilePackages: ["@communityos/ui"],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
