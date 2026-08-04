export type StepType = "number" | "currency" | "percentage" | "boolean" | "select" | "text";

export interface StepOption {
  value: string;
  label: Record<string, string>;
}

export interface StepValidation {
  minimum?: number;
  maximum?: number;
}

/**
 * Depende de otro paso: solo se muestra si esa respuesta cumple la condición.
 * La navegación nunca se programa, se configura.
 */
export interface StepDependency {
  stepId: string;
  equals: unknown;
}

export interface StepDefinition {
  id: string;
  type: StepType;
  required: boolean;
  label: Record<string, string>;
  help?: Record<string, string>;
  validation?: StepValidation;
  options?: StepOption[];
  dependsOn?: StepDependency;
}

/** Sin lógica: solo estructura. La lógica de negocio vive fuera de aquí. */
export interface JourneyDefinition {
  id: string;
  title: Record<string, string>;
  estimatedTimeMinutes: number;
  steps: StepDefinition[];
}

export interface JourneyState {
  /**
   * Guardamos el id del paso (no un índice numérico) porque los pasos
   * condicionales pueden cambiar qué posición ocupa cada uno en la lista
   * visible cuando el usuario modifica una respuesta anterior. `null` cuando
   * el Journey se ha completado (ya no hay paso actual).
   */
  currentStepId: string | null;
  answers: Record<string, unknown>;
  visitedSteps: string[];
  completedSteps: string[];
  startedAt: string;
  lastUpdated: string;
}

export interface JourneyProgress {
  current: number;
  total: number;
  percentage: number;
}

export type JourneyEventType =
  | "journey_started"
  | "question_answered"
  | "validation_failed"
  | "journey_completed"
  | "journey_abandoned";

export interface JourneyEvent {
  type: JourneyEventType;
  journeyId: string;
  stepId?: string;
  at: string;
}

export type JourneyEventListener = (event: JourneyEvent) => void;
