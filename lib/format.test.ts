import { it, expect } from "vitest";
import { formatTime, formatDate, formatLongDate, formatParts } from "./format";

const iso = "2026-11-22T18:30:00-06:00";

it("formatea en hora de Puebla sin importar la TZ del proceso", () => {
  process.env.TZ = "UTC";
  expect(formatTime(iso)).toBe("18:30");
});

it("formatParts separa día de la semana, día y mes", () => {
  expect(formatParts(iso)).toEqual({ weekday: "dom", day: "22", month: "nov" });
});

it("formatDate y formatLongDate solo capitalizan la primera letra", () => {
  expect(formatDate(iso)).toBe("Dom 22 de nov");
  expect(formatLongDate(iso)).toBe("Domingo, 22 de noviembre");
});
