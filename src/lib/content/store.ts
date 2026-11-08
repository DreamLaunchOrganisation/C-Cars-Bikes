import "server-only";
import { get, put } from "@vercel/blob";
import { defaultContent } from "./defaults";
import { siteContentSchema, type SiteContent } from "./schema";

/** Fichier de contenu dans le store Vercel Blob. */
const CONTENT_PATH = "content.json";

export class StorageNotConfiguredError extends Error {
  constructor() {
    super("Stockage non configuré (BLOB_READ_WRITE_TOKEN manquant).");
  }
}

export function isStorageConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

/** Valide un contenu brut ; en cas de problème, revient au contenu par défaut (jamais de page cassée). */
export function parseContent(raw: unknown): SiteContent {
  let data = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch (error) {
      console.error("[content] content.json illisible, contenu par défaut utilisé :", error);
      return defaultContent;
    }
  }
  const result = siteContentSchema.safeParse(data);
  if (!result.success) {
    console.error("[content] content.json invalide, contenu par défaut utilisé :", result.error.issues);
    return defaultContent;
  }
  return result.data;
}

/** Dernière version enregistrée, lue à la source (sans le cache du CDN). */
export async function readStoredContent(): Promise<SiteContent> {
  if (!isStorageConfigured()) return defaultContent;
  const file = await get(CONTENT_PATH, { access: "public", useCache: false });
  if (!file || file.statusCode !== 200) return defaultContent;
  return parseContent(await new Response(file.stream).text());
}

export async function writeStoredContent(content: SiteContent): Promise<void> {
  if (!isStorageConfigured()) throw new StorageNotConfiguredError();
  const valid = siteContentSchema.parse(content);
  await put(CONTENT_PATH, JSON.stringify(valid), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}
