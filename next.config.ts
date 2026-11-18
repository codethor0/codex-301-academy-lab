import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

// The site loads scripts, styles, fonts, and images only from its own origin.
// 'unsafe-inline' is required in script-src because the Turbopack production
// build emits a per-page inline chunk-loader script, and in style-src for the
// compatibility marquee timing. All content is rendered as React text, so the
// site has no HTML injection sink.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // The development server needs eval and a websocket for hot reload, so the
  // policy applies to production builds only.
  ...(isProduction ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy }] : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The Docker image sets NEXT_OUTPUT_STANDALONE=1 to build a self-contained
  // server. Native `pnpm build` and `pnpm start` are unchanged.
  output: process.env.NEXT_OUTPUT_STANDALONE === "1" ? "standalone" : undefined,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
