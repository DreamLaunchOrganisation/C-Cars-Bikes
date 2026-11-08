/** Hôte des fichiers publics Vercel Blob : <store>.public.blob.vercel-storage.com */
const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/** Vrai seulement pour une image hébergée dans un store Vercel Blob (refuse toute URL forgée). */
export function isBlobUrl(src: string): boolean {
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}
