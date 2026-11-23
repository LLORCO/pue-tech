import { requireAdmin } from "@/lib/auth/session";

// Placeholder: Task 8 lo convierte en el tablero del panel.
export default async function PanelPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-tinta">Panel</h1>
      <p className="mt-2 text-tinta/70">Aquí vas a administrar eventos y comunidades.</p>
    </div>
  );
}
