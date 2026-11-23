import { count } from "drizzle-orm";
import { createCommunity } from "../lib/data/communities";
import { createEvent, setEventStatus } from "../lib/data/events";
import { db } from "../lib/db/client";
import { communities } from "../lib/db/schema";
import { devCommunities, devEvents } from "../lib/seed";
import { assertSeedTarget } from "../lib/seed-guard";

async function main() {
  // Antes de conectar: solo bases locales, nunca una remota por accidente.
  assertSeedTarget({
    DATABASE_URL: process.env.DATABASE_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    SEED_ALLOW_REMOTE: process.env.SEED_ALLOW_REMOTE,
  });
  const [{ n }] = await db.select({ n: count() }).from(communities);
  if (n > 0) {
    throw new Error("Ya hay comunidades en la base; el seed solo corre sobre una base vacía.");
  }

  const idBySlug = new Map<string, string>();
  for (const { slug, ...input } of devCommunities) {
    idBySlug.set(slug, (await createCommunity(db, input)).id);
  }

  const now = new Date();
  for (const { communitySlug, status, ...rest } of devEvents) {
    const communityId = communitySlug ? idBySlug.get(communitySlug) ?? null : null;
    const e = await createEvent(db, { ...rest, communityId });
    await setEventStatus(db, e.id, status, now);
  }
  console.log(`Seed listo: ${devCommunities.length} comunidades, ${devEvents.length} eventos.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
