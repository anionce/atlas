import { describe, expect, it } from "vitest";

import { evaluateSavingsGoalRules } from "./savings-goal-rules";

describe("evaluateSavingsGoalRules", () => {
  it("succeeds when the final balance meets or exceeds the goal", () => {
    expect(evaluateSavingsGoalRules({ goalAmount: 10_000, finalBalance: 10_000 })).toEqual([
      { code: "goal_reached", severity: "success" },
    ]);
    expect(evaluateSavingsGoalRules({ goalAmount: 10_000, finalBalance: 12_000 })).toEqual([
      { code: "goal_reached", severity: "success" },
    ]);
  });

  it("warns when the final balance falls short of the goal", () => {
    expect(evaluateSavingsGoalRules({ goalAmount: 10_000, finalBalance: 8_000 })).toEqual([
      { code: "goal_not_reached", severity: "warning" },
    ]);
  });
});
