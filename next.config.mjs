/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return []
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default nextConfig;
