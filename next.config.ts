import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@api/mural-production", "oas", "es5-ext"],
};

export default nextConfig;
