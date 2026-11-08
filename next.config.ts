import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: {
      // Formulaire de contact avec pièce jointe (4 Mo max + marge).
      // Vercel plafonne de toute façon le corps des requêtes à 4,5 Mo.
      bodySizeLimit: "4.5mb",
    },
  },
};

export default nextConfig;
