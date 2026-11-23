import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/panel/LoginForm";
import { getAdminSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Entrar al panel",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getAdminSession()) redirect("/panel");

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="font-display text-2xl font-bold text-tinta">Entrar al panel</h1>
      <p className="mt-1 text-sm text-tinta/70">Acceso para administrar eventos y comunidades.</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
