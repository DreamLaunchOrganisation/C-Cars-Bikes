import { describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "./session-token";

const SECRET = "un-secret-de-test-suffisamment-long-0123456789";
const NOW = Date.UTC(2026, 10, 8, 12, 0, 0);
const DAY = 24 * 60 * 60;

describe("session token", () => {
  it("accepte un jeton valide", () => {
    const token = createSessionToken(SECRET, NOW, 30 * DAY);
    expect(verifySessionToken(token, SECRET, NOW + 1000)).toBe(true);
  });

  it("refuse un jeton expiré", () => {
    const token = createSessionToken(SECRET, NOW, DAY);
    expect(verifySessionToken(token, SECRET, NOW + DAY * 1000 + 1)).toBe(false);
  });

  it("refuse un jeton dont l'expiration a été modifiée", () => {
    const token = createSessionToken(SECRET, NOW, DAY);
    const [, signature] = token.split(".");
    const forged = `${NOW + 365 * DAY * 1000}.${signature}`;
    expect(verifySessionToken(forged, SECRET, NOW)).toBe(false);
  });

  it("refuse une signature modifiée", () => {
    const token = createSessionToken(SECRET, NOW, DAY);
    expect(verifySessionToken(`${token.slice(0, -2)}xx`, SECRET, NOW)).toBe(false);
  });

  it("refuse un jeton signé avec un autre secret", () => {
    const token = createSessionToken("autre-secret-tout-aussi-long-0123456789abcd", NOW, DAY);
    expect(verifySessionToken(token, SECRET, NOW)).toBe(false);
  });

  it("refuse l'absence de jeton ou un format invalide", () => {
    expect(verifySessionToken(undefined, SECRET, NOW)).toBe(false);
    expect(verifySessionToken("", SECRET, NOW)).toBe(false);
    expect(verifySessionToken("abc", SECRET, NOW)).toBe(false);
  });
});
