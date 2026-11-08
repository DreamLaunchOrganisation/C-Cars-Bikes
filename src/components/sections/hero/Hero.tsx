import { site } from "@/data/site";
import { HeroLogo } from "./HeroLogo";
import { HeroSlideshow } from "./HeroSlideshow";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.intro}>
          <h1 id="hero-title">
            <span className="sr-only">{site.name}, atelier auto et moto à Trazegnies</span>
            <HeroLogo />
          </h1>
          <p className={styles.lead}>
            Entretien, restauration, customisation et préparation de deux et quatre roues. Du V-twin au V12,
            des véhicules d&apos;après-guerre aux technologies récentes.
          </p>
          <div className={styles.ctas}>
            <a href="#contact" className="btn btn-primary">
              Prendre rendez-vous →
            </a>
            <a href="#services" className="btn btn-ghost">
              Nos services
            </a>
          </div>
        </div>

        <HeroSlideshow />
      </div>
    </section>
  );
}
