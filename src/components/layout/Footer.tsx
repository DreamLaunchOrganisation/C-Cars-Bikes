import { site } from "@/data/site";
import { CurrentYear } from "@/components/ui/CurrentYear";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <small>
          © <CurrentYear /> {site.name} · {site.address.street}, {site.address.postalCode} {site.address.city} ·{" "}
          {site.phone.display}
        </small>
      </div>
    </footer>
  );
}
