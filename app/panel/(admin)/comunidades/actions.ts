"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import type { FormState } from "@/components/panel/form-state";
import { requireAdmin } from "@/lib/auth/session";
import { createCommunity, getCommunityById, updateCommunity } from "@/lib/data/communities";
import { db } from "@/lib/db/client";
import { parseCommunityForm } from "@/lib/validation";

const FIELDS = ["name", "description", "topics", "links"] as const;

function submittedValues(fd: FormData): Record<string, string> {
  return Object.fromEntries(FIELDS.map((k) => [k, typeof fd.get(k) === "string" ? (fd.get(k) as string) : ""]));
}

export async function createCommunityAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const result = parseCommunityForm(fd);
  if (!result.ok) return { errors: result.errors, values: submittedValues(fd) };
  await createCommunity(db, result.data);
  revalidatePath("/", "layout");
  redirect("/panel/comunidades");
}

export async function updateCommunityAction(id: string, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (!(await getCommunityById(db, id))) notFound();
  const result = parseCommunityForm(fd);
  if (!result.ok) return { errors: result.errors, values: submittedValues(fd) };
  await updateCommunity(db, id, result.data);
  revalidatePath("/", "layout");
  redirect("/panel/comunidades");
}
