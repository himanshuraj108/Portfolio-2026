/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'media.licdn.com' },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    outputFileTracingIncludes: {
      '/api/**/*': ['./prisma/schema.prisma'],
    },
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), '@prisma/client', '.prisma/client'];
    return config;
  },
};

export default nextConfig;
