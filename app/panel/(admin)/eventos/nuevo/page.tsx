import { EventForm } from "@/components/panel/EventForm";
import { requireAdmin } from "@/lib/auth/session";
import { listCommunities } from "@/lib/data/communities";
import { db } from "@/lib/db/client";
import { createEventAction } from "../actions";

export default async function NewEventPage() {
  await requireAdmin();
  const communities = await listCommunities(db, new Date());

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-tinta">Nuevo evento</h1>
      <EventForm
        action={createEventAction}
        communities={communities.map((c) => ({ id: c.id, name: c.name }))}
        submitLabel="Crear evento"
      />
    </div>
  );
}
