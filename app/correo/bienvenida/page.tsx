import { Suspense } from "react";
import { WelcomeEmail } from "@/components/WelcomeEmail";

export default function BienvenidaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold text-cobalt">¡Listo, ya estás suscrito!</h1>
      <p className="mb-6 mt-1 text-ink/70">Así se ve el correo de bienvenida que te llegaría (vista previa de la demo).</p>
      <Suspense>
        <WelcomeEmail />
      </Suspense>
    </div>
  );
}
