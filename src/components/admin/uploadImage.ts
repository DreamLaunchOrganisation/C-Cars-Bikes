"use client";

import { upload } from "@vercel/blob/client";
import { resizeImage, type ImageKind } from "@/lib/image-resize";
import type { Img } from "@/lib/content/schema";

export type UploadFolder = "partners" | "clients" | "sales";

/** Redimensionne l'image dans le navigateur puis l'envoie directement dans Vercel Blob. */
export async function uploadImage(file: File, folder: UploadFolder, kind: ImageKind): Promise<Img> {
  const resized = await resizeImage(file, kind);
  let blob;
  try {
    blob = await upload(`uploads/${folder}/${resized.file.name}`, resized.file, {
      access: "public",
      handleUploadUrl: "/api/admin/upload",
    });
  } catch (error) {
    console.error("[admin] Envoi de l'image échoué :", error);
    throw new Error("Envoi de l'image impossible : session expirée ou stockage non configuré. Rechargez la page et réessayez.");
  }
  return { src: blob.url, width: resized.width, height: resized.height, blurDataURL: resized.blurDataURL };
}
