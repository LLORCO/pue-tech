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
