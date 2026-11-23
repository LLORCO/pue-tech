import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { EventCard } from "@/components/EventCard";
import { db } from "@/lib/db/client";
import { getCommunityBySlug } from "@/lib/data/communities";
import { listUpcoming } from "@/lib/data/events";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/comunidades/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const community = await getCommunityBySlug(db, slug);
  if (!community) return { title: "Comunidad no encontrada" };
  return { title: community.name, description: community.description.slice(0, 160) };
}

export default async function CommunityPage({ params }: PageProps<"/comunidades/[slug]">) {
  const { slug } = await params;
  const community = await getCommunityBySlug(db, slug);
  if (!community) notFound();
  const events = await listUpcoming(db, { now: new Date(), communitySlug: community.slug });
  return (
    <>
      <header className="mx-auto max-w-5xl px-4 pb-6 pt-12 sm:pt-16">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">{community.name}</h1>
        <p className="mt-3 max-w-2xl text-lg text-tinta/70">{community.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href={`/suscribete?comunidad=${community.slug}`}
            className="rounded-full bg-vino px-6 py-2.5 font-medium text-blanco hover:bg-vino/90"
          >
            Seguir
          </Link>
          {community.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="text-sm text-tinta/70 underline hover:text-vino">
              {l.label}
            </a>
          ))}
        </div>
      </header>
      <section className="mx-auto max-w-5xl space-y-4 px-4 pb-16 pt-6">
        <h2 className="font-display text-2xl font-semibold">Próximos eventos</h2>
        {events.length === 0 ? (
          <EmptyState text="Esta comunidad no tiene eventos próximos." />
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
