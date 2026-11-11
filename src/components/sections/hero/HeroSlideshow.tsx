"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import moteurMoto from "@/assets/hero/moteur-moto.jpg";
import porsche356 from "@/assets/hero/porsche-356.jpg";
import voituresCourse from "@/assets/hero/voitures-course.jpg";
import moteurHarleyChrome from "@/assets/hero/moteur-harley-chrome.jpg";
import harleySportster48 from "@/assets/hero/harley-sportster-48.jpg";
import alfaGiuliettaSpider from "@/assets/hero/alfa-romeo-giulietta-spider.jpg";
import ducatiDiavelProfil from "@/assets/hero/ducati-diavel-profil.jpg";
import roueArriereMoto from "@/assets/hero/roue-arriere-moto.jpg";
import mercedes300slPhare from "@/assets/hero/mercedes-300sl-phare.jpg";
import cobraAileAvant from "@/assets/hero/cobra-aile-avant.jpg";
import ferrariDinoPhare from "@/assets/hero/ferrari-dino-phare.jpg";
import ducatiDiavelArriere from "@/assets/hero/ducati-diavel-arriere.jpg";
import styles from "./HeroSlideshow.module.css";

/** Photos du diaporama d'accueil, dans l'ordre (motos et voitures en alternance). */
const slides = [
  { image: moteurMoto, alt: "Moteur de moto chromé en gros plan" },
  { image: porsche356, alt: "Porsche 356 argent à bandes noires dans un champ" },
  { image: harleySportster48, alt: "Harley-Davidson Sportster noire préparée, pneus à flancs blancs" },
  { image: voituresCourse, alt: "Deux voitures de course d'avant-guerre" },
  { image: moteurHarleyChrome, alt: "Moteur V-twin Harley-Davidson chromé" },
  { image: alfaGiuliettaSpider, alt: "Alfa Romeo Giulietta Spider rouge" },
  { image: ducatiDiavelProfil, alt: "Ducati Diavel rouge et blanche de profil" },
  { image: mercedes300slPhare, alt: "Phare d'une Mercedes 300 SL argent, en noir et blanc" },
  { image: roueArriereMoto, alt: "Roue arrière et échappement d'une moto, en noir et blanc" },
  { image: ferrariDinoPhare, alt: "Phare avant d'une Ferrari Dino rouge" },
  { image: ducatiDiavelArriere, alt: "Ducati Diavel rouge et noire vue de trois quarts arrière" },
  { image: cobraAileAvant, alt: "Aile avant et roue d'une Cobra bleu nuit" },
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
