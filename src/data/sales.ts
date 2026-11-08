import type { IconName } from "@/components/ui/Icon";

export type SaleCategory = { slug: string; title: string; subtitle: string; icon: IconName };

/**
 * Catégories de la section « Vente ».
 * Les pages de détail (/vente/autos, …) sont à créer quand le contenu sera prêt.
 */
export const saleCategories: SaleCategory[] = [
  { slug: "autos", title: "Autos", subtitle: "Voitures d'occasion", icon: "car" },
  { slug: "motos", title: "Motos", subtitle: "Motos d'occasion", icon: "motorbike" },
  { slug: "pieces", title: "Pièces", subtitle: "Performance & oldtimers", icon: "gear" },
  { slug: "divers", title: "Divers", subtitle: "Accessoires & équipement", icon: "toolbox" },
];
