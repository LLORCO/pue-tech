import { brand } from "@/lib/brand";
import type { EventWithCommunity } from "@/lib/db/schema";
import { ogUrl } from "@/lib/og";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Media kit" };

const c = brand.colors;

const palette = [
  { name: "Blanco", hex: c.blanco, use: "Fondo del sitio", dark: false },
  { name: "Arena", hex: c.arena, use: "Bordes, separadores y superficies suaves", dark: false },
  { name: "Verde", hex: c.verde, use: "Apoyo en ilustraciones y estados positivos", dark: true },
  { name: "Bosque profundo", hex: c.bosque, use: "Fondo de imágenes para redes y pie de página", dark: true },
  { name: "Marrón", hex: c.marron, use: "Apoyo cálido en ilustraciones", dark: true },
  { name: "Cacao", hex: c.cacao, use: "Segundo fondo oscuro para redes", dark: true },
  { name: "Vino", hex: c.vino, use: "Detalles: fechas, botones y la diagonal del logo", dark: true },
  { name: "Vino claro", hex: c.vinoClaro, use: "Acento sobre fondos oscuros", dark: false },
  { name: "Tinta", hex: c.tinta, use: "Texto principal", dark: true },
];

const voice = [
  { si: "Esta semana en Puebla: 6 eventos", no: "¡¡No te lo pierdas!! 🔥🔥" },
  { si: "Este evento ya no está disponible", no: "Error 404" },
  { si: "Recibe cada lunes los eventos que te interesan", no: "Suscríbase a nuestro boletín" },
];

// Evento de muestra fijo: el media kit no depende de la base de datos.
const sampleEvent: EventWithCommunity = {
  id: "muestra",
  slug: "datos-abiertos-puebla",
  title: "Datos abiertos Puebla",
  description: "",
  communityId: null,
  startsAt: new Date("2026-12-04T01:00:00Z"),
  endsAt: new Date("2026-12-04T03:00:00Z"),
  venue: "Angelópolis",
  online: false,
  registrationUrl: null,
  topics: [],
  status: "publicado",
  publishedAt: null,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
  community: null,
};

const h2 = "font-display text-2xl font-bold text-tinta";

export default function MediaKitPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-20 px-4 py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-vino">Media kit</p>
        <h1 className="font-display text-5xl font-bold text-tinta">Identidad de {brand.name}</h1>
        <p className="max-w-xl text-lg text-tinta/70">{brand.tagline}</p>
      </header>

      <section className="space-y-4">
        <h2 className={h2}>Logo</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid h-40 place-items-center rounded-2xl border border-arena bg-blanco text-3xl"><Logo /></div>
          <div className="grid h-40 place-items-center rounded-2xl bg-bosque text-3xl"><Logo light /></div>
        </div>
        <p className="text-sm text-tinta/70">
          PUE/Tech en Space Grotesk bold, con la diagonal en vino (vino claro sobre fondos oscuros).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>Colores</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {palette.map((p) => (
            <div key={p.hex} className="overflow-hidden rounded-2xl border border-arena">
              <div
                className={`flex h-24 items-end p-3 font-mono text-sm ${p.dark ? "text-blanco" : "text-tinta"}`}
                style={{ background: p.hex }}
              >
                {p.hex}
              </div>
              <div className="p-3">
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-tinta/70">{p.use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>Tipografía</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-arena p-6">
            <p className="font-sans text-5xl font-semibold">Geist</p>
            <p className="mt-2 text-sm text-tinta/70">Para el sitio: textos, formularios y fechas. Clara en cualquier pantalla.</p>
          </div>
          <div className="rounded-2xl border border-arena p-6">
            <p className="font-display text-5xl font-bold">Space Grotesk</p>
            <p className="mt-2 text-sm text-tinta/70">Para titulares y redes: el logo y las imágenes de cada evento.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>Tono de voz</h2>
        <p className="max-w-2xl">Cercano pero cuidado: claro primero, amable siempre. Sin exclamaciones de más ni tecnicismos.</p>
        <div className="overflow-hidden rounded-2xl border border-arena">
          <div className="grid grid-cols-2 border-b border-arena bg-arena/40 text-sm font-medium">
            <p className="p-3 text-verde">Sí</p>
            <p className="p-3 text-vino">No</p>
          </div>
          {voice.map((v) => (
            <div key={v.si} className="grid grid-cols-2 border-b border-arena last:border-0">
              <p className="p-4 font-medium">{v.si}</p>
              <p className="p-4 text-tinta/50 line-through">{v.no}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>Plantillas para redes</h2>
        <p className="max-w-2xl">
          Cada evento genera su post (1080×1080) y su story (1080×1920) automáticamente. Así se ven:
        </p>
        <div className="flex flex-wrap items-start gap-8">
          <figure className="w-full max-w-sm space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ogUrl(sampleEvent, "post")} alt="Post de ejemplo" className="w-full rounded-2xl" />
            <a href={ogUrl(sampleEvent, "post")} download="pue-tech-post.png" className="text-sm font-medium text-vino underline">Descargar post</a>
          </figure>
          <figure className="w-full max-w-[14rem] space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ogUrl(sampleEvent, "story")} alt="Story de ejemplo" className="w-full rounded-2xl" />
            <a href={ogUrl(sampleEvent, "story")} download="pue-tech-story.png" className="text-sm font-medium text-vino underline">Descargar story</a>
          </figure>
        </div>
      </section>
    </div>
  );
}
