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
