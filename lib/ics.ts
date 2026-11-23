import type { EventWithCommunity } from "./db/schema";

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

export function toICS(event: EventWithCommunity, now: Date): string {
  const description = [
    event.description,
    "",
    `Organiza: ${event.community?.name ?? "Independiente"}`,
    ...(event.registrationUrl ? [`Registro: ${event.registrationUrl}`] : []),
  ].join("\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PUE Tech//Eventos tech de Puebla//ES",
    "BEGIN:VEVENT",
    `UID:${event.id}@puetech`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(event.startsAt)}`,
    `DTEND:${stamp(event.endsAt)}`,
    `SUMMARY:${esc(event.title)}`,
    `DESCRIPTION:${esc(description)}`,
    `LOCATION:${esc(event.online ? "En línea" : event.venue)}`,
    ...(event.status === "cancelado" ? ["STATUS:CANCELLED"] : []),
    ...(event.registrationUrl ? [`URL:${event.registrationUrl}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
