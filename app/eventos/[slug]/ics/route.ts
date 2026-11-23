import { db } from "@/lib/db/client";
import { getPublicEventBySlug } from "@/lib/data/events";
import { toICS } from "@/lib/ics";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: RouteContext<"/eventos/[slug]/ics">) {
  const { slug } = await ctx.params;
  const event = await getPublicEventBySlug(db, slug);
  if (!event) return new Response("No encontrado", { status: 404 });
  return new Response(toICS(event, new Date()), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}
