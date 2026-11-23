import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { authBaseURL } from "@/lib/auth/base-url";
import { db } from "@/lib/db/client";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  // Producción (SITE_URL) y los hosts de cada deploy de Vercel, para que los previews funcionen.
  baseURL: authBaseURL({
    SITE_URL: process.env.SITE_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
  }),
  database: drizzleAdapter(db, { provider: "pg", schema }),
  // Registro cerrado: la cuenta del autor se crea con `npm run admin:create`.
  emailAndPassword: { enabled: true, disableSignUp: true },
  // nextCookies debe ir al final de la lista de plugins.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
