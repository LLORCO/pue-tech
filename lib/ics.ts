import type { EventWithCommunity } from "./db/schema";

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s: string) =>
  s
    .replace(/\r\n?/g, "\n")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/([,;])/g, "\\$1");

const encoder = new TextEncoder();

// RFC 5545 §3.1: líneas de máximo 75 octetos; la continuación va tras CRLF + espacio.
// Se corta por puntos de código para no partir un carácter UTF-8 de varios bytes.
function fold(line: string): string {
  const out: string[] = [];
  let current = "";
  let size = 0;
  for (const ch of line) {
    const n = encoder.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74;
    if (size + n > limit) {
      out.push(current);
      current = "";
      size = 0;
    }
    current += ch;
    size += n;
  }
  out.push(current);
  return out.join("\r\n ");
}

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
  ]
    .map(fold)
    .join("\r\n");
}
