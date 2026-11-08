import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdmin, UnauthorizedError } from "@/lib/admin/session";

/** Dossiers autorisés pour les images envoyées depuis l'admin. */
const ALLOWED_PATH = /^uploads\/(partners|clients|sales)\/[^/]+$/;

/**
 * Délivre au navigateur un jeton d'envoi direct vers Vercel Blob
 * (contourne la limite de 4,5 Mo des requêtes Vercel). Réservé à l'admin connecté.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    // Demande de jeton venant du navigateur : session obligatoire, avant toute autre chose.
    // (La notification de fin d'envoi, elle, vient de Vercel et est signée par handleUpload.)
    if (body.type === "blob.generate-client-token") await requireAdmin();

    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!ALLOWED_PATH.test(pathname)) throw new Error("Emplacement d'envoi refusé.");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 8 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof UnauthorizedError ? 401 : 400;
    const message = error instanceof Error ? error.message : "Envoi refusé.";
    return NextResponse.json({ error: message }, { status });
  }
}
