import { describe, expect, it } from "vitest";

import { generateInsights } from "./insights";

describe("generateInsights", () => {
  it("explains VAT for new construction", () => {
    const insights = generateInsights({ propertyPrice: 250_000, isNewConstruction: true });
    expect(insights.some((i) => i.code === "new_construction_tax")).toBe(true);
  });

  it("explains transfer tax for resale", () => {
    const insights = generateInsights({ propertyPrice: 250_000, isNewConstruction: false });
    expect(insights.some((i) => i.code === "resale_transfer_tax")).toBe(true);
  });

  it("every emitted insight has non-empty copy", () => {
    const insights = generateInsights({ propertyPrice: 250_000, isNewConstruction: false });
    for (const insight of insights) {
      expect(insight.title.length).toBeGreaterThan(0);
      expect(insight.message.length).toBeGreaterThan(0);
    }
  });

  it("mentions the region's actual ITP rate when a region is given", () => {
    const insights = generateInsights({
      propertyPrice: 250_000,
      isNewConstruction: false,
      region: "madrid",
    });
    const transferTax = insights.find((i) => i.code === "resale_transfer_tax");
    expect(transferTax?.message).toContain("6");
  });

  it("describes progressive brackets, not a single rate, for regions that have them", () => {
    const insights = generateInsights({
      propertyPrice: 800_000,
      isNewConstruction: false,
      region: "cataluna",
    });
    const transferTax = insights.find((i) => i.code === "resale_transfer_tax");
    expect(transferTax?.message).toContain("tramos progresivos");
    expect(transferTax?.message).toContain("10");
    expect(transferTax?.message).toContain("13");
  });
});
