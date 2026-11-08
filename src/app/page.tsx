import { Hero } from "@/components/sections/hero/Hero";
import { Marquee } from "@/components/sections/marquee/Marquee";
import { Services } from "@/components/sections/services/Services";
import { About } from "@/components/sections/about/About";
import { Sales } from "@/components/sections/sales/Sales";
import { Clients } from "@/components/sections/clients/Clients";
import { Reviews } from "@/components/sections/reviews/Reviews";
import { Contact } from "@/components/sections/contact/Contact";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";

export default function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <Hero />
      <Marquee />
      <Services />
      <About />
      <Sales />
      <Clients />
      <Reviews />
      <Contact />
    </>
  );
}
