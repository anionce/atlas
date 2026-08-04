# ADR-0004: Supabase como backend inicial

Estado: Aceptada — pendiente de implementación
Fecha: 2026-08-04

## Contexto

PRD 11 — Technical Architecture necesita PostgreSQL (por las relaciones
entre User, Journey, Simulation, Scenario) sin montar una API REST propia
desde el primer día. El MVP actual (Milestone 2) no requiere todavía
cuenta de usuario ni persistencia en servidor: el progreso del Journey se
guarda en `localStorage` vía `LocalStoragePersistenceAdapter`
(`packages/journey-engine`), suficiente para completar y volver a una
simulación en el mismo dispositivo.

## Decisión

Cuando el producto necesite cuentas (Milestone 5 del roadmap: guardar
escenarios, histórico, comparaciones), el backend será Supabase:
PostgreSQL + Auth + Storage + Edge Functions, con Prisma como ORM.

## Consecuencias

- No hay trabajo pendiente en el motor para esto: `PersistenceAdapter`
  (`packages/journey-engine/src/persistence.ts`) ya es la interfaz que
  desacopla el Journey Engine de dónde se guarda el progreso. Añadir un
  `SupabasePersistenceAdapter` el día que exista cuenta de usuario no
  debería tocar el motor.
- Requiere que alguien cree el proyecto de Supabase y provea las
  credenciales — no es algo que se pueda generar sin esa cuenta externa.
- Hasta entonces, cerrar el navegador en modo incógnito pierde el
  progreso: es una limitación conocida y aceptada del MVP, no un bug.
