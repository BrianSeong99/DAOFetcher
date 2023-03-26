/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["cdn.stamp.fyi", "avatars.githubusercontent.com", 'cdn.discordapp.com', 'www.cnet.com', 'cdn.geekwire.com', 'thumbor.forbes.com'],
  },
};

module.exports = nextConfig;
