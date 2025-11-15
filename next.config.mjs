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
        // Include for all API routes - explicitly include the query engine binary
        '/api/**': [
            './src/generated/prisma/**/*',
            './src/generated/prisma/**/*.node',
            './src/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node',
            './src/generated/prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node',
        ],
        // Include for all routes (catch-all)
        '/**': [
            './src/generated/prisma/**/*',
            './src/generated/prisma/**/*.node',
            './src/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node',
            './src/generated/prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node',
        ],
    },
};

export default nextConfig;
