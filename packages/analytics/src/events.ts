import { getAnalyticsProvider } from "./config";

/**
 * Funciones semánticas: nunca `gtag(...)` o `provider.track(...)` sueltos
 * por la aplicación. Cada acción de negocio tiene su propia función.
 */
export function trackJourneyStarted(properties: { journeyId: string }): void {
  getAnalyticsProvider().track({ name: "journey_started", properties });
}

export function trackQuestionAnswered(properties: { journeyId: string; stepId: string }): void {
  getAnalyticsProvider().track({ name: "question_answered", properties });
}

export function trackValidationFailed(properties: { journeyId: string; stepId: string }): void {
  getAnalyticsProvider().track({ name: "validation_failed", properties });
}

export function trackJourneyCompleted(properties: { journeyId: string }): void {
  getAnalyticsProvider().track({ name: "journey_completed", properties });
}

export function trackJourneyAbandoned(properties: { journeyId: string }): void {
  getAnalyticsProvider().track({ name: "journey_abandoned", properties });
}

export function trackScenarioCompared(properties: {
  journeyId: string;
  scenarioIds: string[];
}): void {
  getAnalyticsProvider().track({ name: "scenario_compared", properties });
}

export function trackRecommendationClicked(properties: {
  journeyId: string;
  recommendationId: string;
}): void {
  getAnalyticsProvider().track({ name: "recommendation_clicked", properties });
}
