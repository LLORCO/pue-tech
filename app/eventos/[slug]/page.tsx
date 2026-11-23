import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import { db } from "@/lib/db/client";
import { getPublicEventBySlug } from "@/lib/data/events";
import { formatLongDate, formatTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/eventos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(db, slug);
  if (!event) return { title: "Evento no encontrado" };
  return { title: event.title, description: event.description.slice(0, 160) };
}

export default async function EventPage({ params }: PageProps<"/eventos/[slug]">) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(db, slug);
  if (!event) notFound();

  const start = event.startsAt.toISOString();
  const end = event.endsAt.toISOString();
  const btn = "rounded-full border border-arena px-5 py-2 text-sm font-medium hover:border-tinta/40";

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {event.community ? (
          <Link href={`/comunidades/${event.community.slug}`} className="font-medium text-tinta/80 hover:underline">
            {event.community.name}
          </Link>
        ) : (
          <span className="font-medium text-tinta/80">Independiente</span>
        )}
        <EventStatusBadge status={event.status} />
      </div>
      <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">{event.title}</h1>
      <p className="mt-5 text-lg font-medium text-vino">
        {formatLongDate(start)} · {formatTime(start)}–{formatTime(end)}
      </p>
      <p className="mt-1 text-tinta/70">{event.online ? "En línea" : event.venue}</p>
      <p className="mt-8 whitespace-pre-line text-lg leading-relaxed">{event.description}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        {event.registrationUrl && event.status !== "cancelado" && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-vino px-6 py-2 font-medium text-blanco hover:bg-vino/90"
          >
            Registrarme
          </a>
        )}
        <a href={`/eventos/${event.slug}/ics`} className={btn}>
          Agregar a calendario
        </a>
        <CopyLinkButton className={btn} />
      </div>
    </article>
  );
}
