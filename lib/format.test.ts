import { it, expect } from "vitest";
import { formatTime, formatDate } from "./format";

it("formatea en hora de Puebla sin importar la TZ del proceso", () => {
  process.env.TZ = "UTC";
  expect(formatTime("2026-11-22T18:30:00-06:00")).toBe("18:30");
  expect(formatDate("2026-11-22T18:30:00-06:00")).toMatch(/22/);
  expect(formatDate("2026-11-22T18:30:00-06:00").toLowerCase()).toMatch(/nov/);
});
