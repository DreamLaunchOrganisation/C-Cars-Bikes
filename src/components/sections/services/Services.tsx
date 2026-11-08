import { services } from "@/data/services";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Services.module.css";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title">
      <div className="wrap">
        <SectionHeading
          id="services-title"
          eyebrow="Services"
          title="Un service technique complet, axé performance"
          aside="Nous disposons de tout le matériel et de l'outillage nécessaire pour la réalisation en totale autonomie des opérations d'entretien, restauration, customisation, préparation et pour la réalisation de pièces spéciales."
        />
        <Reveal as="ul" className={styles.grid}>
          {services.map((service, i) => (
            <li key={service.title} className={styles.card}>
              <span className={styles.num}>/{String(i + 1).padStart(2, "0")}</span>
              <Icon name={service.icon} className={styles.icon} />
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
