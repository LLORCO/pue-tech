import { expect, test, type Page } from "@playwright/test";
import postgres from "postgres";
import { ADMIN_EMAIL, ADMIN_PASSWORD, E2E_DATABASE_URL } from "./env";

const pad = (n: number) => String(n).padStart(2, "0");
// Valor para <input type="datetime-local"> unos días en el futuro.
function localInput(daysAhead: number, hour: number) {
  const d = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hour)}:00`;
}

async function login(page: Page) {
  await page.goto("/panel/login");
  await page.getByLabel("Correo").fill(ADMIN_EMAIL);
  await page.getByLabel("Contraseña").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/panel$/);
  await expect(page.getByRole("heading", { name: "Eventos" })).toBeVisible();
}

async function fillEvent(page: Page, title: string) {
  await page.getByLabel("Título").fill(title);
  await page.getByLabel("Descripción").fill("Evento creado por la prueba de punta a punta.");
  await page.getByLabel("Inicio (hora de Puebla)").fill(localInput(4, 18));
  await page.getByLabel("Fin (hora de Puebla)").fill(localInput(4, 20));
  await page.getByLabel("Lugar").fill("Sala de pruebas, Puebla");
}

test("/panel sin sesión redirige a /panel/login", async ({ page }) => {
  await page.goto("/panel");
  await expect(page).toHaveURL(/\/panel\/login$/);
  await expect(page.getByRole("heading", { name: "Entrar al panel" })).toBeVisible();
});

test("login con contraseña incorrecta muestra un error", async ({ page }) => {
  await page.goto("/panel/login");
  await page.getByLabel("Correo").fill(ADMIN_EMAIL);
  await page.getByLabel("Contraseña").fill("incorrecta-123");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByText("Correo o contraseña incorrectos")).toBeVisible();
  await expect(page).toHaveURL(/\/panel\/login$/);
});

test("login, crear evento y publicarlo hace que aparezca en /", async ({ page }) => {
  const title = "Evento e2e publicado";
  await login(page);

  await page.getByRole("link", { name: "Nuevo evento" }).click();
  await expect(page).toHaveURL(/\/panel\/eventos\/nuevo$/);
  await fillEvent(page, title);
  await page.getByRole("button", { name: "Crear evento" }).click();

  // Se crea como borrador: todavía no es público.
  await expect(page).toHaveURL(/\/panel\/eventos\/[0-9a-f-]+$/);
  await page.goto("/");
  await expect(page.getByRole("link", { name: new RegExp(title) })).toHaveCount(0);

  await page.goBack();
  await page.getByRole("button", { name: "Publicar" }).click();
  await expect(page.getByRole("button", { name: "Volver a borrador" })).toBeVisible();

  await page.goto("/");
  await expect(page.getByRole("link", { name: new RegExp(title) })).toBeVisible();
});

test("enviar el formulario sin sesión termina en /panel/login y no crea el evento", async ({ page, context }) => {
  const title = "Evento e2e sin sesion";
  await login(page);
  await page.getByRole("link", { name: "Nuevo evento" }).click();
  await expect(page.getByRole("heading", { name: "Nuevo evento" })).toBeVisible();
  await fillEvent(page, title);

  await context.clearCookies();
  await page.getByRole("button", { name: "Crear evento" }).click();
  await expect(page).toHaveURL(/\/panel\/login$/);

  await page.goto("/");
  await expect(page.getByRole("link", { name: new RegExp(title) })).toHaveCount(0);
  // Tampoco quedó guardado como borrador. Se consulta la base directamente: un
  // nuevo login toparía con el límite de intentos de Better Auth.
  const sql = postgres(E2E_DATABASE_URL, { max: 1 });
  try {
    const rows = await sql`select id from events where title = ${title}`;
    expect(rows).toHaveLength(0);
  } finally {
    await sql.end();
  }
});
