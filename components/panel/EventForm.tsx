"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, inputCls } from "@/components/Field";
import type { FormState } from "./form-state";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

export function EventForm({
  action,
  initial,
  communities,
  submitLabel,
}: {
  action: Action;
  initial?: Record<string, string>;
  communities: { id: string; name: string }[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {} as FormState);
  const errors = state.errors ?? {};
  const values = state.values ?? initial ?? {};

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <Field label="Título" error={errors.title}>
        <input name="title" defaultValue={values.title ?? ""} className={inputCls} />
      </Field>
      <Field label="Descripción" error={errors.description}>
        <textarea name="description" rows={5} defaultValue={values.description ?? ""} className={inputCls} />
      </Field>
      <Field label="Comunidad" error={errors.communityId}>
        <select name="communityId" defaultValue={values.communityId ?? ""} className={inputCls}>
          <option value="">Independiente</option>
          {communities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Inicio (hora de Puebla)" error={errors.startsAt}>
          <input type="datetime-local" name="startsAt" defaultValue={values.startsAt ?? ""} className={inputCls} />
        </Field>
        <Field label="Fin (hora de Puebla)" error={errors.endsAt}>
          <input type="datetime-local" name="endsAt" defaultValue={values.endsAt ?? ""} className={inputCls} />
        </Field>
      </div>
      <Field label="Lugar" error={errors.venue}>
        <input name="venue" defaultValue={values.venue ?? ""} className={inputCls} />
      </Field>
      <label className="flex items-center gap-2 text-sm font-medium text-tinta">
        <input type="checkbox" name="online" defaultChecked={values.online === "on"} />
        En línea
      </label>
      <Field label="Enlace de registro (opcional)" error={errors.registrationUrl}>
        <input name="registrationUrl" defaultValue={values.registrationUrl ?? ""} className={inputCls} />
      </Field>
      <Field label="Temas (separados por coma)" error={errors.topics}>
        <input name="topics" defaultValue={values.topics ?? ""} className={inputCls} />
      </Field>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-vino px-5 py-2 text-sm font-medium text-blanco hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Guardando…" : submitLabel}
        </button>
        <Link href="/panel" className="text-sm text-tinta/70 hover:text-vino">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
