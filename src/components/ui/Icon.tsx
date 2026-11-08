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
  car: {
    viewBox: "0 0 100 50",
    body: (
      <>
        <path d="M8 36h84l-4-12-16-4-12-10H34L22 20 10 24z" />
        <circle cx="26" cy="38" r="7" fill="var(--icon-bg, transparent)" />
        <circle cx="74" cy="38" r="7" fill="var(--icon-bg, transparent)" />
      </>
    ),
  },
  motorbike: {
    viewBox: "0 0 100 60",
    body: (
      <>
        <circle cx="20" cy="42" r="14" />
        <circle cx="80" cy="42" r="14" />
        <path d="M20 42 40 22h22l18 20M40 22l8 20h12M62 22l6-10h8" />
      </>
    ),
  },
  gear: {
    viewBox: "0 0 60 60",
    body: (
      <>
        <circle cx="30" cy="30" r="12" />
        <path d="M30 6v8M30 46v8M6 30h8M46 30h8M13 13l6 6M41 41l6 6M13 47l6-6M41 19l6-6" />
      </>
    ),
  },
  toolbox: {
    viewBox: "0 0 60 60",
    body: (
      <>
        <rect x="10" y="18" width="40" height="30" rx="3" />
        <path d="M22 18v-6h16v6M10 30h40" />
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
