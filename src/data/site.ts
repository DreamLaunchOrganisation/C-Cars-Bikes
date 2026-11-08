/**
 * Informations de l'entreprise : source unique utilisée par tout le site
 * (en-tête, pied de page, contact, SEO, données structurées).
 */

export const site = {
  name: "C/Cars & Bikes",
  url: "https://carbike.be",
  slogan: "Votre passion est aussi la mienne.",
  description:
    "C/Cars & Bikes, atelier auto et moto à Trazegnies : entretien, restauration, customisation, préparation, carburateurs Weber et Dell'Orto, cartographie et pneus.",
  owner: "Salva",
  phone: {
    display: "0475 54 30 60",
    href: "tel:+32475543060",
    international: "+32 475 54 30 60",
  },
  email: "info@carbike.be",
  address: {
    street: "Rue André 23A",
    postalCode: "6183",
    city: "Trazegnies",
    country: "Belgique",
    countryCode: "BE",
  },
  maps: {
    link: "https://maps.google.com/?q=Rue+Andr%C3%A9+23A,+6183+Trazegnies",
    embed:
      "https://www.google.com/maps?q=Rue%20Andr%C3%A9%2023A%2C%206183%20Trazegnies&output=embed",
  },
} as const;

export const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#atelier", label: "L'atelier" },
  { href: "#vente", label: "Vente" },
  { href: "#clients", label: "Nos clients" },
  { href: "#contact", label: "Contact" },
] as const;

/** Créneau d'ouverture, en minutes depuis minuit. */
export type Slot = { from: number; to: number };

/** Horaires par jour (0 = dimanche … 6 = samedi), comme `Date.getDay()`. */
export const openingHours: { day: number; label: string; slots: Slot[] }[] = [
  { day: 1, label: "Lundi", slots: [{ from: 510, to: 720 }, { from: 780, to: 1080 }] },
  { day: 2, label: "Mardi", slots: [{ from: 510, to: 720 }, { from: 780, to: 1080 }] },
  { day: 3, label: "Mercredi", slots: [{ from: 510, to: 720 }, { from: 780, to: 1080 }] },
  { day: 4, label: "Jeudi", slots: [{ from: 510, to: 720 }, { from: 780, to: 1080 }] },
  { day: 5, label: "Vendredi", slots: [{ from: 510, to: 720 }, { from: 780, to: 1080 }] },
  { day: 6, label: "Samedi", slots: [{ from: 540, to: 720 }, { from: 810, to: 1020 }] },
  { day: 0, label: "Dimanche", slots: [] },
];

export const timeZone = "Europe/Brussels";
