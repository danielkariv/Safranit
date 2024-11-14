import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'd-steimatzky.co.il', // Just the domain part, without the protocol
    ],
  },
};

export default nextConfig;
