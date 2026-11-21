import type { Community, TechEvent } from "./types";

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

export function toICS(event: TechEvent, community: Community): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cemita//Eventos tech de Puebla//ES",
    "BEGIN:VEVENT",
    `UID:${event.slug}@cemita`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(event.start)}`,
    `DTEND:${stamp(event.end)}`,
    `SUMMARY:${esc(event.title)}`,
    `DESCRIPTION:${esc(`${event.description}\n\nOrganiza: ${community.name}\nRegistro: ${event.registrationUrl}`)}`,
    `LOCATION:${esc(event.venue)}`,
    `URL:${event.registrationUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
