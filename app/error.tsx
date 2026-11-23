"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:py-32">
      <h1 className="font-display text-4xl font-bold text-tinta sm:text-5xl">Algo salió mal</h1>
      <p className="mt-4 text-lg text-tinta/70">
        No pudimos cargar esta página. Inténtalo de nuevo en unos momentos.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full bg-vino px-6 py-3 font-medium text-blanco hover:bg-vino/90"
        >
          Intentar de nuevo
        </button>
        <Link href="/" className="rounded-full border border-arena px-6 py-3 font-medium hover:border-tinta/40">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
