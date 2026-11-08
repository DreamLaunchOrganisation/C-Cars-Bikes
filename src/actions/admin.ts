"use server";

import { randomUUID } from "node:crypto";
import { del } from "@vercel/blob";
import { ZodError } from "zod";
import { isBlobUrl } from "@/lib/admin/blob-url";
import { requireAdmin, UnauthorizedError } from "@/lib/admin/session";
import { mutateContent } from "@/lib/content";
import { appendItem, moveItem, removeItem, updateItem } from "@/lib/content/list-ops";
import { StorageNotConfiguredError } from "@/lib/content/store";
import {
  clientPhotoSchema,
  contactSchema,
  imgSchema,
  openingHoursSchema,
  partnerSchema,
  saleItemSchema,
  type ClientCategory,
  type ClientPhoto,
  type Contact,
  type DayHours,
  type Img,
  type SaleCategory,
} from "@/lib/content/schema";

/*
 * Actions de l'espace d'administration. Chacune vérifie la session elle-même
 * (ne jamais se fier au seul proxy), valide ses entrées, relit le contenu,
 * applique sa modification puis rafraîchit le site.
 */

export type ActionResult = { ok: true } | { ok: false; error: string };
type Direction = -1 | 1;

class InvalidInputError extends Error {}

/** Exécute une modification protégée et traduit les erreurs en message pour l'interface. */
async function run(change: () => Promise<void>): Promise<ActionResult> {
  try {
    await requireAdmin();
    await change();
    return { ok: true };
  } catch (error) {
    if (
      error instanceof UnauthorizedError ||
      error instanceof InvalidInputError ||
      error instanceof StorageNotConfiguredError
    ) {
      return { ok: false, error: error.message };
    }
    if (error instanceof ZodError) return { ok: false, error: error.issues[0]?.message ?? "Données invalides." };
    console.error("[admin] Échec de l'action :", error);
    return { ok: false, error: "Une erreur est survenue, réessayez." };
  }
}

/** L'image doit avoir été envoyée dans notre store Blob (refuse toute URL forgée). */
function checkImage(img: Img): Img {
  const valid = imgSchema.parse(img);
  if (!isBlobUrl(valid.src)) throw new InvalidInputError("Image invalide : renvoyez la photo.");
  return valid;
}

function checkDirection(direction: number): Direction {
  if (direction !== -1 && direction !== 1) throw new InvalidInputError("Déplacement invalide.");
  return direction;
}

/** Supprime une image envoyée (jamais une image du dépôt). Un échec n'annule pas la suppression. */
async function deleteImage(src: string | undefined) {
  if (!src || !isBlobUrl(src)) return;
  try {
    await del(src);
  } catch (error) {
    console.error("[admin] Image non supprimée du stockage :", src, error);
  }
}

const sameCategory = <T extends { category: string }>(a: T, b: T) => a.category === b.category;

/* --- Bandeau (logos partenaires) ---------------------------------------- */

export async function addPartner(input: { name: string; logo: Img }): Promise<ActionResult> {
  return run(async () => {
    const partner = partnerSchema.parse({ id: randomUUID(), name: input.name, logo: checkImage(input.logo) });
    await mutateContent((c) => ({ ...c, partners: appendItem(c.partners, partner) }));
  });
}

export async function removePartner(id: string): Promise<ActionResult> {
  return run(async () => {
    let src: string | undefined;
    await mutateContent((c) => {
      src = c.partners.find((p) => p.id === id)?.logo.src;
      return { ...c, partners: removeItem(c.partners, id) };
    });
    await deleteImage(src);
  });
}

export async function movePartner(id: string, direction: Direction): Promise<ActionResult> {
  return run(async () => {
    const dir = checkDirection(direction);
    await mutateContent((c) => ({ ...c, partners: moveItem(c.partners, id, dir) }));
  });
}

/* --- Nos clients -------------------------------------------------------- */

export async function addClientPhoto(input: { title: string; category: ClientCategory; image: Img }): Promise<ActionResult> {
  return run(async () => {
    const photo = clientPhotoSchema.parse({ id: randomUUID(), ...input, image: checkImage(input.image) });
    await mutateContent((c) => ({ ...c, clients: appendItem(c.clients, photo) }));
  });
}

export async function updateClientPhoto(
  id: string,
  patch: { title: string; category: ClientCategory },
): Promise<ActionResult> {
  return run(async () => {
    const valid = clientPhotoSchema.pick({ title: true, category: true }).parse(patch);
    await mutateContent((c) => ({ ...c, clients: updateItem<ClientPhoto>(c.clients, id, valid) }));
  });
}

export async function removeClientPhoto(id: string): Promise<ActionResult> {
  return run(async () => {
    let src: string | undefined;
    await mutateContent((c) => {
      src = c.clients.find((p) => p.id === id)?.image.src;
      return { ...c, clients: removeItem(c.clients, id) };
    });
    await deleteImage(src);
  });
}

export async function moveClientPhoto(id: string, direction: Direction): Promise<ActionResult> {
  return run(async () => {
    const dir = checkDirection(direction);
    await mutateContent((c) => ({ ...c, clients: moveItem(c.clients, id, dir, sameCategory) }));
  });
}

/* --- Vente -------------------------------------------------------------- */

export async function addSaleItem(input: { category: SaleCategory; description: string; image: Img }): Promise<ActionResult> {
  return run(async () => {
    const item = saleItemSchema.parse({ id: randomUUID(), ...input, image: checkImage(input.image) });
    await mutateContent((c) => ({ ...c, sales: appendItem(c.sales, item) }));
  });
}

export async function updateSaleItem(
  id: string,
  patch: { category: SaleCategory; description: string },
): Promise<ActionResult> {
  return run(async () => {
    const valid = saleItemSchema.pick({ category: true, description: true }).parse(patch);
    await mutateContent((c) => ({ ...c, sales: updateItem(c.sales, id, valid) }));
  });
}

export async function removeSaleItem(id: string): Promise<ActionResult> {
  return run(async () => {
    let src: string | undefined;
    await mutateContent((c) => {
      src = c.sales.find((s) => s.id === id)?.image.src;
      return { ...c, sales: removeItem(c.sales, id) };
    });
    await deleteImage(src);
  });
}

export async function moveSaleItem(id: string, direction: Direction): Promise<ActionResult> {
  return run(async () => {
    const dir = checkDirection(direction);
    await mutateContent((c) => ({ ...c, sales: moveItem(c.sales, id, dir) }));
  });
}

/* --- Coordonnées et horaires ------------------------------------------- */

export async function saveContact(contact: Contact, openingHours: DayHours[]): Promise<ActionResult> {
  return run(async () => {
    const validContact = contactSchema.parse(contact);
    const validHours = openingHoursSchema.parse(openingHours);
    await mutateContent((c) => ({ ...c, contact: validContact, openingHours: validHours }));
  });
}
