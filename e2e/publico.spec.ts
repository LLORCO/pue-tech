import { expect, test } from "@playwright/test";
import { DRAFT_SLUG } from "./env";

test("el inicio muestra los eventos sembrados", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Lo mejor de la tecnología en Puebla, en un solo lugar." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /IA generativa para todos/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Observabilidad 101/ })).toBeVisible();
});

test("el filtro por comunidad cambia la lista", async ({ page }) => {
  await page.goto("/");
  const ia = page.getByRole("link", { name: /IA generativa para todos/ });
  const react = page.getByRole("link", { name: /Taller: React desde cero/ });
  await expect(ia).toBeVisible();
  await expect(react).toBeVisible();

  await page.getByRole("navigation", { name: "Filtrar por comunidad" }).getByRole("link", { name: "Popo Data" }).click();
  await expect(page).toHaveURL(/\?comunidad=popo-data$/);
  await expect(ia).toBeVisible();
  await expect(react).toHaveCount(0);
});

test("un evento cancelado muestra la etiqueta Cancelado", async ({ page }) => {
  await page.goto("/");
  const card = page.getByRole("link", { name: /Arduino y cerveza artesanal/ });
  await expect(card.getByText("Cancelado")).toBeVisible();

  await card.click();
  await expect(page.getByRole("heading", { level: 1, name: "Arduino y cerveza artesanal" })).toBeVisible();
  await expect(page.getByText("Cancelado")).toBeVisible();
});

test("la URL de un borrador responde 404", async ({ page, request }) => {
  const response = await page.goto(`/eventos/${DRAFT_SLUG}`);
  expect(response?.status()).toBe(404);
  const ics = await request.get(`/eventos/${DRAFT_SLUG}/ics`);
  expect(ics.status()).toBe(404);
});

test("el .ics de un evento se descarga como text/calendar", async ({ request }) => {
  const response = await request.get("/eventos/ia-generativa-para-todos/ics");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/calendar");
  expect(response.headers()["content-disposition"]).toContain("attachment");
  expect(await response.text()).toContain("BEGIN:VCALENDAR");
});
