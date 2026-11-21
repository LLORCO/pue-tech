import { Suspense } from "react";
import { EventEmail } from "@/components/EventEmail";

async function Inner({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <EventEmail slug={slug} />;
}

export default function CorreoPage({ params }: PageProps<"/correo/[slug]">) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold text-cobalt">Aviso de evento nuevo</h1>
      <Suspense>
        <Inner params={params} />
      </Suspense>
    </div>
  );
}
