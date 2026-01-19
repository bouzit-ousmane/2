/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: '/api/:path*', // Vercel will automatically route to api/ folder
            },
        ];
    },
    // Ensure API routes are handled by Vercel Functions
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
};

module.exports = nextConfig;
