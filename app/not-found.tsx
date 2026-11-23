import Link from "next/link";

export const metadata = { title: "Página no encontrada" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:py-32">
      <p className="font-display text-sm font-medium tracking-widest text-vino">ERROR 404</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-tinta sm:text-5xl">No encontramos esta página</h1>
      <p className="mt-4 text-lg text-tinta/70">Puede que el enlace esté mal escrito o que el contenido ya no esté disponible.</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-vino px-6 py-3 font-medium text-blanco hover:bg-vino/90"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
