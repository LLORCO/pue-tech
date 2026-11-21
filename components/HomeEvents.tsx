"use client";

import { useState } from "react";
import { useStore } from "@/lib/useStore";
import { upcoming } from "@/lib/store";
import { EventCard } from "./EventCard";
import { CommunityFilter } from "./CommunityFilter";
import { EmptyState } from "./EmptyState";

export function HomeEvents() {
  const { events, communities } = useStore();
  const [filter, setFilter] = useState<string | null>(null);
  const list = upcoming(events, new Date(), filter ?? undefined);
  return (
    <section className="mx-auto max-w-5xl space-y-5 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="font-display text-3xl font-extrabold text-cobalt">¿Qué hay de nuevo en el horno?</h2>
        <p className="text-sm text-ink/60">{list.length} eventos próximos</p>
      </div>
      <CommunityFilter communities={communities} value={filter} onChange={setFilter} />
      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((e) => (
            <EventCard key={e.slug} event={e} community={communities.find((c) => c.slug === e.communitySlug)} />
          ))}
        </div>
      )}
    </section>
  );
}
