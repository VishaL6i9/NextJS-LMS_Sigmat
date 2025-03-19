/** @type {import('next').NextConfig} */
const nextConfig = {
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