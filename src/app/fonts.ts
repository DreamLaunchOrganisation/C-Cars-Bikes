import localFont from "next/font/local";

/*
 * Polices auto-hébergées (fichiers dans src/assets/fonts, licence SIL OFL).
 * next/font les optimise et expose chacune via une variable CSS.
 */

export const anton = localFont({
  src: "../assets/fonts/anton-400.woff2",
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

export const inter = localFont({
  src: "../assets/fonts/inter-var.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

export const jetbrainsMono = localFont({
  src: "../assets/fonts/jetbrains-mono-var.woff2",
  weight: "100 800",
  variable: "--font-mono",
  display: "swap",
});
