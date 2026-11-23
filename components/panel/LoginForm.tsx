"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, inputCls } from "@/components/Field";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    if (error) {
      setError("Correo o contraseña incorrectos");
      setPending(false);
      return;
    }
    router.replace("/panel");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Correo">
        <input name="email" type="email" autoComplete="email" required className={inputCls} />
      </Field>
      <Field label="Contraseña">
        <input name="password" type="password" autoComplete="current-password" required className={inputCls} />
      </Field>
      {error && (
        <p role="alert" className="text-sm font-medium text-vino">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-vino px-5 py-2.5 font-medium text-blanco hover:bg-vino/90 disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
