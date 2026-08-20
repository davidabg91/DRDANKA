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
  /**
   * Security headers. Vercel already sends Strict-Transport-Security, so these
   * fill the remaining gaps flagged by the audit.
   *
   * No Content-Security-Policy here on purpose: this site loads Stripe,
   * Firebase, the Google Maps embed and Vercel Analytics, so a CSP written
   * blind would break checkout or the map. It needs to be built from a real
   * report-only run before it is enforced.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
