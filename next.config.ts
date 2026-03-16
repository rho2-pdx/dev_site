import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/api/journal": ["./journal/**/*"],
  },
};

export default nextConfig;
