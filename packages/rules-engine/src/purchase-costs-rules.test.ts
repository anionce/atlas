import { describe, expect, it } from "vitest";

import { evaluatePurchaseCostsRules } from "./purchase-costs-rules";

describe("evaluatePurchaseCostsRules", () => {
  it("flags new construction taxation", () => {
    expect(evaluatePurchaseCostsRules({ isNewConstruction: true })).toEqual([
      { code: "new_construction_tax", severity: "info" },
    ]);
  });

  it("flags resale transfer tax", () => {
    expect(evaluatePurchaseCostsRules({ isNewConstruction: false })).toEqual([
      { code: "resale_transfer_tax", severity: "info" },
    ]);
  });
});
