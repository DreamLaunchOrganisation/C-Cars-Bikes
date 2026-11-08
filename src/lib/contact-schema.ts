import { z } from "zod";

/**
 * Pièce jointe : 4 Mo max. Vercel refuse les requêtes de plus de 4,5 Mo,
 * il faut garder de la marge pour les autres champs du formulaire.
 */
export const MAX_FILE_SIZE = 4 * 1024 * 1024;

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
] as const;

/** Texte sur une ligne : pas de retour à la ligne (évite l'injection d'en-têtes mail). */
const line = (max = 120) =>
  z
    .string()
    .trim()
    .max(max, "Trop long.")
    .transform((v) => v.replace(/[\r\n]+/g, " "));

export const contactSchema = z.object({
  nom: line().pipe(z.string().min(1, "Merci d'indiquer votre nom.")),
  prenom: line().pipe(z.string().min(1, "Merci d'indiquer votre prénom.")),
  rue: line(),
  numero: line(20),
  cp: line(10),
  localite: line(),
  tel: line(30).pipe(z.string().min(6, "Merci d'indiquer un numéro de téléphone valide.")),
  email: z.string().trim().max(160).pipe(z.email("L'adresse e-mail n'est pas valide.")),
  question: z.string().trim().min(1, "Merci d'écrire votre question.").max(5000, "Message trop long."),
});

export type ContactFields = z.infer<typeof contactSchema>;
export type ContactFieldName = keyof ContactFields;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactFieldName | "fichier", string>>;
  /** Valeurs saisies, renvoyées pour ne pas vider le formulaire en cas d'erreur. */
  values?: Partial<Record<ContactFieldName, string>>;
};

export const initialContactState: ContactState = { status: "idle" };
