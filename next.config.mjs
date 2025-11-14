import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    experimental: {
        authInterrupts: true,
    },
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
    // Include Prisma client files in output file tracing for Vercel deployment
    outputFileTracingIncludes: {
        '/api/**/*': ['./src/generated/prisma/**/*'],
        '/*': ['./src/generated/prisma/**/*'],
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.plugins = [...config.plugins, new PrismaPlugin()];
        }
        return config;
    },
};

export default nextConfig;
