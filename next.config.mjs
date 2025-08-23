/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Redirect configuration for production
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/((?!waitlist|api/waitlist|_next|favicon.ico).*)',
          destination: '/waitlist',
          permanent: false,
        },
      ];
    }
    return [];
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Image optimization
  images: {
    domains: ['ygubmsjjbpzincalmhjp.supabase.co'],
  },
};

export default nextConfig;
