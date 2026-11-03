import type { NextConfig } from "next";

// Photos are served from Neon Object Storage. Its address comes from the same env var the server uses.
const storageUrl = process.env.AWS_ENDPOINT_URL_S3 ? new URL(process.env.AWS_ENDPOINT_URL_S3) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: storageUrl ? [{ protocol: storageUrl.protocol.replace(":", "") as "http" | "https", hostname: storageUrl.hostname, pathname: "/**" }] : [],
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
