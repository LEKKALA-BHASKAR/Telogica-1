/** @type {import('next').NextConfig} */

// The Express API. Next proxies /api/* to it so the browser stays same-origin
// and the auth cookie is sent without any CORS dance.
const API_TARGET = process.env.API_PROXY_TARGET ?? "http://localhost:5001";

const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_TARGET}/api/:path*` }];
  },
};

export default nextConfig;
