import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow access from your local network (e.g. phone)
  allowedDevOrigins: ['192.168.1.37', '192.168.1.21'],
  images: {
    qualities: [25, 50, 75, 100],
  },
};

export default nextConfig;
