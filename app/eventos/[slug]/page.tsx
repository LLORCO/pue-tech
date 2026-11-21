import { Suspense } from "react";
import { EventDetail } from "@/components/EventDetail";
import { seedEvents } from "@/lib/seed";

export function generateStaticParams() {
  return seedEvents.map((e) => ({ slug: e.slug }));
}

async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <EventDetail slug={slug} />;
}

export default function Page({ params }: PageProps<"/eventos/[slug]">) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-cobalt">Calentando la cemita…</div>}>
      <Detail params={params} />
    </Suspense>
  );
}
