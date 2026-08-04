import type { JourneyState } from "./types";

/**
 * El Journey Engine no sabe dónde se guarda el progreso (memoria,
 * localStorage, base de datos). Solo usa esta interfaz.
 */
export interface PersistenceAdapter {
  save(journeyId: string, state: JourneyState): void;
  load(journeyId: string): JourneyState | null;
  clear(journeyId: string): void;
}

export class MemoryPersistenceAdapter implements PersistenceAdapter {
  private readonly store = new Map<string, JourneyState>();

  save(journeyId: string, state: JourneyState): void {
    this.store.set(journeyId, state);
  }

  load(journeyId: string): JourneyState | null {
    return this.store.get(journeyId) ?? null;
  }

  clear(journeyId: string): void {
    this.store.delete(journeyId);
  }
}

const STORAGE_PREFIX = "atlas:journey:";

/**
 * Si falla el guardado (localStorage no disponible, cuota excedida, modo
 * privado…) no rompe el Journey: la persistencia es una mejora, no un
 * requisito para completarlo.
 */
export class LocalStoragePersistenceAdapter implements PersistenceAdapter {
  save(journeyId: string, state: JourneyState): void {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + journeyId, JSON.stringify(state));
    } catch {
      // La persistencia es una mejora, no un requisito para completar el Journey.
    }
  }

  load(journeyId: string): JourneyState | null {
    try {
      const raw = window.localStorage.getItem(STORAGE_PREFIX + journeyId);
      return raw ? (JSON.parse(raw) as JourneyState) : null;
    } catch {
      return null;
    }
  }

  clear(journeyId: string): void {
    try {
      window.localStorage.removeItem(STORAGE_PREFIX + journeyId);
    } catch {
      // noop
    }
  }
}
