import { timeZone } from "@/data/site";
import type { DayHours, Slot } from "@/lib/content/schema";

/** "510" → "8h30", "780" → "13h" */
export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

export function formatSlots(slots: Slot[]): string {
  if (slots.length === 0) return "Fermé";
  return slots.map((s) => `${formatMinutes(s.from)}–${formatMinutes(s.to)}`).join(" · ");
}

/** Jour de la semaine et minutes écoulées, à l'heure de l'atelier (Bruxelles). */
export function localTime(date: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    day: days.indexOf(get("weekday")),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function isOpenAt(date: Date, hours: DayHours[]): boolean {
  const { day, minutes } = localTime(date);
  const today = hours.find((d) => d.day === day);
  return !!today?.slots.some((s) => minutes >= s.from && minutes < s.to);
}

/** Format "Mo-Fr 08:30-12:00" pour les données structurées schema.org. */
export function toSchemaTime(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}
