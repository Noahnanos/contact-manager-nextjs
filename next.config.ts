import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: [],
  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
