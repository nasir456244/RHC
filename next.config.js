/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.sanity.io', 'gateway.ipfscdn.io', 'thewell.mypinata.cloud']
  }
}

module.exports = nextConfig
