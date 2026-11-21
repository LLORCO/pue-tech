import { it, expect } from "vitest";
import { clampTitle, ogUrl } from "./og";
import { seedEvents, seedCommunities } from "./seed";

it("clampTitle recorta títulos largos con elipsis", () => {
  const t = clampTitle("x".repeat(100));
  expect(t.length).toBe(70);
  expect(t.endsWith("…")).toBe(true);
  expect(clampTitle("corto")).toBe("corto");
});
it("ogUrl incluye formato y título codificado", () => {
  const u = ogUrl({ ...seedEvents[0], title: "Hola & adiós" }, seedCommunities[0], "story");
  expect(u).toContain("format=story");
  expect(u).toContain("title=Hola+%26+adi%C3%B3s");
});
