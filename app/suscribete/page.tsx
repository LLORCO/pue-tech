import { Suspense } from "react";
import { SubscribeForm } from "@/components/SubscribeForm";

export const metadata = { title: "Suscríbete" };

export default function SuscribetePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold text-cobalt">Ponle aguacate a tu semana</h1>
      <p className="mt-2 text-ink/70">Elige las comunidades que te interesan y te mandamos sus eventos por correo, recién salidos del horno.</p>
      <Suspense>
        <SubscribeForm />
      </Suspense>
    </div>
  );
}
