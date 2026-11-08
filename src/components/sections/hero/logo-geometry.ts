/*
 * Géométrie du logo C/Cars & Bikes, mesurée sur src/assets/logo.png
 * (repère : pixels du PNG, 246 × 230).
 *
 * Les angles sont en degrés, 0 = midi, sens horaire, et se lisent dans un repère
 * « normalisé » centré en (123, 115) et étiré de 123 × 115 : dans ce repère,
 * tous les séparateurs du logo sont des rayons droits.
 */

export const VIEW = { width: 246, height: 230 };

type Ellipse = { cx: number; cy: number; rx: number; ry: number };

const ORIGIN = { x: 123, y: 115, sx: 123, sy: 115 };

/** Socle noir (même contour que la couronne). */
export const BASE: Ellipse = { cx: 123.4, cy: 115, rx: 122.5, ry: 115.3 };
/** Bord extérieur de la couronne colorée. */
const RING_OUT: Ellipse = { cx: 123.4, cy: 115, rx: 122.2, ry: 115 };
/** Bord intérieur de la couronne (un fin trait noir la sépare du disque). */
const RING_IN: Ellipse = { cx: 123.4, cy: 115, rx: 89.5, ry: 85 };
/** Disque blanc central. */
export const DISC: Ellipse = { cx: 123.4, cy: 115.1, rx: 87.9, ry: 83 };

/** Limites des 3 rangées du damier (rayon normalisé). */
const ROW_EDGES = [0.916, 0.814];
const rowEllipse = (rho: number): Ellipse => ({ cx: ORIGIN.x, cy: ORIGIN.y, rx: rho * ORIGIN.sx, ry: rho * ORIGIN.sy });

/** Point où le rayon d'angle `deg` coupe l'ellipse `e`. */
function hit(e: Ellipse, deg: number): [number, number] {
  const t = (deg * Math.PI) / 180;
  const dx = Math.sin(t) * ORIGIN.sx;
  const dy = -Math.cos(t) * ORIGIN.sy;
  const ox = ORIGIN.x - e.cx;
  const oy = ORIGIN.y - e.cy;
  const a = (dx / e.rx) ** 2 + (dy / e.ry) ** 2;
  const b = 2 * ((ox * dx) / e.rx ** 2 + (oy * dy) / e.ry ** 2);
  const c = (ox / e.rx) ** 2 + (oy / e.ry) ** 2 - 1;
  const k = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  return [ORIGIN.x + k * dx, ORIGIN.y + k * dy];
}

const pt = ([x, y]: [number, number]) => `${x.toFixed(2)} ${y.toFixed(2)}`;

/** Secteur de couronne entre deux ellipses et deux angles (from < to). */
function sector(outer: Ellipse, inner: Ellipse, from: number, to: number) {
  const large = to - from > 180 ? 1 : 0;
  return (
    `M${pt(hit(outer, from))}` +
    `A${outer.rx} ${outer.ry} 0 ${large} 1 ${pt(hit(outer, to))}` +
    `L${pt(hit(inner, to))}` +
    `A${inner.rx} ${inner.ry} 0 ${large} 0 ${pt(hit(inner, from))}Z`
  );
}

/** Zones de couleur, dans l'ordre d'apparition. */
export const SEGMENTS = [
  { id: "yellow", from: 267.6, to: 318.4, fill: "var(--yellow)" },
  { id: "top", from: 321.3, to: 399.4, fill: "url(#logo-metal)" },
  { id: "red", from: 42.3, to: 92.5, fill: "var(--red)" },
  { id: "bottom", from: 139.9, to: 220.2, fill: "url(#logo-metal)" },
].map((s) => ({ ...s, d: sector(RING_OUT, RING_IN, s.from, s.to) }));

/*
 * Damiers : 4 colonnes × 3 rangées de chaque côté. `white[rangée]` liste les
 * colonnes blanches (colonnes dans le sens horaire, rangée 0 = extérieure).
 */
const CHECKER_SIDES = [
  { cols: [94.6, 105.6, 116.2, 127.0, 137.5], white: [[1, 3], [0, 2], [1, 3]], topFirst: true },
  { cols: [222.7, 233.2, 244.0, 254.6, 265.6], white: [[0, 2], [1, 3], [0, 2]], topFirst: false },
];
const rows = [RING_OUT, rowEllipse(ROW_EDGES[0]), rowEllipse(ROW_EDGES[1]), RING_IN];

export const CHECKERS = CHECKER_SIDES.flatMap(({ cols, white, topFirst }) =>
  white.flatMap((whiteCols, row) =>
    whiteCols.map((col) => ({
      d: sector(rows[row], rows[row + 1], cols[col], cols[col + 1]),
      // ordre d'apparition : de haut en bas sur chaque côté
      order: topFirst ? col : cols.length - 2 - col,
    })),
  ),
);
