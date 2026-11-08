import Image from "next/image";
import { getContent } from "@/lib/content";
import { imageProps } from "@/lib/content/image-props";
import { Checker } from "@/components/ui/Checker";
import styles from "./Marquee.module.css";

export async function Marquee() {
  const { partners } = await getContent();
  if (partners.length === 0) return null;

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
              <span key={`${partner.id}-${i}`} className={styles.item}>
                <Image {...imageProps(partner.logo)} placeholder="empty" alt="" className={styles.logo} sizes="160px" />
              </span>
            ))}
          </div>
        </div>
        <Checker />
      </div>
    </div>
  );
}
