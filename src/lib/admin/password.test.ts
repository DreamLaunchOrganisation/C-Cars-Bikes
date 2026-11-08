import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password", () => {
  it("produit une empreinte au format scrypt:sel:hash (sans $, que Next développerait dans .env)", async () => {
    expect(await hashPassword("secret")).toMatch(/^scrypt:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+$/);
  });

  it("deux empreintes du même mot de passe diffèrent (sel aléatoire)", async () => {
    expect(await hashPassword("secret")).not.toBe(await hashPassword("secret"));
  });

  it("accepte le bon mot de passe", async () => {
    expect(await verifyPassword("secret", await hashPassword("secret"))).toBe(true);
  });

  it("refuse un mauvais mot de passe", async () => {
    expect(await verifyPassword("Secret", await hashPassword("secret"))).toBe(false);
  });

  it("refuse une empreinte mal formée", async () => {
    expect(await verifyPassword("secret", "n'importe quoi")).toBe(false);
    expect(await verifyPassword("secret", "")).toBe(false);
  });
});
