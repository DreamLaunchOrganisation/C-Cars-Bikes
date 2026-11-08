"use server";

import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/admin/password";
import { endSession, isAuthConfigured, startSession } from "@/lib/admin/session";

export type LoginState = { error?: string };

/** Délai après un mauvais mot de passe (freine les essais en série). */
const FAILURE_DELAY_MS = 1000;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return { error: "Connexion non configurée (ADMIN_PASSWORD_HASH / SESSION_SECRET manquants)." };
  }

  const password = String(formData.get("password") ?? "");
  if (!(await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH!))) {
    await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
    return { error: "Mot de passe incorrect." };
  }

  await startSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}
