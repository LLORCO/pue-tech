import { it, expect } from "vitest";
import { toICS } from "./ics";
import type { EventWithCommunity } from "./db/schema";

const community = {
  id: "c1c1c1c1-0000-4000-8000-000000000001",
  slug: "python-puebla",
  name: "Python Puebla",
  description: "Comunidad de Python",
  topics: [],
  links: [],
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
};

const ev: EventWithCommunity = {
  id: "e1e1e1e1-0000-4000-8000-000000000001",
  slug: "meetup-python",
  title: "Meetup de Python",
  description: "Charlas, y más.",
  communityId: community.id,
  startsAt: new Date("2026-11-22T18:30:00-06:00"),
  endsAt: new Date("2026-11-22T20:00:00-06:00"),
  venue: "BUAP, Puebla",
  online: false,
  registrationUrl: "https://example.com/registro",
  topics: [],
  status: "publicado",
  publishedAt: null,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
  community,
};

const now = new Date("2026-11-01T12:00:00Z");

it("genera un VEVENT válido en UTC con CRLF", () => {
  const ics = toICS(ev, now);
  expect(ics).toContain("BEGIN:VEVENT");
  expect(ics).toContain("PRODID:-//PUE Tech//Eventos tech de Puebla//ES");
  expect(ics).toContain("DTSTART:20261123T003000Z");
  expect(ics).toContain("DTSTAMP:20261101T120000Z");
  expect(ics).toContain("SUMMARY:Meetup de Python");
  expect(ics).toContain("Organiza: Python Puebla");
  expect(ics).toMatch(/^URL:https:\/\/example\.com\/registro$/m);
  expect(ics).not.toContain("STATUS:CANCELLED");
  expect(ics.split("\r\n").length).toBeGreaterThan(5);
  expect(ics).not.toMatch(/[^\r]\n/);
});

it("evento cancelado sin comunidad ni registro", () => {
  const ics = toICS({ ...ev, status: "cancelado", community: null, communityId: null, registrationUrl: null }, now);
  expect(ics).toContain("STATUS:CANCELLED");
  expect(ics).toContain("Organiza: Independiente");
  expect(ics).not.toMatch(/^URL:/m);
  expect(ics).not.toContain("Registro:");
  expect(ics).not.toContain("undefined");
  expect(ics).toContain(`UID:${ev.id}@puetech`);
});

const octets = (s: string) => Buffer.byteLength(s, "utf8");

it("normaliza CRLF y CR sueltos de la descripción", () => {
  const ics = toICS({ ...ev, description: "Primera línea\r\nSegunda\rTercera" }, now);
  expect(ics.replace(/\r\n/g, "")).not.toContain("\r");
  const unfolded = ics.replace(/\r\n /g, "");
  expect(unfolded).toContain("DESCRIPTION:Primera línea\\nSegunda\\nTercera\\n\\nOrganiza: Python Puebla");
});

it("pliega líneas largas a 75 octetos sin partir caracteres UTF-8", () => {
  const long = "Taller práctico de ñandú y canción ".repeat(10);
  const ics = toICS({ ...ev, title: long, description: "é".repeat(200) }, now);
  const lines = ics.split("\r\n");
  for (const line of lines) expect(octets(line)).toBeLessThanOrEqual(75);
  expect(lines.some((l) => l.startsWith(" "))).toBe(true);
  expect(ics).not.toContain("�");
  const unfolded = ics.replace(/\r\n /g, "");
  expect(unfolded).toContain(`SUMMARY:${long.replace(/,/g, "\\,")}`);
  expect(unfolded).toContain(`DESCRIPTION:${"é".repeat(200)}\\n`);
});
