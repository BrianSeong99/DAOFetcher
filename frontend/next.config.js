/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "cdn.stamp.fyi",
      "avatars.githubusercontent.com",
      "cdn.discordapp.com",
      "www.cnet.com",
      "cdn.geekwire.com",
      "thumbor.forbes.com",
      "picsum.photos",
      "daofetchervancouver.s3.us-west-2.amazonaws.com"
    ],
  },
};

module.exports = nextConfig;
