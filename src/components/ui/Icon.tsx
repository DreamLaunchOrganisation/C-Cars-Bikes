import type { SVGProps } from "react";

/** Icônes du site : un seul composant, tracés en ligne (couleur = currentColor). */
const icons = {
  tire: {
    viewBox: "0 0 24 24",
    body: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
      </>
    ),
  },
  bolt: { viewBox: "0 0 24 24", body: <path d="M13 2 4 14h7l-1 8 9-12h-7z" /> },
  chart: { viewBox: "0 0 24 24", body: <path d="M3 20h18M5 16l4-6 4 3 6-9" /> },
  carburetor: {
    viewBox: "0 0 24 24",
    body: (
      <>
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="M8 6V4M16 6V4M8 18v2M16 18v2M9 12h6" />
      </>
    ),
  },
  /*
   * Illustrations des catégories « Vente ». Les pièces posées devant d'autres sont
   * remplies avec --icon-bg (la couleur du fond derrière l'icône) pour masquer les traits cachés.
   */
  car: {
    viewBox: "0 0 200 90",
    body: (
      <>
        <path d="M16 64 13 54Q13 46 22 44L58 38Q74 24 96 22L112 22Q124 23 134 36L172 42Q186 45 188 54L188 60Q188 64 184 64L170 64A18 18 0 0 0 134 64L66 64A18 18 0 0 0 30 64Z" />
        <path d="M70 37Q80 28 96 27L112 27Q121 28 128 36ZM104 27 102 37" />
        <path d="M80 40V60M131 38V60M86 44h8" />
        <ellipse cx="180" cy="48" rx="4" ry="3" />
        <path d="M15 48h4M178 60h12M10 58h10" />
        <circle cx="48" cy="64" r="14" />
        <circle cx="48" cy="64" r="9" />
        <circle cx="48" cy="64" r="2.5" />
        <circle cx="152" cy="64" r="14" />
        <circle cx="152" cy="64" r="9" />
        <circle cx="152" cy="64" r="2.5" />
      </>
    ),
  },
  motorbike: {
    viewBox: "0 0 200 110",
    body: (
      <>
        <circle cx="46" cy="80" r="22" />
        <circle cx="46" cy="80" r="16" />
        <circle cx="46" cy="80" r="4" />
        <circle cx="158" cy="80" r="22" />
        <circle cx="158" cy="80" r="16" />
        <circle cx="158" cy="80" r="4" />
        <path d="M140 70Q150 56 174 62" />
        <path d="M46 80 94 78M60 52 72 76" />
        <path d="M140 34 157 80M145 33 160 72" />
        <path d="M141 32 134 24 122 22" />
        <circle cx="151" cy="40" r="7" fill="var(--icon-bg)" />
        <path d="M138 44 124 74" />
        <path d="M38 52Q44 44 60 45L100 44L102 50L64 54Q48 54 38 52Z" fill="var(--icon-bg)" />
        <path d="M100 46Q104 33 124 33Q137 33 141 40L136 50L104 52Z" fill="var(--icon-bg)" />
        <path d="M103 53 129 53 125 67 101 67ZM104 58H127M103 62H126" fill="var(--icon-bg)" />
        <path d="M96 67 128 67 126 80Q118 88 104 86L94 80Z" fill="var(--icon-bg)" />
        <circle cx="110" cy="76" r="5" />
        <path d="M126 60Q138 66 132 82Q128 89 112 89L82 89" />
        <path d="M82 86 40 82Q34 83 34 87Q34 91 40 92L82 92Z" fill="var(--icon-bg)" />
        <path d="M86 82h10" />
      </>
    ),
  },
  engine: {
    viewBox: "0 0 200 150",
    body: (
      <>
        {[-24, 24].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 100 104)`}>
            <rect x="91" y="42" width="18" height="60" fill="var(--icon-bg)" />
            <path d="M84 48H116M84 55H116M84 62H116M84 69H116M84 76H116M84 83H116" />
            <rect x="83" y="27" width="34" height="16" rx="3" fill="var(--icon-bg)" />
            <rect x="86" y="15" width="28" height="12" rx="6" fill="var(--icon-bg)" />
          </g>
        ))}
        <path
          d="M60 104Q64 88 100 88Q136 88 140 104L141 116Q138 136 112 138L88 138Q62 136 59 116Z"
          fill="var(--icon-bg)"
        />
        <circle cx="100" cy="115" r="14" />
        <circle cx="100" cy="115" r="5" />
        <path d="M68 102h4M128 102h4M70 126h3M127 126h3" />
        <circle cx="100" cy="68" r="15" fill="var(--icon-bg)" />
        <circle cx="100" cy="68" r="5" />
      </>
    ),
  },
  helmet: {
    viewBox: "0 0 130 110",
    body: (
      <>
        <path d="M20 70C18 30 50 12 80 18C104 24 114 50 110 74L106 88Q104 94 96 94L64 94Q56 94 52 88L46 80L26 82Q20 80 20 70Z" />
        <path d="M62 46Q90 40 110 50L110 70Q88 70 70 68Q60 66 62 46Z" />
        <circle cx="54" cy="58" r="5" />
        <path d="M24 58Q46 28 96 30M84 80h12M84 86h12" />
      </>
    ),
  },
  phone: {
    viewBox: "0 0 24 24",
    body: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    ),
  },
  mail: {
    viewBox: "0 0 24 24",
    body: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
      </>
    ),
  },
  pin: {
    viewBox: "0 0 24 24",
    body: (
      <>
        <path d="M12 22s8-6 8-12a8 8 0 0 0-16 0c0 6 8 12 8 12z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  menu: { viewBox: "0 0 24 24", body: <path d="M3 7h18M3 12h18M3 17h18" /> },
  close: { viewBox: "0 0 24 24", body: <path d="M6 6l12 12M18 6 6 18" /> },
} as const;

export type IconName = keyof typeof icons;

type Props = SVGProps<SVGSVGElement> & { name: IconName; strokeWidth?: number };

export function Icon({ name, strokeWidth = 1.5, ...props }: Props) {
  const { viewBox, body } = icons[name];
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {body}
    </svg>
  );
}
