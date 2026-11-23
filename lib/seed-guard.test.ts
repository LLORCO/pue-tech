import { it, expect } from "vitest";
import { assertSeedTarget } from "./seed-guard";

const local = "postgres://postgres@localhost:54329/puetech_dev";

it("acepta una base local", () => {
  expect(() => assertSeedTarget({ DATABASE_URL: local })).not.toThrow();
  expect(() => assertSeedTarget({ DATABASE_URL: "postgres://u:p@127.0.0.1:5432/db" })).not.toThrow();
});

it("rechaza producción, una URL vacía o inválida", () => {
  expect(() => assertSeedTarget({ DATABASE_URL: local, VERCEL_ENV: "production" })).toThrow(/producción/);
  expect(() => assertSeedTarget({})).toThrow(/DATABASE_URL/);
  expect(() => assertSeedTarget({ DATABASE_URL: "no es url" })).toThrow(/DATABASE_URL/);
});

it("rechaza un host remoto salvo con SEED_ALLOW_REMOTE=1", () => {
  const remote = "postgres://x@example.com/db";
  expect(() => assertSeedTarget({ DATABASE_URL: remote })).toThrow(/example\.com/);
  expect(() => assertSeedTarget({ DATABASE_URL: remote, SEED_ALLOW_REMOTE: "true" })).toThrow();
  expect(() => assertSeedTarget({ DATABASE_URL: remote, SEED_ALLOW_REMOTE: "1" })).not.toThrow();
  expect(() =>
    assertSeedTarget({ DATABASE_URL: remote, SEED_ALLOW_REMOTE: "1", VERCEL_ENV: "production" }),
  ).toThrow(/producción/);
});
