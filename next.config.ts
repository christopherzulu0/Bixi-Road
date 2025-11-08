import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
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
};

export default nextConfig;
