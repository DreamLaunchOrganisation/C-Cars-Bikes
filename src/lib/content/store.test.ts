import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@vercel/blob", () => ({ get: vi.fn(), put: vi.fn() }));

import { get, put } from "@vercel/blob";
import { defaultContent } from "./defaults";
import { parseContent, readStoredContent, StorageNotConfiguredError, writeStoredContent } from "./store";

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
