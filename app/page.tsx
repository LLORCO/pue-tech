import Link from "next/link";
import { CommunityFilter } from "@/components/CommunityFilter";
import { EmptyState } from "@/components/EmptyState";
import { EventCard } from "@/components/EventCard";
import { db } from "@/lib/db/client";
import { listCommunities } from "@/lib/data/communities";
import { listUpcoming } from "@/lib/data/events";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { comunidad } = await searchParams;
  const active = typeof comunidad === "string" && comunidad ? comunidad : null;
  const now = new Date();
  const [events, communities] = await Promise.all([
    listUpcoming(db, { now, communitySlug: active ?? undefined }),
    listCommunities(db, now),
  ]);
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-10 pt-16 sm:pt-24">
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.08] text-tinta sm:text-6xl">
          Lo mejor de la tecnología en Puebla, en un solo lugar.
        </h1>
        <p className="mt-4 text-lg text-tinta/70">Curado cada semana.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/suscribete" className="rounded-full bg-vino px-6 py-3 font-medium text-blanco hover:bg-vino/90">
            Suscríbete
          </Link>
          <Link href="/proponer" className="rounded-full border border-arena px-6 py-3 font-medium hover:border-tinta/40">
            Propón un evento
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-5xl space-y-6 px-4 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-2xl font-semibold">Próximos eventos</h2>
          <p className="text-sm text-tinta/60">
            {events.length} {events.length === 1 ? "evento" : "eventos"}
          </p>
        </div>
        <CommunityFilter communities={communities} active={active} />
        {events.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
