"use client";

import { useState, type FormEvent } from "react";
import {
  addClientExtras,
  addClientPhoto,
  moveClientPhoto,
  removeClientExtra,
  removeClientPhoto,
  updateClientPhoto,
} from "@/actions/admin";
import { CLIENT_CATEGORIES, MAX_CLIENT_DESCRIPTION, MAX_CLIENT_EXTRAS, type ClientCategory, type ClientPhoto, type Img } from "@/lib/content/schema";
import { ItemRow, PhotoField, StatusLine } from "./parts";
import { uploadImage } from "./uploadImage";
import { useAdminAction } from "./useAdminAction";
import styles from "./admin.module.css";

export function ClientsEditor({ photos }: { photos: ClientPhoto[] }) {
  const { pending, status, setStatus, run } = useAdminAction();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ClientCategory>("Motos");
  const [description, setDescription] = useState("");
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
      if (await run(() => addClientPhoto({ title, category, description, image }), "Photo ajoutée.")) {
        setTitle("");
        setDescription("");
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
        <DescriptionField value={description} onChange={setDescription} />
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
                    <ClientExtras photo={photo} disabled={busy} setUploading={setUploading} setStatus={setStatus} run={run} />
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
  onSave: (patch: { title: string; category: ClientCategory; description: string }) => void;
}) {
  const [title, setTitle] = useState(photo.title);
  const [category, setCategory] = useState(photo.category);
  const [description, setDescription] = useState(photo.description ?? "");
  const changed = title !== photo.title || category !== photo.category || description !== (photo.description ?? "");

  return (
    <div className={styles.stackFields}>
      <div className={styles.inlineFields}>
        <input aria-label="Titre" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
        <select aria-label="Catégorie" value={category} onChange={(e) => setCategory(e.target.value as ClientCategory)}>
          {CLIENT_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <DescriptionField value={description} onChange={setDescription} />
      {changed && (
        <button
          type="button"
          className="btn btn-primary"
          disabled={disabled}
          onClick={() => onSave({ title, category, description })}
        >
          Enregistrer
        </button>
      )}
    </div>
  );
}

/** Description facultative, affichée à côté des photos en plein écran. */
function DescriptionField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className={styles.field}>
      <span>Description (facultative)</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={MAX_CLIENT_DESCRIPTION}
        rows={4}
        placeholder={"Ex. Ducati Diavel 2012\n- 711 km\n- Rétros Rizoma"}
      />
      <small className={styles.muted}>Une ligne qui commence par « - » s&apos;affiche comme une puce.</small>
    </label>
  );
}

type AdminAction = ReturnType<typeof useAdminAction>;

/** Autres photos du véhicule (affichées en plein écran sur le site) : vignettes, ajout, suppression. */
function ClientExtras({
  photo,
  disabled,
  setUploading,
  setStatus,
  run,
}: {
  photo: ClientPhoto;
  disabled: boolean;
  setUploading: (uploading: boolean) => void;
  setStatus: AdminAction["setStatus"];
  run: AdminAction["run"];
}) {
  const extras = photo.extras ?? [];
  const room = MAX_CLIENT_EXTRAS - extras.length;

  async function onFiles(files: File[]) {
    if (files.length === 0) return;
    if (files.length > room) {
      return setStatus({ kind: "error", text: `${MAX_CLIENT_EXTRAS} photos supplémentaires maximum (encore ${room} possibles).` });
    }
    setUploading(true);
    try {
      const images: Img[] = [];
      for (const [i, file] of files.entries()) {
        setStatus({ kind: "success", text: `Envoi de la photo ${i + 1} sur ${files.length}…` });
        images.push(await uploadImage(file, "clients", "photo"));
      }
      await run(() => addClientExtras(photo.id, images), images.length > 1 ? "Photos ajoutées." : "Photo ajoutée.");
    } catch (error) {
      setStatus({ kind: "error", text: error instanceof Error ? error.message : "Envoi impossible." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.extras}>
      <span className={styles.muted}>Autres photos du véhicule ({extras.length})</span>
      <ul className={styles.extrasList}>
        {extras.map((img, i) => (
          <li key={img.src} className={styles.extra}>
            {/* eslint-disable-next-line @next/next/no-img-element -- vignette d'admin */}
            <img src={img.src} alt={`${photo.title}, photo ${i + 2}`} loading="lazy" />
            <button
              type="button"
              className={styles.extraRemove}
              aria-label={`Retirer la photo ${i + 2} de ${photo.title}`}
              disabled={disabled}
              onClick={() =>
                confirm("Retirer cette photo ?") && run(() => removeClientExtra(photo.id, img.src), "Photo retirée.")
              }
            >
              ✕
            </button>
          </li>
        ))}
        {room > 0 && (
          <li>
            <label className={`${styles.extraAdd} ${disabled ? styles.extraAddDisabled : ""}`} title="Ajouter des photos">
              <span aria-hidden="true">+</span>
              <span className="sr-only">Ajouter des photos à {photo.title}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                disabled={disabled}
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  e.target.value = "";
                  void onFiles(files);
                }}
              />
            </label>
          </li>
        )}
      </ul>
    </div>
  );
}
