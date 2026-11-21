import type { EventStatus, NewEventInput, Subscription, TechEvent } from "./types";
import { seedEvents } from "./seed";
import { uniqueSlug } from "./slug";

export const STORAGE_KEY = "cemita:v1";

export type State = {
  added: TechEvent[];
  statusOverrides: Record<string, EventStatus>;
  subscriptions: Subscription[];
};

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

const empty = (): State => ({ added: [], statusOverrides: {}, subscriptions: [] });

export function loadState(storage: StorageLike | null | undefined): State {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const p = JSON.parse(raw);
    return {
      added: Array.isArray(p.added) ? p.added : [],
      statusOverrides: p.statusOverrides && typeof p.statusOverrides === "object" ? p.statusOverrides : {},
      subscriptions: Array.isArray(p.subscriptions) ? p.subscriptions : [],
    };
  } catch {
    return empty();
  }
}

function save(storage: StorageLike, state: State) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // almacenamiento lleno o bloqueado: la demo sigue con lo que hay en memoria
  }
}

export function getEvents(state: State): TechEvent[] {
  return [...seedEvents, ...state.added].map((e) =>
    state.statusOverrides[e.slug] ? { ...e, status: state.statusOverrides[e.slug] } : e,
  );
}

export function addEvent(storage: StorageLike, input: NewEventInput): TechEvent {
  const state = loadState(storage);
  const taken = getEvents(state).map((e) => e.slug);
  const ev: TechEvent = { ...input, slug: uniqueSlug(input.title, taken), status: "pendiente" };
  save(storage, { ...state, added: [...state.added, ev] });
  return ev;
}

export function setStatus(storage: StorageLike, slug: string, status: EventStatus) {
  const state = loadState(storage);
  save(storage, { ...state, statusOverrides: { ...state.statusOverrides, [slug]: status } });
}

export function addSubscription(storage: StorageLike, sub: Subscription) {
  const state = loadState(storage);
  const others = state.subscriptions.filter((s) => s.email !== sub.email);
  save(storage, { ...state, subscriptions: [...others, sub] });
}

export function getSubscriptions(state: State): Subscription[] {
  return state.subscriptions;
}

export function subscribersFor(state: State, communitySlug: string): Subscription[] {
  return state.subscriptions.filter((s) => s.communitySlugs === "todas" || s.communitySlugs.includes(communitySlug));
}

export function upcoming(events: TechEvent[], now: Date, communitySlug?: string): TechEvent[] {
  return events
    .filter((e) => e.status === "aprobado" && new Date(e.end) >= now)
    .filter((e) => !communitySlug || e.communitySlug === communitySlug)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}
