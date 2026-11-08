"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import title from "@/assets/title.svg";
import styles from "./Header.module.css";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`${styles.header} ${scrolled || menuOpen ? styles.scrolled : ""}`}>
      {/* Ligne 1 : le titre « C/CARS & BIKES » (même lettrage que l'ancien site) */}
      <div className={`wrap ${styles.brandRow}`}>
        <Link href="/" className={styles.brand} aria-label={`${site.name}, retour à l'accueil`}>
          <Image src={title} alt="" className={styles.title} priority unoptimized />
        </Link>

        <button
          type="button"
          className={styles.burger}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} width={28} height={28} strokeWidth={2} />
        </button>
      </div>

      {/* Ligne 2 : les onglets */}
      <div className={`wrap ${styles.nav}`}>
        <nav aria-label="Navigation principale">
          <ul id="menu" className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
