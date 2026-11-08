import { describe, expect, it } from "vitest";
import { phoneLinks } from "./phone";

describe("phoneLinks", () => {
  it("convertit un numéro belge national", () => {
    expect(phoneLinks("0475 54 30 60")).toEqual({
      href: "tel:+32475543060",
      international: "+32 475 54 30 60",
    });
  });

  it("garde un numéro déjà international", () => {
    expect(phoneLinks("+33 6 12 34 56 78")).toEqual({
      href: "tel:+33612345678",
      international: "+33 6 12 34 56 78",
    });
  });
});
