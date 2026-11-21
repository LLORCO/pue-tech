"use client";

import Link from "next/link";
import { useStore } from "@/lib/useStore";
import { upcoming } from "@/lib/store";

export function CommunityList() {
  const { events, communities } = useStore();
  const now = new Date();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {communities.map((c) => {
        const n = upcoming(events, now, c.slug).length;
        return (
          <Link key={c.slug} href={`/comunidades/${c.slug}`} className="rounded-2xl border-2 border-cobalt/10 bg-white p-5 transition hover:border-cobalt hover:shadow-[4px_4px_0_var(--color-yellow)]">
            <p className="text-4xl">{c.emoji}</p>
            <h2 className="mt-2 font-display text-xl font-bold text-cobalt">{c.name}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-ink/70">{c.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {c.topics.map((t) => <span key={t} className="rounded-full bg-cream px-2 py-0.5 text-xs font-semibold text-cobalt">{t}</span>)}
            </div>
            <p className="mt-3 text-sm font-semibold">{n} {n === 1 ? "evento próximo" : "eventos próximos"}</p>
          </Link>
        );
      })}
    </div>
  );
}
