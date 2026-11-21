"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/useStore";
import { formatLongDate, formatTime } from "@/lib/format";
import { toICS } from "@/lib/ics";
import { ogUrl } from "@/lib/og";
import { TalaveraPattern } from "./TalaveraPattern";

export function EventDetail({ slug }: { slug: string }) {
  const { events, communities } = useStore();
  const [copied, setCopied] = useState(false);
  const event = events.find((e) => e.slug === slug);
  const community = event && communities.find((c) => c.slug === event.communitySlug);

  if (!event || !community) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-5xl">🥪</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-cobalt">Este evento no existe o ya se lo comieron</h1>
        <Link href="/" className="mt-6 inline-block rounded-full bg-cobalt px-6 py-3 font-bold text-white">Ver todos los eventos</Link>
      </div>
    );
  }

  const downloadIcs = () => {
    const url = URL.createObjectURL(new Blob([toICS(event, community)], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.slug}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const copy = async () => {
    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const btn = "rounded-full border-2 border-cobalt px-4 py-2 text-sm font-bold text-cobalt hover:bg-cobalt hover:text-white";

  return (
    <article>
      <header className="relative overflow-hidden bg-cobalt text-white">
        <TalaveraPattern className="absolute inset-0 text-white/10" />
        <div className="relative mx-auto max-w-3xl px-4 py-12">
          {event.status !== "aprobado" && (
            <p className="mb-3 inline-block rounded-full bg-white px-3 py-1 text-xs font-bold uppercase text-cobalt">
              {event.status === "pendiente" ? "En revisión" : "Rechazado"}
            </p>
          )}
          <Link href={`/comunidades/${community.slug}`} className="text-sm font-semibold text-yellow hover:underline">
            {community.emoji} {community.name}
          </Link>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{event.title}</h1>
          <p className="mt-4 text-lg capitalize text-white/90">
            {formatLongDate(event.start)} · {formatTime(event.start)}–{formatTime(event.end)}
          </p>
          <p className="text-white/80">📍 {event.online ? "En línea" : event.venue}</p>
        </div>
      </header>
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <p className="text-lg leading-relaxed">{event.description}</p>
        <div className="flex flex-wrap gap-3">
          <a href={event.registrationUrl} target="_blank" rel="noreferrer" className="rounded-full bg-yellow px-6 py-2 font-bold text-cobalt-dark hover:brightness-95">
            Registrarme
          </a>
          <button onClick={downloadIcs} className={btn}>📅 Agregar a calendario</button>
          <button onClick={copy} className={btn}>{copied ? "¡Link copiado!" : "🔗 Copiar link"}</button>
        </div>
        <section className="rounded-2xl bg-white p-5">
          <h2 className="font-display text-xl font-bold text-cobalt">Compártelo en redes</h2>
          <p className="mt-1 text-sm text-ink/70">Imágenes listas para Instagram, con la identidad de Cemita.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={ogUrl(event, community, "post")} download={`${event.slug}-post.png`} className={btn}>Descargar post</a>
            <a href={ogUrl(event, community, "story")} download={`${event.slug}-story.png`} className={btn}>Descargar story</a>
          </div>
        </section>
      </div>
    </article>
  );
}
