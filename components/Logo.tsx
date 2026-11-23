import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="PUE Tech, inicio"
      className={`font-display text-xl font-bold tracking-tight ${light ? "text-blanco" : "text-tinta"}`}
    >
      PUE<span className={light ? "text-vino-claro" : "text-vino"}>/</span>Tech
    </Link>
  );
}
