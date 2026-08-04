import { describe, expect, it } from "vitest";

import { calculatePurchaseCosts } from "./purchase-costs";

describe("calculatePurchaseCosts", () => {
  it("applies ITP (no stamp duty) for resale properties", () => {
    const result = calculatePurchaseCosts({ propertyPrice: 250_000, isNewConstruction: false });
    expect(result.transferTaxOrVat).toBeCloseTo(250_000 * 0.07, 6);
    expect(result.stampDuty).toBe(0);
    expect(result.total).toBeCloseTo(
      result.transferTaxOrVat + result.notary + result.registry + result.appraisal,
      6,
    );
  });

  it("applies IVA + AJD for new construction", () => {
    const result = calculatePurchaseCosts({ propertyPrice: 250_000, isNewConstruction: true });
    expect(result.transferTaxOrVat).toBeCloseTo(250_000 * 0.1, 6);
    expect(result.stampDuty).toBeCloseTo(250_000 * 0.015, 6);
  });

  it("floors notary and registry fees for cheap properties", () => {
    const result = calculatePurchaseCosts({ propertyPrice: 10_000, isNewConstruction: false });
    expect(result.notary).toBe(300);
    expect(result.registry).toBe(200);
  });

  it("uses the region's ITP rate when given, for resale properties", () => {
    const madrid = calculatePurchaseCosts({
      propertyPrice: 250_000,
      isNewConstruction: false,
      region: "madrid",
    });
    expect(madrid.transferTaxOrVat).toBeCloseTo(250_000 * 0.06, 6);

    const cataluna = calculatePurchaseCosts({
      propertyPrice: 250_000,
      isNewConstruction: false,
      region: "cataluna",
    });
    expect(cataluna.transferTaxOrVat).toBeCloseTo(250_000 * 0.1, 6);
  });

  it("ignores region for new construction, which always uses national IVA", () => {
    const result = calculatePurchaseCosts({
      propertyPrice: 250_000,
      isNewConstruction: true,
      region: "pais-vasco",
    });
    expect(result.transferTaxOrVat).toBeCloseTo(250_000 * 0.1, 6);
  });
});
