type Env = Partial<Record<"SITE_URL" | "VERCEL_URL" | "VERCEL_BRANCH_URL", string>>;

const hostOf = (url: string) => {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
};

/**
 * baseURL de Better Auth: el host de SITE_URL más los de cada deploy de Vercel
 * (VERCEL_URL, VERCEL_BRANCH_URL), para que los previews puedan iniciar sesión.
 * Sin ningún host devuelve undefined: Better Auth no acepta una lista vacía.
 */
export function authBaseURL(env: Env): { allowedHosts: string[]; fallback?: string } | undefined {
  const site = env.SITE_URL || undefined;
  const hosts = [site ? hostOf(site) : "", env.VERCEL_URL ?? "", env.VERCEL_BRANCH_URL ?? ""].filter(Boolean);
  const allowedHosts = [...new Set(hosts)];
  if (allowedHosts.length === 0) return undefined;
  return site ? { allowedHosts, fallback: site } : { allowedHosts };
}
