import { describe, expect, it } from "vitest";
import { defaultContent } from "./defaults";
import { contactSchema, openingHoursSchema, saleItemSchema, siteContentSchema, type DayHours } from "./schema";

/** Semaine complète, tous les jours fermés sauf ceux fournis. */
function week(overrides: Record<number, DayHours["slots"]> = {}): DayHours[] {
  return [0, 1, 2, 3, 4, 5, 6].map((day) => ({ day, slots: overrides[day] ?? [] }));
}

describe("siteContentSchema", () => {
  it("accepte le contenu par défaut", () => {
    expect(siteContentSchema.safeParse(defaultContent).success).toBe(true);
  });

  it("reprend les données actuelles du site", () => {
    expect(defaultContent.partners).toHaveLength(36);
    expect(defaultContent.clients).toHaveLength(6);
    expect(defaultContent.sales).toEqual([]);
    expect(defaultContent.contact).toEqual({ phoneDisplay: "0475 54 30 60", email: "info@carbike.be" });
  });
});

describe("openingHoursSchema", () => {
  it("accepte un jour sans plage (fermé)", () => {
    expect(openingHoursSchema.safeParse(week({ 1: [{ from: 510, to: 720 }] })).success).toBe(true);
  });

  it("refuse une plage dont la fin n'est pas après le début", () => {
    expect(openingHoursSchema.safeParse(week({ 1: [{ from: 600, to: 600 }] })).success).toBe(false);
  });

  it("refuse deux plages qui se chevauchent", () => {
    const slots = [
      { from: 510, to: 720 },
      { from: 700, to: 800 },
    ];
    expect(openingHoursSchema.safeParse(week({ 1: slots })).success).toBe(false);
  });

  it("refuse plus de deux plages", () => {
    const slots = [
      { from: 480, to: 540 },
      { from: 600, to: 660 },
      { from: 720, to: 780 },
    ];
    expect(openingHoursSchema.safeParse(week({ 1: slots })).success).toBe(false);
  });

  it("refuse une heure au-delà de minuit", () => {
    expect(openingHoursSchema.safeParse(week({ 1: [{ from: 600, to: 1500 }] })).success).toBe(false);
  });

  it("refuse une semaine incomplète", () => {
    expect(openingHoursSchema.safeParse(week().slice(1)).success).toBe(false);
  });
});

describe("contactSchema", () => {
  it("refuse un e-mail invalide", () => {
    expect(contactSchema.safeParse({ phoneDisplay: "0475 54 30 60", email: "pas-un-mail" }).success).toBe(false);
  });

  it("refuse un numéro trop court", () => {
    expect(contactSchema.safeParse({ phoneDisplay: "12", email: "info@carbike.be" }).success).toBe(false);
  });

  it.each(["0475 54 30 60", "+32 475 54 30 60"])("accepte le numéro %s", (phoneDisplay) => {
    expect(contactSchema.safeParse({ phoneDisplay, email: "info@carbike.be" }).success).toBe(true);
  });
});

describe("saleItemSchema", () => {
  const item = {
    id: "a",
    category: "autos",
    image: { src: "https://x.public.blob.vercel-storage.com/a.jpg", width: 800, height: 600 },
  };

  it("accepte une description de 500 caractères", () => {
    expect(saleItemSchema.safeParse({ ...item, description: "x".repeat(500) }).success).toBe(true);
  });

  it("refuse une description de 501 caractères", () => {
    expect(saleItemSchema.safeParse({ ...item, description: "x".repeat(501) }).success).toBe(false);
  });
});
