"use client";

import { useSyncExternalStore } from "react";
import { openingHours } from "@/data/site";
import { formatSlots, isOpenAt, localTime } from "@/lib/hours";
import styles from "./Contact.module.css";

/** Rafraîchit l'affichage chaque minute. */
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}
/** Clé stable à la minute près (évite des rendus inutiles). */
const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => null;

export function OpeningHours() {
  // null côté serveur : le statut « ouvert / fermé » ne s'affiche qu'une fois dans le navigateur
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  const now = minute === null ? null : new Date(minute * 60_000);
  const today = now ? localTime(now).day : null;
  const open = now ? isOpenAt(now) : null;

  return (
    <div className={styles.box}>
      <p className={`${styles.openBadge} ${open ? styles.isOpen : ""}`}>
        <i aria-hidden="true" />
        <span>{open === null ? "Horaires" : open ? "Ouvert maintenant" : "Fermé actuellement"}</span>
      </p>
      <h3 className={styles.boxTitle}>Horaires</h3>
      <ul className={styles.hours}>
        {openingHours.map((d) => (
          <li key={d.day} className={d.day === today ? styles.today : ""} aria-current={d.day === today ? "date" : undefined}>
            <span>{d.label}</span>
            <span>{formatSlots(d.slots)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
