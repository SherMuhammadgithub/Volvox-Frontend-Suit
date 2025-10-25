/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination:
          "https://dual-loria-volvox-88ede180.koyeb.app/api/v1/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
