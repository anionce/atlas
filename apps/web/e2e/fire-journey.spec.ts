import { expect, test } from "@playwright/test";

test("completes the FIRE journey end to end", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Empezar: Independencia financiera (FIRE)" }).click();

  await expect(page.getByText("Paso 1 de 5")).toBeVisible();
  await page.getByLabel("¿Cuántos años tienes?").fill("30");
  await page.getByRole("button", { name: "Continuar" }).click();

  // Capital invertido: opcional, lo saltamos.
  await expect(page.getByText("Paso 2 de 5")).toBeVisible();
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel("¿Cuánto puedes invertir cada mes?").fill("800");
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel("¿Qué rentabilidad anual esperas de tus inversiones?").fill("6");
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page.getByText("Paso 5 de 5")).toBeVisible();
  await page.getByLabel("¿Cuánto necesitas al mes para vivir cómodamente?").fill("1500");
  await page.getByRole("button", { name: "Ver resultado" }).click();

  await expect(page.getByText("Resumen")).toBeVisible();
  await expect(page.getByText("Capital necesario para vivir de las rentas")).toBeVisible();
  await expect(page.getByText("Comparativa de escenarios")).toBeVisible();
});
