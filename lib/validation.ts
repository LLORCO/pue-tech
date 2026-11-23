import { z } from "zod";
import { localToIso } from "./datetime";

const httpUrl = (msg: string) =>
  z.string().refine((s) => {
    try {
      return /^https?:$/.test(new URL(s).protocol);
    } catch {
      return false;
    }
  }, msg);

const dateField = (msg: string) => z.date({ error: msg });

export const eventInputSchema = z
  .object({
    title: z.string().trim().min(1, "Ponle un título al evento.").max(120, "El título puede tener hasta 120 caracteres."),
    description: z.string().trim().min(1, "Cuéntanos de qué trata el evento."),
    communityId: z.string().nullable(),
    startsAt: dateField("Indica cuándo empieza."),
    endsAt: dateField("Indica cuándo termina."),
    venue: z.string().trim(),
    online: z.boolean(),
    registrationUrl: httpUrl("Escribe un link válido que empiece con http:// o https://.").nullable(),
    topics: z.array(z.string()),
  })
  .superRefine((v, ctx) => {
    if (v.startsAt instanceof Date && v.endsAt instanceof Date && v.endsAt <= v.startsAt) {
      ctx.addIssue({ code: "custom", path: ["endsAt"], message: "El fin debe ser posterior al inicio." });
    }
    if (!v.online && !v.venue) {
      ctx.addIssue({ code: "custom", path: ["venue"], message: "Indica el lugar o marca el evento como en línea." });
    }
  });

export const communityInputSchema = z.object({
  name: z.string().trim().min(1, "Escribe el nombre de la comunidad."),
  description: z.string().trim().min(1, "Cuéntanos de qué trata la comunidad."),
  topics: z.array(z.string()),
  links: z.array(
    z.object({
      label: z.string().trim().min(1, "Cada link necesita una etiqueta."),
      url: httpUrl("Cada link debe empezar con http:// o https://."),
    }),
  ),
});

export type EventInput = z.infer<typeof eventInputSchema>;
export type CommunityInput = z.infer<typeof communityInputSchema>;
export type FormResult<T> = { ok: true; data: T } | { ok: false; errors: Record<string, string> };

const str = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
};

const parseTopics = (text: string) => [...new Set(text.split(",").map((t) => t.trim()).filter(Boolean))];

const parseDate = (local: string) => new Date(local ? localToIso(local) : NaN);

function run<T>(schema: z.ZodType<T>, raw: unknown): FormResult<T> {
  const r = schema.safeParse(raw);
  if (r.success) return { ok: true, data: r.data };
  const errors: Record<string, string> = {};
  for (const issue of r.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return { ok: false, errors };
}

export function parseEventForm(fd: FormData): FormResult<EventInput> {
  return run(eventInputSchema, {
    title: str(fd, "title"),
    description: str(fd, "description"),
    communityId: str(fd, "communityId") || null,
    startsAt: parseDate(str(fd, "startsAt")),
    endsAt: parseDate(str(fd, "endsAt")),
    venue: str(fd, "venue"),
    online: fd.get("online") === "on",
    registrationUrl: str(fd, "registrationUrl") || null,
    topics: parseTopics(str(fd, "topics")),
  });
}

export function parseCommunityForm(fd: FormData): FormResult<CommunityInput> {
  const links = str(fd, "links")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf("|");
      return i === -1 ? { label: "", url: line } : { label: line.slice(0, i).trim(), url: line.slice(i + 1).trim() };
    });
  return run(communityInputSchema, {
    name: str(fd, "name"),
    description: str(fd, "description"),
    topics: parseTopics(str(fd, "topics")),
    links,
  });
}
