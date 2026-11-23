import type { EventWithCommunity } from "./db/schema";
import { formatDate, formatTime } from "./format";

export type OgFormat = "post" | "story";

export function ogUrl(event: EventWithCommunity, format: OgFormat): string {
  const iso = event.startsAt.toISOString();
  const q = new URLSearchParams({
    format,
    title: event.title,
    date: formatDate(iso),
    time: formatTime(iso),
    venue: event.online ? "En línea" : event.venue,
    community: event.community?.name ?? "Independiente",
  });
  return `/api/og?${q.toString()}`;
}

export function clampTitle(title: string, max = 70): string {
  return title.length <= max ? title : `${title.slice(0, max - 1).trimEnd().padEnd(max - 1, " ")}…`;
}
