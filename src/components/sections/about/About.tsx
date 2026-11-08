import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./About.module.css";

const stats = [
  { value: "2 & 4", label: "roues" },
  { value: "V2–V12", label: "toutes motorisations" },
  { value: "100%", label: "réalisé en atelier" },
];

export function About() {
  return (
    <section id="atelier" className={styles.about} aria-labelledby="about-title">
      <div className={`wrap ${styles.grid}`}>
        <Reveal>
          <p className="eyebrow">L&apos;atelier</p>
          <h2 id="about-title" className={`display ${styles.title}`}>
            Né d&apos;une passion pour les véhicules de caractère
          </h2>
          <p className={styles.sig}>
            <b aria-hidden="true">●</b> {site.owner}, fondateur &amp; mécanicien
          </p>
        </Reveal>

        <Reveal className={styles.text}>
          <p>
            {site.name} est né de la passion de son fondateur pour les véhicules uniques et de caractère. Ici,
            chaque machine est traitée comme si c&apos;était la nôtre.
          </p>
          <p>
            {site.owner} assure un service technique complet et axé sur les performances : entretien,
            restauration, customisation, préparation et fabrication de pièces spéciales, le tout en autonomie
            complète.
          </p>
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt>{stat.value}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
