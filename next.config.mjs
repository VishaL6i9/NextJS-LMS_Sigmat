/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'via.placeholder.com',
            },
        ],
    },
    eslint: {
        // Disable ESLint during production builds
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Ignore TypeScript errors during production builds
        ignoreBuildErrors: true,
    },
}

export default nextConfig;