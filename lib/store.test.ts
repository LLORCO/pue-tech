import { describe, it, expect, beforeEach } from "vitest";
import { loadState, getEvents, addEvent, setStatus, addSubscription, subscribersFor, upcoming } from "./store";
import { seedEvents } from "./seed";

function memStorage(init: Record<string, string> = {}) {
  const m = new Map(Object.entries(init));
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
  };
}

const input = {
  title: "Meetup de prueba",
  description: "desc",
  communitySlug: "mole-y-codigo",
  start: "2026-12-01T18:00:00-06:00",
  end: "2026-12-01T20:00:00-06:00",
  venue: "Centro",
  online: false,
  registrationUrl: "https://example.com",
  topics: [],
  submittedBy: "Ana",
};

describe("store", () => {
  let s: ReturnType<typeof memStorage>;
  beforeEach(() => (s = memStorage()));

  it("loadState con basura devuelve estado vacío sin lanzar", () => {
    const st = loadState(memStorage({ "cemita:v1": "{basura" }));
    expect(st).toEqual({ added: [], statusOverrides: {}, subscriptions: [] });
  });

  it("getEvents combina seed + agregados y aplica overrides", () => {
    const ev = addEvent(s, input);
    setStatus(s, seedEvents[0].slug, "rechazado");
    const all = getEvents(loadState(s));
    expect(all.length).toBe(seedEvents.length + 1);
    expect(all.find((e) => e.slug === ev.slug)).toBeTruthy();
    expect(all.find((e) => e.slug === seedEvents[0].slug)!.status).toBe("rechazado");
  });

  it("addEvent entra como pendiente con slug único", () => {
    const a = addEvent(s, input);
    const b = addEvent(s, input);
    expect(a.status).toBe("pendiente");
    expect(a.slug).not.toBe(b.slug);
  });

  it("aprobar hace que aparezca en upcoming; pendientes, rechazados y pasados no", () => {
    const now = new Date("2026-11-20T12:00:00-06:00");
    const a = addEvent(s, input);
    expect(upcoming(getEvents(loadState(s)), now).some((e) => e.slug === a.slug)).toBe(false);
    setStatus(s, a.slug, "aprobado");
    const list = upcoming(getEvents(loadState(s)), now);
    expect(list.some((e) => e.slug === a.slug)).toBe(true);
    expect(list.every((e) => e.status === "aprobado")).toBe(true);
    const later = upcoming(getEvents(loadState(s)), new Date("2027-06-01T00:00:00Z"));
    expect(later).toEqual([]);
    const sorted = [...list].sort((x, y) => x.start.localeCompare(y.start));
    expect(list.map((e) => e.slug)).toEqual(sorted.map((e) => e.slug));
  });

  it("upcoming filtra por comunidad", () => {
    const now = new Date("2026-11-20T12:00:00-06:00");
    const list = upcoming(getEvents(loadState(s)), now, "mole-y-codigo");
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((e) => e.communitySlug === "mole-y-codigo")).toBe(true);
  });

  it("subscribersFor incluye 'todas' y las que siguen la comunidad", () => {
    addSubscription(s, { email: "a@x.mx", communitySlugs: "todas", createdAt: "" });
    addSubscription(s, { email: "b@x.mx", communitySlugs: ["x"], createdAt: "" });
    addSubscription(s, { email: "c@x.mx", communitySlugs: ["y"], createdAt: "" });
    expect(subscribersFor(loadState(s), "x").map((x) => x.email)).toEqual(["a@x.mx", "b@x.mx"]);
  });
});
