import Link from "next/link";

export function EmptyState({ text = "No hay eventos que coincidan con este filtro." }: { text?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-arena bg-white p-8 text-center">
      <p className="font-display text-lg font-bold text-tinta">{text}</p>
      <p className="mt-1 text-sm text-tinta/70">
        <Link href="/suscribete" className="font-medium text-vino underline">Suscríbete</Link> y te avisamos cuando haya novedades.
      </p>
    </div>
  );
}
