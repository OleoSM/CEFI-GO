/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ['192.168.1.87'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', '192.168.1.87']
    }
  },
  typescript: {
    ignoreBuildErrors: true  // temporal — admin mock data types por alinear en Fase 3
  }
};

export default nextConfig;
