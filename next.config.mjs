// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    eslint: {
        // Only enable ESLint in development
        ignoreDuringBuilds: process.env.NODE_ENV === 'production'
    },
    typescript: {
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        ignoreBuildErrors: true
    },
    webpack: (config) => {
        if (config.module && config.module.rules) {
            config.module.rules.push({
                test: /\.(json|js|ts|tsx|jsx)$/,
                resourceQuery: /raw/,
                use: 'raw-loader'
            });
        }
        return config;
    },

    // START OF CRITICAL ADDITION
    async rewrites() {
        // Dynamically use the environment variable on Vercel production, 
        // or fallback to 127.0.0.1 for local development.
        const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5275';

        return [
            // Proxy for environment developer endpoints
            {
                source: '/api/env/:path*',
                destination: `${BACKEND_URL}/api/env/:path*`,
            },

            // Existing working rules
            {
                source: '/api/SpatialEnvironment/:path*',
                destination: `${BACKEND_URL}/api/SpatialEnvironment/:path*`,
            },
            {
                source: '/api/live/:path*',
                destination: `${BACKEND_URL}/api/live/:path*`,
            },
            // Catch-all for any other API routes to ensure they proxy correctly
            {
                source: '/api/:path*',
                destination: `${BACKEND_URL}/api/:path*`,
            },
        ];
    }
    // END OF CRITICAL ADDITION
};

export default nextConfig;