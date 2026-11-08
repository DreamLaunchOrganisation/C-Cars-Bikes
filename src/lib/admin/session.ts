import "server-only";
import { cookies } from "next/headers";
import { createSessionToken, SESSION_COOKIE, verifySessionToken } from "./session-token";

/** Durée de la session : 30 jours. */
const MAX_AGE = 30 * 24 * 60 * 60;

export class UnauthorizedError extends Error {
  constructor() {
    super("Session expirée, reconnectez-vous.");
  }
}

/** SESSION_SECRET, ou null s'il est absent ou trop court. */
function sessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

export function isAuthConfigured(): boolean {
  return !!sessionSecret() && !!process.env.ADMIN_PASSWORD_HASH;
}

export async function isAdmin(): Promise<boolean> {
  const secret = sessionSecret();
  if (!secret) return false;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token, secret, Date.now());
}

/** À appeler en premier dans chaque Server Action / Route Handler de l'admin. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new UnauthorizedError();
}

export async function startSession(): Promise<void> {
  const secret = sessionSecret();
  if (!secret) throw new Error("SESSION_SECRET manquant ou trop court (32 caractères minimum).");
  (await cookies()).set(SESSION_COOKIE, createSessionToken(secret, Date.now(), MAX_AGE), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
