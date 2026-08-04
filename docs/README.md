# Documentación

- [`PRD.docx`](./PRD.docx) — Product Requirements Document v1.0 (misión, visión, mercado, UX, domain model, arquitectura de producto, MVP, roadmap por hitos).
- [`TDD.docx`](./TDD.docx) — Technical Design Document: `TDD-001 Decision Engine` y `TDD-002 Journey Engine` (contratos, flujos, testing, performance).
- [`Next-Steps.docx`](./Next-Steps.docx) — plan semana a semana para arrancar el desarrollo.
- [`adr/`](./adr/README.md) — Architecture Decision Records: por qué se tomó cada decisión importante.

## Decisiones clave a recordar

- El **Decision Engine** y el **Journey Engine** nunca dependen de React/Next.js/UI. Son paquetes puros, testeables de forma aislada.
- Las herramientas ("Journeys") son **configuración**, no código nuevo por cada calculadora.
- El MVP es **un único Journey excelente** ("Comprar vivienda"), no muchas herramientas mediocres.
- Roadmap por **hitos**, no por fechas: Foundation → Platform → First Journey → First Users → SEO Expansion → Accounts → Growth → Scale.

## Estado actual

- **Milestone 0 — Foundation**: hecho (monorepo, tooling, CI).
- **Milestone 1 — Platform**: hecho (`decision-engine`, `formula-engine`, `rules-engine`, `journey-engine`, `design-system`, `analytics`, `seo`). Pendiente: i18n real más allá de español, autenticación (bloqueada por necesitar credenciales de Supabase, ver [ADR-0004](./adr/0004-supabase-backend-inicial.md)).
- **Milestone 2 — First Journey**: hecho. "Comprar vivienda" funciona de principio a fin en `/comprar-vivienda`.
- **Milestone 3 en adelante** (First Users, SEO Expansion, Accounts, Growth, Scale): no empiezan hasta tener uso real del producto — así lo marca el propio roadmap del PRD.
