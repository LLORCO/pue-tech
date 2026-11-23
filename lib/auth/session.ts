import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type Session } from "@/lib/auth";

/** Sesión actual (o null). Memoizada por render con `cache` de React. */
export const getAdminSession = cache(
  async (): Promise<Session | null> => auth.api.getSession({ headers: await headers() }),
);

/**
 * Frontera de seguridad del panel: toda página y Server Action del panel la
 * llama primero. Sin sesión redirige al login. El registro está cerrado, así
 * que cualquier sesión válida pertenece al administrador.
 */
export async function requireAdmin(): Promise<Session> {
  const session = await getAdminSession();
  if (!session) redirect("/panel/login");
  return session;
}
