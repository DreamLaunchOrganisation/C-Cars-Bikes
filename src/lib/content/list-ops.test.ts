import { describe, expect, it } from "vitest";
import { appendItem, moveItem, removeItem, updateItem } from "./list-ops";

type Item = { id: string; group?: string; label?: string };
const ids = (list: Item[]) => list.map((i) => i.id);
const abc = (): Item[] => [{ id: "a" }, { id: "b" }, { id: "c" }];

describe("moveItem", () => {
  it("ne déplace pas le premier élément vers le haut", () => {
    expect(ids(moveItem(abc(), "a", -1))).toEqual(["a", "b", "c"]);
  });

  it("ne déplace pas le dernier élément vers le bas", () => {
    expect(ids(moveItem(abc(), "c", 1))).toEqual(["a", "b", "c"]);
  });

  it("échange avec le voisin du dessus", () => {
    expect(ids(moveItem(abc(), "b", -1))).toEqual(["b", "a", "c"]);
  });

  it("échange avec le voisin du dessous", () => {
    expect(ids(moveItem(abc(), "b", 1))).toEqual(["a", "c", "b"]);
  });

  it("saute les éléments d'un autre groupe", () => {
    const list: Item[] = [
      { id: "m1", group: "Motos" },
      { id: "a1", group: "Autos" },
      { id: "m2", group: "Motos" },
    ];
    const sameGroup = (x: Item, y: Item) => x.group === y.group;
    expect(ids(moveItem(list, "m2", -1, sameGroup))).toEqual(["m2", "a1", "m1"]);
  });

  it("ignore un id inconnu", () => {
    expect(ids(moveItem(abc(), "zz", -1))).toEqual(["a", "b", "c"]);
  });

  it("ne modifie pas la liste d'origine", () => {
    const list = abc();
    moveItem(list, "b", -1);
    expect(ids(list)).toEqual(["a", "b", "c"]);
  });
});

describe("removeItem", () => {
  it("retire l'élément", () => {
    expect(ids(removeItem(abc(), "b"))).toEqual(["a", "c"]);
  });

  it("ignore un id inconnu", () => {
    expect(ids(removeItem(abc(), "zz"))).toEqual(["a", "b", "c"]);
  });
});

describe("updateItem", () => {
  it("modifie uniquement l'élément ciblé", () => {
    const list = updateItem(abc(), "b", { label: "B" });
    expect(list[1]).toEqual({ id: "b", label: "B" });
    expect(list[0]).toEqual({ id: "a" });
  });

  it("ignore un id inconnu", () => {
    expect(updateItem(abc(), "zz", { label: "Z" })).toEqual(abc());
  });

  it("ne modifie pas la liste d'origine", () => {
    const list = abc();
    updateItem(list, "a", { label: "A" });
    expect(list[0]).toEqual({ id: "a" });
  });
});

describe("appendItem", () => {
  it("ajoute à la fin sans modifier l'original", () => {
    const list = abc();
    expect(ids(appendItem(list, { id: "d" }))).toEqual(["a", "b", "c", "d"]);
    expect(list).toHaveLength(3);
  });
});
