/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'p3.music.126.net',
      },
      {
        protocol: 'https',
        hostname: 'y.gtimg.cn',
      },
      {
        protocol: 'https',
        hostname: 'pic.xiami.net',
      },
      {
        protocol: 'http',
        hostname: 'singerimg.kugou.com',
      },
      {
        protocol: 'http',
        hostname: 'musicdata.baidu.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api.php',
        destination: '/api/proxy', // Proxy to local API
      },
    ];
  },
};

module.exports = nextConfig;