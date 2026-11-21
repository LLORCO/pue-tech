import Link from "next/link";

export function EmptyState({ text = "No hay nada en el horno para este filtro… todavía." }: { text?: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-cobalt/20 bg-white p-8 text-center">
      <p className="text-3xl">🥪</p>
      <p className="mt-2 font-display text-lg font-bold text-cobalt">{text}</p>
      <p className="mt-1 text-sm text-ink/70">
        <Link href="/suscribete" className="font-semibold text-cobalt underline">Suscríbete</Link> y te avisamos en cuanto salga algo.
      </p>
    </div>
  );
}
