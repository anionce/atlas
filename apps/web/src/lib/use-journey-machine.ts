"use client";

import { useEffect, useState } from "react";

import {
  trackJourneyAbandoned,
  trackJourneyCompleted,
  trackJourneyStarted,
  trackQuestionAnswered,
  trackValidationFailed,
} from "@atlas/analytics";
import {
  JourneyMachine,
  LocalStoragePersistenceAdapter,
  type JourneyDefinition,
} from "@atlas/journey-engine";

/**
 * Puente entre el Journey Engine (una clase de TypeScript sin dependencias
 * de React) y un componente. La máquina se crea una única vez con el
 * inicializador perezoso de useState; forzamos un re-render manual tras
 * cada mutación, y suscribimos la analítica a los eventos del motor.
 */
export function useJourneyMachine(definition: JourneyDefinition) {
  const [{ machine, startedFresh }] = useState(() => {
    const persistence =
      typeof window !== "undefined" ? new LocalStoragePersistenceAdapter() : undefined;
    const alreadyStarted = persistence?.load(definition.id) != null;
    return {
      machine: new JourneyMachine(definition, { persistence }),
      startedFresh: !alreadyStarted,
    };
  });
  const [, setVersion] = useState(0);
  const rerender = () => setVersion((v) => v + 1);

  useEffect(() => {
    // El evento journey_started se emite de forma síncrona en el
    // constructor, antes de que este efecto pueda suscribirse. Lo
    // reportamos aquí directamente en vez de vía machine.on(...).
    if (startedFresh) {
      trackJourneyStarted({ journeyId: definition.id });
    }

    return machine.on((event) => {
      switch (event.type) {
        case "question_answered":
          if (event.stepId) {
            trackQuestionAnswered({ journeyId: event.journeyId, stepId: event.stepId });
          }
          break;
        case "validation_failed":
          if (event.stepId) {
            trackValidationFailed({ journeyId: event.journeyId, stepId: event.stepId });
          }
          break;
        case "journey_completed":
          trackJourneyCompleted({ journeyId: event.journeyId });
          break;
        case "journey_abandoned":
          trackJourneyAbandoned({ journeyId: event.journeyId });
          break;
      }
    });
  }, [machine, startedFresh, definition.id]);

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
