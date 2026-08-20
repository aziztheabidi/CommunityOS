import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  transpilePackages: ["@communityos/ui", "@communityos/maps"],
  serverExternalPackages: ["@prisma/client", "prisma"],
  poweredByHeader: false,
  reactStrictMode: true,
  // Force empty so a mistaken Vercel env cannot bake localhost into the client.
  env: {
    NEXT_PUBLIC_API_URL: "",
    DATABASE_URL:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/communityos?schema=public",
    DIRECT_URL:
      process.env.DIRECT_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/communityos?schema=public",
  },
  webpack: (config) => {
    // Prefer compiled package output (avoid following declaration maps into src/).
    config.resolve.alias = {
      ...config.resolve.alias,
      "@communityos/database": path.join(rootDir, "../../packages/database/dist/index.js"),
    };
    return config;
  },
};

export default nextConfig;
