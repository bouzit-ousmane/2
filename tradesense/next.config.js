/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    // Removed top-level 'eslint' as it is deprecated in newer Next.js versions
};

module.exports = nextConfig;
