"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, inputCls } from "@/components/Field";
import type { FormState } from "./form-state";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

export function CommunityForm({
  action,
  initial,
  submitLabel,
}: {
  action: Action;
  initial?: Record<string, string>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {} as FormState);
  const errors = state.errors ?? {};
  const values = state.values ?? initial ?? {};

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <Field label="Nombre" error={errors.name}>
        <input name="name" defaultValue={values.name ?? ""} className={inputCls} />
      </Field>
      <Field label="Descripción" error={errors.description}>
        <textarea name="description" rows={5} defaultValue={values.description ?? ""} className={inputCls} />
      </Field>
      <Field label="Temas (separados por coma)" error={errors.topics}>
        <input name="topics" defaultValue={values.topics ?? ""} className={inputCls} />
      </Field>
      <Field label="Enlaces (uno por línea: Etiqueta | https://url)" error={errors.links}>
        <textarea name="links" rows={4} defaultValue={values.links ?? ""} className={inputCls} />
      </Field>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-vino px-5 py-2 text-sm font-medium text-blanco hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Guardando…" : submitLabel}
        </button>
        <Link href="/panel/comunidades" className="text-sm text-tinta/70 hover:text-vino">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
