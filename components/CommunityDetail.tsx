"use client";

import Link from "next/link";
import { useStore } from "@/lib/useStore";
import { upcoming } from "@/lib/store";
import { EventCard } from "./EventCard";
import { EmptyState } from "./EmptyState";
import { TalaveraPattern } from "./TalaveraPattern";

export function CommunityDetail({ slug }: { slug: string }) {
  const { events, communities } = useStore();
  const c = communities.find((x) => x.slug === slug);
  if (!c) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-extrabold text-cobalt">Esta comunidad no está en el menú</h1>
        <Link href="/comunidades" className="mt-6 inline-block rounded-full bg-cobalt px-6 py-3 font-bold text-white">Ver comunidades</Link>
      </div>
    );
  }
  const list = upcoming(events, new Date(), c.slug);
  return (
    <>
      <header className="relative overflow-hidden bg-cobalt text-white">
        <TalaveraPattern className="absolute inset-0 text-white/10" />
        <div className="relative mx-auto max-w-5xl px-4 py-12">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{c.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/85">{c.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href={`/suscribete?comunidad=${c.slug}`} className="rounded-full bg-yellow px-6 py-2.5 font-bold text-cobalt-dark hover:bg-white">
              + Seguir comunidad
            </Link>
            {c.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-white/80 underline hover:text-yellow">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-5xl space-y-4 px-4 py-10">
        <h2 className="font-display text-2xl font-extrabold text-cobalt">Próximos eventos</h2>
        {list.length === 0 ? (
          <EmptyState text="Esta comunidad no tiene nada en el horno… todavía." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {list.map((e) => <EventCard key={e.slug} event={e} community={c} />)}
          </div>
        )}
      </section>
    </>
  );
}
