/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.sanity.io', 'cdn.dribbble.com', 'gateway.ipfscdn.io']
  }
}

module.exports = nextConfig
