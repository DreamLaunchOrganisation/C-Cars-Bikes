import type { SaleCategory } from "@/lib/content/schema";

/** Catégories de la section « Vente » (les annonces sont gérées depuis l'admin). */
export const saleCategories: { slug: SaleCategory; title: string }[] = [
  { slug: "autos", title: "Autos" },
  { slug: "motos", title: "Motos" },
  { slug: "pieces", title: "Pièces" },
  { slug: "divers", title: "Divers" },
];

export const saleCategoryTitle = (slug: SaleCategory) => saleCategories.find((c) => c.slug === slug)?.title ?? slug;
