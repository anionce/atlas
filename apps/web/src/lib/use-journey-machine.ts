"use client";

import { useState } from "react";

import {
  JourneyMachine,
  LocalStoragePersistenceAdapter,
  type JourneyDefinition,
} from "@atlas/journey-engine";

/**
 * Puente entre el Journey Engine (una clase de TypeScript sin dependencias
 * de React) y un componente. La máquina se crea una única vez con el
 * inicializador perezoso de useState; forzamos un re-render manual tras
 * cada mutación.
 */
export function useJourneyMachine(definition: JourneyDefinition) {
  const [machine] = useState(() => {
    const persistence =
      typeof window !== "undefined" ? new LocalStoragePersistenceAdapter() : undefined;
    return new JourneyMachine(definition, { persistence });
  });
  const [, setVersion] = useState(0);
  const rerender = () => setVersion((v) => v + 1);

  return {
    machine,
    state: machine.getState(),
    currentStep: machine.getCurrentStep(),
    progress: machine.getProgress(),
    isComplete: machine.isComplete(),
    setAnswer(stepId: string, value: unknown) {
      const error = machine.setAnswer(stepId, value);
      rerender();
      return error;
    },
    goNext() {
      const advanced = machine.goNext();
      rerender();
      return advanced;
    },
    goBack() {
      machine.goBack();
      rerender();
    },
  };
}
