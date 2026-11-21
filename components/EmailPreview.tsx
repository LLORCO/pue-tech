import Link from "next/link";
import type { Community, TechEvent } from "@/lib/types";
import { brand } from "@/lib/brand";
import { formatLongDate, formatTime } from "@/lib/format";

type Props =
  | { kind: "evento"; event: TechEvent; community: Community; email?: string }
  | { kind: "bienvenida"; email: string; follows: string };

const c = brand.colors;

export function EmailPreview(props: Props) {
  const subject =
    props.kind === "evento" ? `🥪 Nuevo en el horno: ${props.event.title}` : "¡Bienvenido a Cemita! 🥪";
  const to = props.email || "tu@correo.com";
  const cta = { background: c.yellow, color: c.cobaltDark, padding: "12px 24px", borderRadius: 999, fontWeight: 700, textDecoration: "none", display: "inline-block" };

  return (
    <div className="mx-auto max-w-[680px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg">
      <div className="space-y-1 border-b border-black/10 bg-neutral-50 px-5 py-3 text-sm text-neutral-600">
        <p><b>De:</b> Cemita &lt;hola@cemita.mx&gt;</p>
        <p><b>Para:</b> {to}</p>
        <p><b>Asunto:</b> {subject}</p>
      </div>
      <div style={{ background: c.cream, padding: 24 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", background: c.white, borderRadius: 16, overflow: "hidden", fontFamily: "Inter, Arial, sans-serif", color: c.ink }}>
          <div style={{ background: c.cobalt, color: c.white, padding: "24px 28px", borderBottom: `6px solid ${c.yellow}` }}>
            <div style={{ fontFamily: "var(--font-bricolage), Arial", fontWeight: 800, fontSize: 28 }}>cemita</div>
            <div style={{ opacity: 0.8, fontSize: 14 }}>{brand.tagline}</div>
          </div>
          <div style={{ padding: 28, lineHeight: 1.5 }}>
            {props.kind === "evento" ? (
              <>
                <p style={{ margin: 0, color: c.cobalt, fontWeight: 700 }}>
                  {props.community.emoji} {props.community.name} tiene algo nuevo
                </p>
                <h1 style={{ fontFamily: "var(--font-bricolage), Arial", fontSize: 30, lineHeight: 1.1, margin: "8px 0 12px" }}>
                  {props.event.title}
                </h1>
                <p style={{ margin: "0 0 4px", textTransform: "capitalize" }}>
                  📅 {formatLongDate(props.event.start)} · {formatTime(props.event.start)}
                </p>
                <p style={{ margin: "0 0 16px" }}>📍 {props.event.online ? "En línea" : props.event.venue}</p>
                <p>{props.event.description}</p>
                <p style={{ margin: "24px 0" }}>
                  <Link href={`/eventos/${props.event.slug}`} style={cta}>Ver en Cemita</Link>
                </p>
              </>
            ) : (
              <>
                <h1 style={{ fontFamily: "var(--font-bricolage), Arial", fontSize: 30, lineHeight: 1.1, margin: "0 0 12px" }}>
                  ¡Ya estás en la cemita! 🥪
                </h1>
                <p>A partir de hoy te avisamos de los eventos de <b>{props.follows}</b>. Nada de spam, solo lo que sale del horno.</p>
                <p style={{ margin: "24px 0" }}>
                  <Link href="/" style={cta}>Ver qué hay esta semana</Link>
                </p>
              </>
            )}
            <div style={{ background: c.cream, borderRadius: 12, padding: 16, fontSize: 14 }}>
              <b style={{ color: c.cobalt }}>Date una vuelta por todo lo que hay en el horno.</b> Meetups, talleres y hackatones de todas las comunidades de Puebla, en un solo lugar.
            </div>
          </div>
          <div style={{ padding: "16px 28px", fontSize: 12, color: "#64748b", borderTop: "1px solid #eee" }}>
            Recibes este correo porque te suscribiste en Cemita. Cancelar suscripción · Cambiar comunidades
          </div>
        </div>
      </div>
    </div>
  );
}
