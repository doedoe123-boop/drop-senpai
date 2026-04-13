import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@drop-senpai/lib", "@drop-senpai/types"],
};

export default nextConfig;
