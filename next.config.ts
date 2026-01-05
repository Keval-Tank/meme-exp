import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images : {
    remotePatterns : [
      {
        protocol : 'https',
        hostname : "hjdlydadcmwyofkobjjl.supabase.co"
      },
      {
        protocol : 'https',
        hostname : "replicate.delivery"
      }
    ]
  },
  typescript : {
    ignoreBuildErrors : true
  }
};

export default nextConfig;
