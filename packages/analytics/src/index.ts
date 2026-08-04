export { configureAnalytics, getAnalyticsProvider } from "./config";
export { NoopAnalyticsProvider } from "./providers/noop-provider";
export { ConsoleAnalyticsProvider } from "./providers/console-provider";
export type { AnalyticsEvent, AnalyticsProvider } from "./types";

export {
  trackJourneyStarted,
  trackQuestionAnswered,
  trackValidationFailed,
  trackJourneyCompleted,
  trackJourneyAbandoned,
  trackScenarioCompared,
  trackRecommendationClicked,
} from "./events";
