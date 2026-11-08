import { getContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SalesBoard } from "./SalesBoard";
import styles from "./Sales.module.css";

export async function Sales() {
  const { sales } = await getContent();

  return (
    <section id="vente" className={styles.section} aria-labelledby="sales-title">
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
            <div className={styles.empty}>
              <p>Rien en vente pour le moment — contactez-nous pour toute recherche.</p>
              <a href="#contact" className="btn btn-primary">
                Nous contacter →
              </a>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
