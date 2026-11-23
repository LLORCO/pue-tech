import Link from "next/link";

export function EmptyState({ text, showProposeLink = true }: { text: string; showProposeLink?: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-arena bg-white p-8 text-center">
      <p className="font-display text-lg font-bold text-tinta">{text}</p>
      {showProposeLink && (
        <p className="mt-1 text-sm text-tinta/70">
          ¿Organizas algo?{" "}
          <Link href="/proponer" className="font-medium text-vino underline">
            Propón un evento
          </Link>
          .
        </p>
      )}
    </div>
  );
}
