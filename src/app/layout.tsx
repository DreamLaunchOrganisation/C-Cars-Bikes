import type { Metadata, Viewport } from "next";
import { site } from "@/data/site";
import { anton, inter, jetbrainsMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Atelier auto & moto à Trazegnies`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "garage moto Trazegnies",
    "atelier auto moto",
    "carburateur Weber",
    "Dell'Orto",
    "cartographie",
    "restauration oldtimer",
    "préparation moto",
    "Courcelles",
    "Charleroi",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_BE",
    url: site.url,
    siteName: site.name,
    title: `${site.name} · Atelier auto & moto`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#141414",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr-BE" data-scroll-behavior="smooth" className={`${anton.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
