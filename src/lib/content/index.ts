import "server-only";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { readStoredContent, writeStoredContent } from "./store";
import type { SiteContent } from "./schema";

export const CONTENT_TAG = "site-content";

/**
 * Contenu du site, mis en cache (il fait partie du rendu statique) et
 * invalidé par `mutateContent` à chaque modification depuis l'admin.
 */
export async function getContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  return readStoredContent();
}

/**
 * Applique une modification à la dernière version enregistrée, l'écrit,
 * puis rafraîchit immédiatement le site. À appeler uniquement depuis une Server Action.
 */
export async function mutateContent(change: (content: SiteContent) => SiteContent): Promise<SiteContent> {
  const next = change(await readStoredContent());
  await writeStoredContent(next);
  updateTag(CONTENT_TAG);
  return next;
}
