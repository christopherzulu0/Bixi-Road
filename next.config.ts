import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configure external image domains for Uploadthing
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Include Prisma client files in output file tracing for deployment
  outputFileTracingIncludes: {
    '/api/**/*': ['./src/generated/prisma/**/*'],
    '/*': ['./src/generated/prisma/**/*'],
  },
};

export default nextConfig;
