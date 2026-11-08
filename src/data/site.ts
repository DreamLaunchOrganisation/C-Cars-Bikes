/**
 * Informations fixes de l'entreprise. Le téléphone, l'e-mail et les horaires
 * sont modifiables depuis l'admin : voir src/lib/content (contenu par défaut dans defaults.ts).
 */

export const site = {
  name: "C/Cars & Bikes",
  url: "https://carbike.be",
  description:
    "C/Cars & Bikes, atelier auto et moto à Trazegnies : entretien, restauration, customisation, préparation, carburateurs Weber et Dell'Orto, cartographie et pneus.",
  owner: "Salva",
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

export const timeZone = "Europe/Brussels";
