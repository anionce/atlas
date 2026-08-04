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
 * de React) y un componente.
 *
 * El primer render (tanto en el servidor como en el cliente) crea la
 * máquina SIN tocar localStorage, siempre en el paso 1: así el HTML que
 * genera el servidor y el primer render del cliente coinciden siempre.
 * Restaurar el progreso guardado es un efecto que solo corre en el
 * cliente, después de montar — si lo hiciéramos durante el render nos
 * arriesgaríamos a un hydration mismatch (el servidor nunca ve
 * localStorage, así que no puede saber si había una simulación guardada).
 */
export function useJourneyMachine(definition: JourneyDefinition) {
  const [machine, setMachine] = useState(() => new JourneyMachine(definition));
  const [, setVersion] = useState(0);
  const rerender = () => setVersion((v) => v + 1);

  useEffect(() => {
    const persistence = new LocalStoragePersistenceAdapter();
    const existingState = persistence.load(definition.id);

    // localStorage no existe durante el render (ni en el servidor ni en el
    // primer render del cliente antes de hidratar); leerlo ahí causaría el
    // mismatch que este efecto existe para evitar. Este es exactamente el
    // caso que la documentación de la regla admite: sincronizar con un
    // sistema externo desde un efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMachine(
      new JourneyMachine(definition, {
        persistence,
        initialState: existingState ?? undefined,
      }),
    );

    if (!existingState) {
      trackJourneyStarted({ journeyId: definition.id });
    }
    // Solo debe ejecutarse una vez, al montar: restaurar/adjuntar la
    // persistencia no depende de nada que cambie entre renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [definition.id]);

  useEffect(() => {
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
  }, [machine]);

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
