import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vitest/config";

/**
 * Imite les imports d'images de Next (objet { src, width, height, blurDataURL })
 * au lieu de la simple URL renvoyée par Vite.
 */
function nextStaticImages(): Plugin {
  return {
    name: "next-static-images",
    enforce: "pre",
    load(id) {
      const path = id.split("?")[0];
      if (!/\.(png|jpe?g|webp|svg)$/i.test(path)) return null;
      const name = path.split("/").pop();
      return `export default ${JSON.stringify({
        src: `/_next/static/media/${name}`,
        width: 400,
        height: 300,
        blurDataURL: "data:image/jpeg;base64,AAAA",
      })};`;
    },
  };
}

export default defineConfig({
  plugins: [nextStaticImages()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // « server-only » lève une erreur hors de Next : neutralisé pour les tests
      "server-only": fileURLToPath(new URL("./test/stubs/empty.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
