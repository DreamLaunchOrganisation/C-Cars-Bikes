import type { IconName } from "@/components/ui/Icon";
import type { SaleCategory } from "@/lib/content/schema";

/** Catégories de la section « Vente » (les annonces sont gérées depuis l'admin). */
export const saleCategories: { slug: SaleCategory; title: string; subtitle: string; icon: IconName }[] = [
  { slug: "autos", title: "Autos", subtitle: "Voitures d'occasion", icon: "car" },
  { slug: "motos", title: "Motos", subtitle: "Motos d'occasion", icon: "motorbike" },
  { slug: "pieces", title: "Pièces", subtitle: "Performance & oldtimers", icon: "engine" },
  { slug: "divers", title: "Divers", subtitle: "Accessoires & équipement", icon: "helmet" },
];

export const saleCategoryTitle = (slug: SaleCategory) => saleCategories.find((c) => c.slug === slug)?.title ?? slug;
