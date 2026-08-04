import { expect, test } from "@playwright/test";

test("completes the buy-home journey end to end", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Empezar: Comprar una vivienda" }).click();

  await expect(page.getByText("Paso 1 de 7")).toBeVisible();
  await page.getByLabel("¿Cuánto ganas al mes?").fill("2500");
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel("¿Cuánto tienes ahorrado?").fill("40000");
  await page.getByRole("button", { name: "Continuar" }).click();

  // Deudas mensuales: paso opcional, lo saltamos sin rellenar.
  await expect(page.getByText("Paso 3 de 7")).toBeVisible();
  await page.getByRole("button", { name: "Continuar" }).click();

  // Capacidad de ahorro mensual: también opcional, lo saltamos.
  await expect(page.getByText("Paso 4 de 7")).toBeVisible();
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel("¿Qué tipo de interés estás manejando?").fill("3.2");
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel("¿A cuántos años quieres la hipoteca?").fill("30");
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page.getByText("Paso 7 de 7")).toBeVisible();
  await page.getByRole("button", { name: "No", exact: true }).click();
  await page.getByRole("button", { name: "Ver resultado" }).click();

  await expect(page.getByText("Resumen")).toBeVisible();
  await expect(page.getByText(/Puedes comprar una vivienda de aproximadamente/)).toBeVisible();
  await expect(page.getByText("Comparativa de escenarios")).toBeVisible();
});

test("blocks advancing past a required step until it's valid", async ({ page }) => {
  await page.goto("/comprar-vivienda");
  await expect(page.getByRole("button", { name: "Continuar" })).toBeDisabled();

  await page.getByLabel("¿Cuánto ganas al mes?").fill("-100");
  await expect(page.getByText("no puede ser menor que 0")).toBeVisible();
  await expect(page.getByRole("button", { name: "Continuar" })).toBeDisabled();
});
