import { brand } from "@/lib/brand";
import { seedCommunities, seedEvents } from "@/lib/seed";
import { ogUrl } from "@/lib/og";
import { Logo } from "@/components/Logo";
import { TalaveraPattern } from "@/components/TalaveraPattern";

export const metadata = { title: "Media kit" };

const palette = [
  { name: "Cobalto Talavera", hex: brand.colors.cobalt, use: "Color principal, fondos y botones", dark: true },
  { name: "Cobalto noche", hex: brand.colors.cobaltDark, use: "Pie de página y texto sobre amarillo", dark: true },
  { name: "Amarillo yema", hex: brand.colors.yellow, use: "Acentos, llamadas a la acción, fechas" },
  { name: "Crema pan", hex: brand.colors.cream, use: "Fondo general" },
  { name: "Blanco azulejo", hex: brand.colors.white, use: "Tarjetas y superficies" },
  { name: "Tinta", hex: brand.colors.ink, use: "Texto principal", dark: true },
];

const voice = [
  { do: "¿Qué hay de nuevo en el horno?", dont: "Próximos eventos disponibles" },
  { do: "Ponle aguacate a tu semana", dont: "Suscríbase a nuestro boletín" },
  { do: "Este evento ya se lo comieron", dont: "Error 404: recurso no encontrado" },
];

export default function MediaKitPage() {
  const ev = seedEvents.find((e) => e.slug === "datos-abiertos-puebla")!;
  const com = seedCommunities.find((c) => c.slug === ev.communitySlug)!;
  const h2 = "font-display text-2xl font-extrabold text-cobalt";

  return (
    <div>
      <section className="relative overflow-hidden bg-cobalt text-white">
        <TalaveraPattern className="absolute inset-0 text-white/10" />
        <div className="relative mx-auto max-w-5xl px-4 py-14">
          <p className="text-sm font-bold uppercase tracking-widest text-yellow">Media kit</p>
          <h1 className="mt-2 font-display text-5xl font-extrabold">La receta de Cemita</h1>
          <p className="mt-3 max-w-xl text-white/85">
            Todo lo que necesitas para que Cemita se vea igual en el sitio, los correos y las redes.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-4 py-12">
        <section className="space-y-4">
          <h2 className={h2}>La idea</h2>
          <p className="max-w-2xl text-lg">
            Como la cemita poblana, <b>trae de todo adentro</b>: todos los eventos tech de Puebla en un solo pan. La
            identidad toma su color y sus formas de la <b>Talavera</b>: azul cobalto, amarillo y azulejos.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className={h2}>Logo</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid h-40 place-items-center rounded-2xl bg-white"><Logo /></div>
            <div className="grid h-40 place-items-center rounded-2xl bg-cobalt"><Logo light /></div>
          </div>
          <p className="text-sm text-ink/70">El círculo amarillo es el pan de la cemita. Úsalo solo cuando el espacio sea pequeño (avatar de redes).</p>
        </section>

        <section className="space-y-4">
          <h2 className={h2}>Colores</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {palette.map((p) => (
              <div key={p.hex} className="overflow-hidden rounded-2xl border border-black/5 bg-white">
                <div className={`h-24 ${p.dark ? "text-white" : "text-ink"} flex items-end p-3 font-mono text-sm`} style={{ background: p.hex }}>
                  {p.hex}
                </div>
                <div className="p-3">
                  <p className="font-bold">{p.name}</p>
                  <p className="text-sm text-ink/70">{p.use}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={h2}>Tipografía</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6">
              <p className="font-display text-5xl font-extrabold text-cobalt">Bricolage</p>
              <p className="mt-2 text-sm text-ink/70">Bricolage Grotesque · títulos, fechas y el logo. Con carácter, como la ciudad.</p>
            </div>
            <div className="rounded-2xl bg-white p-6">
              <p className="text-5xl font-semibold">Inter</p>
              <p className="mt-2 text-sm text-ink/70">Inter · textos y formularios. Clara y fácil de leer en el celular.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={h2}>Tono de voz</h2>
          <p className="max-w-2xl">Cercano, poblano y con humor, pero siempre claro: primero se entiende, luego se sonríe.</p>
          <div className="overflow-hidden rounded-2xl bg-white">
            {voice.map((v) => (
              <div key={v.do} className="grid grid-cols-2 border-b border-black/5 last:border-0">
                <p className="p-4 font-semibold text-cobalt">✅ {v.do}</p>
                <p className="p-4 text-ink/50 line-through">{v.dont}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={h2}>Plantillas para redes</h2>
          <p className="max-w-2xl">
            Cada evento genera su post (1080×1080) y su story (1080×1920) automáticamente, desde su página. Así se ven:
          </p>
          <div className="flex flex-wrap items-start gap-6">
            <figure className="w-full max-w-sm space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ogUrl(ev, com, "post")} alt="Post de Instagram de ejemplo" className="w-full rounded-2xl shadow-lg" />
              <a href={ogUrl(ev, com, "post")} download="cemita-post.png" className="text-sm font-bold text-cobalt underline">Descargar post</a>
            </figure>
            <figure className="w-full max-w-[14rem] space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ogUrl(ev, com, "story")} alt="Story de Instagram de ejemplo" className="w-full rounded-2xl shadow-lg" />
              <a href={ogUrl(ev, com, "story")} download="cemita-story.png" className="text-sm font-bold text-cobalt underline">Descargar story</a>
            </figure>
          </div>
        </section>
      </div>
    </div>
  );
}
