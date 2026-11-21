"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/useStore";
import { subscribersFor } from "@/lib/store";
import { formatDate, formatTime } from "@/lib/format";
import type { EventStatus } from "@/lib/types";
import { inputCls } from "@/components/Field";

const PASSWORD = "cemita2026";
const tabs: { key: EventStatus; label: string }[] = [
  { key: "pendiente", label: "Pendientes" },
  { key: "aprobado", label: "Aprobados" },
  { key: "rechazado", label: "Rechazados" },
];

export default function ModerarPage() {
  const { events, communities, state, setStatus } = useStore();
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<EventStatus>("pendiente");
  const [approved, setApproved] = useState<string | null>(null);

  useEffect(() => {
    // sessionStorage solo existe en el cliente; leerlo aquí evita un desajuste de hidratación.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (sessionStorage.getItem("cemita:mod") === "1") setAuthed(true);
  }, []);

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <h1 className="font-display text-3xl font-extrabold text-cobalt">Moderación</h1>
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (pw === PASSWORD) {
              sessionStorage.setItem("cemita:mod", "1");
              setAuthed(true);
            } else setError(true);
          }}
        >
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Contraseña" className={inputCls} />
          {error && <p className="text-sm font-semibold text-red-700">Contraseña incorrecta.</p>}
          <button className="w-full rounded-full bg-cobalt py-2 font-bold text-white">Entrar</button>
        </form>
      </div>
    );
  }

  const list = events.filter((e) => e.status === tab).sort((a, b) => a.start.localeCompare(b.start));
  const approvedEvent = approved ? events.find((e) => e.slug === approved) : null;
  const n = approvedEvent ? subscribersFor(state, approvedEvent.communitySlug).length : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold text-cobalt">Moderación</h1>
      <p className="mt-1 text-ink/70">Aquí decides qué entra a la cemita.</p>

      {approvedEvent && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-yellow/30 p-4">
          <p className="font-semibold text-cobalt-dark">
            ✅ “{approvedEvent.title}” publicado. Se avisaría a {n} {n === 1 ? "suscriptor" : "suscriptores"}.
          </p>
          <Link href={`/correo/${approvedEvent.slug}`} className="rounded-full bg-cobalt px-4 py-1.5 text-sm font-bold text-white">
            Ver el correo
          </Link>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${tab === t.key ? "bg-cobalt text-white" : "bg-white text-cobalt"}`}
          >
            {t.label} ({events.filter((e) => e.status === t.key).length})
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-3">
        {list.length === 0 && <li className="rounded-2xl bg-white p-6 text-center text-ink/60">Nada por aquí.</li>}
        {list.map((e) => {
          const c = communities.find((x) => x.slug === e.communitySlug);
          return (
            <li key={e.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4">
              <div className="min-w-0">
                <Link href={`/eventos/${e.slug}`} className="font-display text-lg font-bold text-ink hover:text-cobalt">{e.title}</Link>
                <p className="text-sm text-ink/70">
                  {c?.name} · {formatDate(e.start)} {formatTime(e.start)} · propuesto por {e.submittedBy}
                </p>
              </div>
              <div className="flex gap-2">
                {e.status !== "aprobado" && (
                  <button
                    onClick={() => {
                      setStatus(e.slug, "aprobado");
                      setApproved(e.slug);
                    }}
                    className="rounded-full bg-cobalt px-4 py-1.5 text-sm font-bold text-white"
                  >
                    Aprobar
                  </button>
                )}
                {e.status !== "rechazado" && (
                  <button onClick={() => setStatus(e.slug, "rechazado")} className="rounded-full border-2 border-red-700 px-4 py-1.5 text-sm font-bold text-red-700">
                    Rechazar
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
