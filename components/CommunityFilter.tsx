import type { Community } from "@/lib/types";

export function CommunityFilter({
  communities,
  value,
  onChange,
}: {
  communities: Community[];
  value: string | null;
  onChange: (slug: string | null) => void;
}) {
  const chip = (active: boolean) =>
    `rounded-full border-2 px-3 py-1 text-sm font-semibold transition ${
      active ? "border-cobalt bg-cobalt text-white" : "border-cobalt/20 bg-white text-cobalt hover:border-cobalt"
    }`;
  return (
    <div className="flex flex-wrap gap-2">
      <button className={chip(value === null)} onClick={() => onChange(null)}>
        Todo el menú
      </button>
      {communities.map((c) => (
        <button key={c.slug} className={chip(value === c.slug)} onClick={() => onChange(c.slug)}>
          {c.emoji} {c.name}
        </button>
      ))}
    </div>
  );
}
