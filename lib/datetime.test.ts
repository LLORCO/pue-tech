import { it, expect } from "vitest";
import { localToIso, isoToLocalInput } from "./datetime";
import { formatDate } from "./format";

it("localToIso agrega el desfase de Puebla", () => {
  expect(localToIso("2026-12-04T23:30")).toBe("2026-12-04T23:30:00-06:00");
  expect(localToIso("")).toBe("");
});

it("ida y vuelta de hora local a las 23:30", () => {
  const iso = localToIso("2026-12-04T23:30");
  expect(isoToLocalInput(new Date(iso))).toBe("2026-12-04T23:30");
  expect(formatDate(iso)).toBe("Vie 4 de dic");
});
