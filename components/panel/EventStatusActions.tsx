import { setEventStatusAction } from "@/app/panel/(admin)/eventos/actions";
import type { EventStatus } from "@/lib/db/schema";

const OPTIONS: Record<EventStatus, { status: EventStatus; label: string; primary?: boolean }[]> = {
  borrador: [{ status: "publicado", label: "Publicar", primary: true }],
  publicado: [
    { status: "borrador", label: "Volver a borrador" },
    { status: "cancelado", label: "Cancelar evento" },
  ],
  cancelado: [
    { status: "publicado", label: "Publicar", primary: true },
    { status: "borrador", label: "Volver a borrador" },
  ],
};

export function EventStatusActions({ id, status }: { id: string; status: EventStatus }) {
  return (
    <div className="flex flex-wrap gap-3">
      {OPTIONS[status].map((o) => (
        <form key={o.status} action={setEventStatusAction.bind(null, id, o.status)}>
          <button
            type="submit"
            className={
              o.primary
                ? "rounded-full bg-vino px-4 py-1.5 text-sm font-medium text-blanco hover:opacity-90"
                : "rounded-full border border-arena px-4 py-1.5 text-sm font-medium text-tinta hover:border-vino hover:text-vino"
            }
          >
            {o.label}
          </button>
        </form>
      ))}
    </div>
  );
}
