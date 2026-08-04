import { describe, expect, it } from "vitest";

import { toDecisionInput } from "./purchase-costs-to-decision-input";

describe("toDecisionInput", () => {
  it("maps answers into the PurchaseCostsDecisionInput contract", () => {
    const input = toDecisionInput({ propertyPrice: 250_000, isNewConstruction: true });

    expect(input.journeyId).toBe("purchase-costs");
    expect(input.values.propertyPrice).toBe(250_000);
    expect(input.values.isNewConstruction).toBe(true);
  });

  it("passes through the region when present, and leaves it undefined otherwise", () => {
    const withRegion = toDecisionInput({
      propertyPrice: 250_000,
      isNewConstruction: false,
      region: "cataluna",
    });
    expect(withRegion.values.region).toBe("cataluna");

    const withoutRegion = toDecisionInput({ propertyPrice: 250_000, isNewConstruction: false });
    expect(withoutRegion.values.region).toBeUndefined();
  });
});
