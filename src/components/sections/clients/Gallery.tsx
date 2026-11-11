"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { imageProps } from "@/lib/content/image-props";
import { CLIENT_CATEGORIES, type ClientCategory, type ClientPhoto, type Img } from "@/lib/content/schema";
import styles from "./Gallery.module.css";

type Props = {
  photos: ClientPhoto[];
  heading: ReactNode;
};

const GAP = 16;

/**
 * Description saisie dans l'admin → paragraphes et listes à puces
 * (les lignes qui commencent par « - » ou « • » forment une liste).
 */
function Description({ text }: { text: string }) {
  const blocks: ({ kind: "p"; text: string } | { kind: "ul"; items: string[] })[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const bullet = line.match(/^[-•*]\s*(.+)$/);
    const last = blocks.at(-1);
    if (bullet && last?.kind === "ul") last.items.push(bullet[1]);
    else if (bullet) blocks.push({ kind: "ul", items: [bullet[1]] });
    else blocks.push({ kind: "p", text: line });
  }
  return blocks.map((block, i) =>
    block.kind === "p" ? (
      <p key={i}>{block.text}</p>
    ) : (
      <ul key={i}>
        {block.items.map((item, j) => (
          <li key={j}>{item}</li>
        ))}
      </ul>
    ),
  );
}

/** Toutes les photos d'un véhicule : la principale puis les autres. */
const photosOf = (item: ClientPhoto): Img[] => [item.image, ...(item.extras ?? [])];

/**
 * Galerie « Nos clients » : onglets Motos / Autos, carrousel horizontal
 * (glisser au doigt ou à la souris, flèches, points) et affichage plein écran
 * où l'on parcourt toutes les photos du véhicule.
 */
export function Gallery({ photos, heading }: Props) {
  // Onglets : seulement les catégories qui ont au moins une photo
  const names = CLIENT_CATEGORIES.filter((category) => photos.some((p) => p.category === category));
  const [active, setActive] = useState<ClientCategory>(names[0]);
  const [index, setIndex] = useState(0);
  const [bounds, setBounds] = useState({ atStart: true, atEnd: true });
  const [zoomed, setZoomed] = useState<ClientPhoto | null>(null);
  const [shot, setShot] = useState(0);

  const trackRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const drag = useRef({ active: false, moved: false, x: 0, left: 0 });

  const items = photos.filter((p) => p.category === active);

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

  const openItem = (item: ClientPhoto) => {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    setShot(0);
    setZoomed(item);
  };

  const shots = zoomed ? photosOf(zoomed) : [];
  const description = zoomed?.description?.trim();
  const showShot = (i: number) => setShot((i + shots.length) % shots.length);

  // Flèches du clavier dans la visionneuse
  const onLightboxKey = (e: React.KeyboardEvent) => {
    if (shots.length < 2) return;
    if (e.key === "ArrowRight") showShot(shot + 1);
    if (e.key === "ArrowLeft") showShot(shot - 1);
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

      <div className={styles.stage}>
        <button
          type="button"
          className={`${styles.arrow} ${styles.prev}`}
          aria-label="Photo précédente"
          disabled={bounds.atStart}
          onClick={() => scrollBy(-1)}
        >
          ←
        </button>
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
            <li key={item.id} className={styles.item} style={{ animationDelay: `${i * 0.08}s` }}>
              <button type="button" className={styles.card} onClick={() => openItem(item)}>
                <Image
                  {...imageProps(item.image)}
                  alt={item.title}
                  sizes="(max-width: 720px) 86vw, 45vw"
                  className={styles.img}
                />
                <span className={styles.caption}>{item.title}</span>
                {item.extras && item.extras.length > 0 && (
                  <span className={styles.count} aria-label={`${item.extras.length + 1} photos`}>
                    {item.extras.length + 1} photos
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          aria-label="Photo suivante"
          disabled={bounds.atEnd}
          onClick={() => scrollBy(1)}
        >
          →
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.dots} style={{ visibility: scrollable ? "visible" : "hidden" }}>
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Photo ${i + 1}`}
              aria-current={i === index}
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
        <span className={styles.hint}>Glissez pour voir plus →</span>
      </div>

      {/* Clic sur le fond : fermer. Clic sur la photo : suivante. */}
      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        onClose={() => setZoomed(null)}
        onClick={() => setZoomed(null)}
        onKeyDown={onLightboxKey}
        aria-label={zoomed?.title}
      >
        {zoomed && (
          <figure className={description ? styles.withInfo : undefined} onClick={(e) => e.stopPropagation()}>
            <div className={styles.media}>
              <div className={styles.viewer}>
                <Image
                  key={shots[shot].src}
                  {...imageProps(shots[shot])}
                  alt={shots.length > 1 ? `${zoomed.title}, photo ${shot + 1} sur ${shots.length}` : zoomed.title}
                  sizes="100vw"
                  className={`${styles.zoomImg} ${shots.length > 1 ? styles.zoomNext : ""}`}
                  onClick={() => (shots.length > 1 ? showShot(shot + 1) : setZoomed(null))}
                />
                {shots.length > 1 && (
                  <>
                    <button
                      type="button"
                      className={`${styles.arrow} ${styles.viewerPrev}`}
                      aria-label="Photo précédente"
                      onClick={() => showShot(shot - 1)}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className={`${styles.arrow} ${styles.viewerNext}`}
                      aria-label="Photo suivante"
                      onClick={() => showShot(shot + 1)}
                    >
                      →
                    </button>
                  </>
                )}
              </div>
              <figcaption>
                {zoomed.title}
                {shots.length > 1 && (
                  <span className={styles.counter}>
                    {shot + 1} / {shots.length}
                  </span>
                )}
              </figcaption>
              {shots.length > 1 && (
                <ul className={styles.thumbs}>
                  {shots.map((img, i) => (
                    <li key={img.src}>
                      <button
                        type="button"
                        className={`${styles.thumb} ${i === shot ? styles.thumbActive : ""}`}
                        aria-label={`Photo ${i + 1}`}
                        aria-current={i === shot}
                        onClick={() => showShot(i)}
                      >
                        <Image {...imageProps(img)} alt="" sizes="80px" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {description && (
              <aside className={styles.info} aria-label={`À propos : ${zoomed.title}`}>
                <p className={styles.infoLabel}>Le véhicule</p>
                <div className={styles.infoText}>
                  <Description text={description} />
                </div>
              </aside>
            )}
            <button type="button" className={styles.close} aria-label="Fermer" onClick={() => setZoomed(null)}>
              ✕
            </button>
          </figure>
        )}
      </dialog>
    </div>
  );
}
