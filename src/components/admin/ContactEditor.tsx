"use client";

import { useState, type FormEvent } from "react";
import { saveContact } from "@/actions/admin";
import { formatMinutes } from "@/lib/hours";
import { contactSchema, DAY_LABELS, openingHoursSchema, type Contact, type DayHours } from "@/lib/content/schema";
import { StatusLine } from "./parts";
import { useAdminAction } from "./useAdminAction";
import styles from "./admin.module.css";

/** Du lundi au dimanche. */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
/** Heures proposées : de 6h à 22h, au quart d'heure. */
const TIMES = Array.from({ length: (22 - 6) * 4 + 1 }, (_, i) => 6 * 60 + i * 15);

export function ContactEditor({ contact, hours }: { contact: Contact; hours: DayHours[] }) {
  const { pending, status, setStatus, run } = useAdminAction();
  const [phone, setPhone] = useState(contact.phoneDisplay);
  const [email, setEmail] = useState(contact.email);
  const [week, setWeek] = useState<DayHours[]>(() =>
    WEEK_ORDER.map((day) => hours.find((d) => d.day === day) ?? { day, slots: [] }),
  );

  const updateDay = (day: number, slots: DayHours["slots"]) =>
    setWeek((w) => w.map((d) => (d.day === day ? { day, slots } : d)));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = { phoneDisplay: phone, email };
    // Vérification immédiate (le serveur revalide de toute façon)
    const check = contactSchema.safeParse(next);
    if (!check.success) return setStatus({ kind: "error", text: check.error.issues[0].message });
    const checkHours = openingHoursSchema.safeParse(week);
    if (!checkHours.success) return setStatus({ kind: "error", text: checkHours.error.issues[0].message });
    run(() => saveContact(next, week), "Coordonnées et horaires enregistrés.");
  }

  return (
    <section className={styles.panel} aria-labelledby="contact-title">
      <h2 id="contact-title" className={styles.panelTitle}>
        Coordonnées et horaires
      </h2>

      <form onSubmit={onSubmit} className={styles.contactForm}>
        <div className={styles.twoCols}>
          <label className={styles.field}>
            <span>Téléphone</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0475 54 30 60" required />
          </label>
          <label className={styles.field}>
            <span>E-mail (reçoit aussi les messages du formulaire)</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
        </div>

        <h3 className={styles.groupTitle}>Horaires d&apos;ouverture</h3>
        <ul className={styles.hoursList}>
          {week.map((d) => (
            <DayEditor key={d.day} day={d} onChange={(slots) => updateDay(d.day, slots)} />
          ))}
        </ul>

        <StatusLine status={status} />
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </section>
  );
}

function DayEditor({ day, onChange }: { day: DayHours; onChange: (slots: DayHours["slots"]) => void }) {
  const closed = day.slots.length === 0;
  const label = DAY_LABELS[day.day];

  const setSlot = (index: number, key: "from" | "to", value: number) =>
    onChange(day.slots.map((s, i) => (i === index ? { ...s, [key]: value } : s)));

  return (
    <li className={styles.day}>
      <div className={styles.dayHead}>
        <strong>{label}</strong>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={closed}
            onChange={(e) => onChange(e.target.checked ? [] : [{ from: 510, to: 720 }])}
          />
          Fermé
        </label>
      </div>

      {day.slots.map((slot, i) => (
        <div key={i} className={styles.slot}>
          <TimeSelect label={`${label}, plage ${i + 1} : début`} value={slot.from} onChange={(v) => setSlot(i, "from", v)} />
          <span aria-hidden="true">→</span>
          <TimeSelect label={`${label}, plage ${i + 1} : fin`} value={slot.to} onChange={(v) => setSlot(i, "to", v)} />
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.danger}`}
            aria-label={`Retirer la plage ${i + 1} du ${label.toLowerCase()}`}
            onClick={() => onChange(day.slots.filter((_, j) => j !== i))}
          >
            ✕
          </button>
        </div>
      ))}

      {!closed && day.slots.length < 2 && (
        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => onChange([...day.slots, { from: Math.min(day.slots[0].to + 60, 1260), to: 1080 }])}
        >
          + Ajouter une plage
        </button>
      )}
    </li>
  );
}

function TimeSelect({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  // Garde une valeur existante même hors de la grille (ex. 5h45)
  const options = TIMES.includes(value) ? TIMES : [...TIMES, value].sort((a, b) => a - b);
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {options.map((t) => (
        <option key={t} value={t}>
          {formatMinutes(t)}
        </option>
      ))}
    </select>
  );
}
