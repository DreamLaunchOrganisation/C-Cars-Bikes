import type { Img } from "./schema";

/** Propriétés `next/image` d'une image du contenu (flou de chargement seulement s'il existe). */
export function imageProps(img: Img) {
  return {
    src: img.src,
    width: img.width,
    height: img.height,
    ...(img.blurDataURL ? { placeholder: "blur" as const, blurDataURL: img.blurDataURL } : {}),
  };
}
