"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import moteurMoto from "@/assets/hero/moteur-moto.jpg";
import porsche356 from "@/assets/hero/porsche-356.jpg";
import voituresCourse from "@/assets/hero/voitures-course.jpg";
import styles from "./HeroSlideshow.module.css";

/** Photos du diaporama d'accueil (reprises du site actuel), dans l'ordre. */
const slides = [
  { image: moteurMoto, alt: "Moteur de moto chromé en gros plan" },
  { image: porsche356, alt: "Porsche 356 argent à bandes noires dans un champ" },
  { image: voituresCourse, alt: "Deux voitures de course d'avant-guerre" },
];

const DELAY = 5000;

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => setCurrent((c) => (c + 1) % slides.length), DELAY);
    return () => window.clearTimeout(id);
  }, [current, paused]);

  return (
    <div
      className={styles.frame}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carrousel"
      aria-label="Photos de l'atelier"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.alt}
          className={`${styles.slide} ${i === current ? styles.active : ""}`}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            sizes="(max-width: 980px) 100vw, 50vw"
            priority={i === 0}
            placeholder="blur"
          />
        </div>
      ))}

      <div className={styles.dots}>
        {slides.map((slide, i) => (
          <button
            key={slide.alt}
            type="button"
            className={i === current ? styles.dotActive : undefined}
            aria-label={`Afficher la photo ${i + 1} sur ${slides.length}`}
            aria-current={i === current}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}
