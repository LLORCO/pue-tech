const TZ = "America/Mexico_City";

const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function formatParts(iso: string): { weekday: string; day: string; month: string } {
  const parts = new Intl.DateTimeFormat("es-MX", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" })
    .formatToParts(new Date(iso));
  const get = (t: Intl.DateTimeFormatPartTypes) => (parts.find((p) => p.type === t)?.value ?? "").replace(/\./g, "");
  return { weekday: get("weekday"), day: get("day"), month: get("month") };
}

export function formatDate(iso: string): string {
  const { weekday, day, month } = formatParts(iso);
  return capFirst(`${weekday} ${day} de ${month}`);
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(
    new Date(iso),
  );
}

export function formatLongDate(iso: string): string {
  return capFirst(
    new Intl.DateTimeFormat("es-MX", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" }).format(new Date(iso)),
  );
}
