"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ActionResult } from "@/actions/admin";

export type Status = { kind: "success" | "error"; text: string } | null;

/**
 * Lance une action d'admin, affiche le résultat et rafraîchit les données de la page.
 * Renvoie `true` si l'action a réussi.
 */
export function useAdminAction() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>(null);

  const run = (action: () => Promise<ActionResult>, successText = "Enregistré.") =>
    new Promise<boolean>((resolve) => {
      startTransition(async () => {
        try {
          const result = await action();
          if (result.ok) {
            setStatus({ kind: "success", text: successText });
            router.refresh();
          } else {
            setStatus({ kind: "error", text: result.error });
          }
          resolve(result.ok);
        } catch (error) {
          setStatus({ kind: "error", text: error instanceof Error ? error.message : "Une erreur est survenue." });
          resolve(false);
        }
      });
    });

  return { pending, status, setStatus, run };
}
