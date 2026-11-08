"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { GalleryCategory, GalleryItem } from "@/data/gallery";
import styles from "./Gallery.module.css";

type Props = {
  categories: Record<GalleryCategory, GalleryItem[]>;
  heading: ReactNode;
};

const GAP = 16;

/**
 * Galerie « Nos clients » : onglets Motos / Autos, carrousel horizontal
 * (glisser au doigt ou à la souris, flèches, points) et affichage plein écran.
 */
export function Gallery({ categories, heading }: Props) {
  const names = Object.keys(categories) as GalleryCategory[];
  const [active, setActive] = useState<GalleryCategory>(names[0]);
  const [index, setIndex] = useState(0);
  const [bounds, setBounds] = useState({ atStart: true, atEnd: true });
  const [zoomed, setZoomed] = useState<GalleryItem | null>(null);

  const trackRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const drag = useRef({ active: false, moved: false, x: 0, left: 0 });

  const items = categories[active];

  const stepWidth = () => {
    const first = trackRef.current?.firstElementChild as HTMLElement | null;
    return first ? first.getBoundingClientRect().width + GAP : 300;
  };

  /** Met à jour le point actif et l'état des flèches selon la position de défilement. */
  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const atStart = track.scrollLeft <= 2;
    const atEnd = track.scrollLeft >= max - 2;
    setBounds({ atStart, atEnd });
    setIndex(max <= 2 ? 0 : atEnd ? items.length - 1 : Math.round(track.scrollLeft / stepWidth()));
  }, [items.length]);

  // Revenir au début et recalculer quand on change d'onglet ou de taille d'écran
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0, behavior: "instant" });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [active, sync]);

  // Ouvre / ferme la boîte de dialogue plein écran
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (zoomed && !dialog.open) dialog.showModal();
    if (!zoomed && dialog.open) dialog.close();
  }, [zoomed]);

  const scrollBy = (direction: 1 | -1) => trackRef.current?.scrollBy({ left: direction * stepWidth() });
  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    const item = track?.children[i] as HTMLElement | undefined;
    if (track && item) track.scrollTo({ left: item.offsetLeft - track.offsetLeft });
  };

  // --- Glisser à la souris (sur mobile, le défilement tactile natif suffit) ---
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { active: true, moved: false, x: e.clientX, left: trackRef.current.scrollLeft };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!drag.current.active || !track) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    if (drag.current.moved) {
      track.classList.add(styles.dragging);
      track.scrollLeft = drag.current.left - dx;
    }
  };
  const endDrag = () => {
    const track = trackRef.current;
    if (!drag.current.active || !track) return;
    drag.current.active = false;
    if (drag.current.moved) {
      track.classList.remove(styles.dragging);
      const w = stepWidth();
      track.scrollTo({ left: Math.round(track.scrollLeft / w) * w });
    }
  };

  const openItem = (item: GalleryItem) => {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    setZoomed(item);
  };

  const scrollable = !(bounds.atStart && bounds.atEnd);

  return (
    <div>
      <div className={styles.head}>
        <div className={styles.heading}>{heading}</div>
        <div className={styles.tabs} role="tablist" aria-label="Catégorie">
          {names.map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={name === active}
              className={`${styles.tab} ${name === active ? styles.tabActive : ""}`}
              onClick={() => setActive(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <ul
        ref={trackRef}
        key={active}
        className={styles.track}
        onScroll={sync}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onDragStart={(e) => e.preventDefault()}
        aria-label={`Photos ${active}`}
      >
        {items.map((item, i) => (
          <li key={item.title} className={styles.item} style={{ animationDelay: `${i * 0.08}s` }}>
            <button type="button" className={styles.card} onClick={() => openItem(item)}>
              <Image
                src={item.image}
                alt={item.title}
                placeholder="blur"
                sizes="(max-width: 720px) 86vw, 45vw"
                className={styles.img}
              />
              <span className={styles.caption}>{item.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.controls}>
        <div className={styles.dots} style={{ visibility: scrollable ? "visible" : "hidden" }}>
          {items.map((item, i) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Photo ${i + 1}`}
              aria-current={i === index}
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
        <span className={styles.hint}>Glissez pour voir plus →</span>
        <div className={styles.arrows}>
          <button type="button" aria-label="Photo précédente" disabled={bounds.atStart} onClick={() => scrollBy(-1)}>
            ←
          </button>
          <button type="button" aria-label="Photo suivante" disabled={bounds.atEnd} onClick={() => scrollBy(1)}>
            →
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        onClose={() => setZoomed(null)}
        onClick={() => setZoomed(null)}
        aria-label={zoomed?.title}
      >
        {zoomed && (
          <figure>
            <Image src={zoomed.image} alt={zoomed.title} sizes="100vw" className={styles.zoomImg} />
            <figcaption>{zoomed.title}</figcaption>
          </figure>
        )}
      </dialog>
    </div>
  );
}
