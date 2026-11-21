"use client";

import { useCallback, useSyncExternalStore } from "react";
import * as s from "./store";
import { seedCommunities } from "./seed";
import type { EventStatus, NewEventInput, Subscription } from "./types";

const listeners = new Set<() => void>();
let snapshotRaw: string | null = null;
let snapshot: s.State = s.loadState(null);

function getStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

// Respaldo en memoria si localStorage no está disponible.
const memory = new Map<string, string>();
const fallback: s.StorageLike = { getItem: (k) => memory.get(k) ?? null, setItem: (k, v) => void memory.set(k, v) };
const storage = () => getStorage() ?? fallback;

function getSnapshot(): s.State {
  let raw: string | null = null;
  try {
    raw = storage().getItem(s.STORAGE_KEY);
  } catch {}
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    snapshot = s.loadState(storage());
  }
  return snapshot;
}

const serverSnapshot = s.loadState(null);

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === s.STORAGE_KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const emit = () => listeners.forEach((l) => l());

export function useStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
  const addEvent = useCallback((input: NewEventInput) => {
    const ev = s.addEvent(storage(), input);
    emit();
    return ev;
  }, []);
  const setStatus = useCallback((slug: string, status: EventStatus) => {
    s.setStatus(storage(), slug, status);
    emit();
  }, []);
  const addSubscription = useCallback((sub: Subscription) => {
    s.addSubscription(storage(), sub);
    emit();
  }, []);
  return {
    state,
    events: s.getEvents(state),
    communities: seedCommunities,
    subscriptions: state.subscriptions,
    addEvent,
    setStatus,
    addSubscription,
  };
}
