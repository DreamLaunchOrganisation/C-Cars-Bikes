"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { sendContactMessage } from "@/actions/contact";
import {
  MAX_FILE_SIZE,
  initialContactState,
  type ContactFieldName,
  type ContactState,
} from "@/lib/contact-schema";
import styles from "./ContactForm.module.css";

type FieldProps = {
  name: ContactFieldName;
  label: string;
  required?: boolean;
  span?: 2 | 3 | 4 | 6;
  half?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "tel" | "email";
  defaultValue?: string;
  error?: string;
};

function Field({ name, label, required, span = 3, half, type = "text", error, ...rest }: FieldProps) {
  const id = `contact-${name}`;
  return (
    <div className={`${styles.field} ${styles[`s${span}`]} ${half ? styles.half : ""}`}>
      <label htmlFor={id}>
        {label} {required && <em aria-hidden="true">*</em>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${id}-error`} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
}

export function ContactForm() {
  // Server Action appelée via une fonction client : la page reste 100 % statique
  // (passer l'action directement rendrait la page dynamique avec Cache Components).
  const [state, formAction, pending] = useActionState(
    (prev: ContactState, formData: FormData) => sendContactMessage(prev, formData),
    initialContactState,
  );
  // Fichier choisi, lié à l'état courant : il s'efface après chaque envoi (le formulaire est réinitialisé)
  const [picked, setPicked] = useState<{ name: string | null; error: string | null; for: typeof state }>({
    name: null,
    error: null,
    for: state,
  });
  const fileLabel = picked.for === state ? picked.name : null;
  const fileError = picked.for === state ? picked.error : null;
  const startedAt = useRef<HTMLInputElement>(null);

  // Heure d'affichage du formulaire (anti-robots), renseignée côté navigateur
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, [state]);

  const v = state.values ?? {};
  const err = state.errors ?? {};

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > MAX_FILE_SIZE) {
      e.target.value = "";
      setPicked({ name: null, error: "Fichier trop lourd (4 Mo maximum).", for: state });
      return;
    }
    setPicked({ name: file?.name ?? null, error: null, for: state });
  };

  return (
    <form action={formAction} className={styles.form} aria-describedby="contact-status">
      {/* Champ piège invisible pour les robots */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAt} type="hidden" name="startedAt" />

      <Field name="nom" label="Nom" required autoComplete="family-name" defaultValue={v.nom} error={err.nom} />
      <Field name="prenom" label="Prénom" required autoComplete="given-name" defaultValue={v.prenom} error={err.prenom} />
      <Field name="rue" label="Rue" span={4} autoComplete="address-line1" defaultValue={v.rue} />
      <Field name="numero" label="Numéro" span={2} half defaultValue={v.numero} />
      <Field name="cp" label="Code postal" span={2} half inputMode="numeric" autoComplete="postal-code" defaultValue={v.cp} />
      <Field name="localite" label="Localité" span={4} autoComplete="address-level2" defaultValue={v.localite} />
      <Field name="tel" label="Téléphone ou GSM" required type="tel" autoComplete="tel" defaultValue={v.tel} error={err.tel} />
      <Field name="email" label="E-mail" required type="email" autoComplete="email" defaultValue={v.email} error={err.email} />

      <div className={`${styles.field} ${styles.s6}`}>
        <span className={styles.label} id="file-label">
          Joindre un fichier (photo ou PDF, max 4 Mo)
        </span>
        <label className={styles.file}>
          <input
            type="file"
            name="fichier"
            accept="image/*,.pdf"
            aria-labelledby="file-label"
            onChange={onFileChange}
          />
          {fileLabel ? (
            <span>
              <b>✓</b> {fileLabel}
            </span>
          ) : (
            <span>
              <b>Choisir un fichier</b> ou glisser-déposer ici
            </span>
          )}
        </label>
        {(fileError || err.fichier) && <span className={styles.error}>{fileError ?? err.fichier}</span>}
      </div>

      <div className={`${styles.field} ${styles.s6}`}>
        <label htmlFor="contact-question">
          Votre question <em aria-hidden="true">*</em>
        </label>
        <textarea
          id="contact-question"
          name="question"
          required
          placeholder="Marque, modèle, année… et ce que vous souhaitez faire"
          defaultValue={v.question}
          aria-invalid={!!err.question}
        />
        {err.question && <span className={styles.error}>{err.question}</span>}
      </div>

      <div id="contact-status" role="status" aria-live="polite" className={styles.statusSlot}>
        {state.status !== "idle" && state.message && (
          <p className={`${styles.status} ${state.status === "error" ? styles.statusError : ""}`}>
            {state.status === "success" ? "✓ " : ""}
            {state.message}
          </p>
        )}
      </div>

      <div className={styles.foot}>
        <small>
          <em>*</em> Champs obligatoires
        </small>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Envoi en cours…" : "Envoyer le message →"}
        </button>
      </div>
    </form>
  );
}
