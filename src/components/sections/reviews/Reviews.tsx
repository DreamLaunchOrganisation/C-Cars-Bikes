import { Checker } from "@/components/ui/Checker";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./Reviews.module.css";

/** Lien vers la page d'avis Google de l'atelier (à renseigner). */
const REVIEWS_URL = "https://www.google.com/maps/search/?api=1&query=Cars+%26+Bikes+Trazegnies";

export function Reviews() {
  return (
    <>
      <Checker />
      <section className={styles.reviews} aria-labelledby="reviews-title">
        <Reveal className="wrap">
          <p className={styles.stars} aria-hidden="true">
            ★★★★★
          </p>
          <h2 id="reviews-title" className={`display ${styles.title}`}>
            Ils nous ont confié leur machine
          </h2>
          <p className={styles.text}>
            Découvrez les avis de nos clients et partagez votre expérience à votre tour.
          </p>
          <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-red">
            Lire les avis clients →
          </a>
        </Reveal>
      </section>
      <Checker />
    </>
  );
}
