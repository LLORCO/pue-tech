import type { EventStatus } from "@/lib/db/schema";

export function EventStatusBadge({ status }: { status: EventStatus }) {
  if (status !== "cancelado") return null;
  return (
    <span className="inline-block rounded-full border border-vino px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-vino">
      Cancelado
    </span>
  );
}
