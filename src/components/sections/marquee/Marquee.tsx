import Image from "next/image";
import { partners } from "@/data/partners";
import { Checker } from "@/components/ui/Checker";
import styles from "./Marquee.module.css";

export function Marquee() {
  // Liste doublée pour un défilement continu sans saut
  const items = [...partners, ...partners];
  return (
    <div>
      <p className="sr-only">Nos marques partenaires : {partners.map((p) => p.name).join(", ")}.</p>
      <div aria-hidden="true">
        <Checker />
        <div className={styles.marquee}>
          <div className={styles.track}>
            {items.map((partner, i) => (
              <span key={i} className={styles.item}>
                <Image src={partner.logo} alt="" className={styles.logo} sizes="160px" />
              </span>
            ))}
          </div>
        </div>
        <Checker />
      </div>
    </div>
  );
}
