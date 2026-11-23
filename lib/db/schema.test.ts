import { describe, expect, it } from "vitest";
import { createTestDb } from "./test-db";
import { communities, events } from "./schema";

describe("esquema", () => {
  it("crea un evento sin comunidad ni registro y lo lee", async () => {
    const db = await createTestDb();
    const [e] = await db
      .insert(events)
      .values({
        slug: "x",
        title: "X",
        description: "d",
        startsAt: new Date("2026-12-04T18:00:00-06:00"),
        endsAt: new Date("2026-12-04T20:00:00-06:00"),
      })
      .returning();
    expect(e.status).toBe("borrador");
    expect(e.communityId).toBeNull();
    expect(e.registrationUrl).toBeNull();
  });

  it("rechaza slugs de comunidad repetidos", async () => {
    const db = await createTestDb();
    const c = { slug: "c", name: "C", description: "d" };
    await db.insert(communities).values(c);
    await expect(db.insert(communities).values(c)).rejects.toThrow();
  });
});
