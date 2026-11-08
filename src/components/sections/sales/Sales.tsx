import { saleCategories } from "@/data/sales";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Sales.module.css";

export function Sales() {
  return (
    <section id="vente" className={styles.section} aria-labelledby="sales-title">
      <div className="wrap">
        <SectionHeading
          id="sales-title"
          eyebrow="Vente"
          title="À vendre à l'atelier"
          aside="Véhicules sélectionnés, pièces et accessoires. Contactez-nous pour toute disponibilité."
        />
        <Reveal as="ul" className={styles.grid}>
          {saleCategories.map((category) => (
            <li key={category.slug}>
              {/* Les pages /vente/[slug] seront ajoutées avec les annonces ; en attendant → contact */}
              <a href="#contact" className={styles.card} title={`${category.title} : nous contacter`}>
                <span className={styles.visual}>
                  <Icon name={category.icon} strokeWidth={2} />
                </span>
                <span className={styles.body}>
                  <span>
                    <strong>{category.title}</strong>
                    <small>{category.subtitle}</small>
                  </span>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
