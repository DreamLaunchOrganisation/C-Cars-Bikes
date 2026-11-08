import { describe, expect, it } from "vitest";
import { defaultContent } from "@/lib/content/defaults";
import { isOpenAt } from "./hours";

/** Dates en heure de Bruxelles (UTC+1 en novembre). Le 9/11/2026 est un lundi. */
const brussels = (iso: string) => new Date(`${iso}+01:00`);
const hours = defaultContent.openingHours;

describe("isOpenAt", () => {
  it("ouvert un lundi à 9h", () => {
    expect(isOpenAt(brussels("2026-11-09T09:00:00"), hours)).toBe(true);
  });

  it("fermé un lundi à 12h30 (pause de midi)", () => {
    expect(isOpenAt(brussels("2026-11-09T12:30:00"), hours)).toBe(false);
  });

  it("fermé un dimanche à 10h", () => {
    expect(isOpenAt(brussels("2026-11-08T10:00:00"), hours)).toBe(false);
  });

  it("suit les horaires reçus (dimanche matin ouvert)", () => {
    const sundayOpen = hours.map((d) => (d.day === 0 ? { day: 0, slots: [{ from: 600, to: 720 }] } : d));
    expect(isOpenAt(brussels("2026-11-08T10:00:00"), sundayOpen)).toBe(true);
  });
});
