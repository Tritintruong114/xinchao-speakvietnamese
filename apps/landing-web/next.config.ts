import type { NextConfig } from 'next';

/**
 * Supabase Storage public URLs always use *.supabase.co.
 * Use a static wildcard so next/image works even when SUPABASE_URL is missing at config-eval time
 * (dev/Turbopack) — env-based patterns alone caused "Failed to generate cache key".
 */
/** Matches both public URLs (`.../object/public/bucket/...`) and direct object paths (`.../object/bucket/...`). */
const supabaseStorageRemotePatterns = [
  {
    protocol: 'https' as const,
    hostname: '**.supabase.co',
    pathname: '/storage/v1/object/**',
  },
];

const nextConfig: NextConfig = {
  transpilePackages: ['@xinchao/ui-web', '@xinchao/config-tailwind'],
  images: {
    /** Avoids Next image optimizer cache-key failures for Storage URLs in dev/Turbopack. */
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/7.x/**',
      },
      ...supabaseStorageRemotePatterns,
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
