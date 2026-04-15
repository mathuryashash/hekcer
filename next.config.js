/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        // Only proxy to local FastAPI during local development.
        // On Vercel (production), vercel.json rewrites handle /api/* → api/index.py
        if (process.env.NODE_ENV !== 'development') {
            return [];
        }
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
