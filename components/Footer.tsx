import Link from "next/link";
import { brand } from "@/lib/brand";
import { Logo } from "./Logo";
import { TalaveraPattern } from "./TalaveraPattern";

export function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-cobalt-dark text-white">
      <TalaveraPattern className="absolute inset-0 text-white/5" />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Logo light />
          <p className="max-w-sm text-white/80">{brand.tagline}</p>
        </div>
        <div className="space-y-1 text-sm text-white/60 sm:text-right">
          <p>Datos de demostración · Build Day Puebla 2026</p>
          <Link href="/moderar" className="underline hover:text-yellow">Panel de moderación</Link>
        </div>
      </div>
    </footer>
  );
}
