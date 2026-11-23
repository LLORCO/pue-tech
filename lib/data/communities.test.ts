import { beforeEach, describe, expect, it } from "vitest";
import { createTestDb } from "../db/test-db";
import type { Db } from "../db/client";
import {
  createCommunity,
  getCommunityById,
  getCommunityBySlug,
  listCommunities,
  updateCommunity,
} from "./communities";
import { createEvent, setEventStatus } from "./events";

const now = new Date("2026-12-01T12:00:00-06:00");
const base = { description: "d", topics: [], links: [] };

let db: Db;
beforeEach(async () => {
  db = await createTestDb();
});

describe("comunidades", () => {
  it("crea con slug único y lo conserva al actualizar", async () => {
    const a = await createCommunity(db, { ...base, name: "Popo Data" });
    const b = await createCommunity(db, { ...base, name: "Popo Data" });
    expect([a.slug, b.slug]).toEqual(["popo-data", "popo-data-2"]);
    const u = await updateCommunity(db, a.id, { ...base, name: "Otro nombre" });
    expect(u.slug).toBe("popo-data");
    expect(u.name).toBe("Otro nombre");
    expect((await getCommunityBySlug(db, "popo-data"))?.id).toBe(a.id);
    expect((await getCommunityById(db, a.id))?.name).toBe("Otro nombre");
    expect(await getCommunityBySlug(db, "nope")).toBeNull();
  });

  it("listCommunities ordena por nombre y cuenta solo eventos públicos próximos", async () => {
    await createCommunity(db, { ...base, name: "Zeta" });
    const a = await createCommunity(db, { ...base, name: "Alfa" });
    const ev = (title: string, day: number, communityId: string) => ({
      title, description: "d", communityId, venue: "x", online: false, registrationUrl: null, topics: [],
      startsAt: new Date(`2026-12-${day}T18:00:00-06:00`),
      endsAt: new Date(`2026-12-${day}T20:00:00-06:00`),
    });
    const futuro = await createEvent(db, ev("Futuro", 10, a.id));
    const cancelado = await createEvent(db, ev("Cancelado", 11, a.id));
    await createEvent(db, ev("Borrador", 12, a.id));
    const pasado = await createEvent(db, { ...ev("Pasado", 1, a.id), startsAt: new Date("2026-11-01T18:00:00-06:00"), endsAt: new Date("2026-11-01T20:00:00-06:00") });
    for (const e of [futuro, pasado]) await setEventStatus(db, e.id, "publicado", now);
    await setEventStatus(db, cancelado.id, "cancelado", now);
    const list = await listCommunities(db, now);
    expect(list.map((c) => [c.name, c.upcomingCount])).toEqual([["Alfa", 2], ["Zeta", 0]]);
  });
});
