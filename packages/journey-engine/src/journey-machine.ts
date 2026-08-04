import type { PersistenceAdapter } from "./persistence";
import type {
  JourneyDefinition,
  JourneyEvent,
  JourneyEventListener,
  JourneyEventType,
  JourneyProgress,
  JourneyState,
  StepDefinition,
} from "./types";
import { validateStepValue } from "./validation";

export interface JourneyMachineOptions {
  persistence?: PersistenceAdapter;
  initialState?: JourneyState;
}

function createInitialState(): JourneyState {
  const now = new Date().toISOString();
  return {
    currentStepId: null,
    answers: {},
    visitedSteps: [],
    completedSteps: [],
    startedAt: now,
    lastUpdated: now,
  };
}

/**
 * El State Manager + Navigation + Validation + Progress + Submission del
 * Journey Engine. No sabe de qué trata el Journey (hipoteca, inversión,
 * placas solares...): para él todo son preguntas y respuestas.
 */
export class JourneyMachine {
  private readonly definition: JourneyDefinition;
  private readonly persistence?: PersistenceAdapter;
  private state: JourneyState;
  private readonly listeners = new Set<JourneyEventListener>();

  constructor(definition: JourneyDefinition, options: JourneyMachineOptions = {}) {
    this.definition = definition;
    this.persistence = options.persistence;

    const restored = options.initialState ?? this.persistence?.load(definition.id) ?? null;
    if (restored) {
      this.state = restored;
    } else {
      this.state = createInitialState();
      this.state.currentStepId = this.getVisibleSteps()[0]?.id ?? null;
      this.persist();
      this.emit("journey_started");
    }
  }

  on(listener: JourneyEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): JourneyState {
    return { ...this.state, answers: { ...this.state.answers } };
  }

  getDefinition(): JourneyDefinition {
    return this.definition;
  }

  /** Pasos visibles según las respuestas actuales: los condicionales no cumplidos se ocultan. */
  getVisibleSteps(): StepDefinition[] {
    return this.definition.steps.filter((step) => this.isStepVisible(step));
  }

  private isStepVisible(step: StepDefinition): boolean {
    if (!step.dependsOn) return true;
    return this.state.answers[step.dependsOn.stepId] === step.dependsOn.equals;
  }

  getCurrentStep(): StepDefinition | undefined {
    return this.definition.steps.find((step) => step.id === this.state.currentStepId);
  }

  getProgress(): JourneyProgress {
    const visible = this.getVisibleSteps();
    const total = visible.length;
    const current = Math.min(this.state.completedSteps.length, total);
    return {
      current,
      total,
      percentage: total === 0 ? 0 : Math.round((current / total) * 100),
    };
  }

  isComplete(): boolean {
    return this.state.currentStepId === null && this.state.completedSteps.length > 0;
  }

  /**
   * Valida al vuelo, mientras el usuario escribe. Siempre guarda el valor
   * (para que el input siga siendo controlado) y devuelve el error, si lo hay.
   */
  setAnswer(stepId: string, value: unknown): string | null {
    const step = this.definition.steps.find((s) => s.id === stepId);
    if (!step) return null;

    this.state = {
      ...this.state,
      answers: { ...this.state.answers, [stepId]: value },
      lastUpdated: new Date().toISOString(),
    };
    this.persist();

    const error = validateStepValue(step, value);
    if (error) {
      this.emit("validation_failed", stepId);
      return error;
    }

    this.emit("question_answered", stepId);
    return null;
  }

  canGoNext(): boolean {
    const step = this.getCurrentStep();
    if (!step) return false;
    return validateStepValue(step, this.state.answers[step.id]) === null;
  }

  /** Avanza al siguiente paso visible, o completa el Journey si no queda ninguno. */
  goNext(): boolean {
    const step = this.getCurrentStep();
    if (!step || !this.canGoNext()) return false;

    const visited = this.state.visitedSteps.includes(step.id)
      ? this.state.visitedSteps
      : [...this.state.visitedSteps, step.id];
    const completed = this.state.completedSteps.includes(step.id)
      ? this.state.completedSteps
      : [...this.state.completedSteps, step.id];

    const visibleIds = this.getVisibleSteps().map((s) => s.id);
    const nextId = visibleIds[visibleIds.indexOf(step.id) + 1] ?? null;

    this.state = {
      ...this.state,
      visitedSteps: visited,
      completedSteps: completed,
      currentStepId: nextId,
      lastUpdated: new Date().toISOString(),
    };
    this.persist();

    if (nextId === null) {
      this.emit("journey_completed");
    }
    return true;
  }

  /** Vuelve al paso visible anterior. No hace nada si ya estamos en el primero. */
  goBack(): void {
    const visibleIds = this.getVisibleSteps().map((s) => s.id);
    if (visibleIds.length === 0) return;

    if (this.state.currentStepId === null) {
      // Veníamos de la pantalla de resultado: volvemos al último paso.
      this.state = {
        ...this.state,
        currentStepId: visibleIds[visibleIds.length - 1],
        lastUpdated: new Date().toISOString(),
      };
      this.persist();
      return;
    }

    const currentIndex = visibleIds.indexOf(this.state.currentStepId);
    if (currentIndex <= 0) return;

    this.state = {
      ...this.state,
      currentStepId: visibleIds[currentIndex - 1],
      lastUpdated: new Date().toISOString(),
    };
    this.persist();
  }

  abandon(): void {
    this.emit("journey_abandoned");
  }

  private persist(): void {
    this.persistence?.save(this.definition.id, this.state);
  }

  private emit(type: JourneyEventType, stepId?: string): void {
    const event: JourneyEvent = {
      type,
      journeyId: this.definition.id,
      stepId,
      at: new Date().toISOString(),
    };
    for (const listener of this.listeners) listener(event);
  }
}
