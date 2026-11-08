import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import styles from "./SectionHeading.module.css";

type Props = {
  eyebrow: string;
  title: ReactNode;
  /** Texte d'introduction ou élément (ex. onglets) affiché à droite. */
  aside?: ReactNode;
  id?: string;
};

export function SectionHeading({ eyebrow, title, aside, id }: Props) {
  return (
    <Reveal className={styles.head}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className={`display ${styles.title}`}>
          {title}
        </h2>
      </div>
      {typeof aside === "string" ? <p className={styles.aside}>{aside}</p> : aside}
    </Reveal>
  );
}
