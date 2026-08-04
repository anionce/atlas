import { describe, expect, it } from "vitest";

import { computeMetrics } from "./metrics";

describe("computeMetrics", () => {
  it("matches the formula-engine breakdown plus a totalPct field", () => {
    const metrics = computeMetrics({ propertyPrice: 250_000, isNewConstruction: false });
    expect(metrics.total).toBeCloseTo(
      metrics.transferTaxOrVat +
        metrics.stampDuty +
        metrics.notary +
        metrics.registry +
        metrics.appraisal,
      6,
    );
    expect(metrics.totalPct).toBeCloseTo((metrics.total / 250_000) * 100, 6);
  });

  it("charges more for new construction than for resale, at the same price", () => {
    const resale = computeMetrics({ propertyPrice: 250_000, isNewConstruction: false });
    const newBuild = computeMetrics({ propertyPrice: 250_000, isNewConstruction: true });
    expect(newBuild.total).toBeGreaterThan(resale.total);
  });
});
