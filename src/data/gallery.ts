import type { StaticImageData } from "next/image";

import harleySportster from "@/assets/clients/harley-sportster.jpg";
import harleySportsterCustom from "@/assets/clients/harley-sportster-custom.jpg";
import triumphTr6 from "@/assets/clients/triumph-tr6.jpg";
import alfa2000 from "@/assets/clients/alfa-romeo-2000-berlina.jpg";
import alfaJunior from "@/assets/clients/alfa-romeo-junior-zagato.jpg";
import ferrari348 from "@/assets/clients/ferrari-348.jpg";

export type GalleryItem = { title: string; image: StaticImageData };
export type GalleryCategory = "Motos" | "Autos";

/**
 * Photos « Nos clients ».
 * Pour ajouter une photo : la déposer dans src/assets/clients/, l'importer ici
 * puis l'ajouter dans la bonne catégorie.
 */
export const gallery: Record<GalleryCategory, GalleryItem[]> = {
  Motos: [
    { title: "Harley-Davidson Sportster", image: harleySportster },
    { title: "Harley-Davidson Sportster custom", image: harleySportsterCustom },
  ],
  Autos: [
    { title: "Triumph TR6", image: triumphTr6 },
    { title: "Alfa Romeo 2000 Berlina", image: alfa2000 },
    { title: "Alfa Romeo Junior Zagato", image: alfaJunior },
    { title: "Ferrari 348", image: ferrari348 },
  ],
};
