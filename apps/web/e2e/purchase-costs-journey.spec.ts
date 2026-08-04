import { expect, test } from "@playwright/test";

test("completes the purchase-costs journey end to end", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Empezar: Gastos de compra de vivienda" }).click();

  await expect(page.getByText("Paso 1 de 2")).toBeVisible();
  await page.getByLabel("¿Cuál es el precio de la vivienda?").fill("250000");
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page.getByText("Paso 2 de 2")).toBeVisible();
  await page.getByRole("button", { name: "No", exact: true }).click();
  await page.getByRole("button", { name: "Ver resultado" }).click();

  await expect(page.getByText("Resumen")).toBeVisible();
  await expect(page.getByText("Desglose")).toBeVisible();
  await expect(page.getByText("ITP", { exact: true })).toBeVisible();
});
