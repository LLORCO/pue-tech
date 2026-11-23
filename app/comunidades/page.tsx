import Link from "next/link";
import { db } from "@/lib/db/client";
import { listCommunities } from "@/lib/data/communities";

export const dynamic = "force-dynamic";
export const metadata = { title: "Comunidades" };

export default async function ComunidadesPage() {
  const communities = await listCommunities(db, new Date());
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Comunidades</h1>
      <p className="mb-8 mt-2 text-tinta/70">Las comunidades tech que hacen que Puebla se mueva.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {communities.map((c) => (
          <Link
            key={c.id}
            href={`/comunidades/${c.slug}`}
            className="rounded-xl border border-arena bg-white p-5 transition hover:border-tinta/30"
          >
            <h2 className="font-display text-xl font-semibold">{c.name}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-tinta/70">{c.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {c.topics.map((t) => (
                <span key={t} className="rounded-full bg-arena/60 px-2 py-0.5 text-xs text-tinta/80">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm font-medium text-vino">
              {c.upcomingCount} {c.upcomingCount === 1 ? "evento próximo" : "eventos próximos"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
