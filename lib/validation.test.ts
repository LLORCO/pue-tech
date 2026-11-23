import { it, expect } from "vitest";
import { parseEventForm, parseCommunityForm } from "./validation";

const fd = (obj: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.set(k, v);
  return f;
};

const base = {
  title: "A",
  description: "d",
  communityId: "",
  startsAt: "2026-12-04T18:00",
  endsAt: "2026-12-04T20:00",
  venue: "Centro",
  registrationUrl: "",
  topics: "IA, Web, IA,",
};

it("registro vacío y comunidad vacía se vuelven null", () => {
  const r = parseEventForm(fd(base));
  expect(r).toMatchObject({ ok: true, data: { communityId: null, registrationUrl: null, topics: ["IA", "Web"], online: false } });
});

it("online se activa con 'on'", () => {
  const r = parseEventForm(fd({ ...base, venue: "", online: "on" }));
  expect(r).toMatchObject({ ok: true, data: { online: true } });
});

it("rechaza fin antes del inicio, link no http y lugar vacío sin 'en línea'", () => {
  const r = parseEventForm(
    fd({ ...base, endsAt: "2026-12-04T17:00", registrationUrl: "ftp://x.com", venue: " " }),
  );
  expect(r.ok).toBe(false);
  if (!r.ok) {
    expect(r.errors.endsAt).toBeTruthy();
    expect(r.errors.registrationUrl).toBeTruthy();
    expect(r.errors.venue).toBeTruthy();
  }
});

it("exige título, descripción y fechas; título máximo 120", () => {
  const r = parseEventForm(fd({ ...base, title: "", description: "", startsAt: "", endsAt: "" }));
  expect(r.ok).toBe(false);
  if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["description", "endsAt", "startsAt", "title"]);
  const long = parseEventForm(fd({ ...base, title: "x".repeat(121) }));
  expect(long.ok).toBe(false);
});

it("interpreta las fechas en hora de Puebla", () => {
  const r = parseEventForm(fd(base));
  if (!r.ok) throw new Error("debía ser válido");
  expect(r.data.startsAt.toISOString()).toBe("2026-12-05T00:00:00.000Z");
});

it("parsea links 'Etiqueta | url' y rechaza una url inválida", () => {
  const ok = parseCommunityForm(
    fd({ name: "C", description: "d", topics: "IA", links: "Sitio | https://c.mx\n\nTelegram | http://t.me/c" }),
  );
  expect(ok).toMatchObject({
    ok: true,
    data: { links: [{ label: "Sitio", url: "https://c.mx" }, { label: "Telegram", url: "http://t.me/c" }] },
  });
  const bad = parseCommunityForm(fd({ name: "C", description: "d", topics: "", links: "Sitio | nada" }));
  expect(bad.ok).toBe(false);
  if (!bad.ok) expect(bad.errors.links).toBeTruthy();
  const noSep = parseCommunityForm(fd({ name: "C", description: "d", topics: "", links: "https://c.mx" }));
  expect(noSep.ok).toBe(false);
});

it("comunidad exige nombre y descripción", () => {
  const r = parseCommunityForm(fd({ name: "", description: "", topics: "", links: "" }));
  expect(r.ok).toBe(false);
  if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["description", "name"]);
});
