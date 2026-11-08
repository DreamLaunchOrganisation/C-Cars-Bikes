"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { saleCategories, saleCategoryTitle } from "@/data/sales";
import { imageProps } from "@/lib/content/image-props";
import type { SaleCategory, SaleItem } from "@/lib/content/schema";
import styles from "./Sales.module.css";

type Filter = "all" | SaleCategory;

/** Annonces de vente : filtre par catégorie, grille de cartes, détail en grand. */
export function SalesBoard({ items }: { items: SaleItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [opened, setOpened] = useState<SaleItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Onglets : « Tout » + les catégories qui ont au moins une annonce
  const tabs: { value: Filter; label: string }[] = [
    { value: "all", label: "Tout" },
    ...saleCategories
      .filter((c) => items.some((item) => item.category === c.slug))
      .map((c) => ({ value: c.slug, label: c.title })),
  ];
  const visible = filter === "all" ? items : items.filter((item) => item.category === filter);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (opened && !dialog.open) dialog.showModal();
    if (!opened && dialog.open) dialog.close();
  }, [opened]);

  return (
    <div>
      {tabs.length > 2 && (
        <div className={styles.tabs} role="tablist" aria-label="Catégorie">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={tab.value === filter}
              className={`${styles.tab} ${tab.value === filter ? styles.tabActive : ""}`}
              onClick={() => setFilter(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <ul className={styles.grid}>
        {visible.map((item) => (
          <li key={item.id}>
            <button type="button" className={styles.card} onClick={() => setOpened(item)}>
              <span className={styles.visual}>
                <Image
                  {...imageProps(item.image)}
                  alt=""
                  sizes="(max-width: 720px) 100vw, (max-width: 980px) 50vw, 25vw"
                  className={styles.photo}
                />
              </span>
              <span className={styles.body}>
                <small className={styles.chip}>{saleCategoryTitle(item.category)}</small>
                <span className={styles.description}>{item.description}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className={styles.detail}
        onClose={() => setOpened(null)}
        onClick={(e) => e.target === e.currentTarget && setOpened(null)}
        aria-label={opened ? `Annonce : ${saleCategoryTitle(opened.category)}` : undefined}
      >
        {opened && (
          <article className={styles.detailCard}>
            <button type="button" className={styles.close} aria-label="Fermer" onClick={() => setOpened(null)}>
              ✕
            </button>
            <Image {...imageProps(opened.image)} alt="" sizes="(max-width: 900px) 100vw, 860px" className={styles.detailPhoto} />
            <div className={styles.detailBody}>
              <small className={styles.chip}>{saleCategoryTitle(opened.category)}</small>
              <p className={styles.fullDescription}>{opened.description}</p>
              <a href="#contact" className="btn btn-primary" onClick={() => setOpened(null)}>
                Nous contacter →
              </a>
            </div>
          </article>
        )}
      </dialog>
    </div>
  );
}
