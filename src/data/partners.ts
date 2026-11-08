import type { StaticImageData } from "next/image";

import wAndWCycles from "@/assets/Logos partenaires/w-and-w-cycles.png";
import zodiac from "@/assets/Logos partenaires/zodiac.png";
import cleItalienne from "@/assets/Logos partenaires/cle-italienne.png";
import elfMoto from "@/assets/Logos partenaires/elf-moto.png";
import kAndN from "@/assets/Logos partenaires/k-and-n.png";
import termignoni from "@/assets/Logos partenaires/termignoni.png";
import gt2i from "@/assets/Logos partenaires/gt2i.png";
import bikeDesign from "@/assets/Logos partenaires/bike-design.png";
import ngk from "@/assets/Logos partenaires/ngk.png";
import brembo from "@/assets/Logos partenaires/brembo.png";
import arlenNess from "@/assets/Logos partenaires/arlen-ness.png";
import motul from "@/assets/Logos partenaires/motul.png";
import dynojet from "@/assets/Logos partenaires/dynojet.png";
import sparco from "@/assets/Logos partenaires/sparco.png";
import rolandSandsDesign from "@/assets/Logos partenaires/roland-sands-design.png";
import vanceAndHines from "@/assets/Logos partenaires/vance-and-hines.png";
import bell from "@/assets/Logos partenaires/bell.png";
import sAndSCycle from "@/assets/Logos partenaires/s-and-s-cycle.png";
import belRay from "@/assets/Logos partenaires/bel-ray.png";
import mikuni from "@/assets/Logos partenaires/mikuni.png";
import performanceMachine from "@/assets/Logos partenaires/performance-machine.png";
import dellorto from "@/assets/Logos partenaires/dellorto.png";
import omp from "@/assets/Logos partenaires/omp.png";
import weber from "@/assets/Logos partenaires/weber.png";
import stack from "@/assets/Logos partenaires/stack.png";
import freedomPerformance from "@/assets/Logos partenaires/freedom-performance.png";
import rizoma from "@/assets/Logos partenaires/rizoma.png";
import hyperpro from "@/assets/Logos partenaires/hyperpro.png";
import varta from "@/assets/Logos partenaires/varta.png";
import akrapovic from "@/assets/Logos partenaires/akrapovic.png";
import beringer from "@/assets/Logos partenaires/beringer.png";
import tommaselli from "@/assets/Logos partenaires/tommaselli.png";
import motogadget from "@/assets/Logos partenaires/motogadget.png";
import kuryakyn from "@/assets/Logos partenaires/kuryakyn.png";
import michelin from "@/assets/Logos partenaires/michelin.png";
import shinko from "@/assets/Logos partenaires/shinko.png";

export type Partner = { name: string; logo: StaticImageData };

/**
 * Marques partenaires affichées dans le bandeau jaune défilant.
 * Logos détourés depuis l'image des partenaires du site actuel (src/assets/Logos partenaires).
 */
export const partners: Partner[] = [
  { name: "W&W Cycles", logo: wAndWCycles },
  { name: "Zodiac", logo: zodiac },
  { name: "Clé italienne", logo: cleItalienne },
  { name: "elf moto", logo: elfMoto },
  { name: "K&N", logo: kAndN },
  { name: "Termignoni", logo: termignoni },
  { name: "GT2i", logo: gt2i },
  { name: "Bike Design", logo: bikeDesign },
  { name: "NGK", logo: ngk },
  { name: "Brembo", logo: brembo },
  { name: "Arlen Ness", logo: arlenNess },
  { name: "Motul", logo: motul },
  { name: "Dynojet", logo: dynojet },
  { name: "Sparco", logo: sparco },
  { name: "Roland Sands Design", logo: rolandSandsDesign },
  { name: "Vance & Hines", logo: vanceAndHines },
  { name: "Bell", logo: bell },
  { name: "S&S Cycle", logo: sAndSCycle },
  { name: "Bel-Ray", logo: belRay },
  { name: "Mikuni", logo: mikuni },
  { name: "Performance Machine", logo: performanceMachine },
  { name: "Dell'Orto", logo: dellorto },
  { name: "OMP", logo: omp },
  { name: "Weber", logo: weber },
  { name: "Stack", logo: stack },
  { name: "Freedom Performance", logo: freedomPerformance },
  { name: "Rizoma", logo: rizoma },
  { name: "Hyperpro", logo: hyperpro },
  { name: "Varta", logo: varta },
  { name: "Akrapovič", logo: akrapovic },
  { name: "Beringer", logo: beringer },
  { name: "Tommaselli", logo: tommaselli },
  { name: "motogadget", logo: motogadget },
  { name: "Küryakyn", logo: kuryakyn },
  { name: "Michelin", logo: michelin },
  { name: "Shinko", logo: shinko },
];
