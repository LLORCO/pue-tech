"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import type { FormState } from "@/components/panel/form-state";
import { requireAdmin } from "@/lib/auth/session";
import { createEvent, getEventById, setEventStatus, updateEvent } from "@/lib/data/events";
import { db } from "@/lib/db/client";
import { eventStatus, type EventStatus } from "@/lib/db/schema";
import { parseEventForm } from "@/lib/validation";

const FIELDS = ["title", "description", "communityId", "startsAt", "endsAt", "venue", "registrationUrl", "topics"] as const;

function submittedValues(fd: FormData): Record<string, string> {
  const values = Object.fromEntries(
    FIELDS.map((k) => [k, typeof fd.get(k) === "string" ? (fd.get(k) as string) : ""]),
  );
  return { ...values, online: fd.get("online") === "on" ? "on" : "" };
}

export async function createEventAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const result = parseEventForm(fd);
  if (!result.ok) return { errors: result.errors, values: submittedValues(fd) };
  const event = await createEvent(db, result.data);
  revalidatePath("/", "layout");
  redirect(`/panel/eventos/${event.id}`);
}

export async function updateEventAction(id: string, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (!(await getEventById(db, id))) notFound();
  const result = parseEventForm(fd);
  if (!result.ok) return { errors: result.errors, values: submittedValues(fd) };
  await updateEvent(db, id, result.data);
  revalidatePath("/", "layout");
  redirect("/panel");
}

export async function setEventStatusAction(id: string, status: EventStatus): Promise<void> {
  await requireAdmin();
  // `status` llega del cliente: se valida contra los valores del enum.
  if (!eventStatus.enumValues.includes(status)) throw new Error("Estado no válido");
  if (!(await getEventById(db, id))) notFound();
  await setEventStatus(db, id, status, new Date());
  revalidatePath("/", "layout");
}
