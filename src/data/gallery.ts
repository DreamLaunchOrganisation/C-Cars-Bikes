import type { StaticImageData } from "next/image";

import harleySportster from "@/assets/clients/harley-sportster.jpg";
import harleySportster2 from "@/assets/clients/harley-sportster-2.jpg";
import harleySportster3 from "@/assets/clients/harley-sportster-3.jpg";
import harleySportster4 from "@/assets/clients/harley-sportster-4.jpg";
import harleySportsterCustom from "@/assets/clients/harley-sportster-custom.jpg";
import harleySportsterCustom2 from "@/assets/clients/harley-sportster-custom-2.jpg";
import harleySportsterCustom3 from "@/assets/clients/harley-sportster-custom-3.jpg";
import harleySportsterCustom4 from "@/assets/clients/harley-sportster-custom-4.jpg";
import harleySportsterCustom5 from "@/assets/clients/harley-sportster-custom-5.jpg";
import harleyFatBobGraffiti from "@/assets/clients/harley-fat-bob-graffiti.jpg";
import harleyFatBobGraffiti2 from "@/assets/clients/harley-fat-bob-graffiti-2.jpg";
import harleyFatBobUsine from "@/assets/clients/harley-fat-bob-usine.jpg";
import harleyFatBobUsine2 from "@/assets/clients/harley-fat-bob-usine-2.jpg";
import harleyFatBobDuo from "@/assets/clients/harley-fat-bob-duo.jpg";
import ducatiMonsterS2r from "@/assets/clients/ducati-monster-s2r.jpg";
import ducatiMonsterS2r2 from "@/assets/clients/ducati-monster-s2r-2.jpg";
import ducatiMonsterS2r3 from "@/assets/clients/ducati-monster-s2r-3.jpg";
import ducatiMonsterS2r4 from "@/assets/clients/ducati-monster-s2r-4.jpg";
import ducatiDiavel from "@/assets/clients/ducati-diavel.jpg";
import ducatiDiavel2 from "@/assets/clients/ducati-diavel-2.jpg";
import ducatiDiavel3 from "@/assets/clients/ducati-diavel-3.jpg";
import triumphTr6 from "@/assets/clients/triumph-tr6.jpg";
import triumphTr6_2 from "@/assets/clients/triumph-tr6-2.jpg";
import alfa2000 from "@/assets/clients/alfa-romeo-2000-berlina.jpg";
import alfa2000_2 from "@/assets/clients/alfa-romeo-2000-berlina-2.jpg";
import alfa2000_3 from "@/assets/clients/alfa-romeo-2000-berlina-3.jpg";
import alfa2000Moteur from "@/assets/clients/alfa-romeo-2000-berlina-moteur.jpg";
import alfa2000Interieur from "@/assets/clients/alfa-romeo-2000-berlina-interieur.jpg";
import alfaJunior from "@/assets/clients/alfa-romeo-junior-zagato.jpg";
import alfaJunior2 from "@/assets/clients/alfa-romeo-junior-zagato-2.jpg";
import ferrari348 from "@/assets/clients/ferrari-348.jpg";
import ferrari348_2 from "@/assets/clients/ferrari-348-2.jpg";
import ferrari348_3 from "@/assets/clients/ferrari-348-3.jpg";
import ferrari348Moteur from "@/assets/clients/ferrari-348-moteur.jpg";

/**
 * `extras` : autres photos du même véhicule, affichées en plein écran.
 * `description` : texte affiché à côté (une ligne commençant par « - » devient une puce).
 */
export type GalleryItem = { title: string; image: StaticImageData; extras?: StaticImageData[]; description?: string };
export type GalleryCategory = "Motos" | "Autos";

/**
 * Photos « Nos clients ».
 * Pour ajouter une photo : la déposer dans src/assets/clients/, l'importer ici
 * puis l'ajouter dans la bonne catégorie (autres photos du véhicule dans `extras`).
 */
export const gallery: Record<GalleryCategory, GalleryItem[]> = {
  Motos: [
    {
      title: "Harley-Davidson Sportster",
      image: harleySportster,
      extras: [harleySportster2, harleySportster3, harleySportster4],
    },
    {
      title: "Harley-Davidson Sportster custom",
      image: harleySportsterCustom,
      extras: [harleySportsterCustom2, harleySportsterCustom3, harleySportsterCustom4, harleySportsterCustom5],
    },
    {
      title: "Harley-Davidson Fat Bob",
      image: harleyFatBobGraffiti,
      extras: [harleyFatBobGraffiti2, harleyFatBobDuo],
    },
    {
      title: "Ducati Monster S2R",
      image: ducatiMonsterS2r,
      extras: [ducatiMonsterS2r2, ducatiMonsterS2r3, ducatiMonsterS2r4],
    },
    {
      title: "Ducati Diavel",
      image: ducatiDiavel,
      extras: [ducatiDiavel2, ducatiDiavel3],
      description: [
        "Ducati Diavel Carbon Red 2012",
        "- 711 km",
        "- Garde-boue arrière carbone Ducati Performance",
        "- Rétros Rizoma",
        "- Bouchons de cadre Ducati Performance",
        "- Porte-plaque carbone Ducati Performance",
        "- Protection d'échappement carbone Ducati Performance",
        "- Papiers 100 ch",
        "État neuf, reprise possible.",
      ].join("\n"),
    },
    {
      title: "Harley-Davidson Fat Bob noire",
      image: harleyFatBobUsine,
      extras: [harleyFatBobUsine2, harleyFatBobDuo],
    },
  ],
  Autos: [
    { title: "Triumph TR6", image: triumphTr6, extras: [triumphTr6_2] },
    { title: "Alfa Romeo 2000 Berlina", image: alfa2000, extras: [alfa2000_2, alfa2000_3, alfa2000Moteur, alfa2000Interieur] },
    { title: "Alfa Romeo Junior Zagato", image: alfaJunior, extras: [alfaJunior2] },
    { title: "Ferrari 348", image: ferrari348, extras: [ferrari348_2, ferrari348_3, ferrari348Moteur] },
  ],
};
