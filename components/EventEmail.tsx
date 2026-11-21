"use client";

import Link from "next/link";
import { useStore } from "@/lib/useStore";
import { subscribersFor } from "@/lib/store";
import { EmailPreview } from "./EmailPreview";

export function EventEmail({ slug }: { slug: string }) {
  const { events, communities, state } = useStore();
  const event = events.find((e) => e.slug === slug);
  const community = event && communities.find((c) => c.slug === event.communitySlug);
  if (!event || !community) {
    return <p className="text-center">Este evento no existe. <Link href="/" className="underline">Volver</Link></p>;
  }
  const subs = subscribersFor(state, community.slug);
  return (
    <>
      <p className="mb-6 text-ink/70">
        Se enviaría a {subs.length} {subs.length === 1 ? "suscriptor" : "suscriptores"}
        {subs.length > 0 && `: ${subs.map((s) => s.email).join(", ")}`}.
      </p>
      <EmailPreview kind="evento" event={event} community={community} email={subs[0]?.email} />
    </>
  );
}
