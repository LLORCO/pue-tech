import type { Community, TechEvent } from "./types";
import { formatDate, formatTime } from "./format";

export type OgFormat = "post" | "story";

export function ogUrl(event: TechEvent, community: Community, format: OgFormat): string {
  const q = new URLSearchParams({
    format,
    title: event.title,
    date: formatDate(event.start),
    time: formatTime(event.start),
    venue: event.venue,
    community: community.name,
    emoji: community.emoji,
  });
  return `/api/og?${q.toString()}`;
}

export function clampTitle(title: string, max = 70): string {
  return title.length <= max ? title : `${title.slice(0, max - 1).trimEnd().padEnd(max - 1, " ")}…`;
}
