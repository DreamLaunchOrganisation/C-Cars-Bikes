/*
 * Redimensionnement dans le navigateur avant l'envoi : une photo de téléphone
 * (5–12 Mo) devient un JPEG de quelques centaines de Ko, un logo garde sa transparence.
 */

export type ImageKind = "photo" | "logo";

const SETTINGS: Record<ImageKind, { maxSide: number; type: string; quality?: number; ext: string }> = {
  photo: { maxSide: 2000, type: "image/jpeg", quality: 0.85, ext: "jpg" },
  logo: { maxSide: 600, type: "image/png", ext: "png" },
};

export type ResizedImage = { file: File; width: number; height: number; blurDataURL: string };

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Conversion de l'image impossible."))), type, quality),
  );
}

export async function resizeImage(source: File, kind: ImageKind): Promise<ResizedImage> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(source, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Format d'image non pris en charge par ce navigateur. Utilisez une photo JPEG ou PNG.");
  }

  const { maxSide, type, quality, ext } = SETTINGS[kind];
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);

  // Vignette floue affichée pendant le chargement (16 px de large)
  const thumb = document.createElement("canvas");
  thumb.width = 16;
  thumb.height = Math.max(1, Math.round((16 * height) / width));
  thumb.getContext("2d")!.drawImage(bitmap, 0, 0, thumb.width, thumb.height);
  const blurDataURL = thumb.toDataURL(kind === "logo" ? "image/png" : "image/jpeg", 0.6);
  bitmap.close();

  const blob = await canvasToBlob(canvas, type, quality);
  const baseName = source.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]+/gi, "-").toLowerCase() || "image";
  return { file: new File([blob], `${baseName}.${ext}`, { type }), width, height, blurDataURL };
}
