type Env = Partial<Record<"DATABASE_URL" | "VERCEL_ENV" | "SEED_ALLOW_REMOTE", string>>;

const LOCAL_HOSTS = ["localhost", "127.0.0.1"];

/**
 * El seed de desarrollo solo corre contra una base local. Una base remota
 * (p. ej. la de producción en Neon) exige `SEED_ALLOW_REMOTE=1` explícito.
 */
export function assertSeedTarget(env: Env): void {
  if (env.VERCEL_ENV === "production") {
    throw new Error("El seed de desarrollo no corre en producción.");
  }
  let host: string;
  try {
    host = new URL(env.DATABASE_URL ?? "").hostname;
  } catch {
    throw new Error("DATABASE_URL no está definida o no es una URL válida.");
  }
  if (!LOCAL_HOSTS.includes(host) && env.SEED_ALLOW_REMOTE !== "1") {
    throw new Error(
      `Rechazado: el host "${host}" no es local. El seed de desarrollo solo corre en localhost; ` +
        "si de verdad quieres sembrar una base remota, define SEED_ALLOW_REMOTE=1.",
    );
  }
}
