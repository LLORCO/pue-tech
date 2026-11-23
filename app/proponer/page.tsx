"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/useStore";
import { validateEvent, type FieldErrors } from "@/lib/validate";
import { localToIso } from "@/lib/datetime";
import type { TechEvent } from "@/lib/types";
import { Field, inputCls } from "@/components/Field";

export default function ProponerPage() {
  const { communities, addEvent } = useStore();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState<TechEvent | null>(null);
  const [online, setOnline] = useState(false);

  const submit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    const input = {
      title: get("title"),
      description: get("description"),
      communitySlug: get("communitySlug"),
      start: localToIso(get("start")),
      end: localToIso(get("end")),
      venue: online ? "En línea" : get("venue"),
      online,
      registrationUrl: get("registrationUrl"),
      topics: [],
      submittedBy: get("submittedBy"),
    };
    const errs = validateEvent(input);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSent(addEvent(input));
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-5xl">🔥</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-cobalt">¡Listo! Tu evento está en revisión.</h1>
        <p className="mt-2 text-ink/70">
          Moderación revisa cada evento antes de publicarlo, para que Cemita no se llene de ruido. Te avisamos pronto.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href={`/eventos/${sent.slug}`} className="rounded-full bg-cobalt px-5 py-2 font-bold text-white">Ver cómo quedó</Link>
          <button onClick={() => setSent(null)} className="rounded-full border-2 border-cobalt px-5 py-2 font-bold text-cobalt">Proponer otro</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold text-cobalt">Propón un evento</h1>
      <p className="mt-2 text-ink/70">¿Organizas algo tech en Puebla? Mándalo y, en cuanto lo revisemos, sale en el horno.</p>
      <form onSubmit={submit} noValidate className="mt-8 space-y-4 rounded-2xl bg-white p-6">
        <Field label="Título" error={errors.title}><input name="title" className={inputCls} /></Field>
        <Field label="Descripción" error={errors.description}><textarea name="description" rows={4} className={inputCls} /></Field>
        <Field label="Comunidad" error={errors.communitySlug}>
          <select name="communitySlug" defaultValue="" className={inputCls}>
            <option value="" disabled>Elige una…</option>
            {communities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Empieza" error={errors.start}><input type="datetime-local" name="start" className={inputCls} /></Field>
          <Field label="Termina" error={errors.end}><input type="datetime-local" name="end" className={inputCls} /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-cobalt">
          <input type="checkbox" checked={online} onChange={(e) => setOnline(e.target.checked)} /> Es en línea
        </label>
        {!online && <Field label="Lugar" error={errors.venue}><input name="venue" className={inputCls} /></Field>}
        <Field label="Link de registro" error={errors.registrationUrl}><input name="registrationUrl" placeholder="https://" className={inputCls} /></Field>
        <Field label="Tu nombre y contacto" error={errors.submittedBy}><input name="submittedBy" className={inputCls} /></Field>
        <button className="w-full rounded-full bg-yellow py-3 font-bold text-cobalt-dark hover:brightness-95">Mandar a revisión</button>
      </form>
    </div>
  );
}
