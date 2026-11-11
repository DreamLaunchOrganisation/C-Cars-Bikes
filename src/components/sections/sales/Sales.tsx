import { getContent } from "@/lib/content";
import { saleCategories } from "@/data/sales";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SalesBoard } from "./SalesBoard";
import styles from "./Sales.module.css";

export async function Sales() {
  const { sales } = await getContent();

  return (
    <section id="vente" aria-labelledby="sales-title">
      <div className="wrap">
        <SectionHeading
          id="sales-title"
          eyebrow="Vente"
          title="À vendre à l'atelier"
          aside="Véhicules sélectionnés, pièces et accessoires. Contactez-nous pour toute disponibilité."
        />
        <Reveal>
          {sales.length > 0 ? (
            <SalesBoard items={sales} />
          ) : (
            <ul className={`${styles.grid} ${styles.categoryGrid}`}>
              {saleCategories.map((category) => (
                <li key={category.slug}>
                  <a href="#contact" className={styles.categoryCard} title={`${category.title} : nous contacter`}>
                    <span className={styles.categoryVisual}>
                      <Icon name={category.icon} strokeWidth={2} />
                    </span>
                    <span className={styles.categoryBody}>
                      <span>
                        <strong>{category.title}</strong>
                        <small>{category.subtitle}</small>
                      </span>
                      <span className={styles.categoryArrow} aria-hidden="true">
                        →
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
}
