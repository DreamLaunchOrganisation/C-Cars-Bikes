import { createHmac, timingSafeEqual } from "node:crypto";

/** Nom du cookie de session de l'admin (partagé avec proxy.ts). */
export const SESSION_COOKIE = "cb_admin";

/*
 * Jeton de session de l'admin : "<expiration en ms>.<signature HMAC-SHA256 base64url>".
 * Sans état côté serveur : la signature (clé SESSION_SECRET) empêche toute falsification.
 */

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSessionToken(secret: string, nowMs: number, maxAgeSec: number): string {
  const exp = String(nowMs + maxAgeSec * 1000);
  return `${exp}.${sign(exp, secret)}`;
}

export function verifySessionToken(token: string | undefined, secret: string, nowMs: number): boolean {
  if (!token || !secret) return false;
  const [exp, signature] = token.split(".");
  if (!exp || !signature || !/^\d+$/.test(exp)) return false;

  const expected = Buffer.from(sign(exp, secret));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;

  return Number(exp) > nowMs;
}
