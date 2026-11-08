import "server-only";
import { get, put } from "@vercel/blob";
import { isBlobUrl } from "@/lib/admin/blob-url";
import { defaultContent } from "./defaults";
import { siteContentSchema, type SiteContent } from "./schema";

/** Fichier de contenu dans le store Vercel Blob. */
const CONTENT_PATH = "content.json";

export class StorageNotConfiguredError extends Error {
  constructor() {
    super("Stockage non configuré (BLOB_READ_WRITE_TOKEN manquant).");
  }
}

/** content.json illisible : on refuse de le modifier pour ne pas écraser le contenu. */
export class ContentCorruptedError extends Error {
  constructor() {
    super("Le contenu enregistré est illisible ou invalide : modification annulée pour ne rien écraser. Contactez le développeur.");
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

/**
 * Les images du dépôt (contenu par défaut) sont enregistrées avec leur URL de build,
 * qui peut changer d'un déploiement à l'autre : on les rattache à leur version actuelle.
 */
function withCurrentRepoImages(content: SiteContent): SiteContent {
  const partnerLogos = new Map(defaultContent.partners.map((p) => [p.id, p.logo]));
  const clientImages = new Map(defaultContent.clients.map((c) => [c.id, c.image]));
  return {
    ...content,
    partners: content.partners.map((p) =>
      !isBlobUrl(p.logo.src) && partnerLogos.has(p.id) ? { ...p, logo: partnerLogos.get(p.id)! } : p,
    ),
    clients: content.clients.map((c) =>
      !isBlobUrl(c.image.src) && clientImages.has(c.id) ? { ...c, image: clientImages.get(c.id)! } : c,
    ),
  };
}

/**
 * Dernière version enregistrée, lue à la source (sans le cache du CDN).
 * En mode strict (avant une écriture), un fichier invalide lève une erreur au lieu de revenir
 * au contenu par défaut, pour ne jamais écraser le contenu du gérant.
 */
export async function readStoredContent({ strict = false } = {}): Promise<SiteContent> {
  if (!isStorageConfigured()) return defaultContent;
  const file = await get(CONTENT_PATH, { access: "public", useCache: false });
  if (!file || file.statusCode !== 200) return defaultContent;
  const text = await new Response(file.stream).text();

  if (strict) {
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new ContentCorruptedError();
    }
    const result = siteContentSchema.safeParse(data);
    if (!result.success) throw new ContentCorruptedError();
    return withCurrentRepoImages(result.data);
  }
  return withCurrentRepoImages(parseContent(text));
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
