const TZ = "America/Mexico_City";

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" })
    .format(new Date(iso))
    .replace(/\./g, "");
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(
    new Date(iso),
  );
}

export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" }).format(
    new Date(iso),
  );
}
