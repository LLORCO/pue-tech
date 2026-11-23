import { and, asc, eq, gte, inArray, sql } from "drizzle-orm";
import type { Db } from "../db/client";
import { communities, events, type Community } from "../db/schema";
import { uniqueSlug } from "../slug";
import type { CommunityInput } from "../validation";

export async function listCommunities(
  db: Db,
  now: Date,
): Promise<(Community & { upcomingCount: number })[]> {
  const rows = await db
    .select({
      community: communities,
      upcomingCount: sql<number>`count(${events.id})::int`,
    })
    .from(communities)
    .leftJoin(
      events,
      and(
        eq(events.communityId, communities.id),
        inArray(events.status, ["publicado", "cancelado"]),
        gte(events.endsAt, now),
      ),
    )
    .groupBy(communities.id)
    .orderBy(asc(communities.name));
  return rows.map((r) => ({ ...r.community, upcomingCount: r.upcomingCount }));
}

export async function getCommunityBySlug(db: Db, slug: string): Promise<Community | null> {
  const [row] = await db.select().from(communities).where(eq(communities.slug, slug)).limit(1);
  return row ?? null;
}

export async function getCommunityById(db: Db, id: string): Promise<Community | null> {
  const [row] = await db.select().from(communities).where(eq(communities.id, id)).limit(1);
  return row ?? null;
}

export async function createCommunity(db: Db, input: CommunityInput): Promise<Community> {
  const taken = (await db.select({ slug: communities.slug }).from(communities)).map((r) => r.slug);
  const [row] = await db
    .insert(communities)
    .values({ ...input, slug: uniqueSlug(input.name, taken) })
    .returning();
  return row;
}

export async function updateCommunity(db: Db, id: string, input: CommunityInput): Promise<Community> {
  const [row] = await db
    .update(communities)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(communities.id, id))
    .returning();
  if (!row) throw new Error("Comunidad no encontrada");
  return row;
}
