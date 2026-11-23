import { beforeEach, describe, expect, it } from "vitest";
import { createTestDb } from "../db/test-db";
import type { Db } from "../db/client";
import type { EventInput } from "../validation";
import { createCommunity } from "./communities";
import {
  createEvent,
  getEventById,
  getPublicEventBySlug,
  listAllEvents,
  listUpcoming,
  setEventStatus,
  updateEvent,
} from "./events";

const now = new Date("2026-12-01T12:00:00-06:00");
const at = (iso: string) => new Date(iso);

function input(over: Partial<EventInput> = {}): EventInput {
  return {
    title: "Evento",
    description: "Descripción",
    communityId: null,
    startsAt: at("2026-12-10T18:00:00-06:00"),
    endsAt: at("2026-12-10T20:00:00-06:00"),
    venue: "Puebla",
    online: false,
    registrationUrl: null,
    topics: [],
    ...over,
  };
}

let db: Db;
beforeEach(async () => {
  db = await createTestDb();
});

describe("eventos", () => {
  it("listUpcoming muestra publicados y cancelados, no borradores ni terminados", async () => {
    const pub = await createEvent(db, input({ title: "Publicado", startsAt: at("2026-12-10T18:00:00-06:00") }));
    const can = await createEvent(db, input({ title: "Cancelado", startsAt: at("2026-12-11T18:00:00-06:00"), endsAt: at("2026-12-11T20:00:00-06:00") }));
    await createEvent(db, input({ title: "Borrador" }));
    const old = await createEvent(db, input({ title: "Terminado", startsAt: at("2026-11-01T18:00:00-06:00"), endsAt: at("2026-11-01T20:00:00-06:00") }));
    await setEventStatus(db, pub.id, "publicado", now);
    await setEventStatus(db, can.id, "cancelado", now);
    await setEventStatus(db, old.id, "publicado", now);
    expect((await listUpcoming(db, { now })).map((e) => e.title)).toEqual(["Publicado", "Cancelado"]);
  });

  it("getPublicEventBySlug devuelve null para borrador y para slug inexistente", async () => {
    const e = await createEvent(db, input({ title: "Secreto" }));
    expect(await getPublicEventBySlug(db, e.slug)).toBeNull();
    expect(await getPublicEventBySlug(db, "nope")).toBeNull();
    await setEventStatus(db, e.id, "publicado", now);
    expect((await getPublicEventBySlug(db, e.slug))?.title).toBe("Secreto");
  });

  it("slugs únicos: mismo título → '-2'; título sin letras → 'evento'", async () => {
    expect((await createEvent(db, input({ title: "Meetup IA" }))).slug).toBe("meetup-ia");
    expect((await createEvent(db, input({ title: "Meetup IA" }))).slug).toBe("meetup-ia-2");
    expect((await createEvent(db, input({ title: "🎉🎉" }))).slug).toBe("evento");
  });

  it("nace en borrador", async () => {
    expect((await createEvent(db, input())).status).toBe("borrador");
  });

  it("updateEvent no cambia el slug y actualiza updatedAt", async () => {
    const e = await createEvent(db, input({ title: "Original" }));
    const u = await updateEvent(db, e.id, input({ title: "Nuevo título" }));
    expect(u.slug).toBe("original");
    expect(u.title).toBe("Nuevo título");
    expect(u.updatedAt.getTime()).toBeGreaterThanOrEqual(e.updatedAt.getTime());
  });

  it("publicar dos veces conserva el primer publishedAt", async () => {
    const e = await createEvent(db, input());
    const first = await setEventStatus(db, e.id, "publicado", now);
    expect(first.publishedAt).toEqual(now);
    const later = new Date("2026-12-05T12:00:00-06:00");
    await setEventStatus(db, e.id, "borrador", later);
    const again = await setEventStatus(db, e.id, "publicado", later);
    expect(again.publishedAt).toEqual(now);
  });

  it("filtra por comunidad y trae community null para independientes", async () => {
    const c = await createCommunity(db, { name: "Popo Data", description: "d", topics: [], links: [] });
    const a = await createEvent(db, input({ title: "Con comunidad", communityId: c.id }));
    const b = await createEvent(db, input({ title: "Independiente", startsAt: at("2026-12-12T18:00:00-06:00"), endsAt: at("2026-12-12T20:00:00-06:00") }));
    await setEventStatus(db, a.id, "publicado", now);
    await setEventStatus(db, b.id, "publicado", now);
    const all = await listUpcoming(db, { now });
    expect(all.map((e) => e.community?.slug ?? null)).toEqual(["popo-data", null]);
    const filtered = await listUpcoming(db, { now, communitySlug: "popo-data" });
    expect(filtered.map((e) => e.title)).toEqual(["Con comunidad"]);
  });

  it("listAllEvents ordena por inicio descendente y getEventById trae borradores", async () => {
    const a = await createEvent(db, input({ title: "A", startsAt: at("2026-12-10T18:00:00-06:00") }));
    await createEvent(db, input({ title: "B", startsAt: at("2026-12-20T18:00:00-06:00"), endsAt: at("2026-12-20T20:00:00-06:00") }));
    expect((await listAllEvents(db)).map((e) => e.title)).toEqual(["B", "A"]);
    expect((await getEventById(db, a.id))?.title).toBe("A");
    expect(await getEventById(db, "00000000-0000-0000-0000-000000000000")).toBeNull();
  });
});
