import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@vercel/blob", () => ({ get: vi.fn(), put: vi.fn() }));

import { get, put } from "@vercel/blob";
import { defaultContent } from "./defaults";
import { parseContent, readStoredContent, repoImageKey, StorageNotConfiguredError, writeStoredContent } from "./store";

const streamOf = (text: string) => new Response(text).body!;

describe("parseContent", () => {
  beforeEach(() => vi.spyOn(console, "error").mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it("renvoie le contenu par défaut pour un objet invalide", () => {
    expect(parseContent({})).toEqual(defaultContent);
  });

  it("renvoie le contenu par défaut pour un JSON illisible", () => {
    expect(parseContent("{")).toEqual(defaultContent);
  });

  it("garde un contenu valide", () => {
    const content = { ...defaultContent, sales: [] };
    expect(parseContent(JSON.stringify(content))).toEqual(content);
  });
});

describe("readStoredContent", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.mocked(get).mockReset();
  });

  it("renvoie le contenu par défaut sans jeton, sans appeler Blob", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
    await expect(readStoredContent()).resolves.toEqual(defaultContent);
    expect(get).not.toHaveBeenCalled();
  });

  it("renvoie le contenu par défaut quand content.json n'existe pas encore", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "test");
    vi.mocked(get).mockResolvedValue(null);
    await expect(readStoredContent()).resolves.toEqual(defaultContent);
  });

  it("lit content.json en contournant le cache du CDN", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "test");
    const stored = { ...defaultContent, contact: { phoneDisplay: "0471 00 00 00", email: "a@b.be" } };
    vi.mocked(get).mockResolvedValue({ statusCode: 200, stream: streamOf(JSON.stringify(stored)) } as never);
    await expect(readStoredContent()).resolves.toEqual(stored);
    expect(get).toHaveBeenCalledWith("content.json", expect.objectContaining({ access: "public", useCache: false }));
  });
});

describe("photos supplémentaires des véhicules", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.mocked(get).mockReset();
  });

  const withExtras = defaultContent.clients.find((c) => (c.extras ?? []).length > 0)!;
  const blobImg = { src: "https://abc.public.blob.vercel-storage.com/uploads/clients/x.jpg", width: 800, height: 600 };
  const readWith = async (clients: unknown[]) => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "test");
    const stored = { ...defaultContent, clients };
    vi.mocked(get).mockResolvedValue({ statusCode: 200, stream: streamOf(JSON.stringify(stored)) } as never);
    return (await readStoredContent()).clients.find((c) => c.id === withExtras.id)!;
  };

  it("reprend les photos du dépôt pour un content.json enregistré avant la fonctionnalité", async () => {
    const legacy = defaultContent.clients.map((c) => ({ ...c, extras: undefined }));
    expect((await readWith(legacy)).extras).toEqual(withExtras.extras);
  });

  it("respecte les photos retirées ou ajoutées depuis l'admin", async () => {
    const [, ...kept] = withExtras.extras!;
    const clients = defaultContent.clients.map((c) => (c.id === withExtras.id ? { ...c, extras: [...kept, blobImg] } : c));
    expect((await readWith(clients)).extras).toEqual([...kept, blobImg]);
  });

  it("rattache une photo du dépôt à son URL du build actuel", async () => {
    const first = withExtras.extras![0];
    const old = { ...first, src: first.src.replace(/.[^./]+(.w+)$/, ".ancienbuild$1") };
    const clients = defaultContent.clients.map((c) => (c.id === withExtras.id ? { ...c, extras: [old] } : c));
    expect((await readWith(clients)).extras).toEqual([first]);
  });

  it("reprend la description du dépôt si elle n'a jamais été enregistrée, garde celle effacée", async () => {
    const described = defaultContent.clients.find((c) => c.description)!;
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "test");
    const legacy = { ...defaultContent, clients: defaultContent.clients.map((c) => ({ ...c, description: undefined })) };
    vi.mocked(get).mockResolvedValue({ statusCode: 200, stream: streamOf(JSON.stringify(legacy)) } as never);
    expect((await readStoredContent()).clients.find((c) => c.id === described.id)!.description).toBe(described.description);

    const cleared = { ...defaultContent, clients: defaultContent.clients.map((c) => ({ ...c, description: "" })) };
    vi.mocked(get).mockResolvedValue({ statusCode: 200, stream: streamOf(JSON.stringify(cleared)) } as never);
    expect((await readStoredContent()).clients.find((c) => c.id === described.id)!.description).toBe("");
  });

  it("donne un nom stable aux images du dépôt", () => {
    expect(repoImageKey("/_next/static/media/harley-sportster-custom-2.3lx6cy0rpmw_f.jpg")).toBe("harley-sportster-custom-2");
  });
});

describe("writeStoredContent", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.mocked(put).mockReset();
  });

  it("refuse un contenu invalide sans écrire", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "test");
    const invalid = { ...defaultContent, contact: { phoneDisplay: "1", email: "x" } };
    await expect(writeStoredContent(invalid)).rejects.toThrow();
    expect(put).not.toHaveBeenCalled();
  });

  it("refuse d'écrire sans jeton", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
    await expect(writeStoredContent(defaultContent)).rejects.toBeInstanceOf(StorageNotConfiguredError);
  });

  it("écrase content.json sans suffixe aléatoire", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "test");
    await writeStoredContent(defaultContent);
    expect(put).toHaveBeenCalledWith(
      "content.json",
      expect.any(String),
      expect.objectContaining({ access: "public", addRandomSuffix: false, allowOverwrite: true }),
    );
  });
});

describe("readStoredContent (écriture : lecture stricte)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.mocked(get).mockReset();
    vi.restoreAllMocks();
  });

  it("refuse de repartir d'un content.json invalide (évite d'écraser le contenu par défaut)", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "test");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(get).mockResolvedValue({ statusCode: 200, stream: streamOf('{"version":1,"partners":"cassé"}') } as never);
    await expect(readStoredContent({ strict: true })).rejects.toThrow(/illisible|invalide/);
  });

  it("rattache les images du dépôt à leur version actuelle", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "test");
    const stale = structuredClone(defaultContent);
    stale.partners[0].logo = { src: "/_next/static/media/ancienne-empreinte.png", width: 1, height: 1 };
    vi.mocked(get).mockResolvedValue({ statusCode: 200, stream: streamOf(JSON.stringify(stale)) } as never);
    const content = await readStoredContent();
    expect(content.partners[0].logo).toEqual(defaultContent.partners[0].logo);
  });
});
