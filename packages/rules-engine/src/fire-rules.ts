import type { RuleTrigger } from "./types";

export interface FireRulesInput {
  /** `null` cuando, al ritmo actual, nunca se alcanza el número FIRE. */
  monthsToFire: number | null;
}

const WITHIN_A_DECADE_MONTHS = 120;

export function evaluateFireRules({ monthsToFire }: FireRulesInput): RuleTrigger[] {
  if (monthsToFire === null) {
    return [{ code: "fire_unreachable", severity: "warning" }];
  }
  if (monthsToFire <= WITHIN_A_DECADE_MONTHS) {
    return [{ code: "fire_within_decade", severity: "success" }];
  }
  return [];
}
