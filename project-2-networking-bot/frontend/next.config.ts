import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const outreachUrl = (process.env.OUTREACH_URL || 'http://127.0.0.1:8000').replace(/\/$/, "");

    // If outreachUrl already ends with /outreach, we proxy /api to the base URL
    // so that /api/outreach becomes {base}/outreach instead of {base}/outreach/outreach
    const baseUrl = outreachUrl.endsWith("/outreach")
      ? outreachUrl.replace("/outreach", "")
      : outreachUrl;

    return [
      {
        source: '/api/:path*',
        destination: `${baseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
