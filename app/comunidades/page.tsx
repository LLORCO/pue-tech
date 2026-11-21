import { CommunityList } from "@/components/CommunityList";

export const metadata = { title: "Comunidades" };

export default function ComunidadesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold text-cobalt">Comunidades</h1>
      <p className="mb-8 mt-2 text-ink/70">Los ingredientes de la cemita: las comunidades tech que hacen que Puebla se mueva.</p>
      <CommunityList />
    </div>
  );
}
