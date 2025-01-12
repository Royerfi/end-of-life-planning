/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
        };
      }
  
      config.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['next/babel'],
            },
          },
        ],
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
              value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://api.openai.com https://*.vercel-blob.com; worker-src 'self' blob:;"
            }
          ]
        }
      ]
    },
    experimental: {
      serverComponentsExternalPackages: ['fs'],
    },
  }
  
  export default nextConfig;