import Link from "next/link";
import { Logo } from "./Logo";

const nav = [
  { href: "/", label: "Eventos" },
  { href: "/comunidades", label: "Comunidades" },
  { href: "/proponer", label: "Proponer" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-arena bg-blanco/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Logo />
        <nav className="flex flex-wrap items-center gap-1 text-sm font-medium">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-full px-3 py-1.5 text-tinta/80 hover:text-vino">
              {n.label}
            </Link>
          ))}
          <Link href="/suscribete" className="ml-1 rounded-full bg-vino px-4 py-1.5 text-blanco hover:bg-vino/90">
            Suscríbete
          </Link>
        </nav>
      </div>
    </header>
  );
}
