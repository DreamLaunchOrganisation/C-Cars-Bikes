"use server";

import { getContent } from "@/lib/content";
import { sendMail } from "@/lib/mailer";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  contactSchema,
  type ContactFieldName,
  type ContactState,
} from "@/lib/contact-schema";

const FIELDS: ContactFieldName[] = ["nom", "prenom", "rue", "numero", "cp", "localite", "tel", "email", "question"];

/** Délai minimum entre l'affichage du formulaire et l'envoi (anti-robots). */
const MIN_FILL_TIME_MS = 3000;

const LABELS: Record<Exclude<ContactFieldName, "question">, string> = {
  nom: "Nom",
  prenom: "Prénom",
  rue: "Rue",
  numero: "Numéro",
  cp: "Code postal",
  localite: "Localité",
  tel: "Téléphone",
  email: "E-mail",
};

/**
 * Server Action du formulaire de contact.
 * Valide les champs, vérifie la pièce jointe et envoie le message à l'atelier.
 */
export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = Object.fromEntries(FIELDS.map((f) => [f, String(formData.get(f) ?? "")])) as Record<
    ContactFieldName,
    string
  >;

  // --- Anti-spam : champ piège rempli ou envoi trop rapide → on ignore en silence
  const honeypot = String(formData.get("website") ?? "");
  const startedAt = Number(formData.get("startedAt") ?? 0);
  if (honeypot || (startedAt && Date.now() - startedAt < MIN_FILL_TIME_MS)) {
    return { status: "success", message: "Merci ! Votre message a bien été envoyé." };
  }

  // --- Validation des champs
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactFieldName;
      errors[field] ??= issue.message;
    }
    return { status: "error", message: "Merci de corriger les champs indiqués.", errors, values };
  }
  const data = parsed.data;

  // --- Pièce jointe (optionnelle)
  const file = formData.get("fichier");
  let attachment: { filename: string; content: Buffer; contentType: string } | undefined;
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) {
      return { status: "error", errors: { fichier: "Fichier trop lourd (4 Mo maximum)." }, values };
    }
    if (!(ALLOWED_FILE_TYPES as readonly string[]).includes(file.type)) {
      return { status: "error", errors: { fichier: "Format non accepté (photo ou PDF uniquement)." }, values };
    }
    const safeName = file.name.replace(/[^\w.-]+/g, "_").slice(-80) || "piece-jointe";
    attachment = { filename: safeName, content: Buffer.from(await file.arrayBuffer()), contentType: file.type };
  }

  // --- Envoi
  const fullName = `${data.prenom} ${data.nom}`;
  const lines = (Object.keys(LABELS) as (keyof typeof LABELS)[])
    .filter((key) => data[key])
    .map((key) => `${LABELS[key].padEnd(12)} : ${data[key]}`);

  const text = [
    "Nouveau message envoyé depuis le formulaire du site carbike.be",
    "",
    ...lines,
    "",
    "Question :",
    data.question,
    attachment ? `\nPièce jointe : ${attachment.filename}` : "",
  ].join("\n");

  // Messages envoyés à l'e-mail modifiable depuis l'admin (CONTACT_TO reste prioritaire)
  const { contact } = await getContent();

  try {
    await sendMail({
      to: contact.email,
      subject: `Nouveau message du site - ${fullName}`,
      text,
      replyTo: { name: fullName, address: data.email },
      attachments: attachment ? [attachment] : undefined,
    });
  } catch (error) {
    console.error("[contact] Échec de l'envoi :", error);
    return {
      status: "error",
      message: `Le message n'a pas pu être envoyé. Réessayez ou appelez-nous au ${contact.phoneDisplay}.`,
      values,
    };
  }

  return { status: "success", message: "Merci ! Votre message a bien été envoyé. Nous revenons vers vous rapidement." };
}
