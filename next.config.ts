import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Firebase Storage images to flow through the Next.js image
    // optimizer (auto AVIF/WebP, on-the-fly resize, aggressive cache).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
    ],
    // Reasonable max widths for our covers (catalog + detail).
    deviceSizes: [320, 480, 640, 768, 1024, 1280, 1536],
    // Static covers never change once deployed — cache the optimized
    // variants for 31 days instead of re-optimizing on every visit.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
