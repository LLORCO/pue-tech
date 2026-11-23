import Link from "next/link";
import type { EventWithCommunity } from "@/lib/db/schema";
import { formatParts, formatTime } from "@/lib/format";
import { EventStatusBadge } from "./EventStatusBadge";

export function EventCard({ event }: { event: EventWithCommunity }) {
  const start = event.startsAt.toISOString();
  const { weekday, day, month } = formatParts(start);
  const cancelled = event.status === "cancelado";
  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group flex gap-5 rounded-xl border border-arena bg-white p-5 transition hover:border-tinta/30"
    >
      <div className="flex w-14 shrink-0 flex-col items-center text-vino">
        <span className="text-xs uppercase tracking-wide">{weekday}</span>
        <span className="font-display text-3xl font-bold leading-none">{day}</span>
        <span className="text-xs uppercase tracking-wide">{month}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className={`font-display text-lg font-semibold leading-tight text-tinta group-hover:underline ${cancelled ? "line-through decoration-1" : ""}`}>
          {event.title}
        </h3>
        <p className="mt-1 text-sm text-tinta/70">
          {formatTime(start)} · {event.online ? "En línea" : event.venue}
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-tinta/60">
          <span>{event.community?.name ?? "Independiente"}</span>
          <EventStatusBadge status={event.status} />
        </p>
      </div>
    </Link>
  );
}
