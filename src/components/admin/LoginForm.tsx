"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/actions/admin-auth";
import styles from "./admin.module.css";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className={styles.loginCard}>
      <h1 className={styles.loginTitle}>Espace administration</h1>
      <p className={styles.muted}>C/Cars &amp; Bikes</p>

      <label className={styles.field}>
        <span>Mot de passe</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          autoFocus
          aria-invalid={!!state.error}
          aria-describedby={state.error ? "login-error" : undefined}
        />
      </label>

      {state.error && (
        <p id="login-error" role="alert" className={styles.error}>
          {state.error}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
