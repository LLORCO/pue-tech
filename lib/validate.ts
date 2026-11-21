import type { NewEventInput } from "./types";

export type FieldErrors = Partial<Record<keyof NewEventInput, string>>;

export function validateEvent(input: NewEventInput): FieldErrors {
  const e: FieldErrors = {};
  if (!input.title.trim()) e.title = "Ponle un título a tu evento.";
  if (!input.description.trim()) e.description = "Cuéntanos de qué va.";
  if (!input.communitySlug) e.communitySlug = "Elige la comunidad que organiza.";
  if (!input.submittedBy.trim()) e.submittedBy = "¿Quién lo propone?";
  const start = Date.parse(input.start);
  const end = Date.parse(input.end);
  if (Number.isNaN(start)) e.start = "Indica cuándo empieza.";
  if (Number.isNaN(end)) e.end = "Indica cuándo termina.";
  else if (!Number.isNaN(start) && end <= start) e.end = "El fin tiene que ser después del inicio.";
  if (!input.online && !input.venue.trim()) e.venue = "¿Dónde será? (o marca que es en línea)";
  try {
    const u = new URL(input.registrationUrl);
    if (!/^https?:$/.test(u.protocol)) throw new Error();
  } catch {
    e.registrationUrl = "Pega un link válido, que empiece con https://";
  }
  return e;
}

// Puebla usa UTC-6 todo el año desde 2022.
export const localToIso = (local: string) => (local ? `${local}:00-06:00` : "");
