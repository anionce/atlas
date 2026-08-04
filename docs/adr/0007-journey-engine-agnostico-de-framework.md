# ADR-0007: El Journey Engine tampoco depende de React

Estado: Aceptada
Fecha: 2026-08-04

## Contexto

TDD-002 exige explícitamente que el Decision Engine sea independiente de
React, pero no lo dice con la misma fuerza para el Journey Engine (el
motor de navegación/estado del wizard). Al implementarlo, había dos
caminos: escribirlo directamente como un hook de React (más rápido de
integrar), o como una clase de TypeScript plana con un hook fino por
encima que la conecte a React.

## Decisión

`packages/journey-engine` es TypeScript puro (clase `JourneyMachine`, sin
imports de React). `apps/web/src/lib/use-journey-machine.ts` es el
adaptador — un hook de ~40 líneas que crea la instancia, fuerza
re-render tras cada mutación, y traduce sus eventos a llamadas de
`@atlas/analytics`.

## Consecuencias

- Mismo beneficio que ADR-0002 pero para el motor de flujo: reutilizable
  desde una app móvil o tests sin React, y con tests unitarios rápidos en
  Node (21 tests, ~300ms, sin jsdom).
- El coste es un adaptador adicional a mantener por cada framework de UI
  que lo consuma; hoy solo existe el de React.
- Un detalle de diseño no obvio, documentado en el propio código: el
  evento `journey_started` se emite de forma síncrona en el constructor
  de `JourneyMachine`, antes de que un `useEffect` pueda suscribirse. El
  hook lo compensa comprobando si la persistencia ya tenía estado
  guardado, en vez de depender del evento para ese caso concreto.
