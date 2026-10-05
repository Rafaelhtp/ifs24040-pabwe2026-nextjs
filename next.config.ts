import type { NextConfig } from "next";

// Alamat API asli. Hanya dipakai di sisi server (rewrites), TIDAK lagi dipanggil langsung dari browser.
const API_TARGET_URL =
  process.env.NEXT_PUBLIC_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ["@tabler/icons-react"],
    // Sisipkan CSS langsung ke HTML -> tidak ada file CSS yang memblokir render
    // (menghilangkan audit "Eliminate render-blocking resources").
    inlineCss: true,
  },
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": "./src/lib/noop.js",
    },
  },
  async rewrites() {
    // Browser memanggil /api-proxy/* (same-origin), Next.js yang meneruskan ke API Delcom.
    // Hasilnya: tanpa CORS/preflight dan tanpa peringatan Chrome soal header Authorization.
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${API_TARGET_URL}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/((?!api-proxy).*)",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;