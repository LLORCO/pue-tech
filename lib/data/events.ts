import { and, asc, desc, eq, gte, inArray, sql, type SQL } from "drizzle-orm";
import type { Db } from "../db/client";
import {
  communities,
  events,
  type Event,
  type EventStatus,
  type EventWithCommunity,
} from "../db/schema";
import { uniqueSlug } from "../slug";
import type { EventInput } from "../validation";

const selectWithCommunity = (db: Db) =>
  db
    .select({ event: events, community: communities })
    .from(events)
    .leftJoin(communities, eq(events.communityId, communities.id));

const flatten = (r: { event: Event; community: EventWithCommunity["community"] }): EventWithCommunity => ({
  ...r.event,
  community: r.community,
});

export async function listUpcoming(
  db: Db,
  opts: { now: Date; communitySlug?: string },
): Promise<EventWithCommunity[]> {
  const conds: SQL[] = [
    inArray(events.status, ["publicado", "cancelado"]),
    gte(events.endsAt, opts.now),
  ];
  if (opts.communitySlug) conds.push(eq(communities.slug, opts.communitySlug));
  const rows = await selectWithCommunity(db)
    .where(and(...conds))
    .orderBy(asc(events.startsAt));
  return rows.map(flatten);
}

export async function getPublicEventBySlug(db: Db, slug: string): Promise<EventWithCommunity | null> {
  const [row] = await selectWithCommunity(db)
    .where(and(eq(events.slug, slug), inArray(events.status, ["publicado", "cancelado"])))
    .limit(1);
  return row ? flatten(row) : null;
}

export async function listAllEvents(db: Db): Promise<EventWithCommunity[]> {
  const rows = await selectWithCommunity(db).orderBy(desc(events.startsAt));
  return rows.map(flatten);
}

export async function getEventById(db: Db, id: string): Promise<EventWithCommunity | null> {
  const [row] = await selectWithCommunity(db).where(eq(events.id, id)).limit(1);
  return row ? flatten(row) : null;
}

export async function createEvent(db: Db, input: EventInput): Promise<Event> {
  const taken = (await db.select({ slug: events.slug }).from(events)).map((r) => r.slug);
  const [row] = await db
    .insert(events)
    .values({ ...input, slug: uniqueSlug(input.title, taken), status: "borrador" })
    .returning();
  return row;
}

export async function updateEvent(db: Db, id: string, input: EventInput): Promise<Event> {
  const [row] = await db
    .update(events)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning();
  if (!row) throw new Error("Evento no encontrado");
  return row;
}

export async function setEventStatus(
  db: Db,
  id: string,
  status: EventStatus,
  now: Date,
): Promise<Event> {
  const [row] = await db
    .update(events)
    .set({
      status,
      updatedAt: now,
      ...(status === "publicado"
        ? { publishedAt: sql`coalesce(${events.publishedAt}, ${now.toISOString()}::timestamptz)` }
        : {}),
    })
    .where(eq(events.id, id))
    .returning();
  if (!row) throw new Error("Evento no encontrado");
  return row;
}
