/*
 * Opérations pures sur les listes du contenu (bandeau, photos, annonces).
 * Elles renvoient toujours une nouvelle liste et ignorent un identifiant inconnu
 * (cas de deux onglets d'admin ouverts en même temps).
 */

type WithId = { id: string };

export function appendItem<T extends WithId>(list: T[], item: T): T[] {
  return [...list, item];
}

export function removeItem<T extends WithId>(list: T[], id: string): T[] {
  return list.filter((item) => item.id !== id);
}

export function updateItem<T extends WithId>(list: T[], id: string, patch: Partial<T>): T[] {
  return list.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

/**
 * Échange l'élément avec son voisin le plus proche dans la direction donnée.
 * `sameGroup` limite l'échange aux éléments du même groupe (ex. Motos / Autos).
 */
export function moveItem<T extends WithId>(
  list: T[],
  id: string,
  direction: -1 | 1,
  sameGroup: (a: T, b: T) => boolean = () => true,
): T[] {
  const from = list.findIndex((item) => item.id === id);
  if (from === -1) return [...list];

  let to = from + direction;
  while (to >= 0 && to < list.length && !sameGroup(list[from], list[to])) to += direction;
  if (to < 0 || to >= list.length) return [...list];

  const next = [...list];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}
