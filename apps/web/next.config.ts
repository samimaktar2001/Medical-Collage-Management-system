import type { NextConfig } from 'next';

const apiDestination = (
  process.env.API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:4000'
).replace(/\/+$/, '');

const connectOrigins = ["'self'"];
if (apiDestination.startsWith('http')) {
  try {
    const parsed = new URL(apiDestination);
    connectOrigins.push(parsed.origin);
  } catch {}
}

const config: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [{ source: '/api/v1/:path*', destination: `${apiDestination}/api/v1/:path*` }];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'same-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "media-src 'self' data: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              `connect-src ${connectOrigins.join(' ')}`,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  poweredByHeader: false,
};
export default config;

