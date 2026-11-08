"use client";

/* eslint-disable @next/next/no-img-element -- vignettes d'admin : pas besoin de l'optimisation d'images */

import type { ReactNode } from "react";
import type { Img } from "@/lib/content/schema";
import type { Status } from "./useAdminAction";
import styles from "./admin.module.css";

export function StatusLine({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <p role={status.kind === "error" ? "alert" : "status"} className={status.kind === "error" ? styles.error : styles.success}>
      {status.text}
    </p>
  );
}

type ItemRowProps = {
  image: Img;
  alt: string;
  logo?: boolean;
  canUp: boolean;
  canDown: boolean;
  disabled: boolean;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
  children?: ReactNode;
};

/** Une ligne de liste : vignette, champs éventuels, flèches de tri et suppression. */
export function ItemRow({ image, alt, logo, canUp, canDown, disabled, onMove, onDelete, children }: ItemRowProps) {
  return (
    <li className={styles.item}>
      <img src={image.src} alt={alt} className={logo ? styles.thumbLogo : styles.thumb} loading="lazy" />
      <div className={styles.itemBody}>{children}</div>
      <div className={styles.itemControls}>
        <button type="button" className={styles.iconBtn} aria-label={`Monter : ${alt}`} disabled={disabled || !canUp} onClick={() => onMove(-1)}>
          ↑
        </button>
        <button type="button" className={styles.iconBtn} aria-label={`Descendre : ${alt}`} disabled={disabled || !canDown} onClick={() => onMove(1)}>
          ↓
        </button>
        <button type="button" className={`${styles.iconBtn} ${styles.danger}`} aria-label={`Supprimer : ${alt}`} disabled={disabled} onClick={onDelete}>
          ✕
        </button>
      </div>
    </li>
  );
}

/** Sélecteur de photo (ouvre l'appareil photo ou la galerie sur téléphone) avec aperçu. */
export function PhotoField({
  file,
  onChange,
  logo,
  label = "Photo",
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  logo?: boolean;
  label?: string;
}) {
  const preview = file ? URL.createObjectURL(file) : null;
  return (
    <div className={styles.field}>
      <span>{label}</span>
      <label className={styles.fileDrop}>
        {preview ? (
          <img src={preview} alt="Aperçu" className={logo ? styles.previewLogo : styles.preview} onLoad={() => URL.revokeObjectURL(preview)} />
        ) : (
          <span className={styles.muted}>Choisir une image…</span>
        )}
        <input
          type="file"
          accept={logo ? "image/png,image/webp" : "image/*"}
          className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
      {logo && <small className={styles.muted}>Logo détouré (fond transparent), PNG ou WebP. Aperçu sur le fond jaune du bandeau.</small>}
    </div>
  );
}
