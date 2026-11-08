/**
 * Lien `tel:` et format international à partir du numéro saisi par le gérant.
 * Un numéro national (commençant par 0) est considéré comme belge (+32).
 */
export function phoneLinks(display: string): { href: string; international: string } {
  const trimmed = display.trim();
  const international = trimmed.startsWith("+") ? trimmed : `+32 ${trimmed.replace(/^0/, "")}`;
  return {
    href: `tel:+${international.replace(/\D/g, "")}`,
    international,
  };
}
