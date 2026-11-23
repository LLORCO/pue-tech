// Valores de prueba para e2e. Nada de esto es real ni se usa fuera de la base desechable.
export const PORT = 3100;
export const BASE_URL = `http://localhost:${PORT}`;

export const E2E_DATABASE_URL =
  process.env.E2E_DATABASE_URL ?? "postgres://postgres@localhost:54329/puetech_e2e";

export const ADMIN_EMAIL = "admin-e2e@example.com";
export const ADMIN_PASSWORD = "e2e-password-123";

export const DRAFT_TITLE = "Borrador secreto e2e";
export const DRAFT_SLUG = "borrador-secreto-e2e";

export const serverEnv = {
  DATABASE_URL: E2E_DATABASE_URL,
  BETTER_AUTH_SECRET: "e2e-secret-e2e-secret-e2e-secret-0123456789",
  SITE_URL: BASE_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
};
