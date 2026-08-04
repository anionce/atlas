import { describe, expect, it } from "vitest";

import { compareScenarios } from "./scenarios";

describe("compareScenarios", () => {
  it("compares the entered type against the alternative at the same price", () => {
    const { scenarios } = compareScenarios({ propertyPrice: 250_000, isNewConstruction: false });
    expect(scenarios.map((s) => s.id)).toEqual(["as-entered", "alternative"]);
    expect(scenarios[0]?.label).toBe("Segunda mano");
    expect(scenarios[1]?.label).toBe("Si fuera obra nueva");
  });

  it("both scenarios use the same property price", () => {
    const { scenarios } = compareScenarios({ propertyPrice: 250_000, isNewConstruction: false });
    // El total cambia (distinto impuesto), pero ambos parten del mismo precio,
    // así que el total nunca debería ser idéntico salvo coincidencia numérica.
    expect(scenarios[0]?.metrics.total).not.toBe(scenarios[1]?.metrics.total);
  });

  it("explains the comparison in human language", () => {
    const { explanation } = compareScenarios({ propertyPrice: 250_000, isNewConstruction: true });
    expect(explanation.length).toBeGreaterThan(0);
  });
});
