"use client";

import { useState, type FormEvent } from "react";
import { addSaleItem, moveSaleItem, removeSaleItem, updateSaleItem } from "@/actions/admin";
import { saleCategories, saleCategoryTitle } from "@/data/sales";
import type { SaleCategory, SaleItem } from "@/lib/content/schema";
import { ItemRow, PhotoField, StatusLine } from "./parts";
import { uploadImage } from "./uploadImage";
import { useAdminAction } from "./useAdminAction";
import styles from "./admin.module.css";

const MAX_DESCRIPTION = 500;

export function SalesEditor({ items }: { items: SaleItem[] }) {
  const { pending, status, setStatus, run } = useAdminAction();
  const [category, setCategory] = useState<SaleCategory>("autos");
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
      const image = await uploadImage(file, "sales", "photo");
      if (await run(() => addSaleItem({ category, description, image }), "Annonce publiée.")) {
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
    <section className={styles.panel} aria-labelledby="sales-title">
      <h2 id="sales-title" className={styles.panelTitle}>
        Vente ({items.length} annonces)
      </h2>

      <form onSubmit={onAdd} className={styles.addForm}>
        <h3>Nouvelle annonce</h3>
        <label className={styles.field}>
          <span>Catégorie</span>
          <select value={category} onChange={(e) => setCategory(e.target.value as SaleCategory)}>
            {saleCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>
            Description (prix compris si vous le souhaitez) — {description.length}/{MAX_DESCRIPTION}
          </span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={MAX_DESCRIPTION} />
        </label>
        <PhotoField file={file} onChange={setFile} />
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {uploading ? "Envoi…" : "Publier l'annonce"}
        </button>
      </form>

      <StatusLine status={status} />

      {items.length === 0 ? (
        <p className={styles.muted}>Aucune annonce : le site affiche « Rien en vente pour le moment ».</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item, i) => (
            <ItemRow
              key={item.id}
              image={item.image}
              alt={`${saleCategoryTitle(item.category)} : ${item.description.slice(0, 40)}`}
              canUp={i > 0}
              canDown={i < items.length - 1}
              disabled={busy}
              onMove={(dir) => run(() => moveSaleItem(item.id, dir), "Ordre mis à jour.")}
              onDelete={() => confirm("Supprimer cette annonce ?") && run(() => removeSaleItem(item.id), "Annonce supprimée.")}
            >
              <SaleFields item={item} disabled={busy} onSave={(patch) => run(() => updateSaleItem(item.id, patch))} />
            </ItemRow>
          ))}
        </ul>
      )}
    </section>
  );
}

function SaleFields({
  item,
  disabled,
  onSave,
}: {
  item: SaleItem;
  disabled: boolean;
  onSave: (patch: { category: SaleCategory; description: string }) => void;
}) {
  const [category, setCategory] = useState(item.category);
  const [description, setDescription] = useState(item.description);
  const changed = category !== item.category || description !== item.description;

  return (
    <div className={styles.stackFields}>
      <select aria-label="Catégorie" value={category} onChange={(e) => setCategory(e.target.value as SaleCategory)}>
        {saleCategories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.title}
          </option>
        ))}
      </select>
      <textarea aria-label="Description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={MAX_DESCRIPTION} />
      {changed && (
        <button type="button" className="btn btn-primary" disabled={disabled} onClick={() => onSave({ category, description })}>
          Enregistrer
        </button>
      )}
    </div>
  );
}
