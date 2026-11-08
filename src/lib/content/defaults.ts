import type { StaticImageData } from "next/image";
import { gallery } from "@/data/gallery";
import { partners } from "@/data/partners";
import type { Img, SiteContent } from "./schema";

/** Image du dépôt → image sérialisable du contenu. */
function toImg(image: StaticImageData): Img {
  return { src: image.src, width: image.width, height: image.height, blurDataURL: image.blurDataURL };
}

/**
 * Contenu de départ : celui du site avant la mise en place de l'admin.
 * Utilisé tant qu'aucun content.json n'a été enregistré (ou si le stockage est absent).
 * Les identifiants sont stables pour que l'admin puisse les cibler avant la première écriture.
 */
export const defaultContent: SiteContent = {
  version: 1,
  partners: partners.map((p, i) => ({ id: `partner-${i}`, name: p.name, logo: toImg(p.logo) })),
  clients: (["Motos", "Autos"] as const).flatMap((category) =>
    gallery[category].map((item, i) => ({
      id: `client-${category.toLowerCase()}-${i}`,
      title: item.title,
      category,
      image: toImg(item.image),
    })),
  ),
  sales: [],
  contact: { phoneDisplay: "0475 54 30 60", email: "info@carbike.be" },
  openingHours: [
    { day: 1, slots: [{ from: 510, to: 720 }, { from: 780, to: 1080 }] },
    { day: 2, slots: [{ from: 510, to: 720 }, { from: 780, to: 1080 }] },
    { day: 3, slots: [{ from: 510, to: 720 }, { from: 780, to: 1080 }] },
    { day: 4, slots: [{ from: 510, to: 720 }, { from: 780, to: 1080 }] },
    { day: 5, slots: [{ from: 510, to: 720 }, { from: 780, to: 1080 }] },
    { day: 6, slots: [{ from: 540, to: 720 }, { from: 810, to: 1020 }] },
    { day: 0, slots: [] },
  ],
};
