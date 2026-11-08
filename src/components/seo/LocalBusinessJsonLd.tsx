import { openingHours, site } from "@/data/site";
import { toSchemaTime } from "@/lib/hours";

const SCHEMA_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Données structurées schema.org (fiche « garage ») pour Google :
 * adresse, téléphone, horaires… affichables dans les résultats de recherche.
 */
export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: site.name,
    description: site.description,
    url: site.url,
    image: `${site.url}/icon.png`,
    telephone: site.phone.international,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: site.address.countryCode,
    },
    openingHoursSpecification: openingHours.flatMap((d) =>
      d.slots.map((slot) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: SCHEMA_DAYS[d.day],
        opens: toSchemaTime(slot.from),
        closes: toSchemaTime(slot.to),
      })),
    ),
  };

  return (
    <script
      type="application/ld+json"
      // Échappe "<" pour empêcher toute injection de balise
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
