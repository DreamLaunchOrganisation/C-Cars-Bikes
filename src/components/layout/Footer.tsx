import { site } from "@/data/site";
import { getContent } from "@/lib/content";
import { CurrentYear } from "@/components/ui/CurrentYear";
import styles from "./Footer.module.css";

export async function Footer() {
  const { contact } = await getContent();
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <small>
          © <CurrentYear /> {site.name} · {site.address.street}, {site.address.postalCode} {site.address.city} ·{" "}
          {contact.phoneDisplay}
        </small>
      </div>
    </footer>
  );
}
