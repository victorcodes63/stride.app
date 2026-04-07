/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard/accounts/contracts',
        destination: '/dashboard/people/contracts',
        permanent: true,
      },
      {
        source: '/dashboard/accounts/contracts/:id',
        destination: '/dashboard/people/contracts/:id',
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig
