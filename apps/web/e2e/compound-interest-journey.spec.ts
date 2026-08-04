import { expect, test } from "@playwright/test";

test("completes the compound-interest journey end to end", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Empezar: Ahorrar con interés compuesto" }).click();

  await expect(page.getByText("Paso 1 de 5")).toBeVisible();
  // Capital inicial: opcional, lo saltamos.
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel("¿Cuánto puedes ahorrar cada mes?").fill("200");
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel("¿Qué rentabilidad anual esperas?").fill("6");
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel("¿Durante cuántos años quieres ahorrar?").fill("15");
  await page.getByRole("button", { name: "Continuar" }).click();

  // Objetivo de ahorro: opcional, lo saltamos.
  await expect(page.getByText("Paso 5 de 5")).toBeVisible();
  await page.getByRole("button", { name: "Ver resultado" }).click();

  await expect(page.getByText("Resumen")).toBeVisible();
  await expect(page.getByText(/En 15 años podrías tener aproximadamente/)).toBeVisible();
  await expect(page.getByText("Comparativa de escenarios")).toBeVisible();
});
