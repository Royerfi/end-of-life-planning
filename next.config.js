/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    // Adjust webpack configuration
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // Prevents `fs` usage on the client
      };
    }

    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'], // Ensure compatibility with Next.js
        },
      },
    });

    return config;
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com;
              style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
              img-src 'self' data: https:;
              font-src 'self' data:;
              connect-src 'self' https://api.openai.com https://eol25-aeo1adquw-royerfis-projects.vercel.app https://uaubxuvf3dkzppdn.public.blob.vercel-storage.com;
              worker-src 'self' blob:;
            `.replace(/\s{2,}/g, ' '), // Removes extra spaces
          },
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              font-src 'self' data:;
              connect-src 'self' https://api.openai.com https://eol25-aeo1adquw-royerfis-projects.vercel.app https://uaubxuvf3dkzppdn.public.blob.vercel-storage.com;
            `.replace(/\s{2,}/g, ' '),
          },
          {
            key: 'Cache-Control',
            value: 'private, max-age=3600',
          },
        ],
      },
    ];
  },

  env: {
    VERCEL_URL: process.env.VERCEL_URL, // Use environment variable
  },

  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/public/uploads/:path*', // Maps dynamic paths correctly
      },
    ];
  },
};

export default nextConfig;
