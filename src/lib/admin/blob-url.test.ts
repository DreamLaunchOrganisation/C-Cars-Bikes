import { describe, expect, it } from "vitest";
import { isBlobUrl } from "./blob-url";

describe("isBlobUrl", () => {
  it("accepte une image du store Vercel Blob", () => {
    expect(isBlobUrl("https://abc123.public.blob.vercel-storage.com/uploads/clients/x.jpg")).toBe(true);
  });

  it.each([
    ["http (non chiffré)", "http://abc123.public.blob.vercel-storage.com/x.jpg"],
    ["domaine piégé dans le chemin", "https://evil.com/x.public.blob.vercel-storage.com"],
    ["domaine qui finit pareil sans point", "https://evilpublic.blob.vercel-storage.com.evil.com/x.jpg"],
    ["image du dépôt", "/_next/static/media/x.png"],
    ["texte quelconque", "pas une url"],
  ])("refuse %s", (_label, src) => {
    expect(isBlobUrl(src)).toBe(false);
  });
});
