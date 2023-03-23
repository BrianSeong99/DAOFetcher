/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["cdn.stamp.fyi", "avatars.githubusercontent.com", 'cdn.discordapp.com'],
  },
};

module.exports = nextConfig;
