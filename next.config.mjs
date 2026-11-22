/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Admin media uploads go through a server action. The default 1 MB cap
      // rejected ordinary phone photos; the per-type limits are enforced in
      // lib/server/media.js. (Vercel still caps request bodies at ~4.5 MB.)
      bodySizeLimit: '30mb',
    },
  },
};

export default nextConfig;
