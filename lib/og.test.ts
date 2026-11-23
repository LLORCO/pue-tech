import { it, expect } from "vitest";
import { clampTitle, ogUrl } from "./og";
import type { EventWithCommunity } from "./db/schema";

const community = {
  id: "c1",
  slug: "cloud-puebla",
  name: "Cloud Puebla",
  description: "d",
  topics: [],
  links: [],
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
} as EventWithCommunity["community"];

const event: EventWithCommunity = {
  id: "e1",
  slug: "hola",
  title: "Hola",
  description: "d",
  communityId: "c1",
  startsAt: new Date("2026-12-05T05:30:00Z"), // 23:30 en Puebla
  endsAt: new Date("2026-12-05T07:30:00Z"),
  venue: "BUAP",
  online: false,
  registrationUrl: null,
  topics: [],
  status: "publicado",
  publishedAt: null,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
  community,
};

it("clampTitle recorta títulos largos con elipsis", () => {
  const t = clampTitle("x".repeat(100));
  expect(t.length).toBe(70);
  expect(t.endsWith("…")).toBe(true);
  expect(clampTitle("corto")).toBe("corto");
});
it("ogUrl incluye formato y título codificado", () => {
  const u = ogUrl({ ...event, title: "Hola & adiós" }, "story");
  expect(u).toContain("format=story");
  expect(u).toContain("title=Hola+%26+adi%C3%B3s");
});
it("ogUrl usa la hora de Puebla y el nombre de la comunidad", () => {
  const u = ogUrl(event, "post");
  expect(u).toContain("time=23%3A30");
  expect(u).toContain("community=Cloud+Puebla");
});
it("ogUrl sin comunidad manda Independiente", () => {
  expect(ogUrl({ ...event, communityId: null, community: null }, "post")).toContain("community=Independiente");
});
