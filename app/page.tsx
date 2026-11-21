import Link from "next/link";
import { HomeEvents } from "@/components/HomeEvents";
import { TalaveraPattern } from "@/components/TalaveraPattern";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-cobalt text-white">
        <TalaveraPattern className="absolute inset-0 text-white/10" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <p className="inline-block rounded-full bg-yellow px-3 py-1 text-sm font-bold text-cobalt-dark">
            Eventos tech de Puebla
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            Todos los eventos tech de Puebla, <span className="text-yellow">en una sola cemita.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">
            Meetups, talleres y hackatones de todas las comunidades, en un solo lugar. Sin estar en mil grupos de WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/suscribete" className="rounded-full bg-yellow px-6 py-3 font-bold text-cobalt-dark hover:bg-white">
              Ponle aguacate a tu semana →
            </Link>
            <Link href="/proponer" className="rounded-full border-2 border-white/60 px-6 py-3 font-bold hover:bg-white/10">
              Propón un evento
            </Link>
          </div>
        </div>
      </section>
      <HomeEvents />
    </>
  );
}
