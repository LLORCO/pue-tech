const TZ = "America/Mexico_City";

// Puebla usa UTC-6 todo el año desde 2022.
export const localToIso = (local: string) => (local ? `${local}:00-06:00` : "");

/** Valor para <input type="datetime-local"> en hora de Puebla. */
export function isoToLocalInput(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}
