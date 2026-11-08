"use client";

import { useState, type FormEvent } from "react";
import { addClientPhoto, moveClientPhoto, removeClientPhoto, updateClientPhoto } from "@/actions/admin";
import { CLIENT_CATEGORIES, type ClientCategory, type ClientPhoto } from "@/lib/content/schema";
import { ItemRow, PhotoField, StatusLine } from "./parts";
import { uploadImage } from "./uploadImage";
import { useAdminAction } from "./useAdminAction";
import styles from "./admin.module.css";

export function ClientsEditor({ photos }: { photos: ClientPhoto[] }) {
  const { pending, status, setStatus, run } = useAdminAction();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ClientCategory>("Motos");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const busy = pending || uploading;

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    if (!file) return setStatus({ kind: "error", text: "Choisissez une photo." });
    setUploading(true);
    setStatus({ kind: "success", text: "Envoi de la photo…" });
    try {
      const image = await uploadImage(file, "clients", "photo");
      if (await run(() => addClientPhoto({ title, category, image }), "Photo ajoutée.")) {
        setTitle("");
        setFile(null);
      }
    } catch (error) {
      setStatus({ kind: "error", text: error instanceof Error ? error.message : "Envoi impossible." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className={styles.panel} aria-labelledby="clients-title">
      <h2 id="clients-title" className={styles.panelTitle}>
        Nos clients ({photos.length} photos)
      </h2>

      <form onSubmit={onAdd} className={styles.addForm}>
        <h3>Ajouter une photo</h3>
        <label className={styles.field}>
          <span>Titre (ex. Ferrari 348)</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={80} />
        </label>
        <label className={styles.field}>
          <span>Catégorie</span>
          <select value={category} onChange={(e) => setCategory(e.target.value as ClientCategory)}>
            {CLIENT_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <PhotoField file={file} onChange={setFile} />
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {uploading ? "Envoi…" : "Ajouter"}
        </button>
      </form>

      <StatusLine status={status} />

      {CLIENT_CATEGORIES.map((cat) => {
        const group = photos.filter((p) => p.category === cat);
        return (
          <div key={cat}>
            <h3 className={styles.groupTitle}>
              {cat} ({group.length})
            </h3>
            {group.length === 0 ? (
              <p className={styles.muted}>Aucune photo : l&apos;onglet {cat} est masqué sur le site.</p>
            ) : (
              <ul className={styles.list}>
                {group.map((photo, i) => (
                  <ItemRow
                    key={photo.id}
                    image={photo.image}
                    alt={photo.title}
                    canUp={i > 0}
                    canDown={i < group.length - 1}
                    disabled={busy}
                    onMove={(dir) => run(() => moveClientPhoto(photo.id, dir), "Ordre mis à jour.")}
                    onDelete={() =>
                      confirm(`Supprimer la photo « ${photo.title} » ?`) && run(() => removeClientPhoto(photo.id), "Photo supprimée.")
                    }
                  >
                    <ClientFields photo={photo} disabled={busy} onSave={(patch) => run(() => updateClientPhoto(photo.id, patch))} />
                  </ItemRow>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </section>
  );
}

function ClientFields({
  photo,
  disabled,
  onSave,
}: {
  photo: ClientPhoto;
  disabled: boolean;
  onSave: (patch: { title: string; category: ClientCategory }) => void;
}) {
  const [title, setTitle] = useState(photo.title);
  const [category, setCategory] = useState(photo.category);
  const changed = title !== photo.title || category !== photo.category;

  return (
    <div className={styles.inlineFields}>
      <input aria-label="Titre" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
      <select aria-label="Catégorie" value={category} onChange={(e) => setCategory(e.target.value as ClientCategory)}>
        {CLIENT_CATEGORIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      {changed && (
        <button type="button" className="btn btn-primary" disabled={disabled} onClick={() => onSave({ title, category })}>
          Enregistrer
        </button>
      )}
    </div>
  );
}
