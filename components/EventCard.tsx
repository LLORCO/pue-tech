import Link from "next/link";
import type { Community, TechEvent } from "@/lib/types";
import { formatParts, formatTime } from "@/lib/format";

export function EventCard({ event, community }: { event: TechEvent; community?: Community }) {
  const { weekday: dow, day, month } = formatParts(event.start);
  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group flex gap-4 rounded-2xl border-2 border-cobalt/10 bg-white p-4 transition hover:-translate-y-0.5 hover:border-cobalt hover:shadow-[4px_4px_0_var(--color-yellow)]"
    >
      <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-cobalt py-2 text-white">
        <span className="text-xs uppercase text-yellow">{dow}</span>
        <span className="font-display text-2xl font-extrabold leading-none">{day}</span>
        <span className="text-xs uppercase">{month}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-lg font-bold leading-tight text-ink group-hover:text-cobalt">{event.title}</h3>
        <p className="mt-1 text-sm text-ink/70">
          {formatTime(event.start)} · {event.online ? "En línea" : event.venue}
        </p>
        {community && (
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-0.5 text-xs font-semibold text-cobalt">
            {community.name}
          </p>
        )}
      </div>
    </Link>
  );
}
