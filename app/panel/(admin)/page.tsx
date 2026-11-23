import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { listAllEvents } from "@/lib/data/events";
import { db } from "@/lib/db/client";
import { formatDate, formatTime } from "@/lib/format";

const STATUS_LABEL = { borrador: "Borrador", publicado: "Publicado", cancelado: "Cancelado" } as const;

export default async function PanelPage() {
  await requireAdmin();
  const events = await listAllEvents(db);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-tinta">Eventos</h1>
        <Link
          href="/panel/eventos/nuevo"
          className="rounded-full bg-vino px-4 py-1.5 text-sm font-medium text-blanco hover:opacity-90"
        >
          Nuevo evento
        </Link>
      </div>
      {events.length === 0 ? (
        <p className="mt-6 text-tinta/70">Todavía no hay eventos.</p>
      ) : (
        <ul className="mt-6 divide-y divide-arena border-y border-arena">
          {events.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="font-medium text-tinta">{e.title}</p>
                <p className="text-sm text-tinta/70">
                  {formatDate(e.startsAt.toISOString())} · {formatTime(e.startsAt.toISOString())} ·{" "}
                  {e.community?.name ?? "Independiente"} · {STATUS_LABEL[e.status]}
                </p>
              </div>
              <Link href={`/panel/eventos/${e.id}`} className="text-sm font-medium text-vino hover:underline">
                Editar
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
