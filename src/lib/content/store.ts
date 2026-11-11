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
  const defaultClients = new Map(defaultContent.clients.map((c) => [c.id, c]));
  return {
    ...content,
    partners: content.partners.map((p) =>
      !isBlobUrl(p.logo.src) && partnerLogos.has(p.id) ? { ...p, logo: partnerLogos.get(p.id)! } : p,
    ),
    clients: content.clients.map((stored) => {
      const repo = defaultClients.get(stored.id);
      if (!repo) return stored;
      // Description jamais enregistrée (contenu antérieur) : celle du dépôt. Effacée par l'admin : "" est conservé.
      const c = { ...stored, description: stored.description ?? repo.description };
      const image = isBlobUrl(c.image.src) ? c.image : repo.image;
      // Pas encore de photos supplémentaires enregistrées : on reprend celles du dépôt
      if (c.extras === undefined) return { ...c, image, extras: repo.extras };
      const repoExtras = new Map((repo.extras ?? []).map((img) => [repoImageKey(img.src), img]));
      const extras = c.extras.map((img) => (isBlobUrl(img.src) ? img : (repoExtras.get(repoImageKey(img.src)) ?? img)));
      return { ...c, image, extras };
    }),
  };
}

/**
 * Nom stable d'une image du dépôt, sans l'empreinte ajoutée au build
 * (« /_next/static/media/photo-2.a1b2c3.jpg » → « photo-2 »).
 */
export function repoImageKey(src: string): string {
  return (src.split("/").pop() ?? src).split(".")[0];
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
