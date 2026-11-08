import { cacheLife } from "next/cache";

/** Année courante pour le copyright, mise en cache et recalculée chaque jour. */
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
