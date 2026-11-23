import { CommunityForm } from "@/components/panel/CommunityForm";
import { requireAdmin } from "@/lib/auth/session";
import { createCommunityAction } from "../actions";

export default async function NewCommunityPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-tinta">Nueva comunidad</h1>
      <CommunityForm action={createCommunityAction} submitLabel="Crear comunidad" />
    </div>
  );
}
