# Documentación

- [`PRD.docx`](./PRD.docx) — Product Requirements Document v1.0 (misión, visión, mercado, UX, domain model, arquitectura de producto, MVP, roadmap por hitos).
- [`TDD.docx`](./TDD.docx) — Technical Design Document: `TDD-001 Decision Engine` y `TDD-002 Journey Engine` (contratos, flujos, testing, performance).
- [`Next-Steps.docx`](./Next-Steps.docx) — plan semana a semana para arrancar el desarrollo.

## Decisiones clave a recordar

- El **Decision Engine** y el **Journey Engine** nunca dependen de React/Next.js/UI. Son paquetes puros, testeables de forma aislada.
- Las herramientas ("Journeys") son **configuración**, no código nuevo por cada calculadora.
- El MVP es **un único Journey excelente** ("Comprar vivienda"), no muchas herramientas mediocres.
- Roadmap por **hitos**, no por fechas: Foundation → Platform → First Journey → First Users → SEO Expansion → Accounts → Growth → Scale.

Este `apps/web` + tooling corresponde al **Milestone 0 — Foundation** (Semanas 1-2 de `Next-Steps.docx`).
