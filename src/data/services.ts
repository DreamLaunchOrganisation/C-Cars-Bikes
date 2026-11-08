import type { IconName } from "@/components/ui/Icon";

export type Service = { icon: IconName; title: string; text: string };

export const services: Service[] = [
  { icon: "tire", title: "Pneus auto & moto", text: "Vente et montage, route ou racing." },
  {
    icon: "bolt",
    title: "Diagnostic électrique & électronique",
    text: "Recherche de pannes, faisceaux, capteurs.",
  },
  { icon: "chart", title: "Optimisation de cartographie", text: "Reprogrammation fine de l'injection." },
  {
    icon: "carburetor",
    title: "Injection → carburateur",
    text: "Conversion complète, réglages sur mesure.",
  },
];
