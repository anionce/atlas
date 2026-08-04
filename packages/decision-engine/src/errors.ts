import type { DecisionError } from "./shared-types";

/** Nunca lanzar errores genéricos: todo error tiene formato uniforme (DecisionError). */
export class DecisionValidationError extends Error {
  readonly errors: DecisionError[];

  constructor(errors: DecisionError[]) {
    super(errors.map((e) => e.message).join(" "));
    this.name = "DecisionValidationError";
    this.errors = errors;
  }
}
