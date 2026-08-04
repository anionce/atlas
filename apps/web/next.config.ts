import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@atlas/design-system",
    "@atlas/journey-engine",
    "@atlas/decision-engine",
    "@atlas/formula-engine",
    "@atlas/rules-engine",
    "@atlas/analytics",
    "@atlas/seo",
  ],
};

export default nextConfig;
