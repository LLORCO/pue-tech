import { notFound } from "next/navigation";
import { CommunityForm } from "@/components/panel/CommunityForm";
import { requireAdmin } from "@/lib/auth/session";
import { getCommunityById } from "@/lib/data/communities";
import { db } from "@/lib/db/client";
import { updateCommunityAction } from "../actions";

export default async function EditCommunityPage({ params }: PageProps<"/panel/comunidades/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const community = await getCommunityById(db, id);
  if (!community) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-tinta">Editar comunidad</h1>
      <p className="mb-6 mt-1 text-sm text-tinta/70">Dirección pública: /comunidades/{community.slug}</p>
      <CommunityForm
        action={updateCommunityAction.bind(null, community.id)}
        submitLabel="Guardar cambios"
        initial={{
          name: community.name,
          description: community.description,
          topics: community.topics.join(", "),
          links: community.links.map((l) => `${l.label} | ${l.url}`).join("\n"),
        }}
      />
    </div>
  );
}
