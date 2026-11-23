import Link from "next/link";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/panel/EventForm";
import { EventStatusActions } from "@/components/panel/EventStatusActions";
import { requireAdmin } from "@/lib/auth/session";
import { listCommunities } from "@/lib/data/communities";
import { getEventById } from "@/lib/data/events";
import { db } from "@/lib/db/client";
import { isoToLocalInput } from "@/lib/datetime";
import { ogUrl } from "@/lib/og";
import { updateEventAction } from "../actions";

const STATUS_LABEL = { borrador: "Borrador", publicado: "Publicado", cancelado: "Cancelado" } as const;

export default async function EditEventPage({ params }: PageProps<"/panel/eventos/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const event = await getEventById(db, id);
  if (!event) notFound();
  const communities = await listCommunities(db, new Date());
  const isPublic = event.status !== "borrador";
  const downloadCls = "text-sm font-medium text-vino hover:underline";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-tinta">Editar evento</h1>
        <p className="mt-1 text-sm text-tinta/70">
          Estado: {STATUS_LABEL[event.status]}
          {isPublic && (
            <>
              {" · "}
              <Link href={`/eventos/${event.slug}`} className="font-medium text-vino hover:underline">
                Ver en el sitio
              </Link>
            </>
          )}
        </p>
      </div>
      <EventStatusActions id={event.id} status={event.status} />
      <div className="flex gap-5">
        <a href={ogUrl(event, "post")} download={`${event.slug}-post.png`} className={downloadCls}>
          Post 1080×1080
        </a>
        <a href={ogUrl(event, "story")} download={`${event.slug}-story.png`} className={downloadCls}>
          Story 1080×1920
        </a>
      </div>
      <EventForm
        action={updateEventAction.bind(null, event.id)}
        communities={communities.map((c) => ({ id: c.id, name: c.name }))}
        submitLabel="Guardar cambios"
        initial={{
          title: event.title,
          description: event.description,
          communityId: event.communityId ?? "",
          startsAt: isoToLocalInput(event.startsAt),
          endsAt: isoToLocalInput(event.endsAt),
          venue: event.venue,
          online: event.online ? "on" : "",
          registrationUrl: event.registrationUrl ?? "",
          topics: event.topics.join(", "),
        }}
      />
    </div>
  );
}
