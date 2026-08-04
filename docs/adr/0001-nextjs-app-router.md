# ADR-0001: Next.js App Router

Estado: Aceptada
Fecha: 2026-08-04

## Contexto

Necesitábamos un framework para `apps/web` que resolviera SSR, metadata
por página, streaming y Server Components sin montar la infraestructura a
mano, porque el SEO técnico es central en la estrategia de adquisición
(ver PRD 13 — SEO & Content Strategy).

## Decisión

Next.js con App Router (no Pages Router), TypeScript y React 19.

## Consecuencias

- Cada ruta puede exportar su propio `metadata` de forma nativa (ver
  ADR relacionado con `@atlas/seo`), sin un sistema de head-tags casero.
- Un Server Component no puede tener `"use client"` a la vez que exporta
  `metadata`; las páginas con estado interactivo (el wizard) se dividen en
  página de servidor (metadata) + componente cliente (la lógica), como en
  `/comprar-vivienda`.
- Turbopack es el bundler por defecto de `next dev`/`next build` en esta
  versión de Next.js; no hemos necesitado configurarlo manualmente.
