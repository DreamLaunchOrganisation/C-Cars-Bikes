import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultContent } from "@/lib/content/defaults";
import type { SiteContent } from "@/lib/content/schema";

/* Session, stockage et Blob simulés : on teste les règles des actions. */
const state = vi.hoisted(() => ({ admin: true, content: null as unknown as SiteContent }));

vi.mock("@/lib/admin/session", async () => {
  class UnauthorizedError extends Error {
    constructor() {
      super("Session expirée, reconnectez-vous.");
    }
  }
  return {
    UnauthorizedError,
    requireAdmin: vi.fn(async () => {
      if (!state.admin) throw new UnauthorizedError();
    }),
  };
});
vi.mock("@/lib/content", () => ({
  mutateContent: vi.fn(async (change: (c: SiteContent) => SiteContent) => (state.content = change(state.content))),
}));
vi.mock("@vercel/blob", () => ({ del: vi.fn(async () => {}) }));

import { del } from "@vercel/blob";
import { addPartner, addSaleItem, moveClientPhoto, removePartner, saveContact, updateSaleItem } from "./admin";

const blobImg = { src: "https://abc.public.blob.vercel-storage.com/uploads/partners/x.png", width: 200, height: 80 };

beforeEach(() => {
  state.admin = true;
  state.content = structuredClone(defaultContent);
  vi.mocked(del).mockClear();
});

describe("actions admin", () => {
  it("refuse toute modification sans session", async () => {
    state.admin = false;
    expect(await addPartner({ name: "Ohlins", logo: blobImg })).toEqual({
      ok: false,
      error: "Session expirée, reconnectez-vous.",
    });
    expect(state.content.partners).toHaveLength(36);
  });

  it("ajoute un logo à la fin du bandeau", async () => {
    expect(await addPartner({ name: "Ohlins", logo: blobImg })).toEqual({ ok: true });
    expect(state.content.partners.at(-1)).toMatchObject({ name: "Ohlins", logo: blobImg });
  });

  it("refuse une image qui ne vient pas du store Blob", async () => {
    const result = await addPartner({ name: "Pirate", logo: { ...blobImg, src: "https://evil.com/x.png" } });
    expect(result.ok).toBe(false);
    expect(state.content.partners).toHaveLength(36);
  });

  it("supprime l'image Blob d'un logo retiré", async () => {
    await addPartner({ name: "Ohlins", logo: blobImg });
    const id = state.content.partners.at(-1)!.id;
    expect(await removePartner(id)).toEqual({ ok: true });
    expect(state.content.partners).toHaveLength(36);
    expect(del).toHaveBeenCalledWith(blobImg.src);
  });

  it("ne supprime pas les images du dépôt", async () => {
    await removePartner("partner-0");
    expect(state.content.partners).toHaveLength(35);
    expect(del).not.toHaveBeenCalled();
  });

  it("déplace une photo client au sein de sa catégorie", async () => {
    const autos = () => state.content.clients.filter((c) => c.category === "Autos").map((c) => c.id);
    const [first, second] = autos();
    expect(await moveClientPhoto(second, -1)).toEqual({ ok: true });
    expect(autos().slice(0, 2)).toEqual([second, first]);
  });

  it("ajoute puis modifie une annonce", async () => {
    await addSaleItem({ category: "autos", description: "Alfa Romeo GTV 1974", image: blobImg });
    const id = state.content.sales[0].id;
    expect(await updateSaleItem(id, { category: "motos", description: "Ducati 900 SS" })).toEqual({ ok: true });
    expect(state.content.sales[0]).toMatchObject({ category: "motos", description: "Ducati 900 SS" });
  });

  it("refuse une description vide avec un message clair", async () => {
    expect(await addSaleItem({ category: "autos", description: "  ", image: blobImg })).toEqual({
      ok: false,
      error: "Ajoutez une description.",
    });
  });

  it("refuse des horaires qui se chevauchent", async () => {
    const hours = structuredClone(defaultContent.openingHours);
    hours[0].slots = [
      { from: 510, to: 720 },
      { from: 700, to: 800 },
    ];
    const result = await saveContact(defaultContent.contact, hours);
    expect(result).toEqual({ ok: false, error: "Les plages horaires se chevauchent." });
  });

  it("enregistre de nouvelles coordonnées", async () => {
    const contact = { phoneDisplay: "0471 11 22 33", email: "atelier@carbike.be" };
    expect(await saveContact(contact, defaultContent.openingHours)).toEqual({ ok: true });
    expect(state.content.contact).toEqual(contact);
  });
});
