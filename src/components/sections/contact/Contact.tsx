import { site } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "./ContactForm";
import { OpeningHours } from "./OpeningHours";
import styles from "./Contact.module.css";

export function Contact() {
  const { address } = site;

  return (
    <section id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHeading
          id="contact-title"
          eyebrow="Contact"
          title={
            <>
              <span className={styles.nowrap}>Une question&nbsp;?</span>
              <br />
              <span className={styles.nowrap}>Un projet&nbsp;?</span>
            </>
          }
          aside="Décrivez votre véhicule et votre demande, joignez une photo si besoin : on vous recontacte rapidement."
        />

        <Reveal className={styles.grid}>
          <div className={styles.box}>
            <h3 className={styles.boxTitle}>Formulaire de contact</h3>
            <ContactForm />
          </div>

          <div className={styles.side}>
            <OpeningHours />

            <address className={`${styles.box} ${styles.info}`}>
              <h3 className={styles.boxTitle}>Coordonnées</h3>
              <a href={site.phone.href}>
                <Icon name="phone" strokeWidth={2} />
                {site.phone.display}
              </a>
              <a href={`mailto:${site.email}`}>
                <Icon name="mail" strokeWidth={2} />
                {site.email}
              </a>
              <a href={site.maps.link} target="_blank" rel="noopener noreferrer">
                <Icon name="pin" strokeWidth={2} />
                <span>
                  {address.street}
                  <br />
                  {address.postalCode} {address.city}, {address.country}
                </span>
              </a>
            </address>
          </div>
        </Reveal>

        <Reveal className={styles.map}>
          <iframe title="Plan d'accès à l'atelier" src={site.maps.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </Reveal>
      </div>
    </section>
  );
}
