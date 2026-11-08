"use client";

import { useState, type FormEvent } from "react";
import { addPartner, movePartner, removePartner } from "@/actions/admin";
import type { Partner } from "@/lib/content/schema";
import { ItemRow, PhotoField, StatusLine } from "./parts";
import { uploadImage } from "./uploadImage";
import { useAdminAction } from "./useAdminAction";
import styles from "./admin.module.css";

export function PartnersEditor({ partners }: { partners: Partner[] }) {
  const { pending, status, setStatus, run } = useAdminAction();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const busy = pending || uploading;

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    if (!file) return setStatus({ kind: "error", text: "Choisissez un logo." });
    setUploading(true);
    setStatus({ kind: "success", text: "Envoi du logo…" });
    try {
      const logo = await uploadImage(file, "partners", "logo");
      if (await run(() => addPartner({ name, logo }), "Logo ajouté au bandeau.")) {
        setName("");
        setFile(null);
      }
    } catch (error) {
      setStatus({ kind: "error", text: error instanceof Error ? error.message : "Envoi impossible." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className={styles.panel} aria-labelledby="partners-title">
      <h2 id="partners-title" className={styles.panelTitle}>
        Bandeau jaune ({partners.length} logos)
      </h2>

      <form onSubmit={onAdd} className={styles.addForm}>
        <h3>Ajouter un logo</h3>
        <label className={styles.field}>
          <span>Nom de la marque</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} />
        </label>
        <PhotoField file={file} onChange={setFile} logo label="Logo" />
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {uploading ? "Envoi…" : "Ajouter"}
        </button>
      </form>

      <StatusLine status={status} />

      <ul className={styles.list}>
        {partners.map((p, i) => (
          <ItemRow
            key={p.id}
            image={p.logo}
            alt={p.name}
            logo
            canUp={i > 0}
            canDown={i < partners.length - 1}
            disabled={busy}
            onMove={(dir) => run(() => movePartner(p.id, dir), "Ordre mis à jour.")}
            onDelete={() => confirm(`Retirer « ${p.name} » du bandeau ?`) && run(() => removePartner(p.id), "Logo retiré.")}
          >
            <strong>{p.name}</strong>
          </ItemRow>
        ))}
      </ul>
    </section>
  );
}
