import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { listCommunities } from "@/lib/data/communities";
import { db } from "@/lib/db/client";

export default async function CommunitiesPage() {
  await requireAdmin();
  const communities = await listCommunities(db, new Date());

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-tinta">Comunidades</h1>
        <Link
          href="/panel/comunidades/nueva"
          className="rounded-full bg-vino px-4 py-1.5 text-sm font-medium text-blanco hover:opacity-90"
        >
          Nueva comunidad
        </Link>
      </div>
      {communities.length === 0 ? (
        <p className="mt-6 text-tinta/70">Todavía no hay comunidades.</p>
      ) : (
        <ul className="mt-6 divide-y divide-arena border-y border-arena">
          {communities.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="font-medium text-tinta">{c.name}</p>
                <p className="text-sm text-tinta/70">
                  {c.upcomingCount === 1 ? "1 evento próximo" : `${c.upcomingCount} eventos próximos`}
                </p>
              </div>
              <Link href={`/panel/comunidades/${c.id}`} className="text-sm font-medium text-vino hover:underline">
                Editar
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
