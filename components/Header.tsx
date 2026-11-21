import Link from "next/link";
import { Logo } from "./Logo";

const nav = [
  { href: "/", label: "Eventos" },
  { href: "/comunidades", label: "Comunidades" },
  { href: "/proponer", label: "Proponer" },
  { href: "/media-kit", label: "Media kit" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b-4 border-yellow bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Logo />
        <nav className="flex flex-wrap items-center gap-1 text-sm font-semibold">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-full px-3 py-1.5 text-cobalt hover:bg-cream">
              {n.label}
            </Link>
          ))}
          <Link href="/suscribete" className="rounded-full bg-cobalt px-4 py-1.5 text-white hover:bg-cobalt-dark">
            Suscríbete
          </Link>
        </nav>
      </div>
    </header>
  );
}
