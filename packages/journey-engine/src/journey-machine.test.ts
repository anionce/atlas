import { describe, expect, it, vi } from "vitest";

import { JourneyMachine } from "./journey-machine";
import { MemoryPersistenceAdapter } from "./persistence";
import type { JourneyDefinition, JourneyEvent } from "./types";

const simpleJourney: JourneyDefinition = {
  id: "buy-home",
  title: { es: "Comprar una vivienda" },
  estimatedTimeMinutes: 3,
  steps: [
    {
      id: "income",
      type: "currency",
      required: true,
      label: { es: "¿Cuánto ganas?" },
      validation: { minimum: 0 },
    },
    { id: "savings", type: "currency", required: true, label: { es: "¿Cuánto tienes ahorrado?" } },
  ],
};

const conditionalJourney: JourneyDefinition = {
  id: "buy-home-conditional",
  title: { es: "Comprar una vivienda" },
  estimatedTimeMinutes: 5,
  steps: [
    {
      id: "isNewConstruction",
      type: "boolean",
      required: true,
      label: { es: "¿Es vivienda nueva?" },
    },
    {
      id: "vatQuestion",
      type: "currency",
      required: true,
      label: { es: "IVA" },
      dependsOn: { stepId: "isNewConstruction", equals: true },
    },
    {
      id: "itpQuestion",
      type: "currency",
      required: true,
      label: { es: "ITP" },
      dependsOn: { stepId: "isNewConstruction", equals: false },
    },
  ],
};

describe("JourneyMachine", () => {
  it("starts on the first visible step", () => {
    const machine = new JourneyMachine(simpleJourney);
    expect(machine.getCurrentStep()?.id).toBe("income");
  });

  it("emits question_answered for a valid answer", () => {
    const received: JourneyEvent[] = [];
    const machine = new JourneyMachine({ ...simpleJourney, id: "started-check" });
    const unsubscribe = machine.on((e) => received.push(e));
    machine.setAnswer("income", 2500);
    expect(received.some((e) => e.type === "question_answered")).toBe(true);
    unsubscribe();
  });

  it("does not advance when the current step is invalid", () => {
    const machine = new JourneyMachine(simpleJourney);
    expect(machine.goNext()).toBe(false);
    expect(machine.getCurrentStep()?.id).toBe("income");
  });

  it("advances through all steps and completes the journey", () => {
    const machine = new JourneyMachine(simpleJourney);
    machine.setAnswer("income", 2500);
    expect(machine.goNext()).toBe(true);
    expect(machine.getCurrentStep()?.id).toBe("savings");

    machine.setAnswer("savings", 40_000);
    expect(machine.goNext()).toBe(true);
    expect(machine.isComplete()).toBe(true);
    expect(machine.getCurrentStep()).toBeUndefined();
  });

  it("goBack returns to the previous step, including from the completed state", () => {
    const machine = new JourneyMachine(simpleJourney);
    machine.setAnswer("income", 2500);
    machine.goNext();
    machine.setAnswer("savings", 40_000);
    machine.goNext();
    expect(machine.isComplete()).toBe(true);

    machine.goBack();
    expect(machine.getCurrentStep()?.id).toBe("savings");

    machine.goBack();
    expect(machine.getCurrentStep()?.id).toBe("income");

    // No further back than the first step.
    machine.goBack();
    expect(machine.getCurrentStep()?.id).toBe("income");
  });

  it("reports progress based on completed steps out of visible steps", () => {
    const machine = new JourneyMachine(simpleJourney);
    expect(machine.getProgress()).toEqual({ current: 0, total: 2, percentage: 0 });

    machine.setAnswer("income", 2500);
    machine.goNext();
    expect(machine.getProgress()).toEqual({ current: 1, total: 2, percentage: 50 });
  });

  it("progress moves back down after goBack, not just forward", () => {
    const machine = new JourneyMachine(simpleJourney);
    machine.setAnswer("income", 2500);
    machine.goNext();
    expect(machine.getProgress().current).toBe(1);

    machine.goBack();
    expect(machine.getProgress()).toEqual({ current: 0, total: 2, percentage: 0 });
  });

  it("skips conditional steps that don't match the dependency", () => {
    const machine = new JourneyMachine(conditionalJourney);
    machine.setAnswer("isNewConstruction", false);
    machine.goNext();
    // Con isNewConstruction=false, el siguiente paso visible es itpQuestion, no vatQuestion.
    expect(machine.getCurrentStep()?.id).toBe("itpQuestion");
  });

  it("shows the dependent step when the condition matches", () => {
    const machine = new JourneyMachine(conditionalJourney);
    machine.setAnswer("isNewConstruction", true);
    machine.goNext();
    expect(machine.getCurrentStep()?.id).toBe("vatQuestion");
  });

  it("discards a dependent step's stale answer once it's no longer visible", () => {
    const machine = new JourneyMachine(conditionalJourney);
    machine.setAnswer("isNewConstruction", true);
    machine.goNext();
    machine.setAnswer("vatQuestion", 21_000);
    expect(machine.getState().answers.vatQuestion).toBe(21_000);

    // El usuario vuelve atrás y cambia de opinión: ahora no es obra nueva.
    machine.goBack();
    machine.setAnswer("isNewConstruction", false);

    // vatQuestion ya no es visible, y su respuesta no debería seguir ahí
    // "a escondidas" — si no, podría acabar usándose en el cálculo aunque
    // el usuario ya no vea ni pueda corregir esa pregunta.
    expect(machine.getState().answers.vatQuestion).toBeUndefined();
  });

  it("keeps a dependent step's answer when it's still visible after the change", () => {
    const machine = new JourneyMachine(conditionalJourney);
    machine.setAnswer("isNewConstruction", true);
    machine.goNext();
    machine.setAnswer("vatQuestion", 21_000);

    // Volver a fijar el mismo valor de la condición no debería borrar nada.
    machine.setAnswer("isNewConstruction", true);
    expect(machine.getState().answers.vatQuestion).toBe(21_000);
  });

  it("persists state after every answer and restores it on the next construction", () => {
    const persistence = new MemoryPersistenceAdapter();
    const machine = new JourneyMachine({ ...simpleJourney, id: "persisted" }, { persistence });
    machine.setAnswer("income", 3000);

    const restored = new JourneyMachine({ ...simpleJourney, id: "persisted" }, { persistence });
    expect(restored.getState().answers.income).toBe(3000);
  });

  it("emits validation_failed when an invalid answer is set", () => {
    const listener = vi.fn();
    const machine = new JourneyMachine({ ...simpleJourney, id: "validation-check" });
    machine.on(listener);
    machine.setAnswer("income", -100);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ type: "validation_failed", stepId: "income" }),
    );
  });
});
