import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight">
      <span className="grid size-9 place-items-center rounded-full bg-yellow text-cobalt-dark shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]">
        c
      </span>
      <span className={light ? "text-white" : "text-cobalt"}>cemita</span>
    </Link>
  );
}
