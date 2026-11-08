"use client";

import { useSyncExternalStore } from "react";
import { DAY_LABELS, type DayHours } from "@/lib/content/schema";
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

/** Ordre d'affichage : du lundi au dimanche. */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function OpeningHours({ hours }: { hours: DayHours[] }) {
  // null côté serveur : le statut « ouvert / fermé » ne s'affiche qu'une fois dans le navigateur
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  const now = minute === null ? null : new Date(minute * 60_000);
  const today = now ? localTime(now).day : null;
  const open = now ? isOpenAt(now, hours) : null;
  const days = WEEK_ORDER.map((day) => hours.find((d) => d.day === day) ?? { day, slots: [] });

  return (
    <div className={styles.box}>
      <p className={`${styles.openBadge} ${open ? styles.isOpen : ""}`}>
        <i aria-hidden="true" />
        <span>{open === null ? "Horaires" : open ? "Ouvert maintenant" : "Fermé actuellement"}</span>
      </p>
      <h3 className={styles.boxTitle}>Horaires</h3>
      <ul className={styles.hours}>
        {days.map((d) => (
          <li key={d.day} className={d.day === today ? styles.today : ""} aria-current={d.day === today ? "date" : undefined}>
            <span>{DAY_LABELS[d.day]}</span>
            <span>{formatSlots(d.slots)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
