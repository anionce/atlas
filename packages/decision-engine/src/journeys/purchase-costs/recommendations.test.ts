import { describe, expect, it } from "vitest";

import { generateRecommendations } from "./recommendations";

describe("generateRecommendations", () => {
  it("suggests checking the regional ITP only for resale", () => {
    const resale = generateRecommendations({ propertyPrice: 250_000, isNewConstruction: false });
    const newBuild = generateRecommendations({ propertyPrice: 250_000, isNewConstruction: true });
    expect(resale.some((r) => r.id === "check_regional_itp")).toBe(true);
    expect(newBuild.some((r) => r.id === "check_regional_itp")).toBe(false);
  });

  it("always includes a budget buffer tip and never exceeds 3 recommendations", () => {
    const recommendations = generateRecommendations({
      propertyPrice: 250_000,
      isNewConstruction: false,
    });
    expect(recommendations.some((r) => r.id === "budget_buffer")).toBe(true);
    expect(recommendations.length).toBeLessThanOrEqual(3);
  });
});
