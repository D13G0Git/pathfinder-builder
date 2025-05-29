/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['pages', 'app', 'components', 'lib', 'src'],
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: 'pbxt.replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: 'jnpqfptdxobrdukqpcza.supabase.co',
      }
    ],
  },
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
  output: 'standalone',
}

export default nextConfig
