import type { CSSProperties } from "react";
import { BASE, CHECKERS, DISC, SEGMENTS, VIEW } from "./logo-geometry";
import { CARS_BIKES, C_SLASH } from "./logo-lettering";
import styles from "./HeroLogo.module.css";

/*
 * Logo C/Cars & Bikes reconstruit à l'identique (géométrie mesurée sur le logo
 * d'origine, lettrage vectorisé), qui se construit pièce par pièce puis reste.
 */

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

const CX = 123;
const CY = 115;

/** Arc de cercle autour du centre (angle en degrés depuis midi, sens horaire). */
const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(CX + r * Math.sin(a)).toFixed(1)} ${(CY - r * Math.cos(a)).toFixed(1)}`;
};
const arc = (r: number, from: number, to: number) =>
  `M${polar(r, from)} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${polar(r, to)}`;

/* Masque de chaque zone : un trait épais qui se déroule le long de la couronne. */
const MASK_R = 104;
const MASK_W = 48;
const MASK_MARGIN = 6;

export function HeroLogo() {
  return (
    <div className={styles.wrap}>
      <div className={styles.glow} aria-hidden="true" />
      <svg
        className={styles.logo}
        viewBox={`-2 -2 ${VIEW.width + 4} ${VIEW.height + 4}`}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Gris métallisé : clair contre le disque, sombre vers le bord */}
          <radialGradient id="logo-metal" gradientUnits="userSpaceOnUse" cx={CX} cy={CY} r={120}>
            <stop offset=".68" stopColor="#bababa" />
            <stop offset="1" stopColor="#1c1c1c" />
          </radialGradient>
          {SEGMENTS.map((s, i) => (
            <mask key={s.id} id={`logo-mask-${s.id}`} maskUnits="userSpaceOnUse">
              <path
                className={styles.sweep}
                d={arc(MASK_R, s.from - MASK_MARGIN, s.to + MASK_MARGIN)}
                pathLength={1}
                strokeWidth={MASK_W}
                style={{ "--i": i } as CSSVars}
              />
            </mask>
          ))}
        </defs>

        {/* 1. Socle noir */}
        <ellipse className={styles.rim} cx={BASE.cx} cy={BASE.cy} rx={BASE.rx} ry={BASE.ry} />

        {/* 2. Zones de couleur */}
        {SEGMENTS.map((s) => (
          <path key={s.id} d={s.d} fill={s.fill} mask={`url(#logo-mask-${s.id})`} />
        ))}

        {/* 3. Damiers (cases blanches ; les noires sont le socle) */}
        {CHECKERS.map((c, i) => (
          <path key={i} className={styles.checker} d={c.d} style={{ "--i": c.order } as CSSVars} />
        ))}

        {/* 4. Disque blanc */}
        <ellipse className={styles.disc} cx={DISC.cx} cy={DISC.cy} rx={DISC.rx} ry={DISC.ry} />

        {/* 5. « C/ » : le contour se dessine, puis se remplit */}
        <path className={styles.cSlash} d={C_SLASH} pathLength={1} fillRule="evenodd" />

        {/* 6. « CARS & BIKES » */}
        <path className={styles.word} d={CARS_BIKES} pathLength={1} fillRule="evenodd" />
      </svg>
    </div>
  );
}
