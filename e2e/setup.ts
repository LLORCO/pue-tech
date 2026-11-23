// Prepara la base desechable: la vacía, migra, siembra, crea la cuenta de prueba
// y un borrador. Corre antes de `next build` (ver webServer en playwright.config.ts).
import { execSync } from "node:child_process";
import postgres from "postgres";
import { serverEnv, DRAFT_TITLE } from "./env";

const env = { ...process.env, ...serverEnv };
const run = (cmd: string) => execSync(cmd, { stdio: "inherit", env });

// El reset es destructivo: solo corre contra una base cuyo nombre termina en `_e2e`
// y, fuera de CI, que esté en la máquina local.
function assertDisposable(url: string) {
  const u = new URL(url);
  const name = decodeURIComponent(u.pathname.slice(1));
  if (!name.endsWith("_e2e")) {
    throw new Error(
      `Rechazado: la base "${name}" no termina en "_e2e"; e2e vacía la base y solo corre sobre una desechable.`,
    );
  }
  if (!process.env.CI && !["localhost", "127.0.0.1"].includes(u.hostname)) {
    throw new Error(`Rechazado: el host "${u.hostname}" no es local; fuera de CI e2e solo corre en localhost.`);
  }
}

async function main() {
  assertDisposable(serverEnv.DATABASE_URL);
  const sql = postgres(serverEnv.DATABASE_URL, { max: 1, onnotice: () => {} });
  await sql.unsafe("DROP SCHEMA IF EXISTS drizzle CASCADE; DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
  await sql.end();

  run("npm run db:migrate");
  run("npm run db:seed");
  run("npm run admin:create");

  // Evento en borrador (el seed no trae ninguno) para probar que su URL da 404.
  process.env.DATABASE_URL = serverEnv.DATABASE_URL;
  const { db } = await import("../lib/db/client");
  const { createEvent } = await import("../lib/data/events");
  const day = 24 * 60 * 60 * 1000;
  await createEvent(db, {
    title: DRAFT_TITLE,
    description: "Evento en borrador: no debe verse en el sitio público.",
    communityId: null,
    startsAt: new Date(Date.now() + 5 * day),
    endsAt: new Date(Date.now() + 5 * day + 2 * 60 * 60 * 1000),
    venue: "Puebla",
    online: false,
    registrationUrl: null,
    topics: [],
  });
}

main().then(
  () => process.exit(0),
  (e: unknown) => {
    console.error(e);
    process.exit(1);
  },
);
