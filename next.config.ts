import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow access from your local network (e.g. phone)
  allowedDevOrigins: ['192.168.1.37'],
};

export default nextConfig;
