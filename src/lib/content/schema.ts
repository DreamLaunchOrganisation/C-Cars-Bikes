import { z } from "zod";

/*
 * Contenu modifiable depuis l'espace d'administration.
 * Stocké dans Vercel Blob (content.json) et validé à chaque lecture / écriture.
 */

/** Jours dans l'ordre de Date.getDay() : 0 = dimanche … 6 = samedi. */
export const DAY_LABELS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export const imgSchema = z.object({
  src: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  blurDataURL: z.string().optional(),
});

export const partnerSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Indiquez le nom de la marque.").max(60),
  logo: imgSchema,
});

export const CLIENT_CATEGORIES = ["Motos", "Autos"] as const;

export const clientPhotoSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Indiquez un titre.").max(80),
  category: z.enum(CLIENT_CATEGORIES),
  image: imgSchema,
});

export const SALE_CATEGORIES = ["autos", "motos", "pieces", "divers"] as const;

export const saleItemSchema = z.object({
  id: z.string().min(1),
  category: z.enum(SALE_CATEGORIES),
  description: z.string().trim().min(1, "Ajoutez une description.").max(500, "500 caractères maximum."),
  image: imgSchema,
});

/** Numéro saisi tel qu'il sera affiché : commence par 0 ou +, 9 à 13 chiffres. */
const phoneSchema = z
  .string()
  .trim()
  .regex(/^[0+][\d\s./-]*$/, "Numéro invalide (ex. 0475 54 30 60).")
  .refine((value) => {
    const digits = value.replace(/\D/g, "").length;
    return digits >= 9 && digits <= 13;
  }, "Numéro invalide (ex. 0475 54 30 60).");

export const contactSchema = z.object({
  phoneDisplay: phoneSchema,
  email: z.string().trim().email("Adresse e-mail invalide."),
});

const slotSchema = z
  .object({
    from: z.number().int().min(0).max(1440),
    to: z.number().int().min(0).max(1440),
  })
  .refine((s) => s.to > s.from, "L'heure de fin doit être après l'heure de début.");

export const dayHoursSchema = z.object({
  day: z.number().int().min(0).max(6),
  slots: z
    .array(slotSchema)
    .max(2, "Deux plages maximum par jour.")
    .refine((slots) => {
      const sorted = [...slots].sort((a, b) => a.from - b.from);
      return sorted.every((s, i) => i === 0 || s.from >= sorted[i - 1].to);
    }, "Les plages horaires se chevauchent."),
});

export const openingHoursSchema = z
  .array(dayHoursSchema)
  .length(7)
  .refine((days) => new Set(days.map((d) => d.day)).size === 7, "Chaque jour doit apparaître une fois.");

export const siteContentSchema = z.object({
  version: z.literal(1),
  partners: z.array(partnerSchema),
  clients: z.array(clientPhotoSchema),
  sales: z.array(saleItemSchema),
  contact: contactSchema,
  openingHours: openingHoursSchema,
});

export type Img = z.infer<typeof imgSchema>;
export type Partner = z.infer<typeof partnerSchema>;
export type ClientCategory = (typeof CLIENT_CATEGORIES)[number];
export type ClientPhoto = z.infer<typeof clientPhotoSchema>;
export type SaleCategory = (typeof SALE_CATEGORIES)[number];
export type SaleItem = z.infer<typeof saleItemSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Slot = z.infer<typeof slotSchema>;
export type DayHours = z.infer<typeof dayHoursSchema>;
export type SiteContent = z.infer<typeof siteContentSchema>;
