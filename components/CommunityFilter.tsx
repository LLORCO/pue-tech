import Link from "next/link";
import type { Community } from "@/lib/db/schema";

export function CommunityFilter({
  communities,
  active,
}: {
  communities: Pick<Community, "slug" | "name">[];
  active: string | null;
}) {
  const chip = (isActive: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition ${
      isActive ? "border-tinta bg-tinta text-blanco" : "border-arena bg-white text-tinta/80 hover:border-tinta/40"
    }`;
  return (
    <nav aria-label="Filtrar por comunidad" className="flex flex-wrap gap-2">
      <Link href="/" className={chip(active === null)} aria-current={active === null ? "page" : undefined}>
        Todas
      </Link>
      {communities.map((c) => (
        <Link
          key={c.slug}
          href={`/?comunidad=${encodeURIComponent(c.slug)}`}
          className={chip(active === c.slug)}
          aria-current={active === c.slug ? "page" : undefined}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
