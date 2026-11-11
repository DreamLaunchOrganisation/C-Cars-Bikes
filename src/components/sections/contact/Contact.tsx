import { site } from "@/data/site";
import { getContent } from "@/lib/content";
import { phoneLinks } from "@/lib/content/phone";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "./ContactForm";
import { OpeningHours } from "./OpeningHours";
import styles from "./Contact.module.css";

export async function Contact() {
  const { address } = site;
  const { contact, openingHours } = await getContent();
  const phone = phoneLinks(contact.phoneDisplay);

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
          aside={"Décrivez votre véhicule et votre demande, joignez une photo si besoin : on vous recontacte rapidement."}
        />

        <Reveal className={styles.grid}>
          <div className={styles.box}>
            <h3 className={styles.boxTitle}>Formulaire de contact</h3>
            <ContactForm />
          </div>

          <div className={styles.side}>
            <OpeningHours hours={openingHours} />

            <address className={`${styles.box} ${styles.info}`}>
              <h3 className={styles.boxTitle}>Coordonnées</h3>
              <a href={phone.href}>
                <Icon name="phone" strokeWidth={2} />
                {contact.phoneDisplay}
              </a>
              <a href={`mailto:${contact.email}`}>
                <Icon name="mail" strokeWidth={2} />
                {contact.email}
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
