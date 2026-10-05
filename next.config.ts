import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "open-api.delcom.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
