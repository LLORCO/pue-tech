import { drizzle } from "drizzle-orm/postgres-js";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import postgres from "postgres";
import * as schema from "./schema";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

let instance: Db | undefined;

function getDb(): Db {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL no está definida");
    // prepare: false por compatibilidad con el pooler de Neon.
    instance = drizzle(postgres(url, { prepare: false }), { schema });
  }
  return instance;
}

// Creación perezosa: importar este módulo no falla si falta DATABASE_URL.
export const db: Db = new Proxy({} as Db, {
  get(_t, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
