import { it, expect } from "vitest";
import { toICS } from "./ics";
import { seedEvents, seedCommunities } from "./seed";

it("genera un VEVENT válido en UTC con CRLF", () => {
  const ev = { ...seedEvents[0], start: "2026-11-22T18:30:00-06:00", end: "2026-11-22T20:00:00-06:00" };
  const ics = toICS(ev, seedCommunities[0]);
  expect(ics).toContain("BEGIN:VEVENT");
  expect(ics).toContain("DTSTART:20261123T003000Z");
  expect(ics).toContain(`SUMMARY:${ev.title}`);
  expect(ics.split("\r\n").length).toBeGreaterThan(5);
  expect(ics).not.toMatch(/[^\r]\n/);
});
